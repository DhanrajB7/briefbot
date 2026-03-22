'use client';

import { useState, useRef, useEffect } from 'react';
import type { QAMessage } from '@/types';

interface Props {
  summaryId: string;
  initialMessages: QAMessage[];
}

export default function QAChat({ summaryId, initialMessages }: Props) {
  const [messages, setMessages] = useState<QAMessage[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');

    const userMsg: QAMessage = {
      id: crypto.randomUUID(),
      summary_id: summaryId,
      role: 'user',
      content: question,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await fetch('/api/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ summaryId, question }),
      });

      if (!res.ok) throw new Error('Failed to get answer');
      const data = await res.json();

      const assistantMsg: QAMessage = {
        id: crypto.randomUUID(),
        summary_id: summaryId,
        role: 'assistant',
        content: data.answer,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: QAMessage = {
        id: crypto.randomUUID(),
        summary_id: summaryId,
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold mb-4">
        Ask Questions
      </h3>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-96 pr-2">
        {messages.length === 0 && (
          <p className="text-text-dim text-sm text-center py-8">
            Ask anything about this document...
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-accent text-bg rounded-br-md'
                  : 'bg-bg-lighter border border-border rounded-bl-md text-text-secondary'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-bg-lighter border border-border rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about this document..."
          className="flex-1 bg-bg-lighter border border-border rounded-xl px-4 py-2.5 text-sm text-text placeholder:text-text-dim focus:outline-none focus:border-accent transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-accent text-bg px-5 py-2.5 rounded-xl font-medium text-sm hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
