import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) return NextResponse.json({ items: [] }, { status: 200 });
    const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://node-eemi.vercel.app';
    const res = await fetch(`${base}/api/orders/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    const data = await res.json().catch(() => ({ items: [] }));
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
