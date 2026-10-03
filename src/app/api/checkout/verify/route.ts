import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSessionUser } from '@/lib/auth/auth';
import { prisma, ensureDbReady } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ ok: false, error: 'Session ID ausente' }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    });

    if (session.status !== 'complete') {
      return NextResponse.json({ ok: false, status: session.status, message: 'Sessão ainda não concluída' });
    }

    const planKey = session.metadata?.planKey || 'annual';
    const subscriptionPlan =
      session.metadata?.subscriptionPlan || (planKey === 'monthly' ? 'pro_monthly' : planKey === 'founding' ? 'founding' : 'pro_annual');

    const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id;
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;

    const user = await getSessionUser();
    if (user?.id) {
      await ensureDbReady();
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionStatus: 'active',
          },
        });
      } catch (dbErr) {
        console.warn('Could not update user subscription in DB directly:', dbErr);
      }
    }

    return NextResponse.json({
      ok: true,
      plan: subscriptionPlan,
      customerId,
      subscriptionId,
      customerEmail: session.customer_details?.email,
      status: 'active',
    });
  } catch (error: any) {
    console.error('Verify checkout session error:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Erro ao validar checkout' },
      { status: 500 }
    );
  }
}
