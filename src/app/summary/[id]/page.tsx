import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase-admin';
import Navbar from '@/components/Navbar';
import QAChat from '@/components/QAChat';
import ShareButton from '@/components/ShareButton';
import Footer from '@/components/Footer';
import type { Summary, QAMessage } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function SummaryPage({ params }: Props) {
  const { id } = await params;

  const { data: summary } = await supabase
    .from('summaries')
    .select('*')
    .eq('id', id)
    .single<Summary>();

  if (!summary) notFound();

  const { data: messages } = await supabase
    .from('qa_messages')
    .select('*')
    .eq('summary_id', id)
    .order('created_at', { ascending: true });

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-dim hover:text-light transition-colors mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="font-mono text-xs text-teal uppercase bg-teal/10 px-2.5 py-1 rounded-full">
                  {summary.source_type}
                </span>
                <span className="text-dim text-xs">
                  {new Date(summary.created_at).toLocaleDateString('en-US', {
                    month: 'long', day: 'numeric', year: 'numeric',
                  })}
                </span>
              </div>
              <h1 className="font-display text-2xl md:text-3xl font-bold break-words">
                {summary.title}
              </h1>
            </div>
            <ShareButton shareId={summary.share_id} />
          </div>

          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            <div className="space-y-6 min-w-0">
              <section className="bg-panel border border-line rounded-2xl p-6">
                <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-teal shrink-0"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>
                  Summary
                </h2>
                <div className="text-mid leading-relaxed whitespace-pre-wrap break-words">
                  {summary.summary}
                </div>
              </section>

              <section className="bg-panel border border-line rounded-2xl p-6">
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

              {summary.source_url && (
                <div className="text-sm text-dim">
                  Source:{' '}
                  <a href={summary.source_url} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline break-all">
                    {summary.source_url}
                  </a>
                </div>
              )}
            </div>

            <div className="bg-panel border border-line rounded-2xl p-6 h-fit lg:sticky lg:top-24">
              <QAChat summaryId={summary.id} initialMessages={(messages || []) as QAMessage[]} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
