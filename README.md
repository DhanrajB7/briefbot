# BriefBot — AI Document Summarizer

**Live Demo:** [briefbot-gamma.vercel.app](https://briefbot-gamma.vercel.app)

BriefBot is a full-stack AI-powered document summarization tool. Upload a PDF, paste a URL, or input raw text — and get an instant, comprehensive summary with key takeaways and interactive Q&A, all in seconds.

---

## What It Does

1. **Upload a PDF** — Extracts text from any PDF document server-side
2. **Paste a URL** — Scrapes and parses article content from any webpage
3. **Paste Text** — Accepts raw text input directly
4. **AI Summary** — Generates a structured summary with 5-8 key takeaways
5. **Interactive Q&A** — Ask follow-up questions about the document with full conversation context
6. **Shareable Links** — Every summary gets a unique public URL you can share with anyone
7. **Dashboard** — View, manage, and revisit all your past summaries

---

## Tech Stack

| Layer | Technology | Why I Chose It |
|-------|-----------|----------------|
| **Framework** | Next.js 14 (App Router) | Server-side rendering, API routes, and file-based routing in one framework. The App Router's server/client component model keeps the bundle lean. |
| **Language** | TypeScript | Type safety across the full stack — caught multiple bugs at compile time that would have been runtime errors in plain JS. |
| **Styling** | Tailwind CSS v4 | Utility-first CSS with the new v4 theme system. Custom design tokens (`@theme inline`) for a consistent dark UI without writing a single CSS file beyond globals. |
| **Database** | Supabase (PostgreSQL) | Managed Postgres with a generous free tier. Row Level Security policies, real-time capabilities, and a great SDK. Stores summaries, Q&A history, and share metadata. |
| **AI** | LLM API | Large language model for summarization and conversational Q&A. Structured JSON output for reliable parsing. Conversation history passed as context for multi-turn Q&A. |
| **PDF Parsing** | unpdf | Server-side PDF text extraction that works in Node.js/Edge environments without DOM dependencies — critical for serverless deployment. |
| **URL Scraping** | Cheerio | Lightweight HTML parsing to extract article content from URLs. Prioritizes semantic selectors (`<article>`, `<main>`, `[role="main"]`) before falling back to `<body>`. |
| **Deployment** | Vercel | Zero-config Next.js deployment with edge functions, automatic HTTPS, and global CDN. |

---

## Architecture

```
src/
├── app/
│   ├── page.tsx                    # Landing page (SSG)
│   ├── summarize/page.tsx          # Document input UI (Client Component)
│   ├── dashboard/page.tsx          # Summary history (Client Component)
│   ├── summary/[id]/page.tsx       # Summary detail + Q&A (Server Component)
│   ├── share/[shareId]/page.tsx    # Public share page (Server Component)
│   └── api/
│       ├── summarize/route.ts      # PDF parse → AI summary → DB insert
│       ├── qa/route.ts             # Contextual Q&A with conversation history
│       └── summaries/              # CRUD endpoints for summary management
├── components/
│   ├── Navbar.tsx                  # Global navigation (Client Component)
│   ├── Footer.tsx                  # Global footer (Server Component)
│   ├── QAChat.tsx                  # Real-time chat interface (Client Component)
│   └── ShareButton.tsx             # Copy-to-clipboard share (Client Component)
├── lib/
│   ├── anthropic.ts                # LLM API: summarization + Q&A functions
│   ├── pdf-parser.ts               # PDF → text extraction
│   ├── url-scraper.ts              # URL → text extraction with Cheerio
│   ├── supabase-admin.ts           # Supabase client (server-side)
│   └── rate-limit.ts               # In-memory IP-based rate limiting
└── types/
    └── index.ts                    # Shared TypeScript interfaces
```

### Data Flow

```
User uploads PDF/URL/text
        │
        ▼
  API Route (/api/summarize)
        │
        ├── PDF? → unpdf extracts text
        ├── URL? → Cheerio scrapes content
        └── Text? → Use directly
        │
        ▼
  Claude API generates:
    • Title (max 10 words)
    • Summary (2-4 paragraphs)
    • Key takeaways (5-8 points)
        │
        ▼
  Supabase stores summary + generates share_id
        │
        ▼
  Redirect to /summary/[id] → render results + Q&A
```

---

## Key Engineering Decisions

### Server vs. Client Components
Next.js App Router requires careful thought about which components run on the server vs. client. I kept data-fetching pages (`summary/[id]`, `share/[shareId]`) as **Server Components** for faster initial loads and SEO, while interactive elements (Navbar, QAChat, ShareButton) are **Client Components** that hydrate on the browser.

### Rate Limiting Without External Services
Instead of adding Redis or a third-party rate limiting service, I built an **in-memory rate limiter** that tracks requests per IP address with configurable windows. This keeps the architecture simple while protecting the AI API from abuse:
- 10 summaries per hour per IP
- 30 Q&A questions per hour per IP

### PDF Parsing in Serverless
The initial approach used `pdf-parse`, which depends on `canvas` and `DOMMatrix` — APIs that don't exist in serverless environments. After debugging the `DOMMatrix is not defined` error, I switched to `unpdf`, which uses a pure-JS PDF parser compatible with Node.js, Edge, and serverless runtimes.

### Structured AI Output
The summarization prompt requests JSON output with a specific schema. The response is parsed with a regex match for the JSON object, making it resilient to any preamble or markdown wrapping the AI might add. This is more reliable than asking for raw text and trying to parse sections.

### URL Content Extraction Strategy
Not all websites structure their HTML the same way. The scraper uses a **priority-based selector strategy**: it first looks for semantic elements (`<article>`, `<main>`, `[role="main"]`), then content-specific classes (`.post-content`, `.article-body`), and finally falls back to `<body>`. Scripts, styles, navs, and footers are stripped before extraction.

---

## Database Schema

```sql
-- Summaries table
summaries (
  id            UUID PRIMARY KEY,
  user_id       UUID (nullable),
  title         TEXT,
  source_type   ENUM('pdf', 'url', 'text'),
  source_url    TEXT (nullable),
  original_text TEXT,
  summary       TEXT,
  key_takeaways JSONB,
  share_id      TEXT UNIQUE,
  created_at    TIMESTAMPTZ
)

-- Q&A conversation history
qa_messages (
  id          UUID PRIMARY KEY,
  summary_id  UUID → summaries(id) ON DELETE CASCADE,
  role        ENUM('user', 'assistant'),
  content     TEXT,
  created_at  TIMESTAMPTZ
)
```

---

## Challenges & Solutions

| Challenge | What Happened | How I Solved It |
|-----------|--------------|-----------------|
| **PDF parsing in serverless** | `pdf-parse` threw `DOMMatrix is not defined` on Vercel because it depends on browser APIs | Replaced with `unpdf` — a pure-JS PDF parser designed for server environments |
| **Tailwind v4 theme tokens** | Custom color names with `rgba()` values weren't generating proper utility classes | Switched to hex values and simplified token names for reliable class generation |
| **Server/Client boundary** | Passing `onClick` handlers from a Server Component to a `<button>` caused a runtime error | Extracted interactive elements into dedicated Client Components (`ShareButton.tsx`) |
| **AI response parsing** | LLM occasionally wraps JSON in markdown code fences | Used regex extraction (`/\{[\s\S]*\}/`) to reliably parse JSON regardless of wrapping |
| **URL scraping reliability** | Many sites don't use semantic HTML — `<article>` or `<main>` tags are missing | Built a cascading selector strategy with 6 priority levels before falling back to `<body>` |
| **Rate limiting on serverless** | Serverless functions are stateless — traditional in-memory stores reset on cold starts | Accepted this tradeoff for simplicity; the rate limiter resets on redeploy but still protects against sustained abuse within a session |

---

## Running Locally

```bash
# Clone the repository
git clone https://github.com/DhanrajB7/briefbot.git
cd briefbot

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your Supabase URL, anon key, and Anthropic API key

# Set up the database
# Run supabase-schema.sql in your Supabase SQL Editor
# Then run supabase-disable-auth.sql to disable RLS

# Start the dev server
npm run dev
```

---

## What I Would Add Next

- **User authentication** — Supabase Auth with GitHub OAuth so users can manage their own summaries privately
- **File storage** — Upload PDFs to Supabase Storage for permanent access
- **Export options** — Download summaries as PDF or Markdown
- **Streaming responses** — Use Claude's streaming API to show the summary as it generates
- **Usage analytics** — Track popular document types and summary quality metrics

---

## Built With

Next.js 14 &bull; TypeScript &bull; Tailwind CSS v4 &bull; Supabase &bull; LLM API &bull; Vercel

Built by [Dhanraj Bhalala](https://github.com/DhanrajB7)
