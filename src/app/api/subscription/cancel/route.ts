import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSessionUser } from '@/lib/auth/auth';
import { prisma, ensureDbReady } from '@/lib/db';
import { sendEmail, renderSubscriptionCancellationEmail } from '@/lib/email/emailService';

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Não autenticado' }, { status: 401 });
    }

    // Find customers in Stripe by email
    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      // If user is just on local trial without Stripe card
      await ensureDbReady();
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { subscriptionStatus: 'canceled' },
        });
      } catch {}

      return NextResponse.json({
        ok: true,
        message: 'Assinatura de teste cancelada com sucesso.',
        cancelAtPeriodEnd: true,
      });
    }

    const customerId = customers.data[0].id;

    // Find active or trialing subscriptions for this customer
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'all',
      limit: 5,
    });

    const activeSub = subscriptions.data.find(
      (s) => s.status === 'active' || s.status === 'trialing'
    );

    if (!activeSub) {
      return NextResponse.json({
        ok: true,
        message: 'Nenhuma assinatura ativa encontrada para renovação futura.',
      });
    }

    // Cancel at period end (preserves access until the paid period expires, complying with CDC)
    const updatedSub = await stripe.subscriptions.update(activeSub.id, {
      cancel_at_period_end: true,
    });

    const subData = updatedSub as any;
    const accessUntil = new Date((subData.current_period_end || subData.cancel_at || Math.floor(Date.now() / 1000) + 30 * 86400) * 1000);

    await ensureDbReady();
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { subscriptionStatus: 'canceling' },
      });
    } catch {}

    // Dispatch clear confirmation email to user
    sendEmail({
      to: user.email,
      subject: 'Confirmação de Cancelamento de Renovação — Trajetta',
      html: renderSubscriptionCancellationEmail({
        userName: user.name || 'Membro Trajetta',
        accessUntilFormatted: accessUntil.toLocaleDateString('pt-BR'),
      }),
      userId: user.id,
    }).catch((emailErr) => console.warn('Cancel email error:', emailErr));

    return NextResponse.json({
      ok: true,
      message: 'Cancelamento agendado com sucesso. Não haverá novas cobranças.',
      cancelAtPeriodEnd: true,
      accessUntil: accessUntil.toISOString(),
      formattedDate: accessUntil.toLocaleDateString('pt-BR'),
    });
  } catch (error: any) {
    console.error('Cancel subscription error:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Erro ao processar cancelamento' },
      { status: 500 }
    );
  }
}
