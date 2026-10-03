import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getSessionUser, createSessionToken, hashPassword, AUTH_COOKIE_NAME } from '@/lib/auth/auth';
import { prisma, ensureDbReady } from '@/lib/db';
import { sendEmail, renderProWelcomeEmail } from '@/lib/email/emailService';

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

    const rawCustomerEmail = session.customer_details?.email || (typeof session.customer === 'object' ? (session.customer as any)?.email : null);
    const customerEmail = rawCustomerEmail ? String(rawCustomerEmail).toLowerCase().trim() : null;
    const customerName = session.customer_details?.name || 'Membro Trajetta';

    await ensureDbReady();

    // 1. Identificar se já existe usuário logado na requisição atual
    let resolvedUser: any = await getSessionUser();

    // 2. Se não estiver logado, buscar pelo e-mail do comprador ou provisionar automaticamente
    if (!resolvedUser && customerEmail) {
      let dbUser = await prisma.user.findUnique({
        where: { email: customerEmail },
      });

      if (!dbUser) {
        // Criar usuário automaticamente para acesso imediato sem dores de cabeça
        const temporaryPassword = 'Tr-' + Math.random().toString(36).slice(-6) + '!';
        const passwordHash = await hashPassword(temporaryPassword);

        dbUser = await prisma.user.create({
          data: {
            email: customerEmail,
            name: customerName,
            passwordHash,
            role: 'USER',
            subscriptionStatus: 'active',
          },
        });

        // Enviar e-mail de acesso imediato com credenciais
        sendEmail({
          to: customerEmail,
          subject: 'Seu acesso ao Trajetta Pro foi liberado! 🚀',
          html: renderProWelcomeEmail({
            userName: customerName,
            email: customerEmail,
            temporaryPassword,
            planName: subscriptionPlan,
            isNewUser: true,
          }),
          userId: dbUser.id,
        }).catch((err) => console.warn('Could not dispatch instant access email from verify:', err));
      } else {
        // Atualizar status da assinatura do usuário existente
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: { subscriptionStatus: 'active' },
        });

        // Enviar e-mail de confirmação de assinatura ativa
        sendEmail({
          to: customerEmail,
          subject: 'Sua assinatura Trajetta Pro está confirmada! 🚀',
          html: renderProWelcomeEmail({
            userName: dbUser.name,
            email: customerEmail,
            planName: subscriptionPlan,
            isNewUser: false,
          }),
          userId: dbUser.id,
        }).catch((err) => console.warn('Could not dispatch upgrade confirmation email:', err));
      }

      resolvedUser = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role,
        avatar: dbUser.avatar,
        subscriptionStatus: dbUser.subscriptionStatus,
        createdAt: dbUser.createdAt,
      };
    } else if (resolvedUser?.id) {
      // Usuário já estava logado ao comprar
      await prisma.user.update({
        where: { id: resolvedUser.id },
        data: { subscriptionStatus: 'active' },
      });

      if (customerEmail) {
        sendEmail({
          to: customerEmail,
          subject: 'Sua assinatura Trajetta Pro está confirmada! 🚀',
          html: renderProWelcomeEmail({
            userName: resolvedUser.name,
            email: customerEmail,
            planName: subscriptionPlan,
            isNewUser: false,
          }),
          userId: resolvedUser.id,
        }).catch((err) => console.warn('Could not dispatch logged-in user upgrade email:', err));
      }
    }

    const response = NextResponse.json({
      ok: true,
      plan: subscriptionPlan,
      customerId,
      subscriptionId,
      customerEmail,
      user: resolvedUser
        ? {
            id: resolvedUser.id,
            email: resolvedUser.email,
            name: resolvedUser.name,
            role: resolvedUser.role,
            avatar: resolvedUser.avatar,
          }
        : null,
      status: 'active',
    });

    // 3. Autenticar imediatamente o navegador via cookie seguro de sessão
    if (resolvedUser) {
      const token = await createSessionToken({
        userId: resolvedUser.id,
        email: resolvedUser.email,
        name: resolvedUser.name,
        role: resolvedUser.role,
      });

      response.cookies.set({
        name: AUTH_COOKIE_NAME,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 dias
      });
    }

    return response;
  } catch (error: any) {
    console.error('Verify checkout session error:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Erro ao validar checkout' },
      { status: 500 }
    );
  }
}
