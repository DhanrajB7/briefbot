import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-text-dim">
        <span>&copy; {new Date().getFullYear()} BriefBot</span>
        <Link
          href="https://github.com/DhanrajB7"
          target="_blank"
          rel="noopener"
          className="hover:text-accent transition-colors"
        >
          Built by Dhanraj Bhalala
        </Link>
      </div>
    </footer>
  );
}
