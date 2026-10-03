import { NextResponse } from 'next/server';
import {
  sendEmail,
  renderWelcomeEmail,
  renderProWelcomeEmail,
  renderTrialWelcomeEmail,
  renderNewsletterWelcomeEmail,
  renderSubscriptionCancellationEmail,
} from '@/lib/email/emailService';

export async function POST(req: Request) {
  try {
    const { email, name, type } = await req.json();
    const recipient = email || 'companytrajetta@gmail.com';
    const userName = name || 'Membro Trajetta';

    let html = '';
    let subject = '';

    switch (type) {
      case 'newsletter':
        subject = 'Inscrição confirmada na Trajetta — Novidades e Atualizações';
        html = renderNewsletterWelcomeEmail(recipient);
        break;
      case 'pro_welcome':
        subject = 'Seu acesso ao Trajetta Pro foi liberado! 🚀';
        html = renderProWelcomeEmail({
          userName,
          email: recipient,
          temporaryPassword: 'Tr-' + Math.random().toString(36).slice(-6) + '!',
          planName: 'pro_monthly',
          isNewUser: true,
        });
        break;
      case 'trial':
        subject = 'Bem-vindo à Trajetta — Sua conta foi criada com sucesso 🚀';
        html = renderTrialWelcomeEmail({
          userName,
          email: recipient,
        });
        break;
      case 'cancel':
        subject = 'Confirmação de Cancelamento de Renovação — Trajetta';
        html = renderSubscriptionCancellationEmail({
          userName,
          accessUntilFormatted: new Date(Date.now() + 30 * 86400000).toLocaleDateString('pt-BR'),
        });
        break;
      case 'vip':
      default:
        subject = 'Você está na Lista VIP da Trajetta — Vaga #1.482 Confirmada';
        html = renderWelcomeEmail(userName, 1482);
        break;
    }

    const result = await sendEmail({
      to: recipient,
      subject,
      html,
    });

    return NextResponse.json({ ok: true, type, recipient, result });
  } catch (error) {
    console.error('Email test endpoint error:', error);
    return NextResponse.json({ ok: false, error: 'Erro ao disparar e-mail de teste.' }, { status: 500 });
  }
}
