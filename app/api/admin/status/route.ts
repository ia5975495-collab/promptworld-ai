import { NextResponse } from 'next/server';

export async function GET() {
  const hasCloudKeys = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
  return NextResponse.json({ mode: hasCloudKeys ? 'cloud' : 'local' });
}