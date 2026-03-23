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
    <div className="flex flex-col">
      <h3 className="font-display text-lg font-semibold mb-4">Ask Questions</h3>

      <div className="flex-1 overflow-y-auto space-y-3 mb-4 max-h-96 pr-1">
        {messages.length === 0 && (
          <p className="text-dim text-sm text-center py-8">
            Ask anything about this document...
          </p>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-teal text-dark rounded-br-sm'
                  : 'bg-dark-3 border border-line rounded-bl-sm text-mid'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-dark-3 border border-line rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-teal rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-teal rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-teal rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 min-w-0 bg-dark-3 border border-line rounded-xl px-4 py-2.5 text-sm text-light placeholder:text-dim focus:outline-none focus:border-teal transition-colors"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-teal text-dark px-4 py-2.5 rounded-xl font-semibold text-sm whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Ask
        </button>
      </form>
    </div>
  );
}
