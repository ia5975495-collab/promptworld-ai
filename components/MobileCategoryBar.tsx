'use client';
import { CATEGORIES } from '@/lib/mockData';

/**
 * Fixed bottom category bar — the mobile face of the left sidebar.
 * Hidden on desktop via CSS (.pw-bottombar { display:none } until 820px).
 */
export default function MobileCategoryBar({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (slug: string) => void;
}) {
  const items = [
    { slug: 'all', icon: '📊', label: 'All' },
    ...CATEGORIES.map((c) => ({ slug: c.name.toLowerCase(), icon: c.icon, label: c.name })),
  ];

  return (
    <nav className="pw-bottombar" aria-label="Categories">
      <div className="pw-bottombar__track">
        {items.map((it) => (
          <button
            key={it.slug}
            type="button"
            aria-current={selected === it.slug ? 'page' : undefined}
            className={`pw-bb-item ${selected === it.slug ? 'is-on' : ''}`}
            onClick={() => onSelect(it.slug)}
          >
            <span className="pw-bb-ico" aria-hidden="true">{it.icon}</span>
            <span className="pw-bb-lbl">{it.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}