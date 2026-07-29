import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
export const dynamic = 'force-dynamic';
const BUCKET = 'prompts';
const TABLE = 'prompts';
const IMG_SEP = '|||'; // must match lib/store.ts

function safeEq(a: string, b: string) {
  if (!a || !b || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function POST(req: Request) {
  const admin = process.env.ADMIN_PASSWORD;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const role = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!admin) { console.error('[publish] no ADMIN_PASSWORD env'); return NextResponse.json({ error: 'not-configured' }, { status: 503 }); }

  let body: any = null;
  try { body = await req.json(); } catch (e) { console.error('[publish] bad json body', e); return NextResponse.json({ error: 'bad request' }, { status: 400 }); }
  if (!body) return NextResponse.json({ error: 'bad request' }, { status: 400 });

  const password = body.password;
  const prompt = body.prompt;
  if (typeof password !== 'string' || !safeEq(password, admin)) {
    console.error('[publish] unauthorized'); return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  if (!url || !role) { console.error('[publish] cloud env missing'); return NextResponse.json({ error: 'cloud not configured' }, { status: 503 }); }

  const supa = createClient(url, role);

  // accept new array field, fall back to old single field
  const imageDataUrls: string[] = Array.isArray(body.imageDataUrls)
    ? body.imageDataUrls
    : (typeof body.imageDataUrl === 'string' && body.imageDataUrl ? [body.imageDataUrl] : []);

  let image_url: string = prompt?.image_url || '';
  if (imageDataUrls.length) {
    const uploaded: string[] = [];
    for (let i = 0; i < imageDataUrls.length; i++) {
      const d = imageDataUrls[i];
      if (typeof d === 'string' && d.startsWith('data:image')) {
        try {
          const base64 = d.split(',')[1] || '';
          const buf = Buffer.from(base64, 'base64');
          const path = `${prompt.id || 'u' + Date.now()}_${i}.jpg`;
          const { error } = await supa.storage.from(BUCKET).upload(path, buf, { contentType: 'image/jpeg', upsert: true });
          if (error) { console.error('[publish] storage upload error', i, error.message); return NextResponse.json({ error: 'upload failed: ' + error.message }, { status: 500 }); }
          uploaded.push(supa.storage.from(BUCKET).getPublicUrl(path).data.publicUrl);
        } catch (e: any) { console.error('[publish] upload exception', i, e?.message || e); return NextResponse.json({ error: 'upload error: ' + (e?.message || 'unknown') }, { status: 500 }); }
      }
    }
    if (uploaded.length) image_url = uploaded.join(IMG_SEP);
  }

  const row = {
    id: prompt.id, title: prompt.title, description: prompt.description, prompt_text: prompt.prompt_text,
    negative_prompt: prompt.negative_prompt || null, model: prompt.model, ai_tool: prompt.ai_tool,
    aspect_ratio: prompt.aspect_ratio, style: prompt.style, category: prompt.category,
    tags: Array.isArray(prompt.tags) ? prompt.tags : [], is_premium: !!prompt.is_premium,
    creator_name: prompt.creator_name || 'Admin', image_url,
    likes_count: 0, downloads_count: 0, views_count: 0, created_at: new Date().toISOString(),
  };
  const { data, error } = await supa.from(TABLE).insert(row).select().single();
  if (error) { console.error('[publish] db insert error:', error.message); return NextResponse.json({ error: 'db insert failed: ' + error.message }, { status: 500 }); }
  console.log('[publish] success id =', data?.id, 'images =', allCount(image_url));
  return NextResponse.json({ ok: true, prompt: data });
}
function allCount(u: string) { return u ? u.split('|||').filter(Boolean).length : 0; }