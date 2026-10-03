import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma, ensureDbReady } from '@/lib/db';
import { sendEmail } from '@/lib/email/emailService';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: any;

    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } catch (err: any) {
        console.error('⚠️ Stripe Webhook signature verification failed:', err.message);
        return NextResponse.json({ error: 'Assinatura inválida' }, { status: 400 });
      }
    } else {
      // Direct JSON parsing if webhook secret is not yet registered
      try {
        event = JSON.parse(rawBody);
      } catch (err) {
        return NextResponse.json({ error: 'Payload JSON inválido' }, { status: 400 });
      }
    }

    console.log(`🔔 Stripe Webhook received event: ${event.type}`);

    await ensureDbReady();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerEmail = session.customer_details?.email || session.customer_email;
        const userId = session.metadata?.userId;
        const planKey = session.metadata?.planKey || 'annual';
        const subscriptionPlan =
          session.metadata?.subscriptionPlan || (planKey === 'monthly' ? 'pro_monthly' : planKey === 'founding' ? 'founding' : 'pro_annual');

        if (customerEmail) {
          try {
            const user = await prisma.user.findFirst({
              where: userId ? { id: userId } : { email: customerEmail },
            });

            if (user) {
              await prisma.user.update({
                where: { id: user.id },
                data: {
                  subscriptionStatus: 'active',
                },
              });
            }

            // Disparar e-mail comemorativo de boas-vindas ao Pro
            await sendEmail({
              to: customerEmail,
              subject: 'Sua assinatura Trajetta Pro está confirmada! 🚀',
              html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
                  <h1 style="color: #060709;">Bem-vindo ao Trajetta Pro!</h1>
                  <p>Sua assinatura foi ativada com sucesso.</p>
                  <p>Agora você tem acesso irrestrito às 4 áreas da vida, AI Trajetta ilimitada e planejamento semanal de alta performance.</p>
                  <p><a href="https://trajettacompany.com.br/app" style="display: inline-block; background-color: #B8FF00; color: #060709; font-weight: bold; padding: 12px 24px; text-decoration: none; border-radius: 8px;">Acessar Minha Trajetória</a></p>
                </div>
              `,
            });
          } catch (e) {
            console.error('Error handling checkout.session.completed:', e);
          }
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        console.log(`Assinatura cancelada para o cliente: ${customerId}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        console.warn(`Pagamento falhou para a fatura: ${invoice.id}`);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Stripe webhook processing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
