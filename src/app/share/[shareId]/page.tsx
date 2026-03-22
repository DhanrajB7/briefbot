import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import Footer from '@/components/Footer';
import type { Summary } from '@/types';

interface Props {
  params: Promise<{ shareId: string }>;
}

export default async function SharePage({ params }: Props) {
  const { shareId } = await params;
  const supabase = await createClient();

  const { data: summary } = await supabase
    .from('summaries')
    .select('title, summary, key_takeaways, source_type, source_url, created_at')
    .eq('share_id', shareId)
    .single<Summary>();

  if (!summary) notFound();

  return (
    <>
      <nav className="border-b border-border bg-bg/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight"
          >
            Brief<span className="text-accent">Bot</span>
          </Link>
          <Link
            href="/login"
            className="text-sm bg-accent text-bg px-4 py-2 rounded-full font-medium hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-all"
          >
            Try BriefBot
          </Link>
        </div>
      </nav>

      <main className="flex-1 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="font-[family-name:var(--font-mono)] text-xs text-accent uppercase bg-accent/10 px-2.5 py-1 rounded-full">
              {summary.source_type}
            </span>
            <span className="text-text-dim text-xs">
              {new Date(summary.created_at).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-8">
            {summary.title}
          </h1>

          {/* Summary */}
          <section className="bg-surface border border-border rounded-2xl p-6 mb-6">
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>
              Summary
            </h2>
            <div className="text-text-secondary leading-relaxed whitespace-pre-wrap">
              {summary.summary}
            </div>
          </section>

          {/* Key Takeaways */}
          <section className="bg-surface border border-border rounded-2xl p-6 mb-8">
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
              Key Takeaways
            </h2>
            <ul className="space-y-3">
              {summary.key_takeaways.map((point: string, i: number) => (
                <li key={i} className="flex gap-3 text-text-secondary">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-accent/10 text-accent text-xs flex items-center justify-center font-medium mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <div className="text-center bg-surface border border-border rounded-2xl p-8">
            <p className="text-text-secondary mb-4">
              Summarized with BriefBot — the AI document summarizer
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-accent text-bg px-6 py-2.5 rounded-full font-medium text-sm hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-all"
            >
              Try It Free
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
