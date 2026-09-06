import { NextRequest, NextResponse } from 'next/server';
import { prisma, ensureDbReady } from '@/lib/db';
import { createSessionToken, hashPassword, AUTH_COOKIE_NAME } from '@/lib/auth/auth';
import { sendEmail } from '@/lib/email/emailService';
import { syncLeadToManyChat } from '@/lib/crm/manychatService';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const state = request.nextUrl.searchParams.get('state');
  const error = request.nextUrl.searchParams.get('error');

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const protocol = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const redirectUri = `${protocol}://${host}/api/auth/callback/google`;

  // Parse state
  let returnUrl = '/app';
  let utmSource = '';
  let utmCampaign = '';
  if (state) {
    try {
      const parsed = JSON.parse(Buffer.from(state, 'base64url').toString('utf8'));
      if (parsed.returnUrl) returnUrl = parsed.returnUrl;
      if (parsed.utm_source) utmSource = parsed.utm_source;
      if (parsed.utm_campaign) utmCampaign = parsed.utm_campaign;
    } catch {}
  }

  if (error || !code) {
    console.warn('[Google OAuth error]:', error || 'Code missing');
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent('Autenticação com Google cancelada ou indisponível.')}`, request.url)
    );
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL('/login?error=Configuração de OAuth incompleta no servidor.', request.url)
    );
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error('[Google OAuth Token Error]:', tokenData);
      return NextResponse.redirect(
        new URL('/login?error=Falha ao validar credenciais com o Google.', request.url)
      );
    }

    // 2. Fetch user profile from Google
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    const googleUser = await userRes.json();
    if (!userRes.ok || !googleUser.email) {
      console.error('[Google OAuth UserInfo Error]:', googleUser);
      return NextResponse.redirect(
        new URL('/login?error=Não foi possível ler seu e-mail do Google.', request.url)
      );
    }

    const email = googleUser.email.toLowerCase().trim();
    const name = googleUser.name || email.split('@')[0];
    const avatar = googleUser.picture || null;

    await ensureDbReady();

    // 3. Upsert user in database
    let user = await prisma.user.findUnique({ where: { email } });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 14);

      const defaultPassword = await hashPassword(`GoogleAuth_${Math.random().toString(36).slice(-8)}!`);

      user = await prisma.user.create({
        data: {
          email,
          name,
          avatar,
          passwordHash: defaultPassword,
          role: 'USER',
          subscriptionStatus: 'trial',
          trialEndsAt,
          currentLifePhase: 'Fundação & Consistência',
        },
      });

      // Seed initial 4 starter habits for the 4 life areas
      try {
        await prisma.habit.createMany({
          data: [
            { userId: user.id, name: 'Treino de Força / Movimento', area: 'Corpo', frequency: '3x_week', frequencyPerWeek: 3, targetValue: 'Piso: 20 min' },
            { userId: user.id, name: 'Revisão Financeira Semanal', area: 'Dinheiro', frequency: 'weekly', frequencyPerWeek: 1, targetValue: 'Conferir extrato' },
            { userId: user.id, name: 'Bloco de Foco Estratégico', area: 'Carreira', frequency: '4x_week', frequencyPerWeek: 4, targetValue: '45 min sem distrações' },
            { userId: user.id, name: 'Momento de Presença & Desconexão', area: 'Vida', frequency: 'daily', frequencyPerWeek: 7, targetValue: '15 min de leitura' },
          ],
        });
      } catch (seedErr) {
        console.warn('[Google OAuth Seed Notice]:', seedErr);
      }

      // Notify via email & CRM asynchronously
      try {
        sendEmail({
          to: email,
          subject: 'Bem-vindo à Trajetta — Seu período de 14 dias começou',
          html: `<div style="font-family:sans-serif; background:#060709; color:#F2F1ED; padding:32px; border-radius:12px;">
            <h2 style="color:#B8FF00;">Olá, ${name}!</h2>
            <p>Sua conta na Trajetta foi criada com sucesso via Google.</p>
            <p>Você tem 14 dias de acesso completo ao Sistema Pessoal de Evolução.</p>
            <p><a href="${protocol}://${host}/app" style="background:#B8FF00; color:#060709; padding:12px 24px; text-decoration:none; font-weight:bold; border-radius:8px; display:inline-block;">Acessar Meu Painel</a></p>
          </div>`,
        }).catch(() => {});

        syncLeadToManyChat({
          name,
          email,
          status: 'registered',
          tags: ['google_auth', 'trial_14d', utmSource].filter(Boolean),
          customFields: {
            plano_interesse: 'Pro Anual (Trial)',
            origem_lead: utmSource || 'google_oauth',
            campanha: utmCampaign || 'direto',
          },
        }).catch(() => {});
      } catch {}
    } else if (avatar && !user.avatar) {
      // Update avatar if not present
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { avatar },
        });
      } catch {}
    }

    // 4. Create JWT Session Token
    const sessionToken = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // 5. Build response with cookies
    const destination = returnUrl.startsWith('/') ? returnUrl : '/app';
    const response = NextResponse.redirect(new URL(destination, request.url));

    const isProd = process.env.NODE_ENV === 'production' && !host.includes('localhost');

    // HTTP-only session cookie
    response.cookies.set(AUTH_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    // Client-side accessible cookie
    response.cookies.set('trajetta_token', sessionToken, {
      httpOnly: false,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    console.error('[Google OAuth Callback Exception]:', err);
    return NextResponse.redirect(
      new URL('/login?error=Erro interno durante a autenticação com o Google.', request.url)
    );
  }
}
