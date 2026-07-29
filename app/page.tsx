'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/mockData';
import { usePrompts } from '@/lib/store';
import AdSlot from '@/components/AdSlot';
import { ADS } from '@/lib/ads';
import MobileCategoryBar from '@/components/MobileCategoryBar';

const TICKER = ['Midjourney V6', 'DALL·E 3', 'Stable Diffusion XL', 'Flux Pro', 'Leonardo Phoenix', 'Ideogram 2', 'Adobe Firefly'];

export default function Home() {
  const prompts = usePrompts();
  const [selected, setSelected] = useState('all');

  const filtered = selected === 'all' ? prompts : prompts.filter((p) => p.category === selected);
  const countFor = (slug: string) => prompts.filter((p) => p.category === slug).length;

  return (
    <div className="pw-page" style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem', display: 'flex', gap: '2rem' }}>
      {/* LEFT sidebar + left ad */}
      <aside className="pw-catside" style={{ width: 250, flexShrink: 0, position: 'sticky', top: 100, height: 'fit-content' }}>
        <h3 style={{ color: '#fff', marginBottom: '1rem', fontSize: 18, fontWeight: 700 }}>Categories</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className={`pw-sidebar-item ${selected === 'all' ? 'is-active' : ''}`} onClick={() => setSelected('all')}><span>📊 All Prompts</span><span className="count">{prompts.length}</span></button>
          {CATEGORIES.map((cat) => { const slug = cat.name.toLowerCase(); return (
            <button key={cat.name} className={`pw-sidebar-item ${selected === slug ? 'is-active' : ''}`} onClick={() => setSelected(slug)}><span>{cat.icon} {cat.name}</span><span className="count">{countFor(slug)}</span></button>
          ); })}
        </div>
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--panel)', borderRadius: 14, border: '1px solid var(--line)' }}>
          <h4 style={{ color: '#fff', marginBottom: '1rem', fontSize: 14, fontWeight: 600 }}>Now Showing</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Prompts</span><span style={{ color: '#fff', fontWeight: 600 }}>{filtered.length}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--muted)' }}>Filter</span><span style={{ color: '#b9a7ff', fontWeight: 600, textTransform: 'capitalize' }}>{selected === 'all' ? 'All' : selected}</span></div>
          </div>
          {selected !== 'all' && <button className="pw-btn-ghost" onClick={() => setSelected('all')} style={{ width: '100%', marginTop: 14, justifyContent: 'center', padding: '9px' }}>Clear filter</button>}
        </div>
        <AdSlot code={ADS.left} label="Sponsored" />
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, minWidth: 0 }}>
        {selected === 'all' && (
          <div className="pw-reveal pw-masthead" style={{ marginBottom: '2rem' }}>
            <div className="pw-masthead__kicker">
              <span className="pw-masthead__tick" /> Issue 01 — The Curated Archive
              <span className="pw-masthead__sep" /> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div className="pw-masthead__grid">
              <div>
                <h1 className="pw-display" style={{ fontSize: 'clamp(40px,6vw,76px)', margin: '0 0 1.1rem', color: 'var(--paper)' }}>
                  A living archive of<br /><span className="pw-accent-ink">prompts worth stealing.</span>
                </h1>
                <p style={{ color: 'var(--muted)', fontSize: 17, lineHeight: 1.6, maxWidth: 460, margin: '0 0 1.6rem' }}>
                  Hand‑picked, production‑ready prompts for Midjourney, DALL·E, Flux and more — each one a recipe you can copy, remix, and generate in a single click.
                </p>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <Link href="/gallery" className="pw-btn-primary">Explore the gallery →</Link>
                  <Link href="/subscribe" className="pw-btn-ghost">Go Premium</Link>
                </div>
              </div>
              <div className="pw-contents">
                <div className="pw-contents__head">Index</div>
                {CATEGORIES.slice(0, 6).map((c) => { const slug = c.name.toLowerCase(); return (
                  <button key={c.name} type="button" onClick={() => setSelected(slug)} className="pw-contents__row" style={{ background: 'none', border: 'none', width: '100%', font: 'inherit', cursor: 'pointer', textAlign: 'left' }}>
                    <span>{c.icon} {c.name}</span><span className="pw-contents__leader" /><span className="pw-contents__num">{String(countFor(slug)).padStart(2, '0')}</span>
                  </button>
                ); })}
              </div>
            </div>
          </div>
        )}

        {selected === 'all' && (
          <div className="pw-ticker"><div className="pw-ticker__track">{[...TICKER, ...TICKER].map((t, i) => <span key={i} className="pw-ticker__item"><span className="pw-ticker__dot" />{t}</span>)}</div></div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: 0 }}>{selected === 'all' ? '🔥 Trending Prompts' : `📂 ${selected.charAt(0).toUpperCase() + selected.slice(1)} Prompts`}</h2>
          {selected !== 'all' && <button onClick={() => setSelected('all')} style={{ color: '#b9a7ff', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>Show all →</button>}
        </div>

        <div className="pw-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {filtered.map((prompt, i) => (
            <div key={prompt.id} className="pw-reveal" style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
              <Link href={`/prompt/${prompt.id}`} style={{ textDecoration: 'none' }}>
                <div className="pw-card">
                  <div style={{ position: 'relative', aspectRatio: '3/4' }}>
                    <img src={prompt.image_url} alt={prompt.title} />
                    {prompt.is_premium && <div style={{ position: 'absolute', top: 12, left: 12, background: 'linear-gradient(120deg,#fbbf24,#f59e0b)', color: '#0a0a0f', padding: '4px 12px', borderRadius: 9999, fontSize: 12, fontWeight: 700 }}>PRO</div>}
                    <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(8,8,12,.7)', backdropFilter: 'blur(6px)', color: '#fff', padding: '4px 10px', borderRadius: 9999, fontSize: 11 }}>{prompt.ai_tool}</div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <h3 style={{ color: '#fff', margin: '0 0 8px', fontSize: 14, fontWeight: 600 }}>{prompt.title}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: 12, margin: 0 }}>{prompt.creator_name}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}><p style={{ fontSize: 18, marginBottom: '1rem' }}>No prompts in this category yet.</p><button className="pw-btn-ghost" onClick={() => setSelected('all')}>Show all prompts</button></div>}

        <AdSlot code={ADS.bottom} label="Sponsored" className="pw-ad--dsk" />
        <AdSlot code={ADS.bottomM} label="Sponsored" className="pw-ad--mob" />
      </main>

      {/* RIGHT rail: native ad + smartlink + premium promo */}
      <aside className="pw-rightrail">
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