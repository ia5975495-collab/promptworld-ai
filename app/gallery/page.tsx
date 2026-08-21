'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/mockData';
import AdSlot from '@/components/AdSlot';
import { ADS } from '@/lib/ads';
import MobileCategoryBar from '@/components/MobileCategoryBar';
import { usePrompts } from '@/lib/store';
import AuroraBackground from '@/components/AuroraBackground';
import PromptCard from '@/components/PromptCard';

export default function GalleryPage() {
  const prompts = usePrompts();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('all');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = () => {
    setToastMsg('Prompt copied to clipboard! Ready to paste into your AI tool.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const countFor = (slug: string) =>
    prompts.filter((p) => p.category?.toLowerCase() === slug.toLowerCase()).length;

  const filtered = useMemo(() => {
    return prompts.filter((p) => {
      const okCat = selected === 'all' || p.category?.toLowerCase() === selected.toLowerCase();
      const q = search.toLowerCase().trim();
      const okSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.prompt_text?.toLowerCase().includes(q) ||
        p.ai_tool?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q));
      return okCat && okSearch;
    });
  }, [prompts, selected, search]);

  return (
    <div style={{ position: 'relative' }}>
      <AuroraBackground />

      {toastMsg && (
        <div className="pw-toast pw-toast-visible">
          <span>✨</span>
          <span>{toastMsg}</span>
        </div>
      )}

      <div
        className="pw-page"
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '2rem 1.5rem',
          display: 'flex',
          gap: '2rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* LEFT STICKY SIDEBAR */}
        <aside
          className="pw-catside"
          style={{ width: 250, flexShrink: 0, position: 'sticky', top: 86, alignSelf: 'flex-start', height: 'fit-content' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: 0 }}>Categories</h3>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{prompts.length}</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <button
              className={`pw-sidebar-item ${selected === 'all' ? 'is-active' : ''}`}
              onClick={() => setSelected('all')}
            >
              <span>📊 All Prompts</span>
              <span className="count">{prompts.length}</span>
            </button>
            {CATEGORIES.map((cat) => {
              const slug = cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  className={`pw-sidebar-item ${selected === slug ? 'is-active' : ''}`}
                  onClick={() => setSelected(slug)}
                >
                  <span>
                    {cat.icon} {cat.name}
                  </span>
                  <span className="count">{countFor(slug)}</span>
                </button>
              );
            })}
          </div>

          {/* Left Ad: 160x600 Banner */}
          <div style={{ marginTop: '2rem' }}>
            <AdSlot code={ADS.left} label="Sponsored" />
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main style={{ flex: 1, minWidth: 0 }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <span className="pw-eyebrow">Explore Library</span>
            <h1 style={{ color: '#fff', margin: '0 0 0.5rem', fontSize: 32, fontWeight: 800 }}>
              AI Prompt <span className="pw-gradient-text">Gallery</span>
            </h1>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: 0 }}>
              Search through {prompts.length} high-quality, verified prompts
            </p>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9a9aab"
              strokeWidth="2"
              style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)' }}
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="pw-search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prompts, styles, keywords, AI tools (e.g. anime, realistic, flux)..."
            />
          </div>

          {/* STICKY QUICK CATEGORIES BAR */}
          <div className="pw-quick-tabs-wrap">
            <button
              className={`pw-quick-tab ${selected === 'all' ? 'is-active' : ''}`}
              onClick={() => setSelected('all')}
            >
              All Prompts ({prompts.length})
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c.name}
                className={`pw-quick-tab ${selected === c.name.toLowerCase() ? 'is-active' : ''}`}
                onClick={() => setSelected(c.name.toLowerCase())}
              >
                <span>{c.icon}</span> {c.name} ({countFor(c.name.toLowerCase())})
              </button>
            ))}
          </div>

          {/* Prompts Grid */}
          <div
            className="pw-grid"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '1.5rem' }}
          >
            {filtered.map((prompt, i) => (
              <div key={prompt.id} className="pw-reveal" style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
                <PromptCard prompt={prompt} onCopy={showToast} />
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="pw-empty-state">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: 20, color: '#fff', marginBottom: '0.5rem' }}>No prompts found</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', margin: '0 auto 1.5rem' }}>
                Try adjusting your search terms or select a different category.
              </p>
              <button
                className="pw-btn-primary"
                onClick={() => {
                  setSearch('');
                  setSelected('all');
                }}
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Bottom Ads: 468x60 (Desktop) & 320x50 (Mobile) */}
          <div style={{ marginTop: '2.5rem' }}>
            <AdSlot code={ADS.bottom} label="Sponsored" className="pw-ad--dsk" />
            <AdSlot code={ADS.bottomM} label="Sponsored" className="pw-ad--mob" />
          </div>
        </main>

        {/* RIGHT RAIL */}
        <aside
          className="pw-rightrail"
          style={{
            width: 300,
            flexShrink: 0,
            position: 'sticky',
            top: 86,
            alignSelf: 'flex-start',
            height: 'fit-content',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <AdSlot code={ADS.right} label="Sponsored" />
          <AdSlot code={ADS.smart} label="Sponsored partner" className="pw-smart" />

          <div
            className="pw-promo"
            style={{ background: 'var(--panel)', padding: '1.5rem', borderRadius: 16, border: '1px solid var(--line)' }}
          >
            <span className="pw-promo__kicker" style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 600, letterSpacing: '0.05em' }}>
              PromptWorld+
            </span>
            <h4 className="pw-promo__title" style={{ color: '#fff', fontSize: 18, fontWeight: 700, margin: '8px 0' }}>
              Unlock the full archive
            </h4>
            <p className="pw-promo__text" style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.5, margin: '0 0 1rem' }}>
              Premium prompts, early drops, and the complete recipe library — ad‑light.
            </p>
            <Link
              href="/subscribe"
              className="pw-btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '10px', display: 'flex' }}
            >
              ⭐ Go Premium
            </Link>
          </div>
        </aside>
      </div>

      <MobileCategoryBar selected={selected} onSelect={setSelected} />

      <AdSlot bare code={ADS.pop} />
      <AdSlot bare code={ADS.social} />
    </div>
  );
}
