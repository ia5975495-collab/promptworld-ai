
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePrompt, allImages } from '@/lib/store';
import { getAllPrompts } from '@/lib/store'; // Make sure this is imported
import type { Metadata } from 'next';

// This dynamically generates SEO tags for every single prompt page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const prompts = getAllPrompts();
  const prompt = prompts.find((p) => p.id === id);

  if (!prompt) {
    return { title: 'Prompt Not Found | PromptWorld AI' };
  }

  return {
    title: `${prompt.title} - AI Prompt | PromptWorld AI`,
    description: `${prompt.description}. Generated with ${prompt.ai_tool} (${prompt.model}). Copy this ${prompt.style} prompt for free.`,
    keywords: [prompt.category, prompt.style, prompt.ai_tool, 'AI prompt', 'copy prompt', 'Midjourney prompt'],
    openGraph: {
      title: `${prompt.title} - AI Prompt`,
      description: prompt.description,
      url: `https://promptworld.store/prompt/${prompt.id}`, // REPLACE WITH YOUR ACTUAL DOMAIN
      siteName: 'PromptWorld AI',
      images: [
        {
          url: prompt.image_url,
          width: 800,
          height: 600,
          alt: prompt.title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
  };
}
export default function PromptDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { prompt, loading } = usePrompt(id);
  const [idx, setIdx] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(0);
  const [copied, setCopied] = useState(false);
  useEffect(() => { setIdx(0); }, [id]);
  useEffect(() => {
    if (!prompt) return;
    const liked = JSON.parse(localStorage.getItem('likedPrompts') || '[]');
    setIsLiked(liked.includes(id));
    setLikesCount(prompt.likes_count || 0);
    setSharesCount(prompt.downloads_count || 0);
  }, [prompt, id]);
  const imgs = prompt ? allImages(prompt) : [];
  const has = imgs.length > 0;
  const prev = () => setIdx((i) => (i - 1 + imgs.length) % imgs.length);
  const next = () => setIdx((i) => (i + 1) % imgs.length);
  const handleLike = () => {
    const liked = JSON.parse(localStorage.getItem('likedPrompts') || '[]');
    if (isLiked) { localStorage.setItem('likedPrompts', JSON.stringify(liked.filter((x: string) => x !== id))); setLikesCount((n) => n - 1); }
    else { liked.push(id); localStorage.setItem('likedPrompts', JSON.stringify(liked)); setLikesCount((n) => n + 1); }
    setIsLiked(!isLiked);
  };
  const handleShare = async () => {
    try {
      if (navigator.share) await navigator.share({ title: prompt?.title, text: prompt?.description, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); alert('Link copied to clipboard!'); }
      setSharesCount((n) => n + 1);
    } catch {}
  };
  const handleCopy = async () => {
    if (!prompt) return;
    try { await navigator.clipboard.writeText(prompt.prompt_text); }
    catch { const ta = document.createElement('textarea'); ta.value = prompt.prompt_text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  if (loading) return <div style={{ padding: '4rem', color: 'var(--muted)', textAlign: 'center' }}>Loading…</div>;
  if (!prompt) return <div style={{ padding: '4rem', textAlign: 'center', color: '#fff' }}><h1>Prompt not found</h1><Link href="/gallery" style={{ color: '#b9a7ff' }}>← Back to Gallery</Link></div>;
  return (
    <div className="pw-page" style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem', color: '#fff' }}>
      <Link href="/gallery" style={{ color: 'var(--muted)', textDecoration: 'none', fontSize: 14, display: 'inline-block', marginBottom: '1.5rem' }}>← Back to Gallery</Link>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div>
          {has ? (
            <div className="pw-carousel">
              <div className="pw-carousel__viewport">
                <img src={imgs[idx] || imgs[0]} alt={prompt.title} style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }} />
                {imgs.length > 1 && (
                  <>
                    <button type="button" className="pw-carousel__nav pw-carousel__nav--prev" aria-label="Previous image" onClick={prev}>‹</button>
                    <button type="button" className="pw-carousel__nav pw-carousel__nav--next" aria-label="Next image" onClick={next}>›</button>
                  </>
                )}
              </div>
              {imgs.length > 1 && (
                <div className="pw-carousel__foot">
                  <div className="pw-carousel__dots">{imgs.map((_, i) => (<button key={i} type="button" aria-label={`Image ${i + 1}`} className={`pw-carousel__dot${i === idx ? ' is-on' : ''}`} onClick={() => setIdx(i)} />))}</div>
                  <span className="pw-carousel__count">{idx + 1} / {imgs.length}</span>
                </div>
              )}
            </div>
          ) : (
            <div style={{ borderRadius: 18, border: '1px solid var(--line)', aspectRatio: '3/4', display: 'grid', placeItems: 'center', color: 'var(--muted)' }}>No image</div>
          )}
          <div className="pw-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem', padding: '1rem 0', borderTop: '1px solid var(--line)' }}>
            <button onClick={handleLike} title={isLiked ? 'Unlike' : 'Like'} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 28, padding: 8 }}>{isLiked ? '❤️' : '🤍'}</button>
            <button onClick={handleShare} title="Share" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 28, padding: 8 }}>✈️</button>
            <div style={{ display: 'flex', gap: '2rem', marginLeft: '1rem', fontSize: 14, color: 'var(--muted)' }}><span>{likesCount.toLocaleString()} likes</span><span>{sharesCount.toLocaleString()} shares</span></div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: '1rem' }}>{prompt.tags.map((t) => <span key={t} style={{ background: 'var(--panel-2)', color: 'var(--muted)', padding: '6px 12px', borderRadius: 9999, fontSize: 12, border: '1px solid var(--line)' }}>#{t}</span>)}</div>
        </div>
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: '1rem' }}>
            <span style={{ background: 'rgba(124,92,255,.12)', color: '#b9a7ff', padding: '4px 12px', borderRadius: 9999, fontSize: 12, border: '1px solid rgba(124,92,255,.3)' }}>{prompt.ai_tool}</span>
            <span style={{ background: 'var(--panel-2)', color: 'var(--muted)', padding: '4px 12px', borderRadius: 9999, fontSize: 12, border: '1px solid var(--line)' }}>{prompt.model}</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', marginBottom: '1rem', marginTop: 0 }}>{prompt.title}</h1>
          <p style={{ color: 'var(--muted)', lineHeight: 1.6, marginBottom: '2rem', marginTop: 0 }}>{prompt.description}</p>
          <div style={{ background: 'var(--panel)', padding: '1.5rem', borderRadius: 16, border: '1px solid var(--line)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}><h3 style={{ color: '#fff', fontWeight: 600, fontSize: 16, margin: 0 }}>Prompt</h3>
              <button onClick={handleCopy} className="pw-btn-primary" style={{ padding: '8px 16px', fontSize: 13, background: copied ? '#22c55e' : undefined }}>{copied ? '✓ Copied!' : '📋 Copy Prompt'}</button></div>
            <p style={{ color: '#d6d6e0', fontFamily: 'ui-monospace, monospace', fontSize: 14, background: '#0a0a0f', padding: '1rem', borderRadius: 10, border: '1px solid var(--line)', lineHeight: 1.6, margin: 0, wordBreak: 'break-word' }}>{prompt.prompt_text}</p>
          </div>
          {prompt.negative_prompt && (
            <div style={{ background: 'var(--panel)', padding: '1.5rem', borderRadius: 16, border: '1px solid var(--line)', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#fff', fontWeight: 600, fontSize: 16, marginBottom: 12, marginTop: 0 }}>Negative Prompt</h3>
              <p style={{ color: 'var(--muted)', fontFamily: 'ui-monospace, monospace', fontSize: 14, background: '#0a0a0f', padding: '1rem', borderRadius: 10, border: '1px solid var(--line)', margin: 0 }}>{prompt.negative_prompt}</p>
            </div>
          )}
          <div style={{ background: 'var(--panel)', padding: '1.5rem', borderRadius: 16, border: '1px solid var(--line)', marginBottom: '1.5rem' }}>
            <h3 style={{ color: '#fff', fontWeight: 600, fontSize: 16, marginBottom: '1rem', marginTop: 0 }}>Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: 14 }}>
              <div><span style={{ color: 'var(--muted)' }}>Style:</span> <span style={{ color: '#fff', marginLeft: 8 }}>{prompt.style}</span></div>
              <div><span style={{ color: 'var(--muted)' }}>Aspect Ratio:</span> <span style={{ color: '#fff', marginLeft: 8 }}>{prompt.aspect_ratio}</span></div>
              <div><span style={{ color: 'var(--muted)' }}>Category:</span> <span style={{ color: '#fff', marginLeft: 8, textTransform: 'capitalize' }}>{prompt.category}</span></div>
              <div><span style={{ color: 'var(--muted)' }}>Model:</span> <span style={{ color: '#fff', marginLeft: 8 }}>{prompt.model}</span></div>
            </div>
          </div>
          <a href="https://your-image-generator-website.com" target="_blank" rel="noopener noreferrer" className="pw-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 16, fontSize: 16 }}>🎨 Generate from Image Generator</a>
        </div>
      </div>
    </div>
  );
}