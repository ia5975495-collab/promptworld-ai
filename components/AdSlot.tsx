'use client';
import { useEffect, useRef, useState } from 'react';

// Build-time flag: Next inlines this on server AND client, so it survives into the browser.
const IS_PROD = process.env.NODE_ENV === 'production';

/**
 *  - DEV (localhost): never runs ad scripts (that's what threw the red overlay).
 *    Shows the designed "AD · your space" placeholder so you see slot positions.
 *  - PROD (live): runs the script; frame stays BLACK while empty, switches to a
 *    light mat only when a real banner image/iframe is detected; smartlink = button.
 *  - bare: no frame, for site-wide scripts (popunder / social bar).
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
  const hasCode = !!code && code.trim().length > 0;
  const RUN = hasCode && IS_PROD;                 // execute network scripts on the LIVE build only
  const smart = className.includes('pw-smart');
  const [live, setLive] = useState(false);        // a real creative was actually painted

  useEffect(() => {
    const el = ref.current;
    if (!el || !RUN) return;
    el.innerHTML = '';
    el.innerHTML = code as string;
    el.querySelectorAll('script').forEach((old) => {
      const s = document.createElement('script');
      Array.from(old.attributes).forEach((a) => s.setAttribute(a.name, a.value));
      s.textContent = old.textContent;
      old.parentNode?.replaceChild(s, old);
    });
    // Detect a real creative so we can swap black -> light mat without guessing.
    const selector = smart ? 'img,iframe,a' : 'img,iframe,canvas,video';
    const obs = new MutationObserver(() => { if (el.querySelector(selector)) { setLive(true); obs.disconnect(); } });
    if (el.querySelector(selector)) { setLive(true); return; }
    obs.observe(el, { childList: true, subtree: true });
    const t = setTimeout(() => obs.disconnect(), 6000);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, [code, RUN, smart]);

  if (IS_PROD && !hasCode) return null;            // live + no code = nothing (clean for visitors)
  const showPlaceholder = !IS_PROD;                // dev = always the placeholder tile

  if (bare) return <div ref={RUN ? ref : undefined} className={`pw-ad--bare ${className}`} />;

  return (
    <div className={`pw-ad ${className}`} aria-label={label}>
      <span className="pw-ad__tag">{label}</span>
      <div ref={ref} className={`pw-ad__body${live ? ' is-live' : ''}`}>
        {showPlaceholder && (
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