'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/categories', label: 'Categories' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="pw-hdr">
      <div className="pw-hdr__inner">
        <Link href="/" className="pw-brand" aria-label="PromptWorld AI home">
          <div className="pw-brand-logo-wrap">
            <img
              src="/logo.png"
              alt="PromptWorld AI"
              style={{ height: '52px', width: 'auto' }}
              className="pw-brand-img"
            />
          </div>
        </Link>

        <nav className="pw-nav" aria-label="Primary">
          {NAV.map((n) => {
            const isActive = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`pw-nav__link ${isActive ? 'pw-nav__link--active' : ''}`}
              >
                {n.label}
              </Link>
            );
          })}
          <a
            href="https://labs.google/fx/tools/image-fx"
            target="_blank"
            rel="noopener noreferrer"
            className="pw-nav__link"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            🎨 AI Generator <span style={{ fontSize: '11px', opacity: 0.7 }}>↗</span>
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <a
            href="https://labs.google/fx/tools/image-fx"
            target="_blank"
            rel="noopener noreferrer"
            className="pw-btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: 13,
              background: 'linear-gradient(120deg, #06b6d4, #3b82f6)',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>✨ Generate</span>
            <span style={{ fontSize: '11px' }}>↗</span>
          </a>
          <Link href="/subscribe" className="pw-btn-primary pw-cta">
            <span className="pw-cta-sparkle">⭐</span> Go Premium
          </Link>
        </div>
      </div>
    </header>
  );
}
