import { NextResponse } from 'next/server';
import { prisma, ensureDbReady } from '@/lib/db';
import { hashPassword, createSessionToken, AUTH_COOKIE_NAME } from '@/lib/auth/auth';
import { syncLeadToManyChat } from '@/lib/crm/manychatService';

export async function POST(req: Request) {
  try {
    await ensureDbReady();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { ok: false, error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { ok: false, error: 'A senha deve conter no mínimo 6 caracteres.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, error: 'Este e-mail já está cadastrado na Trajetta.' },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: {
        name: String(name).trim(),
        email: cleanEmail,
        passwordHash,
        role: 'USER',
      },
    });

    // Sync to ManyChat CRM as registered user
    syncLeadToManyChat({
      email: cleanEmail,
      name: user.name,
      source: 'app_registration',
      status: 'registered',
      tags: ['trajetta_lead', 'trajetta_registered'],
      customFields: {
        trajetta_status: 'active_user',
      },
    }).catch((crmErr) => console.warn('ManyChat sync error on register:', crmErr));

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { ok: false, error: 'Erro ao criar conta.' },
      { status: 500 }
    );
  }
}
