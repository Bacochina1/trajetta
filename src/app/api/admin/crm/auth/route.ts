import { NextResponse } from 'next/server';
import { prisma, ensureDbReady } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/auth';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@trajetta.app';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'TrajettaAdmin!2026#Secure';

export async function POST(req: Request) {
  try {
    await ensureDbReady();
    const { email, password } = await req.json();

    const cleanEmail = (email || '').trim().toLowerCase();
    let isAuthorized = false;
    let adminName = 'Administrador Trajetta';

    if (cleanEmail === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      isAuthorized = true;
    } else {
      const dbUser = await prisma.user.findUnique({
        where: { email: cleanEmail },
      });
      if (dbUser && dbUser.role === 'ADMIN' && (await verifyPassword(password, dbUser.passwordHash))) {
        isAuthorized = true;
        adminName = dbUser.name;
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ ok: false, error: 'E-mail ou senha incorretos' }, { status: 401 });
    }

    const res = NextResponse.json({
      ok: true,
      user: {
        email: cleanEmail,
        role: 'ADMIN',
        name: adminName,
      },
    });

    // Set secure auth cookie
    res.cookies.set('trajetta_admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const cookie = req.headers.get('cookie') || '';
  const isAuth = cookie.includes('trajetta_admin_session=authenticated');

  return NextResponse.json({
    ok: isAuth,
    authenticated: isAuth,
  });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete('trajetta_admin_session');
  return res;
}
