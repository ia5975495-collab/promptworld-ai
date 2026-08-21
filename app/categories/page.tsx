'use client';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/mockData';
import { usePrompts } from '@/lib/store';
import AuroraBackground from '@/components/AuroraBackground';
import AdSlot from '@/components/AdSlot';
import { ADS } from '@/lib/ads';

const CAT_COLORS = [
  'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(124, 92, 255, 0.05))',
  'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.05))',
  'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(236, 72, 153, 0.05))',
  'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(245, 158, 11, 0.05))',
  'linear-gradient(135deg, rgba(6, 182, 212, 0.15), rgba(59, 130, 246, 0.05))',
  'linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(239, 68, 68, 0.05))',
  'linear-gradient(135deg, rgba(124, 92, 255, 0.15), rgba(168, 85, 247, 0.05))',
  'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.05))',
];

export default function CategoriesPage() {
  const prompts = usePrompts();
  const countFor = (name: string) =>
    prompts.filter((p) => p.category?.toLowerCase() === name.toLowerCase()).length;

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '2rem 1rem 5rem' }}>
      <AuroraBackground />

      <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Top Ad */}
        <div style={{ marginBottom: '2rem' }}>
          <AdSlot code={ADS.topThin} label="Sponsored" />
        </div>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="pw-eyebrow">Explore Styles</span>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: 'white', marginBottom: '0.75rem' }}>
            Browse AI Prompts by <span className="pw-gradient-text">Category</span>
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            Explore {prompts.length} curated prompts categorized for easy discovery across ChatGPT, Nanobanana, and Gemini.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {CATEGORIES.map((category, idx) => {
            const count = countFor(category.name);
            return (
              <Link
                key={category.name}
                href={`/gallery?category=${category.name.toLowerCase()}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="pw-card"
                  style={{
                    background: CAT_COLORS[idx % CAT_COLORS.length],
                    borderRadius: '1.25rem',
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                    border: '1px solid var(--line)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ fontSize: '3.5rem', marginBottom: '1.25rem', transform: 'scale(1)', transition: 'transform 0.3s' }}>
                    {category.icon}
                  </div>
                  <h3 style={{ color: 'white', fontWeight: 700, fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                    {category.name}
                  </h3>
                  <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0 }}>
                    <strong style={{ color: '#b9a7ff' }}>{count}</strong> {count === 1 ? 'curated prompt' : 'curated prompts'}
                  </p>
                  <div
                    style={{
                      marginTop: '1.25rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#b9a7ff',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                    }}
                  >
                    Explore prompts →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom Ad */}
        <div style={{ marginTop: '3rem' }}>
          <AdSlot code={ADS.bottom} label="Sponsored" className="pw-ad--dsk" />
          <AdSlot code={ADS.bottomM} label="Sponsored" className="pw-ad--mob" />
        </div>
      </div>
    </div>
  );
}
