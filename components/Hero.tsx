'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const WORDS = [
  'ChatGPT',
  'Nanobanana Pro',
  'Nanobanana 2',
  'Nanobanana 2 Lite',
  'Gemini',
  'AI Creators',
  'Photorealistic Art',
];

const TOOLS = [
  { name: 'ChatGPT', icon: '🤖', color: 'rgba(16, 185, 129, 0.2)' },
  { name: 'Nanobanana Pro', icon: '⚡', color: 'rgba(245, 158, 11, 0.2)' },
  { name: 'Nanobanana 2', icon: '🍌', color: 'rgba(168, 85, 247, 0.2)' },
  { name: 'Nanobanana 2 Lite', icon: '✨', color: 'rgba(6, 182, 212, 0.2)' },
  { name: 'Gemini', icon: '♊', color: 'rgba(59, 130, 246, 0.2)' },
];

export default function Hero({
  onSearch,
  promptCount = 0,
  categoryCount = 8,
}: {
  onSearch?: (q: string) => void;
  promptCount?: number;
  categoryCount?: number;
}) {
  const [typed, setTyped] = useState('');
  const [wordIdx, setWordIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  // Real dynamic prompt count (e.g. 97 -> 96+, 200 -> 199+)
  const displayCount = promptCount > 1 ? `${promptCount - 1}+` : `${promptCount}`;

  // Typewriter effect
  useEffect(() => {
    const currentWord = WORDS[wordIdx];
    const typingSpeed = isDeleting ? 40 : 80;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setTyped(currentWord.slice(0, typed.length + 1));
        if (typed.length + 1 === currentWord.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setTyped(currentWord.slice(0, typed.length - 1));
        if (typed.length - 1 === 0) {
          setIsDeleting(false);
          setWordIdx((prev) => (prev + 1) % WORDS.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [typed, isDeleting, wordIdx]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchInput);
    }
  };

  return (
    <section className="pw-hero-section">
      {/* Ambient background glows */}
      <div className="pw-hero-glow pw-hero-glow-1" />
      <div className="pw-hero-glow pw-hero-glow-2" />
      <div className="pw-hero-glow pw-hero-glow-3" />

      <div className="pw-hero-container">
        {/* Top badge */}
        <div className="pw-hero-badge">
          <span className="pw-hero-badge-dot" />
          <span>✨ {displayCount} Curated Production-Ready AI Prompts</span>
        </div>

        {/* Main Headline */}
        <h1 className="pw-hero-title">
          The Ultimate Gallery for <br />
          <span className="pw-gradient-text">AI Prompts</span> &amp; Inspiration
        </h1>

        {/* Dynamic Subhead Typewriter */}
        <div className="pw-hero-typewriter">
          <span>Engineered For </span>
          <span className="pw-hero-typed-text">{typed}</span>
          <span className="pw-hero-cursor">|</span>
        </div>

        <p className="pw-hero-desc">
          Discover, copy, and generate stunning AI artwork instantly. Handcrafted, high-performing prompts
          optimized for ChatGPT, Nanobanana Pro, Nanobanana 2, Nanobanana 2 Lite, and Gemini.
        </p>

        {/* Hero Interactive Search Bar */}
        <form onSubmit={handleSearchSubmit} className="pw-hero-search-form">
          <div className="pw-hero-search-box">
            <svg
              className="pw-hero-search-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="pw-hero-search-input"
              placeholder="Search prompts (e.g. cyberpunk, anime, cinematic portrait, wallpaper)..."
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                if (onSearch) onSearch(e.target.value);
              }}
            />
            {searchInput && (
              <button
                type="button"
                className="pw-hero-search-clear"
                onClick={() => {
                  setSearchInput('');
                  if (onSearch) onSearch('');
                }}
              >
                ✕
              </button>
            )}
            <button type="submit" className="pw-btn-primary pw-hero-search-btn">
              Explore
            </button>
          </div>
        </form>

        {/* Action CTAs */}
        <div className="pw-hero-actions">
          <a href="#prompts-grid" className="pw-btn-primary pw-hero-cta-main">
            🔥 Browse Trending Prompts
          </a>
          <a
            href="https://labs.google/fx/tools/image-fx"
            target="_blank"
            rel="noopener noreferrer"
            className="pw-btn-primary"
            style={{
              background: 'linear-gradient(120deg, #06b6d4, #3b82f6)',
              boxShadow: '0 10px 30px -8px rgba(6,182,212,0.8)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
            }}
          >
            <span>🎨</span>
            <span>AI Image Generator</span>
            <span style={{ fontSize: '12px' }}>↗</span>
          </a>
          <Link href="/categories" className="pw-btn-ghost pw-hero-cta-ghost">
            📂 View Categories
          </Link>
          <Link href="/subscribe" className="pw-btn-gold pw-hero-cta-gold">
            ⭐ Go Premium (Ad-Free)
          </Link>
        </div>

        {/* AI Tool Pills */}
        <div className="pw-hero-tools">
          <span className="pw-hero-tools-label">SUPPORTED ENGINES:</span>
          {TOOLS.map((tool) => (
            <span
              key={tool.name}
              className="pw-hero-tool-pill"
              style={{ background: tool.color }}
            >
              <span>{tool.icon}</span>
              <span>{tool.name}</span>
            </span>
          ))}
        </div>

        {/* Stats Counter Bar with Real Dynamic Numbers */}
        <div className="pw-hero-stats">
          <div className="pw-hero-stat-card">
            <div className="pw-hero-stat-number">{displayCount}</div>
            <div className="pw-hero-stat-label">AI Prompts</div>
          </div>
          <div className="pw-hero-stat-card">
            <div className="pw-hero-stat-number">50,000+</div>
            <div className="pw-hero-stat-label">Creators Worldwide</div>
          </div>
          <div className="pw-hero-stat-card">
            <div className="pw-hero-stat-number">{categoryCount}</div>
            <div className="pw-hero-stat-label">Curated Categories</div>
          </div>
          <div className="pw-hero-stat-card">
            <div className="pw-hero-stat-number">100%</div>
            <div className="pw-hero-stat-label">Free Instant Copy &amp; Generate</div>
          </div>
        </div>
      </div>
    </section>
  );
}
