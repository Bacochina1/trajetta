import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSessionUser } from '@/lib/auth/auth';

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Não autenticado' }, { status: 401 });
    }

    const customers = await stripe.customers.list({
      email: user.email,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({
        ok: true,
        hasStripeCustomer: false,
        status: 'trial',
      });
    }

    const customer = customers.data[0];
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: 'all',
      limit: 5,
    });

    const activeSub = subscriptions.data.find(
      (s) => s.status === 'active' || s.status === 'trialing'
    );

    // List recent invoices
    const invoices = await stripe.invoices.list({
      customer: customer.id,
      limit: 3,
    });

    const recentInvoices = invoices.data.map((inv) => ({
      id: inv.id,
      number: inv.number,
      amount: (inv.amount_paid || 0) / 100,
      currency: inv.currency,
      status: inv.status,
      date: new Date((inv.created || 0) * 1000).toLocaleDateString('pt-BR'),
      pdfUrl: inv.invoice_pdf,
      hostedUrl: inv.hosted_invoice_url,
    }));

    if (!activeSub) {
      return NextResponse.json({
        ok: true,
        hasStripeCustomer: true,
        status: 'inactive',
        recentInvoices,
      });
    }

    const subData = activeSub as any;
    const periodEnd = new Date((subData.current_period_end || subData.cancel_at || Math.floor(Date.now() / 1000) + 30 * 86400) * 1000);
    const trialEnd = subData.trial_end ? new Date(subData.trial_end * 1000) : null;

    return NextResponse.json({
      ok: true,
      hasStripeCustomer: true,
      status: activeSub.status,
      cancelAtPeriodEnd: activeSub.cancel_at_period_end,
      periodEnd: periodEnd.toISOString(),
      formattedPeriodEnd: periodEnd.toLocaleDateString('pt-BR'),
      trialEnd: trialEnd ? trialEnd.toISOString() : null,
      formattedTrialEnd: trialEnd ? trialEnd.toLocaleDateString('pt-BR') : null,
      recentInvoices,
    });
  } catch (error: any) {
    console.error('Subscription status error:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Erro ao consultar status' },
      { status: 500 }
    );
  }
}
