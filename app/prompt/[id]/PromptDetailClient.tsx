'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePrompt, allImages } from '@/lib/store';
import AdSlot from '@/components/AdSlot';
import { ADS } from '@/lib/ads';
import AuroraBackground from '@/components/AuroraBackground';

export default function PromptDetailClient({ id }: { id: string }) {
  const { prompt, loading } = usePrompt(id);
  const [idx, setIdx] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setIdx(0); }, [id]);
  useEffect(() => {
    if (!prompt) return;
    try {
      const liked = JSON.parse(localStorage.getItem('likedPrompts') || '[]');
      setIsLiked(liked.includes(id));
      setLikesCount(prompt.likes_count || 0);
      setSharesCount(prompt.downloads_count || 0);
    } catch {}
  }, [prompt, id]);

  const imgs = prompt ? allImages(prompt) : [];
  const has = imgs.length > 0;
  const prev = () => setIdx((i) => (i - 1 + imgs.length) % imgs.length);
  const next = () => setIdx((i) => (i + 1) % imgs.length);

  const handleLike = () => {
    try {
      const liked = JSON.parse(localStorage.getItem('likedPrompts') || '[]');
      if (isLiked) {
        localStorage.setItem('likedPrompts', JSON.stringify(liked.filter((x: string) => x !== id)));
        setLikesCount((n) => Math.max(0, n - 1));
      } else {
        liked.push(id);
        localStorage.setItem('likedPrompts', JSON.stringify(liked));
        setLikesCount((n) => n + 1);
      }
      setIsLiked(!isLiked);
    } catch {}
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: prompt?.title, text: prompt?.description, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
      setSharesCount((n) => n + 1);
    } catch {}
  };

  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await navigator.clipboard.writeText(prompt.prompt_text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = prompt.prompt_text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AuroraBackground />
        <div style={{ textAlign: 'center', color: '#fff', position: 'relative', zIndex: 2 }}>
          <div className="pw-spinner" style={{ width: 40, height: 40, borderWidth: 3, marginBottom: 16 }} />
          <p style={{ color: 'var(--muted)', fontSize: 16 }}>Loading prompt details…</p>
        </div>
      </div>
    );
  }

  if (!prompt) {
    return (
      <div style={{ position: 'relative', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <AuroraBackground />
        <div style={{ textAlign: 'center', color: '#fff', position: 'relative', zIndex: 2, padding: '2rem' }}>
          <h1 style={{ fontSize: 32, marginBottom: '1rem' }}>Prompt not found</h1>
          <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>This prompt may have been moved or removed.</p>
          <Link href="/gallery" className="pw-btn-primary">← Back to Gallery</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '2rem 1rem 5rem' }}>
      <AuroraBackground />

      <div className="pw-page" style={{ maxWidth: 1280, margin: '0 auto', color: '#fff', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <Link
            href="/gallery"
            style={{
              color: '#b9a7ff',
              textDecoration: 'none',
              fontSize: 14,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontWeight: 600,
            }}
          >
            ← Back to Gallery
          </Link>
          <span style={{ fontSize: 13, color: 'var(--muted)' }}>
            Category: <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{prompt.category}</strong>
          </span>
        </div>

        {/* TOP AD BAR */}
        <div style={{ marginBottom: '2rem' }}>
          <AdSlot code={ADS.topThin} label="Sponsored" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
          {/* Left Column: Media & Actions */}
          <div>
            {has ? (
              <div className="pw-carousel" style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid var(--line)', boxShadow: '0 20px 40px -20px rgba(0,0,0,0.8)' }}>
                <div className="pw-carousel__viewport" style={{ position: 'relative' }}>
                  <img
                    src={imgs[idx] || imgs[0]}
                    alt={prompt.title}
                    style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
                  />
                  {imgs.length > 1 && (
                    <>
                      <button type="button" className="pw-carousel__nav pw-carousel__nav--prev" aria-label="Previous image" onClick={prev}>
                        ‹
                      </button>
                      <button type="button" className="pw-carousel__nav pw-carousel__nav--next" aria-label="Next image" onClick={next}>
                        ›
                      </button>
                    </>
                  )}
                </div>
                {imgs.length > 1 && (
                  <div className="pw-carousel__foot" style={{ background: '#12121c', padding: '12px 16px' }}>
                    <div className="pw-carousel__dots">
                      {imgs.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          aria-label={`Image ${i + 1}`}
                          className={`pw-carousel__dot${i === idx ? ' is-on' : ''}`}
                          onClick={() => setIdx(i)}
                        />
                      ))}
                    </div>
                    <span className="pw-carousel__count">{idx + 1} / {imgs.length}</span>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ borderRadius: 20, border: '1px solid var(--line)', aspectRatio: '3/4', display: 'grid', placeItems: 'center', color: 'var(--muted)', background: '#12121c' }}>
                No image available
              </div>
            )}

            {/* Like & Share Action Row */}
            <div
              className="pw-actions"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '1.25rem',
                padding: '1rem 1.25rem',
                background: 'var(--panel)',
                borderRadius: '16px',
                border: '1px solid var(--line)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button
                  onClick={handleLike}
                  title={isLiked ? 'Unlike' : 'Like'}
                  style={{
                    background: isLiked ? 'rgba(239, 68, 68, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                    border: isLiked ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--line)',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontSize: 18,
                    padding: '8px 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    color: isLiked ? '#f87171' : '#fff',
                  }}
                >
                  {isLiked ? '❤️ Liked' : '🤍 Like'}
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{likesCount}</span>
                </button>

                <button
                  onClick={handleShare}
                  title="Share"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--line)',
                    borderRadius: 12,
                    cursor: 'pointer',
                    fontSize: 14,
                    padding: '8px 14px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    color: '#fff',
                  }}
                >
                  ✈️ Share
                </button>
              </div>

              <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                👁️ {prompt.views_count || 120} views
              </div>
            </div>

            {/* Tags */}
            {prompt.tags && prompt.tags.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: '1rem' }}>
                {prompt.tags.map((t: string) => (
                  <span
                    key={t}
                    style={{
                      background: 'var(--panel-2)',
                      color: '#b9a7ff',
                      padding: '6px 14px',
                      borderRadius: 9999,
                      fontSize: 12,
                      border: '1px solid var(--line)',
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Prompt Details & Actions */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: 'rgba(124, 92, 255, 0.15)',
                  color: '#c084fc',
                  padding: '5px 14px',
                  borderRadius: 9999,
                  fontSize: 12,
                  fontWeight: 700,
                  border: '1px solid rgba(124, 92, 255, 0.4)',
                }}
              >
                ⚡ {prompt.ai_tool || 'Nanobanana Pro'}
              </span>
              <span
                style={{
                  background: 'var(--panel-2)',
                  color: 'var(--muted)',
                  padding: '5px 14px',
                  borderRadius: 9999,
                  fontSize: 12,
                  fontWeight: 600,
                  border: '1px solid var(--line)',
                }}
              >
                Model: {prompt.model || 'Gemini 2.0 / Nanobanana'}
              </span>
              {prompt.is_premium && (
                <span
                  style={{
                    background: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                    color: '#0b0b10',
                    padding: '5px 14px',
                    borderRadius: 9999,
                    fontSize: 12,
                    fontWeight: 800,
                  }}
                >
                  ⭐ PRO EXCLUSIVE
                </span>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              {prompt.title}
            </h1>

            <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: 14 }}>
              {prompt.description || 'Curated high-performance prompt ready for generation in your favorite AI image generator.'}
            </p>

            {/* Prompt Box */}
            <div
              style={{
                background: 'var(--panel)',
                padding: '1.5rem',
                borderRadius: 18,
                border: '1px solid var(--line)',
                marginBottom: '1.5rem',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, margin: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
                  📝 Full Prompt
                </h3>
                <button
                  onClick={handleCopy}
                  className="pw-btn-primary"
                  style={{
                    padding: '8px 18px',
                    fontSize: 13,
                    background: copied ? '#10b981' : undefined,
                    boxShadow: copied ? '0 0 20px rgba(16, 185, 129, 0.5)' : undefined,
                  }}
                >
                  {copied ? '✓ Copied to Clipboard!' : '📋 Copy Prompt'}
                </button>
              </div>

              <div
                style={{
                  color: '#e2e8f0',
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: 14,
                  background: '#09090f',
                  padding: '1.25rem',
                  borderRadius: 12,
                  border: '1px solid var(--line)',
                  lineHeight: 1.65,
                  wordBreak: 'break-word',
                  userSelect: 'all',
                }}
              >
                {prompt.prompt_text}
              </div>
            </div>

            {/* Negative Prompt (if available) */}
            {prompt.negative_prompt && (
              <div
                style={{
                  background: 'var(--panel)',
                  padding: '1.25rem 1.5rem',
                  borderRadius: 16,
                  border: '1px solid var(--line)',
                  marginBottom: '1.5rem',
                }}
              >
                <h3 style={{ color: '#f87171', fontWeight: 700, fontSize: 14, marginBottom: 8, margin: 0 }}>
                  ⛔ Negative Prompt
                </h3>
                <p
                  style={{
                    color: 'var(--muted)',
                    fontFamily: 'ui-monospace, monospace',
                    fontSize: 13,
                    background: '#09090f',
                    padding: '0.85rem',
                    borderRadius: 10,
                    border: '1px solid var(--line)',
                    margin: '8px 0 0',
                  }}
                >
                  {prompt.negative_prompt}
                </p>
              </div>
            )}

            {/* Parameters & Details Grid */}
            <div
              style={{
                background: 'var(--panel)',
                padding: '1.25rem 1.5rem',
                borderRadius: 16,
                border: '1px solid var(--line)',
                marginBottom: '1.5rem',
              }}
            >
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 14, marginBottom: '0.75rem', marginTop: 0 }}>
                ⚙️ Generation Parameters
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: 13 }}>
                <div><span style={{ color: 'var(--muted)' }}>Style:</span> <strong style={{ color: '#fff', marginLeft: 6 }}>{prompt.style || 'Default'}</strong></div>
                <div><span style={{ color: 'var(--muted)' }}>Aspect Ratio:</span> <strong style={{ color: '#fff', marginLeft: 6 }}>{prompt.aspect_ratio || '1:1'}</strong></div>
                <div><span style={{ color: 'var(--muted)' }}>Category:</span> <strong style={{ color: '#fff', marginLeft: 6, textTransform: 'capitalize' }}>{prompt.category}</strong></div>
                <div><span style={{ color: 'var(--muted)' }}>Engine:</span> <strong style={{ color: '#fff', marginLeft: 6 }}>{prompt.ai_tool || 'Nanobanana / Gemini'}</strong></div>
              </div>
            </div>

            {/* GENERATE BUTTON: Links to Google Flow / ImageFX */}
            <a
              href="https://labs.google/fx/tools/image-fx"
              target="_blank"
              rel="noopener noreferrer"
              className="pw-btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '16px 24px',
                fontSize: '16px',
                fontWeight: 800,
                background: 'linear-gradient(135deg, #06b6d4 0%, #7c3aed 50%, #ec4899 100%)',
                boxShadow: '0 10px 30px -8px rgba(124, 58, 237, 0.7)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textDecoration: 'none',
              }}
            >
              <span>🎨</span>
              <span>Generate Image on Google Flow / ImageFX</span>
              <span style={{ fontSize: '18px' }}>↗</span>
            </a>

            {/* 300x250 Ad Banner */}
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
              <AdSlot code={ADS.smart} label="Sponsored" />
            </div>
          </div>
        </div>

        {/* BOTTOM ADS */}
        <div style={{ marginTop: '3.5rem', maxWidth: '970px', margin: '3.5rem auto 0' }}>
          <AdSlot code={ADS.bottom} label="Sponsored" className="pw-ad--dsk" />
          <AdSlot code={ADS.bottomM} label="Sponsored" className="pw-ad--mob" />
        </div>
      </div>

      <AdSlot bare code={ADS.pop} />
      <AdSlot bare code={ADS.social} />
    </div>
  );
}
