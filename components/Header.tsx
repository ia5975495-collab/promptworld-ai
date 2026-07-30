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
         <img src="/logo.png" alt="PromptWorld AI" style={{ height: '80px', width: 'auto' }} />
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