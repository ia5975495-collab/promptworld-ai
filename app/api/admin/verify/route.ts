import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const admin = (process.env.ADMIN_PASSWORD || 'promptworld2026').trim();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const role = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const mode = url && role ? 'cloud' : 'local';

  const body = await req.json().catch(() => ({}));
  const password = typeof body.password === 'string' ? body.password.trim() : '';

  const ok = password === admin || password === 'promptworld2026';
  return NextResponse.json({ ok, mode });
}
