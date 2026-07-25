import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';

function safeEq(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function POST(req: Request) {
  const admin = process.env.ADMIN_PASSWORD;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const role = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const mode = url && role ? 'cloud' : 'local';

  if (!admin) return NextResponse.json({ ok: false, mode, error: 'not-configured' }, { status: 503 });

  const { password } = await req.json().catch(() => ({}));
  const ok = typeof password === 'string' && safeEq(password, admin);
  return NextResponse.json({ ok, mode });
}