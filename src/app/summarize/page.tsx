'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

type Tab = 'pdf' | 'url' | 'text';

export default function SummarizePage() {
  const [activeTab, setActiveTab] = useState<Tab>('pdf');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.set('sourceType', activeTab);

    if (activeTab === 'pdf') {
      if (!file) { setError('Please select a PDF file.'); setLoading(false); return; }
      formData.set('file', file);
    } else if (activeTab === 'url') {
      if (!url.trim()) { setError('Please enter a URL.'); setLoading(false); return; }
      formData.set('url', url.trim());
    } else {
      if (!text.trim()) { setError('Please enter some text.'); setLoading(false); return; }
      formData.set('text', text.trim());
    }

    try {
      const res = await fetch('/api/summarize', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      router.push(`/summary/${data.summary.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate summary');
      setLoading(false);
    }
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    {
      key: 'pdf',
      label: 'Upload PDF',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>,
    },
    {
      key: 'url',
      label: 'Paste URL',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
    },
    {
      key: 'text',
      label: 'Paste Text',
      icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>,
    },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-bold mb-2">
            Summarize a Document
          </h1>
          <p className="text-text-secondary mb-8">
            Choose your input method and let AI do the reading for you.
          </p>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 bg-bg-light rounded-xl p-1.5">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setError(''); }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? 'bg-bg-lighter text-text border border-border'
                    : 'text-text-dim hover:text-text-secondary'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* PDF upload */}
            {activeTab === 'pdf' && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-border rounded-2xl p-12 text-center cursor-pointer hover:border-accent/40 transition-colors group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent/15 transition-colors">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                </div>
                {file ? (
                  <p className="text-accent font-medium">{file.name}</p>
                ) : (
                  <>
                    <p className="text-text-secondary font-medium mb-1">
                      Click to upload a PDF
                    </p>
                    <p className="text-text-dim text-sm">or drag and drop</p>
                  </>
                )}
              </div>
            )}

            {/* URL input */}
            {activeTab === 'url' && (
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full bg-bg-lighter border border-border rounded-xl px-5 py-4 text-text placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors"
              />
            )}

            {/* Text input */}
            {activeTab === 'text' && (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here..."
                rows={10}
                className="w-full bg-bg-lighter border border-border rounded-xl px-5 py-4 text-text placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors resize-none"
              />
            )}

            {error && (
              <p className="mt-4 text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full bg-accent text-bg py-3.5 rounded-xl font-[family-name:var(--font-heading)] font-medium hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="spinner" />
                  Analyzing document...
                </span>
              ) : (
                'Generate Summary'
              )}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
