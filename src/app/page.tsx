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
          {/* Gradient blobs */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-accent rounded-full opacity-[0.07] blur-[120px] animate-pulse" />
            <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-accent-2 rounded-full opacity-[0.07] blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-surface border border-border rounded-full px-4 py-1.5 mb-8">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="font-[family-name:var(--font-mono)] text-xs text-text-secondary">
                AI-Powered Summarization
              </span>
            </div>

            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Understand any
              <br />
              document in{' '}
              <span className="bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">
                seconds
              </span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Upload a PDF or paste any URL. BriefBot generates instant summaries,
              extracts key takeaways, and lets you ask follow-up questions —
              all powered by AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 bg-accent text-bg px-8 py-3.5 rounded-full font-[family-name:var(--font-heading)] font-medium text-base hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all hover:-translate-y-0.5"
              >
                Start Summarizing
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center gap-2 border border-border px-8 py-3.5 rounded-full font-[family-name:var(--font-heading)] font-medium text-base text-text-secondary hover:border-border-hover hover:text-text transition-all"
              >
                See How It Works
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-24 border-t border-border">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <span className="font-[family-name:var(--font-mono)] text-sm text-accent">Features</span>
              <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mt-3">
                Everything you need to digest content faster
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>
                  ),
                  title: 'PDF & URL Support',
                  desc: 'Upload any PDF document or paste a URL. BriefBot extracts the content and processes it instantly.',
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  ),
                  title: 'Instant Summaries',
                  desc: 'Get a comprehensive summary with key takeaways in seconds, not minutes. Powered by Claude AI.',
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                  ),
                  title: 'Interactive Q&A',
                  desc: 'Ask follow-up questions about the document. The AI remembers context and gives precise answers.',
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                  ),
                  title: 'Shareable Links',
                  desc: 'Generate a public link to share your summaries with teammates, classmates, or anyone.',
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
                  ),
                  title: 'Dashboard & History',
                  desc: 'All your summaries organized in one place. Search, filter, and revisit past documents easily.',
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  ),
                  title: 'Secure & Private',
                  desc: 'Your documents are processed securely. Authentication protects your data and summaries.',
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-surface border border-border rounded-2xl p-6 hover:border-border-hover transition-colors group"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent/15 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 border-t border-border">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-4">
              Ready to save hours of reading?
            </h2>
            <p className="text-text-secondary mb-8 text-lg">
              Join BriefBot and start summarizing documents in seconds.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-accent text-bg px-8 py-3.5 rounded-full font-[family-name:var(--font-heading)] font-medium hover:shadow-[0_0_30px_var(--color-accent-glow)] transition-all hover:-translate-y-0.5"
            >
              Get Started — It&apos;s Free
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
