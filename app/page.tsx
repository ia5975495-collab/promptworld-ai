'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/mockData';
import { usePrompts } from '@/lib/store';

const TICKER = ['Midjourney V6', 'DALL·E 3', 'Stable Diffusion XL', 'Flux Pro', 'Leonardo Phoenix', 'Ideogram 2', 'Adobe Firefly'];

export default function Home() {
  const prompts = usePrompts();
  const [selected, setSelected] = useState('all');

  const filtered = selected === 'all' ? prompts : prompts.filter((p) => p.category === selected);
  const countFor = (slug: string) => prompts.filter((p) => p.category === slug).length;

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem', display: 'flex', gap: '2rem' }}>
      <aside style={{ width: 250, flexShrink: 0, position: 'sticky', top: 100, height: 'fit-content' }}>
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
      </aside>

      <main style={{ flex: 1, minWidth: 0 }}>
        {selected === 'all' && (
          <div className="pw-reveal" style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--panel)', borderRadius: 24, border: '1px solid var(--line)', marginBottom: '2rem' }}>
            <span className="pw-eyebrow">Curated prompt library</span>
            <h1 style={{ fontSize: 48, fontWeight: 800, color: '#fff', marginBottom: '1rem', lineHeight: 1.15 }}>Discover the World's{' '}<span style={{ background: 'linear-gradient(120deg,#7c5cff,#5b8cff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Best AI Prompts</span></h1>
            <p style={{ color: 'var(--muted)', fontSize: 18, maxWidth: 640, margin: '0 auto 2rem', lineHeight: 1.6 }}>Browse curated, production‑ready prompts for Midjourney, DALL·E, Stable Diffusion and more — then generate them in one click.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/gallery" className="pw-btn-primary">Explore Gallery →</Link>
              <Link href="/subscribe" className="pw-btn-ghost">Go Premium</Link>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
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
      </main>
    </div>
  );
}