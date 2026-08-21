'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/mockData';
import AdSlot from '@/components/AdSlot';
import { ADS } from '@/lib/ads';
import MobileCategoryBar from '@/components/MobileCategoryBar';
import { usePrompts } from '@/lib/store';
import AuroraBackground from '@/components/AuroraBackground';
import Hero from '@/components/Hero';
import PromptCard from '@/components/PromptCard';

export default function Home() {
  const prompts = usePrompts();
  const [selected, setSelected] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Trigger copy toast
  const showToast = (text: string) => {
    setToastMsg('Prompt copied to clipboard! Ready to paste into your AI generator.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Filter prompts by category and search
  const filtered = useMemo(() => {
    return prompts.filter((p) => {
      const matchCat = selected === 'all' || p.category?.toLowerCase() === selected.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title?.toLowerCase().includes(q) ||
        p.prompt_text?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.ai_tool?.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [prompts, selected, searchQuery]);

  const countFor = (slug: string) => prompts.filter((p) => p.category?.toLowerCase() === slug.toLowerCase()).length;

  return (
    <div style={{ position: 'relative' }}>
      {/* Animated Aurora Background Mesh */}
      <AuroraBackground />

      {/* Hero Section with Real Dynamic Counts */}
      <Hero onSearch={setSearchQuery} promptCount={prompts.length} categoryCount={CATEGORIES.length} />

      {/* Copy Toast Notification */}
      {toastMsg && (
        <div className="pw-toast pw-toast-visible">
          <span>✨</span>
          <span>{toastMsg}</span>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div
        id="prompts-grid"
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
        {/* LEFT SIDEBAR */}
        <aside
          className="pw-catside"
          style={{ width: 250, flexShrink: 0, position: 'sticky', top: 90, height: 'fit-content' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 700, margin: 0 }}>Categories</h3>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>{prompts.length} total</span>
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

          {/* Left Sidebar 160x600 Ad Slot */}
          <div style={{ marginTop: '2rem' }}>
            <AdSlot code={ADS.left} label="Sponsored" />
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* 1. Top Thin Leaderboard Ad (728x90) */}
          <div style={{ marginBottom: '1.5rem' }}>
            <AdSlot code={ADS.topThin} label="Sponsored Leaderboard" />
          </div>

          {/* Category Quick Tabs Bar */}
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

          {/* Section Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem',
              marginTop: '1.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 800, color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                {selected === 'all'
                  ? '🔥 Trending AI Prompts'
                  : `📂 ${selected.charAt(0).toUpperCase() + selected.slice(1)} Prompts`}
                <span className="pw-live-indicator">LIVE</span>
              </h2>
              {searchQuery && (
                <p style={{ color: 'var(--muted)', fontSize: 13, margin: '4px 0 0' }}>
                  Showing results for &quot;<span style={{ color: '#b9a7ff' }}>{searchQuery}</span>&quot; ({filtered.length} found)
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              {selected !== 'all' && (
                <button
                  onClick={() => setSelected('all')}
                  className="pw-btn-ghost"
                  style={{ padding: '6px 14px', fontSize: 13 }}
                >
                  Show all prompts →
                </button>
              )}
            </div>
          </div>

          {/* 2. THE PROMPTS GRID */}
          <div className="pw-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {filtered.map((prompt, i) => (
              <div key={prompt.id} className="pw-reveal" style={{ animationDelay: `${Math.min(i, 8) * 45}ms` }}>
                <PromptCard prompt={prompt} onCopy={showToast} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <div className="pw-empty-state">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: 20, color: '#fff', marginBottom: '0.5rem' }}>No prompts found</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 400, margin: '0 auto 1.5rem' }}>
                {searchQuery
                  ? `No prompts match "${searchQuery}". Try searching for something else or reset your filter.`
                  : 'No prompts currently in this category. Check back soon for new drops!'}
              </p>
              <button
                className="pw-btn-primary"
                onClick={() => {
                  setSelected('all');
                  setSearchQuery('');
                }}
              >
                Reset Filters &amp; Show All
              </button>
            </div>
          )}

          {/* IN-FEED SPONSORED AD */}
          <div style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>
            <AdSlot code={ADS.right} label="Featured Partner" className="pw-ad-featured" />
          </div>

          {/* CATEGORIES BROWSER SHOWCASE (REAL COUNTS) */}
          <section className="pw-cat-showcase" style={{ marginTop: '3.5rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span className="pw-eyebrow">Explore Styles</span>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff' }}>Browse By Category</h2>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>Pick a style to jump straight into curated prompts</p>
            </div>

            <div className="pw-cat-showcase-grid">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => {
                    setSelected(cat.name.toLowerCase());
                    document.getElementById('prompts-grid')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="pw-cat-showcase-card"
                >
                  <span className="pw-cat-showcase-icon">{cat.icon}</span>
                  <h4 className="pw-cat-showcase-name">{cat.name}</h4>
                  <span className="pw-cat-showcase-count">{countFor(cat.name.toLowerCase())} Prompts</span>
                </button>
              ))}
            </div>
          </section>

          {/* PREMIUM UPGRADE CTA BANNER */}
          <section className="pw-cta-banner" style={{ marginTop: '3.5rem' }}>
            <div className="pw-cta-banner-content">
              <span className="pw-cta-banner-badge">⭐ PROMPTWORLD+</span>
              <h3 className="pw-cta-banner-title">Supercharge Your AI Art Workflow</h3>
              <p className="pw-cta-banner-desc">
                Get unlimited access to production-ready prompts, master prompt recipes, high-res
                downloads, and an ad-light browsing experience.
              </p>
              <div className="pw-cta-banner-perks">
                <span>✓ High-Resolution Prompts</span>
                <span>✓ Early Access Drops</span>
                <span>✓ Ad-Light Browsing</span>
                <span>✓ Negative Prompt Presets</span>
              </div>
              <Link href="/subscribe" className="pw-btn-primary pw-cta-banner-btn">
                ⭐ Upgrade to Premium Now
              </Link>
            </div>
          </section>

          {/* Bottom Ads: Desktop 468x60 & Mobile 320x50 */}
          <div style={{ marginTop: '2.5rem' }}>
            <AdSlot code={ADS.bottom} label="Sponsored" className="pw-ad--dsk" />
            <AdSlot code={ADS.bottomM} label="Sponsored" className="pw-ad--mob" />
          </div>
        </main>
      </div>

      {/* Mobile Category Fixed Bottom Bar */}
      <MobileCategoryBar selected={selected} onSelect={setSelected} />

      {/* Global Background Ads (Pop & Social) */}
      <AdSlot bare code={ADS.pop} />
      <AdSlot bare code={ADS.social} />
    </div>
  );
}
