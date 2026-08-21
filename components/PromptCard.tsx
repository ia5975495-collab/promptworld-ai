'use client';
import { useState } from 'react';
import Link from 'next/link';
import { getCoverImage, hasMultipleImages } from '@/lib/store';

export default function PromptCard({ prompt, onCopy }: { prompt: any; onCopy?: (text: string) => void }) {
  const [copied, setCopied] = useState(false);

  const handleQuickCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const text = prompt.prompt_text || prompt.title;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      if (onCopy) onCopy(text);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Link href={`/prompt/${prompt.id}`} style={{ textDecoration: 'none' }}>
      <div className="pw-card pw-prompt-card">
        {/* --- IMAGE CONTAINER --- */}
        <div className="pw-card-img-wrap" style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
          <img
            src={getCoverImage(prompt.image_url)}
            alt={prompt.title}
            className="pw-card-img"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            loading="lazy"
          />

          {/* Quick Copy Button on Hover */}
          <button
            type="button"
            onClick={handleQuickCopy}
            className={`pw-card-quick-copy ${copied ? 'is-copied' : ''}`}
            title="Copy prompt text"
          >
            {copied ? '✓ Copied' : '📋 Copy'}
          </button>

          {/* Multiple images indicator */}
          {hasMultipleImages(prompt.image_url) && (
            <div className="pw-card-multi-badge">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <rect x="7" y="7" width="14" height="14" rx="2" ry="2" opacity="0.7" />
              </svg>
            </div>
          )}

          {/* Premium PRO Badge */}
          {prompt.is_premium && (
            <div className="pw-card-pro-badge">
              ⭐ PRO
            </div>
          )}

          {/* AI Tool Badge */}
          {prompt.ai_tool && (
            <div className="pw-card-tool-badge">
              {prompt.ai_tool}
            </div>
          )}
        </div>

        {/* --- CARD CONTENT --- */}
        <div style={{ padding: '1.1rem' }}>
          <h3 className="pw-card-title">{prompt.title}</h3>
          
          <div className="pw-card-meta">
            <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
              👤 {prompt.creator_name || 'PromptWorld Artist'}
            </span>
            <span style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
              ❤️ {prompt.likes_count || 0}
            </span>
          </div>

          {prompt.tags && prompt.tags.length > 0 && (
            <div className="pw-card-tags">
              {prompt.tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="pw-tag-pill">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
