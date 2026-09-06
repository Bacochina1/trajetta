import { NextResponse } from 'next/server';
import { prisma, ensureDbReady } from '@/lib/db';
import { sendEmail, renderWelcomeEmail } from '@/lib/email/emailService';
import { saveLead } from '@/lib/crm/crmStore';

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
    return NextResponse.json({ ok: true, totalCount: BASE_WAITLIST_COUNT });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDbReady();
    const body = await req.json();
    const { email, name, phone } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { ok: false, error: 'Por favor, insira um e-mail válido.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const cleanName = name ? String(name).trim() : 'Membro VIP';
    const cleanPhone = phone ? String(phone).trim() : undefined;

    const totalCount = await prisma.waitlist.count();
    const newPosition = BASE_WAITLIST_COUNT + totalCount + 1;

    // 1. Save directly into internal CRM
    const saved = await saveLead({
      email: cleanEmail,
      name: cleanName,
      phone: cleanPhone,
      source: 'landing_page',
      status: 'waitlist',
      tags: ['VIP', 'Lista de Espera', 'Lote 1'],
      position: newPosition,
      notes: cleanPhone ? `Cadastrado com WhatsApp: ${cleanPhone}` : 'Cadastrado na landing page',
    });

    // 2. Notify owner immediately (always works)
    sendOwnerNotification(cleanEmail, cleanName, cleanPhone, newPosition).catch(() => {});

    // 3. Try to send confirmation email to lead
    const welcomeHtml = renderWelcomeEmail(cleanName, newPosition);
    sendEmail({
      to: cleanEmail,
      subject: `Você está na Lista VIP da Trajetta — Vaga #${newPosition} Confirmada`,
      html: welcomeHtml,
    }).catch(() => {});

    return NextResponse.json({
      ok: true,
      alreadyRegistered: false,
      message: 'Sua vaga foi reservada com sucesso! Verifique seu e-mail.',
      name: cleanName,
      email: cleanEmail,
      position: newPosition,
      totalCount: newPosition,
      lead: saved,
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
  leadPhone: string | undefined,
  position: number
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background: #0D1015; color: #F2F1ED; border-radius: 12px; border: 1.5px solid rgba(184,255,0,0.4);">
      <div style="font-size: 11px; font-family: monospace; color: #B8FF00; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">🎯 TRAJETTA CRM — NOVO LEAD VIP</div>
      <h2 style="font-size: 20px; font-weight: 700; color: #fff; margin: 0 0 16px 0;">Vaga #${position} — ${leadName}</h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 0; color: #8E9499;">Nome</td>
          <td style="padding: 10px 0; color: #fff; font-weight: 600;">${leadName}</td>
        </tr>
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 0; color: #8E9499;">E-mail</td>
          <td style="padding: 10px 0; color: #B8FF00; font-weight: 600;">${leadEmail}</td>
        </tr>
        ${leadPhone ? `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 0; color: #8E9499;">WhatsApp</td>
          <td style="padding: 10px 0; color: #fff;">${leadPhone}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 10px 0; color: #8E9499;">Posição na Fila</td>
          <td style="padding: 10px 0; color: #fff; font-weight: bold;">#${position}</td>
        </tr>
      </table>
      <div style="margin-top: 20px; padding: 12px; background: rgba(184,255,0,0.08); border-radius: 8px; font-size: 12px; color: #8E9499;">
        Acesse o CRM da Trajetta: <a href="https://trajetta-app.vercel.app/admin/crm" style="color: #B8FF00; text-decoration: underline;">Painel do CRM</a>
      </div>
    </div>
  `;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: 'Trajetta <onboarding@resend.dev>',
        to: [OWNER_EMAIL],
        subject: `🎯 Novo Lead VIP #${position}: ${leadName} (${leadEmail})`,
        html,
      }),
    });
  } catch {}
}
