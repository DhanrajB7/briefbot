import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-teal rounded-full opacity-[0.05] blur-[120px]" />
            <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-purple rounded-full opacity-[0.05] blur-[120px]" />
          </div>

          <div className="relative w-full max-w-3xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-panel border border-line rounded-full px-4 py-1.5 mb-8">
              <span className="w-2 h-2 bg-teal rounded-full animate-pulse" />
              <span className="font-mono text-xs text-mid tracking-wide">AI-Powered Summarization</span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.08]">
              Understand any<br />document in{' '}
              <span className="bg-gradient-to-r from-teal to-purple bg-clip-text text-transparent">seconds</span>
            </h1>

            <p className="text-base sm:text-lg text-mid max-w-xl mx-auto mb-10 leading-relaxed">
              Upload a PDF or paste any URL. BriefBot generates instant summaries,
              extracts key takeaways, and lets you ask follow-up questions — all powered by AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/summarize"
                className="inline-flex items-center justify-center gap-2 bg-teal text-dark px-8 py-3.5 rounded-full font-display font-semibold text-sm hover:shadow-[0_0_30px_var(--color-glow)] transition-all hover:-translate-y-0.5"
              >
                Start Summarizing
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 border border-line px-8 py-3.5 rounded-full font-display font-medium text-sm text-mid hover:border-line-2 hover:text-light transition-all"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 sm:py-24 border-t border-line">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="font-mono text-sm text-teal tracking-wide">Features</span>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mt-3">
                Everything you need to digest content faster
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8', title: 'PDF & URL Support', desc: 'Upload any PDF or paste a URL. BriefBot extracts the content and processes it instantly.' },
                { icon: 'M12 2a10 10 0 100 20 10 10 0 000-20z M12 6v6l4 2', title: 'Instant Summaries', desc: 'Get a comprehensive summary with key takeaways in seconds, not minutes.' },
                { icon: 'M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z', title: 'Interactive Q&A', desc: 'Ask follow-up questions about the document. The AI gives precise, contextual answers.' },
                { icon: 'M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8 M16 6l-4-4-4 4 M12 2v13', title: 'Shareable Links', desc: 'Generate a public link to share your summaries with teammates or anyone.' },
                { icon: 'M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z', title: 'Dashboard & History', desc: 'All your summaries in one place. Revisit past documents anytime.' },
                { icon: 'M3 11h18v11a2 2 0 01-2 2H5a2 2 0 01-2-2V11z M7 11V7a5 5 0 0110 0v4', title: 'Secure & Private', desc: 'Your documents are processed securely. Data stays private and protected.' },
              ].map((f, i) => (
                <div key={i} className="bg-panel border border-line rounded-2xl p-6 hover:border-line-2 transition-colors group">
                  <div className="w-11 h-11 rounded-xl bg-dark-3 text-teal flex items-center justify-center mb-4 border border-line group-hover:border-teal/30 transition-colors">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d={f.icon}/></svg>
                  </div>
                  <h3 className="font-display font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-mid leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 sm:py-24 border-t border-line">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Ready to save hours of reading?</h2>
            <p className="text-mid mb-8">Start summarizing documents in seconds. Completely free.</p>
            <Link
              href="/summarize"
              className="inline-flex items-center gap-2 bg-teal text-dark px-8 py-3.5 rounded-full font-display font-semibold text-sm hover:shadow-[0_0_30px_var(--color-glow)] transition-all hover:-translate-y-0.5"
            >
              Get Started Free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
