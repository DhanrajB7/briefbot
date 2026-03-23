import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-admin';
import Footer from '@/components/Footer';
import type { Summary } from '@/types';

interface Props {
  params: Promise<{ shareId: string }>;
}

export const dynamic = 'force-dynamic';

export default async function SharePage({ params }: Props) {
  const { shareId } = await params;

  const { data: summary } = await supabase
    .from('summaries')
    .select('title, summary, key_takeaways, source_type, source_url, created_at')
    .eq('share_id', shareId)
    .single<Summary>();

  if (!summary) notFound();

  return (
    <>
      <nav className="border-b border-line bg-dark/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-xl font-bold tracking-tight">
            Brief<span className="text-teal">Bot</span>
          </Link>
          <Link
            href="/summarize"
            className="text-sm bg-teal text-dark px-5 py-2 rounded-full font-semibold"
          >
            Try BriefBot
          </Link>
        </div>
      </nav>

      <main className="flex-1 py-16">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-teal uppercase bg-teal/10 px-2.5 py-1 rounded-full">
              {summary.source_type}
            </span>
            <span className="text-dim text-xs">
              {new Date(summary.created_at).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl font-bold mb-8 break-words">{summary.title}</h1>

          <section className="bg-panel border border-line rounded-2xl p-6 mb-6">
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal shrink-0"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>
              Summary
            </h2>
            <div className="text-mid leading-relaxed whitespace-pre-wrap break-words">{summary.summary}</div>
          </section>

          <section className="bg-panel border border-line rounded-2xl p-6 mb-8">
            <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal shrink-0"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
              Key Takeaways
            </h2>
            <ul className="space-y-3">
              {summary.key_takeaways.map((point: string, i: number) => (
                <li key={i} className="flex gap-3 text-mid">
                  <span className="w-6 h-6 shrink-0 rounded-full bg-teal/10 text-teal text-xs flex items-center justify-center font-semibold mt-0.5">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="text-center bg-panel border border-line rounded-2xl p-8">
            <p className="text-mid mb-4">Summarized with BriefBot — the AI document summarizer</p>
            <Link
              href="/summarize"
              className="inline-flex items-center gap-2 bg-teal text-dark px-6 py-2.5 rounded-full font-semibold text-sm"
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
