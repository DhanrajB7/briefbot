'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight"
        >
          Brief<span className="text-accent">Bot</span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-text-secondary hover:text-text transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/summarize"
                className="text-sm bg-accent text-bg px-4 py-2 rounded-full font-medium hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-all"
              >
                Summarize
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm text-text-dim hover:text-text transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-text-secondary hover:text-text transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="text-sm bg-accent text-bg px-4 py-2 rounded-full font-medium hover:shadow-[0_0_20px_var(--color-accent-glow)] transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-text transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span
            className={`block w-5 h-0.5 bg-text transition-all ${menuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block w-5 h-0.5 bg-text transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-bg border-t border-border px-6 py-4 flex flex-col gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="text-text-secondary py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link href="/summarize" className="text-accent py-2" onClick={() => setMenuOpen(false)}>Summarize</Link>
              <button onClick={() => { handleSignOut(); setMenuOpen(false); }} className="text-text-dim py-2 text-left">Sign Out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-text-secondary py-2" onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link href="/login" className="text-accent py-2" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
