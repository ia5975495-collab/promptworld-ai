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
 *
 *  FIX: Adsterra's "banner" format (topThin/left/bottom/bottomM/smart) all set a
 *  shared `window.atOptions` global before loading invoke.js. If more than one of
 *  these mounts on the same page, they overwrite each other's config and most of
 *  them fail to render. To fix this, any `code` containing "atOptions" is now
 *  rendered inside its own isolated <iframe srcDoc>, giving it a private `window`
 *  so it can never collide with a sibling slot. Native-banner / script-only ads
 *  (e.g. `right`, `pop`, `social`) are untouched since they don't use atOptions
 *  and were already working correctly.
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
  const usesSharedGlobal = hasCode && (code as string).includes('atOptions');
  const [live, setLive] = useState(false);        // a real creative was actually painted

  // --- Path A: atOptions-based banners -> isolated iframe (no global collision) ---
  useEffect(() => {
    const el = ref.current;
    if (!el || !RUN || !usesSharedGlobal) return;

    el.innerHTML = '';
    const iframe = document.createElement('iframe');
    iframe.style.border = '0';
    iframe.style.display = 'block';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.scrolling = 'no';
    // sandbox still allows the ad script + same-origin creative to run, just isolated
    iframe.setAttribute('sandbox', 'allow-scripts allow-popups allow-same-origin');
    iframe.srcdoc = `<!doctype html><html><head><style>
      html,body{margin:0;padding:0;background:transparent;overflow:hidden;
      display:flex;align-items:center;justify-content:center;height:100%;}
    </style></head><body>${code}</body></html>`;
    el.appendChild(iframe);

    const t = setTimeout(() => setLive(true), 1200); // no easy cross-origin DOM check inside sandboxed iframe
    return () => clearTimeout(t);
  }, [code, RUN, usesSharedGlobal]);

  // --- Path B: native banner / bare scripts (right, pop, social) -> original behavior ---
  useEffect(() => {
    const el = ref.current;
    if (!el || !RUN || usesSharedGlobal) return;

    el.innerHTML = '';
    el.innerHTML = code as string;
    el.querySelectorAll('script').forEach((old) => {
      const s = document.createElement('script');
      Array.from(old.attributes).forEach((a) => s.setAttribute(a.name, a.value));
      s.textContent = old.textContent;
      old.parentNode?.replaceChild(s, old);
    });

    const selector = smart ? 'img,iframe,a' : 'img,iframe,canvas,video';
    const obs = new MutationObserver(() => { if (el.querySelector(selector)) { setLive(true); obs.disconnect(); } });
    if (el.querySelector(selector)) { setLive(true); return; }
    obs.observe(el, { childList: true, subtree: true });
    const t = setTimeout(() => obs.disconnect(), 6000);
    return () => { obs.disconnect(); clearTimeout(t); };
  }, [code, RUN, usesSharedGlobal, smart]);

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