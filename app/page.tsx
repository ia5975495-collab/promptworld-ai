'use client';
import { useState } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/mockData';
import AdSlot from '@/components/AdSlot';
import { ADS } from '@/lib/ads';
import MobileCategoryBar from '@/components/MobileCategoryBar';
import { usePrompts, getCoverImage, hasMultipleImages } from '@/lib/store';
import Image from 'next/image';

   

const TICKER = ['Midjourney V6', 'DALL·E 3', 'Stable Diffusion XL', 'Flux Pro', 'Leonardo Phoenix', 'Ideogram 2', 'Adobe Firefly'];

export default function Home() {
  const prompts = usePrompts();
  const [selected, setSelected] = useState('all');
  const filtered = selected === 'all' ? prompts : prompts.filter((p) => p.category === selected);
  const countFor = (slug: string) => prompts.filter((p) => p.category === slug).length;

  return (
    <div className="pw-page" style={{ maxWidth: 1400, margin: '0 auto', padding: '2rem', display: 'flex', gap: '2rem' }}>
      
      {/* LEFT SIDEBAR */}
      <aside className="pw-catside" style={{ width: 250, flexShrink: 0, position: 'sticky', top: 100, height: 'fit-content' }}>
        <h3 style={{ color: '#fff', marginBottom: '1rem', fontSize: 18, fontWeight: 700 }}>Categories</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button className={`pw-sidebar-item ${selected === 'all' ? 'is-active' : ''}`} onClick={() => setSelected('all')}>
            <span>📊 All Prompts</span><span className="count">{prompts.length}</span>
          </button>
          {CATEGORIES.map((cat) => {
            const slug = cat.name.toLowerCase();
            return (
              <button key={cat.name} className={`pw-sidebar-item ${selected === slug ? 'is-active' : ''}`} onClick={() => setSelected(slug)}>
                <span>{cat.icon} {cat.name}</span><span className="count">{countFor(slug)}</span>
              </button>
            );
          })}
        </div>
        
        {/* Left Ad Slot */}
        <div style={{ marginTop: '2rem' }}>
           <AdSlot code={ADS.left} label="Sponsored" />
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main style={{ flex: 1, minWidth: 0 }}>
        
        {/* 1. THIN AD AT THE TOP */}
        <AdSlot code={ADS.topThin} label="Sponsored" />

        {/* 2. THE GRID (Directly under the ad) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', marginTop: '2rem' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#fff', margin: 0 }}>
            {selected === 'all' ? '🔥 Trending Prompts' : `📂 ${selected.charAt(0).toUpperCase() + selected.slice(1)} Prompts`}
          </h2>
          {selected !== 'all' && (
            <button onClick={() => setSelected('all')} style={{ color: '#b9a7ff', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14 }}>
              Show all →
            </button>
          )}
        </div>

        {/* 3. PICTURES: 3 IN A LINE */}
        <div className="pw-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {filtered.map((prompt, i) => (
  <div key={prompt.id} className="pw-reveal" style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
    <Link href={`/prompt/${prompt.id}`} style={{ textDecoration: 'none' }}>
      <div className="pw-card">
        {/* --- IMAGE CONTAINER (FIXED) --- */}
        <div style={{ position: 'relative', aspectRatio: '3/4' }}>
          <img src={getCoverImage(prompt.image_url)} alt={prompt.title} style={{width:'100%',height:'100%',objectFit:'contain'}} /> 
           {hasMultipleImages(prompt.image_url) && (
    <div style={{
      position: 'absolute',
      top: 12,
      right: 12,
      width: 28,
      height: 28,
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <rect x="7" y="7" width="14" height="14" rx="2" ry="2" opacity="0.7"/>
      </svg>
    </div>
  )}
          {prompt.is_premium && (
            <div style={{ 
              position: 'absolute', 
              top: 12, 
              left: 12, 
              background: 'linear-gradient(120deg,#fbbf24,#f59e0b)', 
              color: '#0a0a0f', 
              padding: '4px 12px', 
              borderRadius: 9999, 
              fontSize: 12, 
              fontWeight: 700 
            }}>
              PRO
            </div>
          )}
        </div>
        {/* --- END IMAGE CONTAINER --- */}

        <div style={{ padding: '1rem' }}>
          <h3 style={{ color: '#fff', margin: '0 0 8px', fontSize: 14, fontWeight: 600 }}>{prompt.title}</h3>
          <p style={{ color: 'var(--muted)', fontSize: 12, margin: 0 }}>{prompt.creator_name}</p>
        </div>
      </div>
    </Link>
  </div>
))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--muted)' }}>
            <p style={{ fontSize: 18, marginBottom: '1rem' }}>No prompts in this category yet.</p>
            <button className="pw-btn-ghost" onClick={() => setSelected('all')}>Show all prompts</button>
          </div>
        )}

        {/* Bottom Ads */}
        <div style={{ marginTop: '2rem' }}>
          <AdSlot code={ADS.bottom} label="Sponsored" className="pw-ad--dsk" />
          <AdSlot code={ADS.bottomM} label="Sponsored" className="pw-ad--mob" />
        </div>
      </main>

      {/* RIGHT RAIL (Promo card removed, only ads remain) */}
      

      <MobileCategoryBar selected={selected} onSelect={setSelected} />
    </div>
  );
}