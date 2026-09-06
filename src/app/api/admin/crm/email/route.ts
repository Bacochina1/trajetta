import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email/emailService';

const ADMIN_SECRET = 'TrajettaAdmin2026!';

function isAuthorized(req: Request): boolean {
  const cookie = req.headers.get('cookie') || '';
  if (cookie.includes('trajetta_admin_session=authenticated')) return true;
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.includes(ADMIN_SECRET)) return true;
  return false;
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const { recipients, subject, messageHtml } = await req.json();

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ ok: false, error: 'Nenhum destinatário selecionado' }, { status: 400 });
    }

    if (!subject || !messageHtml) {
      return NextResponse.json({ ok: false, error: 'Assunto e mensagem são obrigatórios' }, { status: 400 });
    }

    const results = [];
    for (const recipient of recipients) {
      const email = typeof recipient === 'string' ? recipient : recipient.email;
      const name = typeof recipient === 'string' ? 'Membro' : recipient.name || 'Membro';

      const personalizedHtml = messageHtml
        .replace(/{{nome}}/g, name)
        .replace(/{{email}}/g, email);

      try {
        const res = await sendEmail({
          to: email,
          subject,
          html: personalizedHtml,
        });
        results.push({ email, success: res.success, id: res.id, error: res.error });
      } catch (err) {
        results.push({ email, success: false, error: String(err) });
      }
    }

    return NextResponse.json({
      ok: true,
      totalSent: results.filter((r) => r.success).length,
      totalFailed: results.filter((r) => !r.success).length,
      results,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
