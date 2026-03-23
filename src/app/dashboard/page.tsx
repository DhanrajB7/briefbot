'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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

  function copyShareLink(shareId: string) {
    navigator.clipboard.writeText(`${window.location.origin}/share/${shareId}`);
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold">Dashboard</h1>
              <p className="text-mid text-sm mt-1">Your summarized documents</p>
            </div>
            <Link
              href="/summarize"
              className="bg-teal text-dark px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-[0_0_20px_var(--color-glow)] transition-all whitespace-nowrap flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
              New Summary
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="spinner !w-8 !h-8" />
            </div>
          ) : summaries.length === 0 ? (
            <div className="text-center py-20 bg-panel border border-line rounded-2xl">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-dark-3 border border-line flex items-center justify-center text-teal">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15h6"/></svg>
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">No summaries yet</h3>
              <p className="text-mid text-sm mb-6">Upload a PDF or paste a URL to create your first summary</p>
              <Link
                href="/summarize"
                className="inline-flex items-center gap-2 bg-teal text-dark px-6 py-2.5 rounded-full font-semibold text-sm"
              >
                Create Summary
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {summaries.map((s) => (
                <div
                  key={s.id}
                  className="bg-panel border border-line rounded-xl p-5 hover:border-line-2 transition-colors group flex items-start justify-between gap-4"
                >
                  <Link href={`/summary/${s.id}`} className="flex-1 min-w-0">
                    <h3 className="font-display font-semibold truncate group-hover:text-teal transition-colors mb-1">
                      {s.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-dim">
                      <span className="font-mono uppercase">{s.source_type}</span>
                      <span>
                        {new Date(s.created_at).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </span>
                    </div>
                  </Link>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => copyShareLink(s.share_id)}
                      className="p-2 rounded-lg text-dim hover:text-teal hover:bg-dark-3 transition-colors"
                      title="Copy share link"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-2 rounded-lg text-dim hover:text-red-400 hover:bg-dark-3 transition-colors"
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
      <Footer />
    </>
  );
}
