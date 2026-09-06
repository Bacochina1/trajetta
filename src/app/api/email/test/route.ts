import { NextResponse } from 'next/server';
import { sendEmail, renderWelcomeEmail } from '@/lib/email/emailService';

export async function POST(req: Request) {
  try {
    const { email, name } = await req.json();
    const recipient = email || 'admin@trajetta.app';
    const userName = name || 'Jim';

    const html = renderWelcomeEmail(userName);
    const result = await sendEmail({
      to: recipient,
      subject: 'Bem-vindo à Trajetta — Seu Sistema Pessoal de Evolução',
      html,
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error('Email test endpoint error:', error);
    return NextResponse.json({ ok: false, error: 'Erro ao disparar e-mail de teste.' }, { status: 500 });
  }
}
