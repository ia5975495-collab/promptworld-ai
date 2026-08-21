'use client';
import Link from 'next/link';
import AuroraBackground from '@/components/AuroraBackground';

const PLANS = [
  {
    name: 'Free Explorer',
    price: '$0',
    period: 'forever',
    badge: 'Standard',
    desc: 'Perfect for casual AI enthusiasts and creative inspiration.',
    features: [
      'Access to 10,000+ public prompts',
      'One-click instant copy',
      'Browse all 8 categories',
      'Community search & tags',
      'Standard image generator link',
    ],
    cta: 'Current Plan',
    ctaLink: '/gallery',
    isCurrent: true,
    highlight: false,
  },
  {
    name: 'PromptWorld PRO',
    price: '$9',
    period: 'per month',
    badge: '⭐ Most Popular',
    desc: 'For serious AI creators, digital artists, and prompt engineers.',
    features: [
      '⚡ Everything in Free',
      '✨ 100% Ad-Free Experience',
      '🔒 Exclusive PRO Master Prompts',
      '📥 High-Resolution Uncompressed Prompts',
      '🔥 Early access to new prompt drops',
      '🎯 Negative Prompt & Seed recipes',
      '💬 Private Discord Creator Lounge',
    ],
    cta: 'Upgrade to PRO',
    ctaLink: '#checkout',
    isCurrent: false,
    highlight: true,
  },
  {
    name: 'Studio Lifetime',
    price: '$49',
    period: 'one-time pay',
    badge: '👑 Best Value',
    desc: 'Lifetime access to all current and future prompt collections.',
    features: [
      '👑 All PRO features for life',
      '🚀 Zero monthly fees forever',
      '📦 Commercial usage rights',
      '📁 Complete Prompt Archive export',
      '⭐ VIP Creator Badge on profile',
      '🤝 Priority 24/7 Support',
    ],
    cta: 'Get Lifetime Access',
    ctaLink: '#checkout',
    isCurrent: false,
    highlight: false,
  },
];

export default function SubscribePage() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '3rem 1.5rem 6rem' }}>
      <AuroraBackground />

      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <div className="pw-hero-badge">
            <span className="pw-hero-badge-dot" />
            <span>⭐ Unlock PromptWorld+</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', fontWeight: 900, color: '#fff', marginBottom: '1rem', lineHeight: 1.15 }}>
            Supercharge Your <span className="pw-gradient-text">Creative Superpowers</span>
          </h1>

          <p style={{ color: 'var(--muted)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.6 }}>
            Join thousands of professional creators who use PromptWorld Pro to create breathtaking visual artwork in seconds.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className="pw-card"
              style={{
                padding: '2.5rem 2rem',
                borderRadius: '24px',
                background: plan.highlight
                  ? 'linear-gradient(160deg, rgba(124, 92, 255, 0.22), rgba(16, 16, 26, 0.95))'
                  : 'rgba(16, 16, 24, 0.75)',
                border: plan.highlight ? '2px solid rgba(192, 132, 252, 0.6)' : '1px solid var(--line)',
                boxShadow: plan.highlight ? '0 20px 50px -15px rgba(124, 92, 255, 0.5)' : 'none',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#fff', margin: 0 }}>{plan.name}</h3>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      padding: '4px 12px',
                      borderRadius: 9999,
                      background: plan.highlight ? 'rgba(124, 92, 255, 0.3)' : 'rgba(255, 255, 255, 0.08)',
                      color: plan.highlight ? '#c084fc' : 'var(--muted)',
                      border: plan.highlight ? '1px solid rgba(192, 132, 252, 0.4)' : 'none',
                    }}
                  >
                    {plan.badge}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: '#fff', fontFamily: 'Sora, sans-serif' }}>
                    {plan.price}
                  </span>
                  <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>/ {plan.period}</span>
                </div>

                <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '2rem' }}>
                  {plan.desc}
                </p>

                <div style={{ borderTop: '1px solid var(--line)', paddingTop: '1.5rem', marginBottom: '2rem' }}>
                  <p style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#b9a7ff', marginBottom: '1rem' }}>
                    What&apos;s Included:
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {plan.features.map((feat) => (
                      <li key={feat} style={{ fontSize: '14px', color: '#d1d5db', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ color: '#10b981', fontWeight: 800 }}>✓</span>
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                {plan.isCurrent ? (
                  <Link
                    href={plan.ctaLink}
                    className="pw-btn-ghost"
                    style={{ width: '100%', justifyContent: 'center', borderRadius: 9999, padding: '12px' }}
                  >
                    {plan.cta}
                  </Link>
                ) : (
                  <Link
                    href={plan.ctaLink}
                    className={plan.highlight ? 'pw-btn-primary' : 'pw-btn-gold'}
                    style={{ width: '100%', justifyContent: 'center', borderRadius: 9999, padding: '14px', fontSize: '15px' }}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem' }}>
            Frequently Asked Questions
          </h2>
          <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', padding: '1.25rem 1.5rem', borderRadius: '16px' }}>
              <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '0 0 6px' }}>
                How do I use the prompts once copied?
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                Simply click &quot;Copy Prompt&quot; on any card and paste it directly into Midjourney (on Discord), Flux, ChatGPT, DALL·E 3, or Stable Diffusion web UI.
              </p>
            </div>
            <div style={{ background: 'var(--panel)', border: '1px solid var(--line)', padding: '1.25rem 1.5rem', borderRadius: '16px' }}>
              <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 700, margin: '0 0 6px' }}>
                Can I cancel my PRO subscription anytime?
              </h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
                Yes! There are no lock-in contracts. You can cancel with a single click from your account dashboard anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
