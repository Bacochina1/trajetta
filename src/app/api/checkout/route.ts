import { NextRequest, NextResponse } from 'next/server';
import { stripe, STRIPE_PLANS, PlanKey } from '@/lib/stripe';
import { getSessionUser } from '@/lib/auth/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const planKey = (body.plan || 'annual') as PlanKey;
    const plan = STRIPE_PLANS[planKey] || STRIPE_PLANS.annual;

    const user = await getSessionUser();
    const customerEmail = body.email || user?.email || undefined;

    // Build origin URL for callbacks
    const origin =
      req.headers.get('origin') ||
      req.headers.get('referer')?.replace(/\/$/, '') ||
      process.env.NEXT_PUBLIC_APP_URL ||
      'https://trajettacompany.com.br';

    const sessionParams: any = {
      mode: 'subscription',
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
      locale: 'pt-BR',
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user?.id || body.userId || '',
        planKey: plan.id,
        subscriptionPlan: plan.subscriptionPlanKey,
      },
      subscription_data: {
        metadata: {
          userId: user?.id || body.userId || '',
          planKey: plan.id,
        },
      },
      success_url: `${origin}/app?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/app?payment=cancelled`,
    };

    if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    // Include 14 days free trial for monthly and annual plans if requested
    if (plan.trialDays > 0) {
      sessionParams.subscription_data.trial_period_days = plan.trialDays;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({
      ok: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error('Stripe checkout session error:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Erro ao inicializar checkout com a Stripe' },
      { status: 500 }
    );
  }
}
