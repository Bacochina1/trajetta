import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma, ensureDbReady } from '@/lib/db';
import { sendEmail, renderProWelcomeEmail } from '@/lib/email/emailService';
import { hashPassword } from '@/lib/auth/auth';

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
      // Direct JSON parsing if webhook secret is not yet configured
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
        const customerEmail = (session.customer_details?.email || session.customer_email)?.toLowerCase().trim();
        const customerName = session.customer_details?.name || 'Membro Trajetta';
        const userId = session.metadata?.userId;
        const planKey = session.metadata?.planKey || 'annual';
        const subscriptionPlan = session.metadata?.subscriptionPlan || (planKey === 'monthly' ? 'pro_monthly' : planKey === 'founding' ? 'founding' : 'pro_annual');

        if (customerEmail) {
          try {
            let user = await prisma.user.findFirst({
              where: userId ? { id: userId } : { email: customerEmail },
            });

            let temporaryPassword: string | undefined = undefined;

            if (user) {
              await prisma.user.update({
                where: { id: user.id },
                data: {
                  subscriptionStatus: 'active',
                },
              });
            } else {
              // Usuário comprou direto sem criar conta prévia: cria conta automaticamente
              temporaryPassword = 'Tr-' + Math.random().toString(36).slice(-6) + '!';
              const passwordHash = await hashPassword(temporaryPassword);
              user = await prisma.user.create({
                data: {
                  email: customerEmail,
                  name: customerName,
                  passwordHash,
                  role: 'USER',
                  subscriptionStatus: 'active',
                },
              });
            }

            // Disparar e-mail comemorativo de boas-vindas ao Pro com credenciais completas
            await sendEmail({
              to: customerEmail,
              subject: temporaryPassword
                ? 'Seu acesso ao Trajetta Pro foi liberado! 🚀'
                : 'Sua assinatura Trajetta Pro está confirmada! 🚀',
              html: renderProWelcomeEmail({
                userName: user.name || customerName,
                email: customerEmail,
                temporaryPassword,
                planName: subscriptionPlan,
                isNewUser: Boolean(temporaryPassword),
              }),
              userId: user.id,
            });
          } catch (e) {
            console.error('Error handling checkout.session.completed:', e);
          }
        }
        break;
      }

      // NOVO: Envio automático de Recibo / Fatura detalhada com link do PDF oficial
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const customerEmail = invoice.customer_email;
        const invoicePdf = invoice.invoice_pdf;
        const hostedInvoiceUrl = invoice.hosted_invoice_url;
        const amountPaid = ((invoice.amount_paid || 0) / 100).toLocaleString('pt-BR', {
          style: 'currency',
          currency: invoice.currency?.toUpperCase() || 'BRL',
        });
        const invoiceNumber = invoice.number || invoice.id;

        if (customerEmail) {
          try {
            await sendEmail({
              to: customerEmail,
              subject: `Recibo de Pagamento Trajetta #${invoiceNumber}`,
              html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #0D0F10; color: #F2F1ED; padding: 32px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);">
                  <div style="margin-bottom: 20px;">
                    <span style="font-size: 11px; font-weight: 800; color: #B8FF00; text-transform: uppercase; letter-spacing: 0.15em;">TRAJETTA • RECIBO OFICIAL</span>
                  </div>
                  <h1 style="font-size: 22px; font-weight: 800; margin: 0 0 12px 0; color: #F2F1ED;">Pagamento Confirmado</h1>
                  <p style="font-size: 14px; line-height: 1.6; color: #8E9499; margin: 0 0 20px 0;">
                    Confirmamos o recebimento do seu pagamento referente à sua assinatura no Trajetta.
                  </p>

                  <div style="background: #14181F; padding: 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 24px;">
                    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                      <tr>
                        <td style="color: #8E9499; padding: 6px 0;">Fatura:</td>
                        <td style="color: #F2F1ED; font-weight: 600; text-align: right; font-family: monospace;">${invoiceNumber}</td>
                      </tr>
                      <tr>
                        <td style="color: #8E9499; padding: 6px 0;">Valor Pago:</td>
                        <td style="color: #B8FF00; font-weight: 800; text-align: right; font-size: 15px;">${amountPaid}</td>
                      </tr>
                      <tr>
                        <td style="color: #8E9499; padding: 6px 0;">Status:</td>
                        <td style="color: #38EF7D; font-weight: 600; text-align: right;">Pago com Sucesso ✓</td>
                      </tr>
                    </table>
                  </div>

                  <div style="display: flex; gap: 12px; margin-bottom: 24px;">
                    ${
                      invoicePdf
                        ? `<a href="${invoicePdf}" style="display: inline-block; background: #1F2328; color: #F2F1ED; font-weight: 600; font-size: 12px; padding: 12px 20px; text-decoration: none; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); margin-right: 10px;">Baixar Fatura em PDF</a>`
                        : ''
                    }
                    ${
                      hostedInvoiceUrl
                        ? `<a href="${hostedInvoiceUrl}" style="display: inline-block; background: #B8FF00; color: #060709; font-weight: 700; font-size: 12px; padding: 12px 20px; text-decoration: none; border-radius: 8px;">Visualizar Recibo Online</a>`
                        : ''
                    }
                  </div>

                  <p style="font-size: 11px; color: #8E9499; line-height: 1.5; margin: 20px 0 0 0; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 16px;">
                    Você pode alterar seu método de pagamento ou cancelar sua assinatura a qualquer momento através do seu painel no aplicativo em Configurações > Assinatura.
                  </p>
                </div>
              `,
            });
          } catch (e) {
            console.error('Error sending invoice receipt email:', e);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const customerId = sub.customer;
        const status = sub.status;
        console.log(`Assinatura atualizada: ${sub.id}, status: ${status}, cancel_at_period_end: ${sub.cancel_at_period_end}`);

        try {
          const customer = await stripe.customers.retrieve(customerId as string);
          const email = (customer as any)?.email?.toLowerCase().trim();
          if (email) {
            const mappedStatus = (status === 'active' || status === 'trialing') 
              ? 'active' 
              : status === 'past_due' 
              ? 'past_due' 
              : 'cancelled';

            await prisma.user.updateMany({
              where: { email },
              data: { subscriptionStatus: mappedStatus },
            });
          }
        } catch (subErr) {
          console.error('Error syncing updated subscription to DB:', subErr);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        console.log(`Assinatura cancelada definitivamente para o cliente: ${customerId}`);

        try {
          const customer = await stripe.customers.retrieve(customerId as string);
          const email = (customer as any)?.email?.toLowerCase().trim();
          if (email) {
            await prisma.user.updateMany({
              where: { email },
              data: { subscriptionStatus: 'cancelled' },
            });
          }
        } catch (subErr) {
          console.error('Error syncing deleted subscription to DB:', subErr);
        }
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
