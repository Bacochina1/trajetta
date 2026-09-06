import { NextResponse } from 'next/server';
import { prisma, ensureDbReady } from '@/lib/db';
import { sendEmail, renderWelcomeEmail } from '@/lib/email/emailService';

const BASE_WAITLIST_COUNT = 1480;
const OWNER_EMAIL = 'companytrajetta@gmail.com';

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
    const { email, name, phone } = await req.json();

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
      // Notify owner about duplicate attempt
      sendOwnerNotification(cleanEmail, existing.name || cleanName, currentPosition, 'duplicado').catch(() => {});

      return NextResponse.json({
        ok: true,
        alreadyRegistered: true,
        message: 'Você já está garantido na nossa Lista de Espera VIP!',
        name: existing.name || cleanName,
        email: cleanEmail,
        position: currentPosition,
        totalCount: currentPosition,
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

    // 1. Always notify owner with lead data (works in sandbox)
    sendOwnerNotification(cleanEmail, cleanName, newPosition, 'novo').catch((e) =>
      console.warn('[Owner Notification Error]:', e)
    );

    // 2. Try to send confirmation email to the lead (works when domain verified)
    const welcomeHtml = renderWelcomeEmail(cleanName, newPosition);
    sendEmail({
      to: cleanEmail,
      subject: `Você está na Lista VIP da Trajetta — Vaga #${newPosition} Confirmada`,
      html: welcomeHtml,
    }).catch((e) => console.warn('[Welcome Email Error]:', e));

    return NextResponse.json({
      ok: true,
      alreadyRegistered: false,
      message: 'Sua vaga foi reservada com sucesso! Verifique seu e-mail.',
      name: cleanName,
      email: cleanEmail,
      position: newPosition,
      totalCount: newPosition,
    });
  } catch (error) {
    console.error('Waitlist registration error:', error);
    return NextResponse.json(
      { ok: false, error: 'Erro ao cadastrar na lista de espera.' },
      { status: 500 }
    );
  }
}

async function sendOwnerNotification(
  leadEmail: string,
  leadName: string,
  position: number,
  tipo: 'novo' | 'duplicado'
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const emoji = tipo === 'novo' ? '🎯' : '♻️';
  const label = tipo === 'novo' ? 'NOVO LEAD' : 'LEAD DUPLICADO';

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px; background: #0D1015; color: #F2F1ED; border-radius: 12px; border: 1px solid rgba(184,255,0,0.3);">
      <div style="font-size: 11px; font-family: monospace; color: #B8FF00; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 12px;">${emoji} TRAJETTA — ${label}</div>
      <h2 style="font-size: 20px; font-weight: 700; color: #fff; margin: 0 0 16px 0;">Vaga #${position} — ${leadName}</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 0; color: #8E9499; font-size: 13px; width: 120px;">Nome</td>
          <td style="padding: 10px 0; color: #F2F1ED; font-size: 13px; font-weight: 600;">${leadName}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 0; color: #8E9499; font-size: 13px;">Email</td>
          <td style="padding: 10px 0; color: #B8FF00; font-size: 13px; font-weight: 600;">${leadEmail}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 0; color: #8E9499; font-size: 13px;">Posição</td>
          <td style="padding: 10px 0; color: #F2F1ED; font-size: 13px;">#${position}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #8E9499; font-size: 13px;">Tipo</td>
          <td style="padding: 10px 0; color: #F2F1ED; font-size: 13px;">${label}</td>
        </tr>
      </table>
      <div style="margin-top: 20px; padding: 12px; background: rgba(184,255,0,0.08); border-radius: 8px; font-size: 12px; color: #8E9499;">
        Total na fila: ${position} pessoas
      </div>
    </div>
  `;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: 'Trajetta <onboarding@resend.dev>',
      to: [OWNER_EMAIL],
      subject: `${emoji} Trajetta Lista VIP — ${label}: ${leadName} (${leadEmail})`,
      html,
    }),
  });
}
