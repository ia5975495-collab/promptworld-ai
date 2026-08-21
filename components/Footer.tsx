'use client';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="pw-footer">
      <div className="pw-footer__inner">
        {/* Brand column */}
        <div className="pw-footer__brand-col">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <img src="/logo.png" alt="PromptWorld AI" style={{ height: '42px', width: 'auto' }} />
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>PromptWorld AI</span>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: '320px' }}>
            The premier AI prompt gallery &amp; image creation hub. Find, copy, and create breathtaking artwork
            with ChatGPT, Nanobanana Pro, Nanobanana 2, Nanobanana 2 Lite, and Gemini.
          </p>
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span className="pw-pill-secure" style={{ fontSize: '11px' }}>⚡ 100% Free Prompts</span>
            <span className="pw-pill-secure" style={{ fontSize: '11px', color: '#fbbf24', borderColor: 'rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.08)' }}>🎨 AI Generator</span>
          </div>
        </div>

        {/* Categories column */}
        <div className="pw-footer__col">
          <h4>Top Categories</h4>
          <Link href="/gallery?category=aesthetic">Aesthetic Prompts</Link>
          <Link href="/gallery?category=anime">Anime &amp; Manga</Link>
          <Link href="/gallery?category=realistic">Photorealistic</Link>
          <Link href="/gallery?category=portrait">Cinematic Portraits</Link>
          <Link href="/gallery?category=wallpaper">4K Wallpapers</Link>
          <Link href="/gallery?category=couples">Couples &amp; Romance</Link>
        </div>

        {/* AI Tools column */}
        <div className="pw-footer__col">
          <h4>Supported Engines</h4>
          <a href="https://labs.google/fx/tools/image-fx" target="_blank" rel="noopener noreferrer">Google Flow / ImageFX ↗</a>
          <Link href="/gallery">ChatGPT Prompts</Link>
          <Link href="/gallery">Nanobanana Pro</Link>
          <Link href="/gallery">Nanobanana 2</Link>
          <Link href="/gallery">Google Gemini Prompts</Link>
        </div>

        {/* Legal & Quick Links */}
        <div className="pw-footer__col">
          <h4>PromptWorld</h4>
          <Link href="/categories">All Categories</Link>
          <Link href="/gallery">Explore Gallery</Link>
          <a href="https://labs.google/fx/tools/image-fx" target="_blank" rel="noopener noreferrer">Launch Google Flow ↗</a>
          <Link href="/subscribe">Go Premium (Ad-Light)</Link>
          <a href="mailto:support@promptworld.store">Contact Support</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="pw-footer__bottom">
        <div style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
          © {new Date().getFullYear()} <strong style={{ color: '#fff' }}>PromptWorld AI</strong>. Built with ❤️ for AI creators worldwide.
        </div>
        <div className="pw-footer__socials">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="pw-social-btn" aria-label="X Twitter">
            𝕏
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="pw-social-btn" aria-label="Discord">
            💬
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="pw-social-btn" aria-label="Instagram">
            📸
          </a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="pw-social-btn" aria-label="YouTube">
            ▶️
          </a>
        </div>
      </div>
    </footer>
  );
}
