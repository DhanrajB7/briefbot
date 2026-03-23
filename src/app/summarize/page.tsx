'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="font-display text-3xl font-bold mb-2">Summarize a Document</h1>
          <p className="text-mid mb-8">Choose your input method and let AI do the reading for you.</p>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-dark-2 rounded-xl p-1">
            {(['pdf', 'url', 'text'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all text-center ${
                  activeTab === tab
                    ? 'bg-dark-3 text-light border border-line'
                    : 'text-dim hover:text-mid'
                }`}
              >
                {tab === 'pdf' ? 'Upload PDF' : tab === 'url' ? 'Paste URL' : 'Paste Text'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {activeTab === 'pdf' && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-line rounded-2xl p-12 text-center cursor-pointer hover:border-teal/40 transition-colors"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-dark-3 border border-line flex items-center justify-center text-teal">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                </div>
                {file ? (
                  <p className="text-teal font-medium text-sm">{file.name}</p>
                ) : (
                  <>
                    <p className="text-mid font-medium mb-1">Click to upload a PDF</p>
                    <p className="text-dim text-sm">or drag and drop</p>
                  </>
                )}
              </div>
            )}

            {activeTab === 'url' && (
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full bg-dark-3 border border-line rounded-xl px-5 py-4 text-sm text-light placeholder:text-dim focus:outline-none focus:border-teal transition-colors"
              />
            )}

            {activeTab === 'text' && (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here..."
                rows={10}
                className="w-full bg-dark-3 border border-line rounded-xl px-5 py-4 text-sm text-light placeholder:text-dim focus:outline-none focus:border-teal transition-colors resize-none"
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
              className="mt-6 w-full bg-teal text-dark py-3.5 rounded-xl font-display font-semibold text-sm hover:shadow-[0_0_20px_var(--color-glow)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
      <Footer />
    </>
  );
}
