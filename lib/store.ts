import { useEffect, useSyncExternalStore } from 'react';
import { MOCK_PROMPTS } from '@/lib/mockData';
import { createClient } from '@supabase/supabase-js';


export interface PromptItem {
  id: string; title: string; description: string; prompt_text: string; negative_prompt?: string;
  model: string; ai_tool: string; aspect_ratio: string; style: string; image_url: string;
  tags: string[]; category: string; is_premium: boolean; creator_name: string;
  likes_count: number; downloads_count: number; views_count: number; created_at?: string;
}

/* ---- multiple images live inside image_url, joined by this marker ---- */
export const IMG_SEP = '|||';
export function allImages(p: { image_url?: string } | null | undefined): string[] {
  const u = (p?.image_url || '').trim();
  if (!u) return [];
  return u.split(IMG_SEP).map((s) => s.trim()).filter(Boolean);
}
export function coverImage(p: { image_url?: string } | null | undefined): string {
  return allImages(p)[0] || '';
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

let cache: PromptItem[] = MOCK;
let loaded = false;
let loading = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

async function load() {
  if (loaded || loading) return;
  loading = true;
  cache = [...getUserPrompts(), ...MOCK];
  emit();
  if (CLOUD && supa) {
    try {
      const { data } = await supa.from(TABLE).select('*').order('created_at', { ascending: false });
      if (data && data.length) cache = [...(data as PromptItem[]), ...MOCK];
    } catch { /* cloud unreachable -> keep local+mock */ }
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
export function refresh() { loaded = false; load(); }

export function publishLocal(p: PromptItem): { ok: boolean; error?: string } {
  const list = getUserPrompts();
  list.unshift(p);
  try { localStorage.setItem(KEY, JSON.stringify(list)); }
  catch { return { ok: false, error: 'Storage full — too many / too large images.' }; }
  cache = [...list, ...MOCK]; loaded = true; emit();
  return { ok: true };
}

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
export async function apiPublish(password: string, p: PromptItem, imageDataUrls: string[]): Promise<{ ok: boolean; prompt?: PromptItem; error?: string }> {
  try {
    const r = await fetch('/api/admin/publish', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password, prompt: p, imageDataUrls }) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) return { ok: false, error: j.error || 'publish failed' };
    return { ok: true, prompt: j.prompt };
  } catch { return { ok: false, error: 'network' }; }
}
// Extract the first image URL from a prompt (handles both single URL and JSON array)
export function getCoverImage(imageUrl: string): string {
  if (!imageUrl) return '';
  
  // Try JSON array format
  try {
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed[0];
    }
  } catch {
    // Not JSON, continue
  }
  
  // Try ||| separator format
  if (imageUrl.includes('|||')) {
    return imageUrl.split('|||')[0].trim();
  }
  
  // Single URL
  return imageUrl;
}

export function hasMultipleImages(imageUrl: string): boolean {
  if (!imageUrl) return false;
  
  // Check JSON array format
  try {
    const parsed = JSON.parse(imageUrl);
    if (Array.isArray(parsed) && parsed.length > 1) return true;
  } catch {
    // Not JSON, continue
  }
  
  // Check ||| separator format
  if (imageUrl.includes('|||')) return true;
  
  return false;
}