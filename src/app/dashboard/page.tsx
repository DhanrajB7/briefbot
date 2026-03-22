'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import type { Summary } from '@/types';

export default function DashboardPage() {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/summaries')
      .then((res) => res.json())
      .then((data) => setSummaries(data.summaries || []))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this summary?')) return;
    await fetch(`/api/summaries/${id}`, { method: 'DELETE' });
    setSummaries((prev) => prev.filter((s) => s.id !== id));
  }

  const sourceIcon = (type: string) => {
    if (type === 'pdf')
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>;
    if (type === 'url')
      return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>;
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold">
                Dashboard
              </h1>
              <p className="text-text-secondary mt-1">Your summarized documents</p>
            </div>
            <Link
              href="/summarize"
              className="bg-accent text-bg px-5 py-2.5 rounded-full font-medium text-sm hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-all flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              New Summary
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="spinner w-8 h-8" />
            </div>
          ) : summaries.length === 0 ? (
            <div className="text-center py-20 bg-surface border border-border rounded-2xl">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15h6"/></svg>
              </div>
              <h3 className="font-[family-name:var(--font-heading)] font-semibold text-lg mb-2">
                No summaries yet
              </h3>
              <p className="text-text-secondary text-sm mb-6">
                Upload a PDF or paste a URL to create your first summary
              </p>
              <Link
                href="/summarize"
                className="inline-flex items-center gap-2 bg-accent text-bg px-6 py-2.5 rounded-full font-medium text-sm hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-all"
              >
                Create Summary
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {summaries.map((s) => (
                <div
                  key={s.id}
                  className="bg-surface border border-border rounded-xl p-5 hover:border-border-hover transition-colors group flex items-start justify-between gap-4"
                >
                  <Link href={`/summary/${s.id}`} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className="text-accent">{sourceIcon(s.source_type)}</span>
                      <h3 className="font-[family-name:var(--font-heading)] font-semibold truncate group-hover:text-accent transition-colors">
                        {s.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text-dim">
                      <span className="font-[family-name:var(--font-mono)] uppercase">
                        {s.source_type}
                      </span>
                      <span>
                        {new Date(s.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/share/${s.share_id}`
                        );
                      }}
                      className="p-2 rounded-lg text-text-dim hover:text-accent hover:bg-accent/10 transition-colors"
                      title="Copy share link"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-2 rounded-lg text-text-dim hover:text-red-400 hover:bg-red-400/10 transition-colors"
                      title="Delete"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
