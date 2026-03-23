'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-line bg-dark/80 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display text-xl font-bold tracking-tight">
          Brief<span className="text-teal">Bot</span>
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/dashboard"
            className={`text-sm transition-colors ${
              pathname === '/dashboard' ? 'text-teal' : 'text-mid hover:text-light'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/summarize"
            className="text-sm bg-teal text-dark px-5 py-2 rounded-full font-semibold hover:shadow-[0_0_20px_var(--color-glow)] transition-all whitespace-nowrap"
          >
            + Summarize
          </Link>
        </div>
      </div>
    </nav>
  );
}
