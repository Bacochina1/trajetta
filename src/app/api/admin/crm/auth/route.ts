import { NextResponse } from 'next/server';

const VALID_EMAIL = 'admin@trajetta.app';
const VALID_EMAIL_FALLBACK = 'companytrajetta@gmail.com';
const VALID_PASSWORD = 'TrajettaAdmin2026!';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const cleanEmail = (email || '').trim().toLowerCase();
    const isEmailValid = cleanEmail === VALID_EMAIL || cleanEmail === VALID_EMAIL_FALLBACK;
    const isPassValid = password === VALID_PASSWORD;

    if (!isEmailValid || !isPassValid) {
      return NextResponse.json({ ok: false, error: 'E-mail ou senha incorretos' }, { status: 401 });
    }

    const res = NextResponse.json({
      ok: true,
      user: {
        email: cleanEmail,
        role: 'ADMIN',
        name: 'Administrador Trajetta',
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
