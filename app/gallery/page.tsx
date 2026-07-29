'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/mockData';
import { usePrompts, coverImage } from '@/lib/store';
import AdSlot from '@/components/AdSlot';
import { ADS } from '@/lib/ads';
import MobileCategoryBar from '@/components/MobileCategoryBar';

export default function GalleryPage() {
  const prompts = usePrompts();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState('all');

  const filtered = prompts.filter((p) => {
    const okCat = selected === 'all' || p.category === selected;
    const q = search.toLowerCase();
    const okSearch = !q || p.title.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
    return okCat && okSearch;
  });

  return (
    <div className="pw-page" style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem', display: 'flex', gap: '2rem' }}>
      <aside className="pw-catside" style={{ width: 250, flexShrink: 0, position: 'sticky', top: 100, height: 'fit-content' }}>
        <h3 style={{ color: '#fff', marginBottom: '1rem', fontSize: 18, fontWeight: 700 }}>Categories</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className={`pw-sidebar-item ${selected === 'all' ? 'is-active' : ''}`} onClick={() => setSelected('all')}><span>📊 All Prompts</span><span className="count">{prompts.length}</span></button>
          {CATEGORIES.map((cat) => { const slug = cat.name.toLowerCase(); return (
            <button key={cat.name} className={`pw-sidebar-item ${selected === slug ? 'is-active' : ''}`} onClick={() => setSelected(slug)}><span>{cat.icon} {cat.name}</span><span className="count">{prompts.filter((p) => p.category === slug).length}</span></button>
          ); })}
        </div>
        <AdSlot code={ADS.left} label="Sponsored" />
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        <h1 style={{ color: '#fff', marginBottom: '1.5rem', fontSize: 32, fontWeight: 800 }}>Prompt Gallery</h1>
        <div style={{ position: 'relative', marginBottom: '2rem' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9a9aab" strokeWidth="2" style={{ position: 'absolute', left: 15, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input className="pw-search" type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search prompts, tags, styles..." />
        </div>

        <div className="pw-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((prompt, i) => (
            <div key={prompt.id} className="pw-reveal" style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
              <Link href={`/prompt/${prompt.id}`} style={{ textDecoration: 'none' }}>
                <div className="pw-card">
                  <div style={{ position: 'relative', aspectRatio: '3/4' }}>
                    <img src={coverImage(prompt)} alt={prompt.title} />
                    {prompt.is_premium && <div style={{ position: 'absolute', top: 12, left: 12, background: 'linear-gradient(120deg,#fbbf24,#f59e0b)', color: '#0a0a0f', padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 700 }}>PRO</div>}
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ color: '#fff', margin: '0 0 8px', fontSize: 14, fontWeight: 600 }}>{prompt.title}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: 12, margin: 0 }}>{prompt.ai_tool}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>No prompts found.</div>}

        <AdSlot code={ADS.bottom} label="Sponsored" className="pw-ad--dsk" />
        <AdSlot code={ADS.bottomM} label="Sponsored" className="pw-ad--mob" />
      </main>

      <aside className="pw-rightrail">
        <AdSlot code={ADS.right} label="Sponsored" />
        <AdSlot code={ADS.smart} label="Sponsored partner" className="pw-smart" />
        <div className="pw-promo">
          <span className="pw-promo__kicker">PromptWorld+</span>
          <h4 className="pw-promo__title">Unlock the full archive</h4>
          <p className="pw-promo__text">Premium prompts, early drops, and the complete recipe library — ad‑light.</p>
          <Link href="/subscribe" className="pw-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '10px' }}>Go Premium</Link>
        </div>
      </aside>

      <MobileCategoryBar selected={selected} onSelect={setSelected} />
      <AdSlot bare code={ADS.pop} />
      <AdSlot bare code={ADS.social} />
    </div>
  );
}