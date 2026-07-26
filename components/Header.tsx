import Link from 'next/link';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/categories', label: 'Categories' },
];

export default function Header() {
  return (
    <header className="pw-hdr">
      <div className="pw-hdr__inner">
        <Link href="/" className="pw-brand" aria-label="PromptWorld AI home">
          <span className="pw-brand__mark" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z" fill="#fff" />
            </svg>
          </span>
          <span className="pw-brand__text">PromptWorld AI</span>
        </Link>

        <nav className="pw-nav" aria-label="Primary">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="pw-nav__link">{n.label}</Link>
          ))}
        </nav>

        <Link href="/subscribe" className="pw-btn-primary pw-cta">Go Premium</Link>
      </div>
    </header>
  );
}