import { useEffect, useSyncExternalStore } from 'react';
import { MOCK_PROMPTS } from '@/lib/mockData';
import { createClient } from '@supabase/supabase-js';

export interface PromptItem {
  id: string;
  title: string;
  description: string;
  prompt_text: string;
  negative_prompt?: string;
  model: string;
  ai_tool: string;
  aspect_ratio: string;
  style: string;
  image_url: string;
  tags: string[];
  category: string;
  is_premium: boolean;
  creator_name: string;
  likes_count: number;
  downloads_count: number;
  views_count: number;
  created_at?: string;
}

const KEY = 'pw_user_prompts';
const TABLE = 'prompts';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
export const CLOUD = !!(url && anon);
const supa = CLOUD ? createClient(url, anon) : null;

const MOCK = MOCK_PROMPTS as unknown as PromptItem[];

function getUserPrompts(): PromptItem[] {
  if (typeof window === 'undefined') return [];
  try { const r = localStorage.getItem(KEY); return r ? (JSON.parse(r) as PromptItem[]) : []; } catch { return []; }
}

/* ---- reactive cache so every page updates the instant data changes ---- */
let cache: PromptItem[] = MOCK;
let loaded = false;
let loading = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

async function load() {
  if (loaded || loading) return;
  loading = true;
  cache = [...getUserPrompts(), ...MOCK];   // instant local paint
  emit();
  if (CLOUD && supa) {
    try {
      const { data } = await supa.from(TABLE).select('*').order('created_at', { ascending: false });
      if (data && data.length) cache = [...(data as PromptItem[]), ...MOCK];
    } catch { /* cloud unreachable → keep local+mock, no crash */ }
  }
  loaded = true; loading = false; emit();
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  if (typeof window !== 'undefined') load();
  return () => { listeners.delete(cb); };
}

export function usePrompts(): PromptItem[] {
  useEffect(() => { if (typeof window !== 'undefined') load(); }, []);
  return useSyncExternalStore(subscribe, () => cache, () => MOCK);
}

export function usePrompt(id: string): { prompt: PromptItem | undefined; loading: boolean } {
  const list = usePrompts();
  const found = list.find((p) => p.id === id);
  return { prompt: found, loading: !loaded && !found };
}

export function getAllPrompts(): PromptItem[] { return cache; }

/* ---- force every subscribed page to refetch (used after publishing) ---- */
export function refresh() { loaded = false; load(); }

/* ---- local publish (fallback / offline) ---- */
export function publishLocal(p: PromptItem): { ok: boolean; error?: string } {
  const list = getUserPrompts();
  list.unshift(p);
  try { localStorage.setItem(KEY, JSON.stringify(list)); }
  catch { return { ok: false, error: 'Storage full — the image is too large.' }; }
  cache = [...list, ...MOCK]; loaded = true; emit();
  return { ok: true };
}

/* ---- server (cloud) calls ---- */
export async function apiStatus(): Promise<'cloud' | 'local'> {
  try { const r = await fetch('/api/admin/status'); if (!r.ok) return 'local'; return ((await r.json()).mode === 'cloud') ? 'cloud' : 'local'; }
  catch { return 'local'; }
}
export async function apiVerify(password: string): Promise<{ ok: boolean; mode: 'cloud' | 'local'; status: number; error?: string }> {
  try {
    const r = await fetch('/api/admin/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
    const j = await r.json().catch(() => ({}));
    return { ok: !!j.ok, mode: j.mode || 'local', status: r.status, error: j.error };
  } catch { return { ok: false, mode: 'local', status: 0, error: 'network' }; }
}
export async function apiPublish(password: string, p: PromptItem, imageDataUrl: string): Promise<{ ok: boolean; prompt?: PromptItem; error?: string }> {
  try {
    const r = await fetch('/api/admin/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password, prompt: p, imageDataUrl }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, error: j.error || 'publish failed' };
    return { ok: true, prompt: j.prompt };
  } catch { return { ok: false, error: 'network' }; }
}

