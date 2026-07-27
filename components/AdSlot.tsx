'use client';
import { useEffect, useRef } from 'react';

// Build-time flag: Next inlines this to a literal on BOTH server and client,
// so it survives into the browser (a runtime `typeof process` check does NOT).
const IS_PROD = process.env.NODE_ENV === 'production';

/**
 * Runs an ad-network snippet (the exact <script> AdsTerra hands you).
 * React won't execute a pasted <script>, so we re-create the script nodes by hand.
 *  - code present  -> run it (the real ad)
 *  - code empty + localhost (dev) -> show a designed "your space" placeholder
 *  - code empty + live build (prod) -> render nothing (clean for visitors)
 *  - bare -> no frame, for site-wide scripts (popunder / social bar / interstitial)
 */
export default function AdSlot({
  code,
  label = 'Sponsored',
  bare = false,
  className = '',
}: {
  code?: string;
  label?: string;
  bare?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const live = !!code && code.trim().length > 0;
  const preview = !live && !IS_PROD;

  useEffect(() => {
    const el = ref.current;
    if (!el || !live) return;
    el.innerHTML = '';
    el.innerHTML = code as string;
    el.querySelectorAll('script').forEach((old) => {
      const s = document.createElement('script');
      Array.from(old.attributes).forEach((a) => s.setAttribute(a.name, a.value));
      s.textContent = old.textContent;
      old.parentNode?.replaceChild(s, old);
    });
  }, [code, live]);

  if (!live && !preview) return null;
  if (bare) return <div ref={live ? ref : undefined} className={`pw-ad--bare ${className}`} />;

  return (
    <div className={`pw-ad ${className}`} aria-label={label}>
      <span className="pw-ad__tag">{label}</span>
            <div ref={ref} className={`pw-ad__body${live ? ' is-live' : ''}`}>
        {preview && (
          <div className="pw-ad__ph">
            <span className="pw-ad__ph-mark">AD</span>
            <span className="pw-ad__ph-label">Sponsored · your space</span>
            <span className="pw-ad__ph-line" />
          </div>
        )}
      </div>
    </div>
  );
}