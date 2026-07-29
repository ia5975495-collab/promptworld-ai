'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/mockData';
import { usePrompts, refresh, apiVerify, apiPublish, publishLocal, PromptItem, IMG_SEP } from '@/lib/store';

/* ============================================================
   ✏️  EDIT YOUR DROPDOWN NAMES HERE (one place — Part 1)
   Change these lists to whatever AI tools / models you want.
   ============================================================ */
const AI_TOOL_OPTIONS = ['ChatGpt', 'Gemini','Google Flow'];
const MODEL_OPTIONS   = ['ChatGPT 5', 'Nano Banana pro','Nano banana 2'];
const STYLE_OPTIONS   = ['Cinematic', 'Photorealistic', 'Anime', 'Oil Painting', 'Digital Art', '3D Render', 'Minimal'];
const RATIO_OPTIONS   = ['1:1', '16:9', '9:16', '4:3', '3:4'];

const LOCAL_GATE = 'promptworld2026';
const blank = {
  title: '', description: '', prompt_text: '', negative_prompt: '',
  ai_tool: AI_TOOL_OPTIONS[0], model: MODEL_OPTIONS[0], aspect_ratio: '3:4',
  style: STYLE_OPTIONS[0], category: 'portrait', tags: '', image_url: '', is_premium: false,
};

function compressImage(file: File, max = 1280, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode'));
      img.onload = () => {
        let { width, height } = img;
        if (width > max || height > max) {
          if (width > height) { height = Math.round((height * max) / width); width = max; }
          else { width = Math.round((width * max) / height); height = max; }
        }
        const c = document.createElement('canvas'); c.width = width; c.height = height;
        const ctx = c.getContext('2d'); if (!ctx) return reject(new Error('canvas'));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(c.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
const fmtSize = (b: number) => b < 1024 ? b + ' B' : b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(1) + ' MB';

export default function AdminDashboard() {
  const prompts = usePrompts();
  const [authed, setAuthed] = useState(false);
  const [mode, setMode] = useState<'cloud' | 'local'>('local');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [checking, setChecking] = useState(false);
  const [form, setForm] = useState(blank);
  const [tab, setTab] = useState<'file' | 'url'>('file');
  // multiple-file state
  const [previews, setPreviews] = useState<string[]>([]);
  const [compressedList, setCompressedList] = useState<string[]>([]);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const [toastErr, setToastErr] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('pw_admin_auth') === '1') {
      setAuthed(true);
      setMode((sessionStorage.getItem('pw_admin_mode') as 'cloud' | 'local') || 'local');
    }
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true); setWrong(false);
    const res = await apiVerify(pw);
    const serverConfigured = res.status === 200;
    const serverMissing = res.status === 503;
    const serverUnreachable = !serverConfigured && !serverMissing;
    if (serverConfigured && res.ok) {
      setAuthed(true); setMode(res.mode);
      sessionStorage.setItem('pw_admin_auth', '1'); sessionStorage.setItem('pw_admin_mode', res.mode); sessionStorage.setItem('pw_pw', pw);
      setPw('');
    } else if (serverConfigured && !res.ok) {
      setWrong(true); setTimeout(() => setWrong(false), 460);
    } else if (serverMissing || serverUnreachable) {
      if (pw === LOCAL_GATE) {
        setAuthed(true); setMode('local');
        sessionStorage.setItem('pw_admin_auth', '1'); sessionStorage.setItem('pw_admin_mode', 'local'); sessionStorage.setItem('pw_pw', pw);
        setPw('');
      } else { setWrong(true); setTimeout(() => setWrong(false), 460); }
    }
    setChecking(false);
  };
  const logout = () => {
    sessionStorage.removeItem('pw_admin_auth'); sessionStorage.removeItem('pw_admin_mode'); sessionStorage.removeItem('pw_pw');
    setAuthed(false); setPw('');
    setForm(blank); setTab('file'); setPreviews([]); setCompressedList([]); setFileNames([]);
    setBusy(false); setToast(''); setToastErr('');
  };
  const set = (k: string, v: string | boolean) => setForm((f) => ({ ...f, [k]: v }));

  const onFiles = async (list: FileList | File[] | null) => {
    if (!list) return;
    const arr = Array.from(list).filter((f) => f.type.startsWith('image/'));
    if (!arr.length) return;
    setProcessing(true);
    const np: string[] = [], nc: string[] = [], nn: string[] = [];
    for (const f of arr) {
      try { const d = await compressImage(f); np.push(d); nc.push(d); nn.push(f.name + ' · ' + fmtSize(f.size)); }
      catch { /* skip unreadable file */ }
    }
    setPreviews((p) => [...p, ...np]); setCompressedList((c) => [...c, ...nc]); setFileNames((n) => [...n, ...nn]);
    setProcessing(false);
  };
  const removeAt = (i: number) => {
    setPreviews((p) => p.filter((_, j) => j !== i));
    setCompressedList((c) => c.filter((_, j) => j !== i));
    setFileNames((n) => n.filter((_, j) => j !== i));
  };
  const clearFiles = () => { setPreviews([]); setCompressedList([]); setFileNames([]); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.prompt_text.trim()) return;
    const urlList = tab === 'url' ? form.image_url.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean) : [];
    const fileImgs = tab === 'file' ? compressedList : [];
    if (fileImgs.length === 0 && urlList.length === 0) { setToastErr(tab === 'file' ? 'Add at least one image.' : 'Paste at least one image URL.'); setTimeout(() => setToastErr(''), 2800); return; }

    const base: PromptItem = {
      id: 'u' + Date.now().toString(),
      title: form.title.trim(), description: form.description.trim() || form.title.trim(),
      prompt_text: form.prompt_text.trim(), negative_prompt: form.negative_prompt.trim() || undefined,
      ai_tool: form.ai_tool, model: form.model, aspect_ratio: form.aspect_ratio, style: form.style,
      category: form.category, image_url: tab === 'url' ? urlList.join(IMG_SEP) : '',
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      is_premium: form.is_premium, creator_name: 'Admin', likes_count: 0, downloads_count: 0, views_count: 0,
      created_at: new Date().toISOString(),
    };
    setBusy(true);
    if (mode === 'cloud') {
      const res = await apiPublish(sessionStorage.getItem('pw_pw') || pw, base, fileImgs); // fileImgs = data urls to upload; url-mode sends []
      if (!res.ok) { setToastErr(res.error || 'Publish failed.'); setTimeout(() => setToastErr(''), 3500); setBusy(false); return; }
      refresh();
    } else {
      const local = { ...base, image_url: tab === 'file' ? fileImgs.join(IMG_SEP) : urlList.join(IMG_SEP) };
      const res = publishLocal(local);
      if (!res.ok) { setToastErr(res.error || 'Save failed.'); setTimeout(() => setToastErr(''), 3500); setBusy(false); return; }
    }
    setBusy(false);
    setForm(blank); clearFiles(); setTab('file');
    setToast('Prompt published!'); setTimeout(() => setToast(''), 3000);
  };

  const urlPrev = form.image_url.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);

  /* ---------------- LOCK SCREEN ---------------- */
  if (!authed) {
    return (
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '2rem' }}>
        <div className={`pw-gate ${wrong ? 'pw-shake' : ''}`}>
          <div className="pw-gate__art">
            <div className="pw-lock-ring">🔒</div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <span className="pw-eyebrow">Restricted · Creator access</span>
              <h1 style={{ fontSize: 34, fontWeight: 800, color: '#fff', lineHeight: 1.12, margin: '0 0 14px' }}>The studio is<br />behind this door.</h1>
              <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.6, maxWidth: 320, margin: 0 }}>Publish prompts with one or many images, manage the gallery, ship new drops. The password is verified on the server.</p>
            </div>
            <div style={{ position: 'relative', zIndex: 1, color: '#5a5a6b', fontSize: 12, letterSpacing: '.08em' }}>PROMPTWORLD · ADMIN</div>
          </div>
          <form onSubmit={login} className="pw-gate__form">
            <h2 style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>Sign in</h2>
            <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 26px' }}>Enter the studio password.</p>
            <label className="pw-label">Password</label>
            <div style={{ position: 'relative', marginBottom: wrong ? 10 : 18 }}>
              <input className="pw-input" type={showPw ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••••" autoFocus style={{ paddingRight: 64, borderColor: wrong ? '#ef4444' : undefined }} />
              <button type="button" className="pw-eye" onClick={() => setShowPw((s) => !s)}>{showPw ? 'Hide' : 'Show'}</button>
            </div>
            {wrong && <p style={{ color: '#f87171', fontSize: 13, margin: '0 0 14px' }}>Wrong password. Try again.</p>}
            <button type="submit" className="pw-btn-primary" disabled={checking} style={{ width: '100%', justifyContent: 'center', opacity: checking ? .7 : 1 }}>{checking ? 'Checking…' : 'Unlock studio →'}</button>
          </form>
        </div>
      </div>
    );
  }

  /* ---------------- DASHBOARD ---------------- */
  return (
    <div className="pw-page" style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: 12 }}>
        <div><span className="pw-eyebrow">Creator studio</span><h1 style={{ fontSize: 32, fontWeight: 800, color: '#fff', margin: 0 }}>Admin Dashboard</h1></div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/" className="pw-btn-ghost" style={{ padding: '9px 16px', fontSize: 14 }}>← Home</Link>
          <button onClick={logout} className="pw-btn-ghost" style={{ padding: '9px 16px', fontSize: 14, color: '#f87171' }}>Lock</button>
        </div>
      </div>
      <div className={`pw-mode-banner ${mode === 'cloud' ? 'is-cloud' : 'is-local'}`}>
        <span className="pw-status-dot" />
        {mode === 'cloud'
          ? <span><b>Live · synced to cloud.</b> Everything you publish (all its images) is visible to every visitor.</span>
          : <span><b>Local preview mode.</b> Saves to this browser only. Add your Supabase keys to <code>.env.local</code> to go live.</span>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
        <form onSubmit={submit} style={{ background: 'var(--panel)', padding: '2rem', borderRadius: 18, border: '1px solid var(--line)' }}>
          <div className="pw-field"><label className="pw-label">Title</label>
            <input className="pw-input" required value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Cinematic Portrait in Golden Hour" /></div>
          <div className="pw-field"><label className="pw-label">Description</label>
            <textarea className="pw-textarea" rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Short description..." /></div>
          <div className="pw-field"><label className="pw-label">Prompt text</label>
            <textarea className="pw-textarea" rows={4} required value={form.prompt_text} onChange={(e) => set('prompt_text', e.target.value)} placeholder="Your full prompt..." /></div>
          <div className="pw-field"><label className="pw-label">Negative prompt (optional)</label>
            <textarea className="pw-textarea" rows={2} value={form.negative_prompt} onChange={(e) => set('negative_prompt', e.target.value)} placeholder="blurry, low quality..." /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="pw-field"><label className="pw-label">AI tool</label>
              <select className="pw-select" value={form.ai_tool} onChange={(e) => set('ai_tool', e.target.value)}>{AI_TOOL_OPTIONS.map((x) => <option key={x}>{x}</option>)}</select></div>
            <div className="pw-field"><label className="pw-label">Model</label>
              <select className="pw-select" value={form.model} onChange={(e) => set('model', e.target.value)}>{MODEL_OPTIONS.map((x) => <option key={x}>{x}</option>)}</select></div>
            <div className="pw-field"><label className="pw-label">Style</label>
              <select className="pw-select" value={form.style} onChange={(e) => set('style', e.target.value)}>{STYLE_OPTIONS.map((x) => <option key={x}>{x}</option>)}</select></div>
            <div className="pw-field"><label className="pw-label">Aspect ratio</label>
              <select className="pw-select" value={form.aspect_ratio} onChange={(e) => set('aspect_ratio', e.target.value)}>{RATIO_OPTIONS.map((x) => <option key={x}>{x}</option>)}</select></div>
          </div>
          <div className="pw-field"><label className="pw-label">Category</label>
            <select className="pw-select" value={form.category} onChange={(e) => set('category', e.target.value)}>{CATEGORIES.map((c) => <option key={c.name} value={c.name.toLowerCase()}>{c.name}</option>)}</select></div>

          {/* IMAGE — one or many */}
          <div className="pw-field">
            <label className="pw-label">Image(s) — you can add several; they become a slider on the detail page</label>
            <div className="pw-tabs">
              <button type="button" className={`pw-tab ${tab === 'file' ? 'is-active' : ''}`} onClick={() => setTab('file')}>Upload files</button>
              <button type="button" className={`pw-tab ${tab === 'url' ? 'is-active' : ''}`} onClick={() => setTab('url')}>Paste URLs</button>
            </div>
            {tab === 'file' ? (
              <>
                <label className={`pw-dropzone ${dragging ? 'is-drag' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
                  onDrop={(e) => { e.preventDefault(); setDragging(false); onFiles(e.dataTransfer.files); }}>
                  <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => onFiles(e.target.files)} />
                  <div className="pw-dropzone__glyph">⬆️</div>
                  <div className="pw-dropzone__hint"><b>Drop one or more images</b> or click to browse</div>
                  <div style={{ color: '#4d4d5c', fontSize: 11, marginTop: 6 }}>{mode === 'cloud' ? 'Uploaded to cloud · auto‑compressed' : 'Auto‑compressed · saved locally'}</div>
                </label>
                {processing && <p style={{ color: '#b9a7ff', fontSize: 12, marginTop: 8 }}>Compressing images…</p>}
                {previews.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 14 }}>
                    {previews.map((src, i) => (
                      <div key={i} className="pw-thumb" style={{ margin: 0 }}>
                        <img src={src} alt={`preview ${i + 1}`} />
                        <div className="pw-thumb__bar"><span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileNames[i]}</span><button type="button" className="pw-thumb__x" onClick={() => removeAt(i)}>✕</button></div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <textarea className="pw-textarea" rows={3} value={form.image_url} onChange={(e) => set('image_url', e.target.value)} placeholder={"Paste one or more image URLs\n(one per line, or comma‑separated)"} style={{ fontFamily: 'inherit' }} />
                {urlPrev.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginTop: 12 }}>
                    {urlPrev.map((u, i) => <img key={i} src={u} alt={`preview ${i + 1}`} style={{ width: '100%', height: 90, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--line)' }} />)}
                  </div>
                )}
              </>
            )}
          </div>

          <div className="pw-field"><label className="pw-label">Tags (comma separated)</label>
            <input className="pw-input" value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="portrait, cinematic, golden hour" /></div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, color: '#fff', fontSize: 14, cursor: 'pointer' }}>
            <input type="checkbox" checked={form.is_premium} onChange={(e) => set('is_premium', e.target.checked)} style={{ width: 18, height: 18 }} /> Mark as Premium
          </label>
          <button type="submit" className="pw-btn-primary" disabled={busy} style={{ width: '100%', justifyContent: 'center', opacity: busy ? .8 : 1 }}>
            {busy ? <><span className="pw-spinner" /> {mode === 'cloud' ? 'Publishing to cloud…' : 'Saving…'}</> : 'Publish Prompt'}
          </button>
        </form>
        <aside style={{ position: 'sticky', top: 100 }}>
          <div style={{ background: 'var(--panel)', padding: '1.5rem', borderRadius: 16, border: '1px solid var(--line)', marginBottom: '1rem' }}>
            <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginTop: 0, marginBottom: 14 }}>Library</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}><span style={{ color: 'var(--muted)' }}>Total prompts</span><span style={{ color: '#fff', fontWeight: 600 }}>{prompts.length}</span></div>
            <p style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.6, margin: '12px 0 0' }}>{mode === 'cloud' ? 'Reading live from the cloud database.' : 'Reading from this browser + demo set.'}</p>
          </div>
          <div style={{ background: 'var(--panel)', padding: '1.5rem', borderRadius: 16, border: '1px solid var(--line)' }}>
            <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginTop: 0, marginBottom: 14 }}>Quick links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
              <Link href="/gallery" style={{ color: '#b9a7ff', textDecoration: 'none' }}>→ View Gallery</Link>
              <Link href="/" style={{ color: '#b9a7ff', textDecoration: 'none' }}>→ View Home</Link>
            </div>
          </div>
        </aside>
      </div>
      {toast && <div className="pw-toast" style={{ borderColor: 'rgba(34,197,94,.5)', color: '#d6ffe4' }}><span style={{ fontSize: 18 }}>✅</span><span>{toast} <Link href="/gallery" style={{ color: '#7CFFB2', marginLeft: 4 }}>View it →</Link></span></div>}
      {toastErr && <div className="pw-toast" style={{ borderColor: 'rgba(239,68,68,.5)', color: '#ffd9d9' }}><span style={{ fontSize: 18 }}>⚠️</span><span>{toastErr}</span></div>}
    </div>
  );
}