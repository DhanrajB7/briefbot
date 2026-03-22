import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import Navbar from '@/components/Navbar';
import QAChat from '@/components/QAChat';
import type { Summary, QAMessage } from '@/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SummaryPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

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

  const shareUrl = `/share/${summary.share_id}`;

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-6">
          {/* Back link */}
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-text-dim hover:text-text transition-colors mb-6"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Dashboard
          </Link>

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
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
              <h1 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold">
                {summary.title}
              </h1>
            </div>
            <button
              onClick={() => {}}
              data-share-url={`${shareUrl}`}
              className="shrink-0 flex items-center gap-2 border border-border rounded-lg px-4 py-2 text-sm text-text-secondary hover:border-accent hover:text-accent transition-colors copy-share-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
              Share
            </button>
          </div>

          <div className="grid lg:grid-cols-[1fr_380px] gap-8">
            {/* Summary content */}
            <div className="space-y-8">
              {/* Summary */}
              <section className="bg-surface border border-border rounded-2xl p-6">
                <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold mb-4 flex items-center gap-2">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>
                  Summary
                </h2>
                <div className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {summary.summary}
                </div>
              </section>

              {/* Key Takeaways */}
              <section className="bg-surface border border-border rounded-2xl p-6">
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

              {/* Source */}
              {summary.source_url && (
                <div className="text-sm text-text-dim">
                  Source:{' '}
                  <a
                    href={summary.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    {summary.source_url}
                  </a>
                </div>
              )}
            </div>

            {/* Q&A Sidebar */}
            <div className="bg-surface border border-border rounded-2xl p-6 h-fit lg:sticky lg:top-24">
              <QAChat
                summaryId={summary.id}
                initialMessages={(messages || []) as QAMessage[]}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Client-side share copy script */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.querySelectorAll('.copy-share-btn').forEach(btn => {
              btn.addEventListener('click', () => {
                const url = window.location.origin + btn.dataset.shareUrl;
                navigator.clipboard.writeText(url).then(() => {
                  const orig = btn.innerHTML;
                  btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copied!';
                  setTimeout(() => btn.innerHTML = orig, 2000);
                });
              });
            });
          `,
        }}
      />
    </>
  );
}
