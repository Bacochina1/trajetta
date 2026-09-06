import { NextResponse } from 'next/server';
import { prisma, ensureDbReady } from '@/lib/db';
import { sendEmail, renderWelcomeEmail } from '@/lib/email/emailService';

const BASE_WAITLIST_COUNT = 1480;

export async function GET() {
  try {
    await ensureDbReady();
    const count = await prisma.waitlist.count();
    return NextResponse.json({
      ok: true,
      totalCount: BASE_WAITLIST_COUNT + count,
    });
  } catch (error) {
    console.error('Waitlist count error:', error);
    return NextResponse.json({ ok: true, totalCount: BASE_WAITLIST_COUNT });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDbReady();
    const { email, name } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { ok: false, error: 'Por favor, insira um e-mail válido.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = name ? String(name).trim() : 'Membro';

    const existing = await prisma.waitlist.findUnique({
      where: { email: cleanEmail },
    });

    const totalCount = await prisma.waitlist.count();
    const currentPosition = BASE_WAITLIST_COUNT + totalCount;

    if (existing) {
      const welcomeHtml = renderWelcomeEmail(existing.name || cleanName, currentPosition);
      return NextResponse.json({
        ok: true,
        alreadyRegistered: true,
        message: 'Você já está garantido na nossa Lista de Espera VIP!',
        name: existing.name || cleanName,
        email: cleanEmail,
        position: currentPosition,
        totalCount: currentPosition,
        emailHtml: welcomeHtml,
      });
    }

    await prisma.waitlist.create({
      data: {
        email: cleanEmail,
        name: cleanName,
        source: 'landing_page',
      },
    });

    const newPosition = currentPosition + 1;
    const welcomeHtml = renderWelcomeEmail(cleanName, newPosition);

    // Send confirmation email in background
    try {
      await sendEmail({
        to: cleanEmail,
        subject: `Você está na Lista VIP da Trajetta — Vaga #${newPosition} Confirmada`,
        html: welcomeHtml,
      });
    } catch (e) {
      console.warn('Failed to dispatch waitlist email:', e);
    }

    return NextResponse.json({
      ok: true,
      alreadyRegistered: false,
      message: 'Sua vaga foi reservada com sucesso! Verifique seu e-mail.',
      name: cleanName,
      email: cleanEmail,
      position: newPosition,
      totalCount: newPosition,
      emailHtml: welcomeHtml,
    });
  } catch (error) {
    console.error('Waitlist registration error:', error);
    return NextResponse.json(
      { ok: false, error: 'Erro ao cadastrar na lista de espera.' },
      { status: 500 }
    );
  }
}
