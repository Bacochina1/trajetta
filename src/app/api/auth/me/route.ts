import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/auth';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, user: null }, { status: 401 });
    }

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error('Session me error:', error);
    return NextResponse.json({ ok: false, user: null }, { status: 500 });
  }
}
