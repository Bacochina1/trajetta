import { NextResponse } from 'next/server';
import { prisma, ensureDbReady } from '@/lib/db';
import { sendEmail, renderWelcomeEmail, renderNewsletterWelcomeEmail } from '@/lib/email/emailService';
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
    const { email, name, phone, source } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { ok: false, error: 'Por favor, insira um e-mail válido.' },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();
    const isNewsletter = source === 'newsletter_footer';
    const cleanName = name ? String(name).trim() : (isNewsletter ? 'Leitor Trajetta' : 'Membro VIP');
    const cleanPhone = phone ? String(phone).trim() : undefined;

    const totalCount = await prisma.waitlist.count();
    const newPosition = BASE_WAITLIST_COUNT + totalCount + 1;

    // 1. Save directly into internal CRM
    const saved = await saveLead({
      email: cleanEmail,
      name: cleanName,
      phone: cleanPhone,
      source: isNewsletter ? 'newsletter_footer' : 'landing_page',
      status: isNewsletter ? 'newsletter' : 'waitlist',
      tags: isNewsletter ? ['Newsletter', 'Novidades', 'Rodape'] : ['VIP', 'Lista de Espera', 'Lote 1'],
      position: newPosition,
      notes: isNewsletter ? 'Inscrito na lista de novidades pelo rodapé' : (cleanPhone ? `Cadastrado com WhatsApp: ${cleanPhone}` : 'Cadastrado na landing page'),
    });

    // 2. Notify owner immediately via Resend
    try {
      await sendOwnerNotification(cleanEmail, cleanName, cleanPhone, newPosition, isNewsletter);
    } catch (e) {
      console.warn('[sendOwnerNotification error]:', e);
    }

    // 3. Send confirmation email to lead
    try {
      if (isNewsletter) {
        await sendEmail({
          to: cleanEmail,
          subject: 'Inscrição confirmada na Trajetta — Novidades e Atualizações',
          html: renderNewsletterWelcomeEmail(cleanEmail),
        });
      } else {
        const welcomeHtml = renderWelcomeEmail(cleanName, newPosition);
        await sendEmail({
          to: cleanEmail,
          subject: `Você está na Lista VIP da Trajetta — Vaga #${newPosition} Confirmada`,
          html: welcomeHtml,
        });
      }
    } catch (e) {
      console.warn('[sendEmail welcome error]:', e);
    }

    return NextResponse.json({
      ok: true,
      alreadyRegistered: false,
      message: isNewsletter 
        ? 'Inscrição realizada com sucesso! Você receberá novidades em seu e-mail.' 
        : 'Sua vaga foi reservada com sucesso! Verifique seu e-mail.',
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
  position: number,
  isNewsletter: boolean = false
) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 520px; margin: 0 auto; padding: 24px; background: #0D1015; color: #F2F1ED; border-radius: 12px; border: 1.5px solid rgba(184,255,0,0.4);">
      <div style="font-size: 11px; font-family: monospace; color: #B8FF00; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px;">
        ${isNewsletter ? '📬 NOVO INSCRITO NA NEWSLETTER' : '🎯 TRAJETTA CRM — NOVO LEAD VIP'}
      </div>
      <h2 style="font-size: 20px; font-weight: 700; color: #fff; margin: 0 0 16px 0;">
        ${isNewsletter ? `Inscrição Rodapé: ${leadEmail}` : `Vaga #${position} — ${leadName}`}
      </h2>
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
          <td style="padding: 10px 0; color: #8E9499;">Tipo</td>
          <td style="padding: 10px 0; color: #fff; font-weight: 600;">${isNewsletter ? 'Newsletter / Novidades' : 'Lead Lista VIP'}</td>
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
      </table>
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
