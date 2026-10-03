import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSessionUser } from '@/lib/auth/auth';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Não autenticado' }, { status: 401 });
    }

    const origin =
      req.headers.get('origin') ||
      req.headers.get('referer')?.replace(/\/$/, '') ||
      'https://trajettacompany.com.br';

    // Find customer by email if not directly saved
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Nenhum histórico de assinatura encontrado na Stripe para este e-mail.' },
        { status: 404 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customers.data[0].id,
      return_url: `${origin}/app`,
    });

    return NextResponse.json({ ok: true, url: portalSession.url });
  } catch (error: any) {
    console.error('Customer portal error:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Erro ao abrir portal da Stripe' },
      { status: 500 }
    );
  }
}
