import { prisma } from '../db';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  userId?: string;
}
export async function sendEmail({ to, subject, html, userId }: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string; sandboxForwarded?: boolean }> {
  const apiKey = (process.env.RESEND_API_KEY || '').replace(/[^\x20-\x7E]/g, '').trim();

  if (apiKey) {
    try {
      // Use custom domain when verified, or fallback to onboarding@resend.dev
      const rawFrom = process.env.RESEND_FROM || 'Trajetta <contato@trajettacompany.com.br>';
      const fromEmail = rawFrom.replace(/[^\x20-\x7E]/g, '').trim();
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.warn(`[Resend Email Warning for ${to}]: ${err}`);

        // If domain is unverified, attempt fallback to onboarding@resend.dev
        let lastErr = err;
        if (fromEmail !== 'Trajetta <onboarding@resend.dev>' && (err.includes('domain is not verified') || err.includes('not have permission') || err.includes('domain'))) {
          const retryRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              from: 'Trajetta <onboarding@resend.dev>',
              to: [to],
              subject,
              html,
            }),
          });
          if (retryRes.ok) {
            const rData = await retryRes.json();
            return { success: true, id: rData.id };
          }
          lastErr = await retryRes.text();
        }

        // In Resend sandbox mode, if the domain is not verified, Resend only allows sending to the account owner (companytrajetta@gmail.com).
        // Forward the actual email to the verified owner so the founder always receives the notification and lead details!
        if (lastErr.includes('only send testing emails') || lastErr.includes('validation_error') || lastErr.includes('domain is not verified')) {
          const ownerEmail = 'companytrajetta@gmail.com';
          const sandboxSubject = `[TRAJETTA NOTIFICAÇÃO: ${to}] ${subject}`;
          const sandboxHtml = `
            <div style="background-color: #B8FF00; color: #0D0F10; padding: 12px 16px; font-family: monospace; font-size: 11px; font-weight: bold; border-radius: 8px; margin-bottom: 20px;">
              ⚡ AVISO RESEND SANDBOX: Este e-mail foi entregue à conta titular (${ownerEmail}) porque o domínio oficial ainda está aguardando verificação de DNS no Resend. Destinatário original: ${to}
            </div>
            ${html}
          `;

          const forwardRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              from: 'Trajetta <onboarding@resend.dev>',
              to: [ownerEmail],
              subject: sandboxSubject,
              html: sandboxHtml,
            }),
          });

          if (forwardRes.ok) {
            const fData = await forwardRes.json();
            console.log(`[Resend Sandbox Forwarded]: ID ${fData.id} delivered to owner ${ownerEmail} on behalf of ${to}`);
            try {
              await prisma.emailLog.create({
                data: {
                  userId: userId || null,
                  to,
                  subject,
                  status: 'sandbox_forwarded',
                  providerId: fData.id,
                  error: 'Sandbox mode: encaminhado para titular',
                }
              });
            } catch {}
            return { success: true, id: fData.id, sandboxForwarded: true };
          }
        }

        try {
          await prisma.emailLog.create({
            data: {
              userId: userId || null,
              to,
              subject,
              status: 'failed',
              error: err,
            }
          });
        } catch {}

        return { success: false, error: err };
      }

      const data = await res.json();
      console.log(`[Resend Email Delivered]: ID ${data.id} to ${to}`);
      try {
        await prisma.emailLog.create({
          data: {
            userId: userId || null,
            to,
            subject,
            status: 'delivered',
            providerId: data.id,
          }
        });
      } catch {}

      return { success: true, id: data.id };
    } catch (e) {
      console.error('[Email Dispatch Error]:', e);
      try {
        await prisma.emailLog.create({
          data: {
            userId: userId || null,
            to,
            subject,
            status: 'failed',
            error: String(e),
          }
        });
      } catch {}
      return { success: false, error: String(e) };
    }
  }

  // Development & Production Log Fallback
  console.log(`\n📨 [TRAJETTA EMAIL DISPATCHED] -> To: ${to} | Subject: "${subject}"`);
  console.log(`Preview HTML snippet: ${html.substring(0, 180)}...\n`);
  return { success: true, id: `trajetta_vip_${Date.now()}` };
}

export function renderWelcomeEmail(userName: string, position: number = 1481): string {
  const formattedPosition = new Intl.NumberFormat('pt-BR').format(position);

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Você está na Lista VIP da Trajetta</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 480px) {
      .email-wrap { padding: 10px 6px !important; }
      .email-container { width: 100% !important; max-width: 100% !important; border-radius: 14px !important; }
      .email-pad { padding: 22px 18px !important; }
      .header-pad { padding: 20px 18px 16px 18px !important; }
      .banner-img { max-height: 110px !important; height: auto !important; }
      .cta-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 15px 16px !important; text-align: center !important; font-size: 13px !important; }
      .mobile-title { font-size: 21px !important; line-height: 1.25 !important; }
      .pass-box { padding: 16px 14px !important; }
      .pass-name { font-size: 18px !important; }
      .badge-tag { font-size: 9px !important; padding: 3px 8px !important; }
    }
    @media only screen and (max-width: 360px) {
      .email-wrap { padding: 4px 2px !important; }
      .email-pad { padding: 18px 12px !important; }
      .header-pad { padding: 14px 12px 12px 12px !important; }
      .mobile-title { font-size: 19px !important; line-height: 1.25 !important; }
      .pass-box { padding: 14px 10px !important; }
      .pass-name { font-size: 16px !important; }
      .cta-btn { padding: 14px 10px !important; font-size: 12.5px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #060709; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #F2F1ED; -webkit-font-smoothing: antialiased;">
  <table class="email-wrap" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #060709; padding: 32px 12px 40px 12px;">
    <tr>
      <td align="center">
        <!-- Container Principal -->
        <table class="email-container" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #0B0E14; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 35px 80px rgba(0,0,0,0.85);">
          
          <!-- Banner Atmosférico Editorial de Fundo com Scrim Suave -->
          <tr>
            <td style="padding: 0; background-color: #080A0F; border-bottom: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <a href="https://trajettacompany.com.br" target="_blank" style="text-decoration: none; display: block;">
                <img class="banner-img" src="https://trajettacompany.com.br/trajetta-email-banner.jpg" alt="Trajetta" width="600" style="display: block; width: 100%; max-height: 150px; object-fit: cover; opacity: 0.88;" />
              </a>
            </td>
          </tr>

          <!-- Cabeçalho com Marca Oficial & Tag VIP -->
          <tr>
            <td class="header-pad" style="padding: 26px 36px 20px 36px; background-color: #0B0E14; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 12px;">
                          <a href="https://trajettacompany.com.br" target="_blank" style="text-decoration: none; display: inline-block;">
                            <img src="https://trajettacompany.com.br/trajetta-logo-white.png" alt="Trajetta" width="32" height="32" style="display: block; border-radius: 8px;" />
                          </a>
                        </td>
                        <td style="vertical-align: middle;">
                          <span style="font-size: 19px; font-weight: 800; letter-spacing: -0.6px; color: #FFFFFF; display: block; line-height: 1;">trajetta</span>
                          <span style="font-size: 9px; font-family: monospace; letter-spacing: 1.5px; text-transform: uppercase; color: #8E9499; display: block; margin-top: 3px;">SISTEMA DE EVOLUÇÃO</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; background-color: rgba(184, 255, 0, 0.12); border: 1px solid rgba(184, 255, 0, 0.35); color: #B8FF00; font-family: monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; padding: 4px 10px; border-radius: 100px; white-space: nowrap;">
                      ● VIP FOUNDER
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Corpo Principal do E-mail -->
          <tr>
            <td class="email-pad" style="padding: 36px 36px 28px 36px;">
              
              <!-- Título Editorial -->
              <h1 class="mobile-title" style="font-size: 24px; font-weight: 700; line-height: 1.3; margin: 0 0 16px 0; color: #FFFFFF; letter-spacing: -0.6px;">
                Sua vaga está garantida na vanguarda, <span style="color: #B8FF00;">${userName}</span>.
              </h1>
              
              <p style="font-size: 14px; line-height: 1.7; color: #BAC2CC; margin: 0 0 24px 0;">
                Você acabou de reservar sua posição prioritária para o lançamento da Trajetta. Não construímos mais um gerenciador de tarefas para frustrar você no terceiro dia — criamos um sistema sóbrio desenhado para a sua <strong>vida real</strong>, com altos, baixos e a paciência necessária para evolução duradoura.
              </p>

              <!-- CARTÃO VIP FOUNDER PASS (Estilo Luxury Pass) -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 0 28px 0; background: linear-gradient(145deg, #13171F 0%, #0B0E13 100%); border: 1.5px solid rgba(184, 255, 0, 0.4); border-radius: 14px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.5);">
                <tr>
                  <td class="pass-box" style="padding: 22px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="left">
                          <span style="font-size: 9px; font-family: monospace; color: #8E9499; letter-spacing: 1.8px; text-transform: uppercase;">TRAJETTA FOUNDER PASS</span>
                        </td>
                        <td align="right">
                          <span style="font-size: 11px; font-family: monospace; color: #B8FF00; font-weight: 700;"># ${formattedPosition}</span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 14px; padding-bottom: 14px;">
                          <div class="pass-name" style="font-size: 20px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">${userName}</div>
                          <div style="font-size: 11px; color: #8E9499; margin-top: 4px;">Acesso Prioritário Nível 1 • Benefícios Vitalícios de IA</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 12px;">
                          <span style="font-size: 9px; font-family: monospace; color: #58D6A7; font-weight: 600;">STATUS: CONFIRMADO</span>
                        </td>
                        <td align="right" style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 12px;">
                          <span style="font-size: 9px; font-family: monospace; color: #8E9499;">LOTE FUNDADOR 2026</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- O Que Você Terá Acesso -->
              <h2 style="font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 1.5px; color: #8E9499; margin: 0 0 14px 0;">
                O QUE ESPERA POR VOCÊ
              </h2>

              <!-- 3 Pilares com Linhas Sutis -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 26px;">
                <tr>
                  <td style="padding: 12px 14px; background-color: #12151B; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px;">
                    <strong style="color: #FFFFFF; font-size: 13px; display: block;">🎯 Metas Divididas em Marcos Trimestrais</strong>
                    <span style="color: #8E9499; font-size: 12px; line-height: 1.4; display: block; margin-top: 2px;">Divida grandes ambições em passos matemáticos viáveis em 4 dimensões (Corpo, Dinheiro, Carreira, Vida).</span>
                  </td>
                </tr>
                <tr><td style="height: 8px;"></td></tr>
                <tr>
                  <td style="padding: 12px 14px; background-color: #12151B; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px;">
                    <strong style="color: #FFFFFF; font-size: 13px; display: block;">⚡ Hábitos com Ritmo Real e Sem Culpa</strong>
                    <span style="color: #8E9499; font-size: 12px; line-height: 1.4; display: block; margin-top: 2px;">Dias difíceis não apagam sua consistência acumulada. O que importa é a sua velocidade de retorno.</span>
                  </td>
                </tr>
                <tr><td style="height: 8px;"></td></tr>
                <tr>
                  <td style="padding: 12px 14px; background-color: #12151B; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px;">
                    <strong style="color: #B8FF00; font-size: 13px; display: block;">🧠 Trajetta IA com Memória Viva Pessoal</strong>
                    <span style="color: #8E9499; font-size: 12px; line-height: 1.4; display: block; margin-top: 2px;">Um estrategista pessoal que lembra de cada vitória, desafio e reflexão ao longo das 52 semanas.</span>
                  </td>
                </tr>
              </table>

              <!-- Citação Serena -->
              <div style="background-color: #12161D; border-left: 3px solid #B8FF00; padding: 16px 18px; border-radius: 8px; margin-bottom: 28px;">
                <p style="font-size: 13px; font-style: italic; line-height: 1.6; color: #F2F1ED; margin: 0;">
                  “Um deslize isolado não anula 20 dias de consistência. O que define sua trajetória é a clareza de horizonte e a rapidez com que você volta ao seu ritmo.”
                </p>
              </div>

              <!-- Botão Principal de Ação -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 20px;">
                <tr>
                  <td align="center">
                    <a class="cta-btn" href="https://trajettacompany.com.br/app" style="display: inline-block; background-color: #B8FF00; color: #0D0F10; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; font-weight: 800; letter-spacing: 0.3px; text-transform: uppercase; text-decoration: none; padding: 15px 32px; border-radius: 12px; box-shadow: 0 8px 24px rgba(184,255,0,0.28);">
                      ACESSAR AMBIENTE TRAJETTA →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 11px; color: #6D747D; text-align: center; margin: 0; line-height: 1.5;">
                Assim que as primeiras vagas forem liberadas, você receberá o link exclusivo de ativação neste mesmo e-mail.
              </p>
            </td>
          </tr>

          <!-- Rodapé do E-mail -->
          <tr>
            <td class="email-pad" style="padding: 24px 36px; background-color: #080A0E; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="font-size: 11px; color: #6D747D; margin: 0 0 6px 0; font-family: monospace;">
                TRAJETTA • SISTEMA PESSOAL DE EVOLUÇÃO • DISCIPLINA SUSTENTÁVEL
              </p>
              <p style="font-size: 10px; color: #50565E; margin: 0; line-height: 1.5;">
                Você recebeu este e-mail porque reservou sua vaga na Lista VIP em <a href="https://trajettacompany.com.br" style="color: #8E9499; text-decoration: underline;">trajettacompany.com.br</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderWeeklyReviewEmail(data: {
  userName: string;
  weekNumber: number;
  streakWeeks: number;
  reflection: string;
}): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Fechamento da Semana ${data.weekNumber} — Trajetta</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 480px) {
      .email-wrap { padding: 10px 6px !important; }
      .email-container { width: 100% !important; max-width: 100% !important; border-radius: 14px !important; }
      .email-pad { padding: 22px 18px !important; }
      .header-pad { padding: 20px 18px 16px 18px !important; }
      .banner-img { max-height: 110px !important; height: auto !important; }
      .cta-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 15px 16px !important; text-align: center !important; font-size: 13px !important; }
      .mobile-title { font-size: 21px !important; line-height: 1.25 !important; }
      .review-box { padding: 18px 16px !important; }
      .badge-tag { font-size: 9px !important; padding: 3px 8px !important; }
    }
    @media only screen and (max-width: 360px) {
      .email-wrap { padding: 4px 2px !important; }
      .email-pad { padding: 18px 12px !important; }
      .header-pad { padding: 14px 12px 12px 12px !important; }
      .mobile-title { font-size: 19px !important; line-height: 1.25 !important; }
      .cta-btn { padding: 14px 10px !important; font-size: 12.5px !important; }
      .review-box { padding: 14px 12px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #060709; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F2F1ED; -webkit-font-smoothing: antialiased;">
  <table class="email-wrap" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #060709; padding: 32px 12px 50px 12px;">
    <tr>
      <td align="center">
        <table class="email-container" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #0B0E14; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 35px 80px rgba(0,0,0,0.85);">
          
          <!-- Banner Atmosférico Editorial de Fundo com Scrim Suave -->
          <tr>
            <td style="padding: 0; background-color: #080A0F; border-bottom: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <a href="https://trajettacompany.com.br" target="_blank" style="text-decoration: none; display: block;">
                <img class="banner-img" src="https://trajettacompany.com.br/trajetta-email-banner.jpg" alt="Trajetta" width="600" style="display: block; width: 100%; max-height: 160px; object-fit: cover; opacity: 0.88;" />
              </a>
            </td>
          </tr>

          <!-- Cabeçalho com Logo Oficial -->
          <tr>
            <td class="header-pad" style="padding: 30px 36px 22px 36px; background-color: #0B0E14; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 12px;">
                          <a href="https://trajettacompany.com.br" target="_blank" style="text-decoration: none; display: inline-block;">
                            <img src="https://trajettacompany.com.br/trajetta-logo-white.png" alt="Trajetta" width="34" height="34" style="display: block; border-radius: 8px;" />
                          </a>
                        </td>
                        <td style="vertical-align: middle;">
                          <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.6px; color: #FFFFFF; display: block; line-height: 1;">trajetta</span>
                          <span style="font-size: 10px; font-family: monospace; letter-spacing: 1.5px; text-transform: uppercase; color: #8E9499; display: block; margin-top: 4px;">DOMINGO DE REFLEXÃO</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span class="badge-tag" style="display: inline-block; background-color: rgba(184, 255, 0, 0.12); border: 1px solid rgba(184, 255, 0, 0.35); color: #B8FF00; font-family: monospace; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 5px 12px; border-radius: 100px; white-space: nowrap;">
                      SEMANA ${data.weekNumber}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td class="email-pad" style="padding: 36px 36px 32px 36px;">
              <h1 class="mobile-title" style="font-size: 24px; font-weight: 700; line-height: 1.3; margin: 0 0 10px 0; color: #FFFFFF; letter-spacing: -0.5px;">
                Semana ${data.weekNumber} Concluída, ${data.userName}.
              </h1>
              <p style="font-size: 13px; color: #8E9499; margin: 0 0 24px 0; font-family: monospace;">
                ✦ ${data.streakWeeks} semanas consecutivas registradas na sua North Star de 2026.
              </p>

              <div class="review-box" style="background-color: #12151B; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 24px; margin-bottom: 28px; box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);">
                <div style="font-size: 11px; font-weight: 700; color: #B8FF00; text-transform: uppercase; letter-spacing: 1.5px; font-family: monospace; margin-bottom: 12px;">
                  REFLEXÃO DA TRAJETTA AI
                </div>
                <p style="font-size: 15px; line-height: 1.7; color: #F2F1ED; margin: 0; font-style: italic;">
                  “${data.reflection}”
                </p>
              </div>

              <!-- Botão Principal -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 12px;">
                <tr>
                  <td align="center">
                    <a class="cta-btn" href="https://trajettacompany.com.br/app" target="_blank" style="display: block; width: 100%; box-sizing: border-box; background-color: #B8FF00; color: #080A0D; font-size: 13px; font-weight: 800; letter-spacing: 0.3px; text-decoration: none; padding: 16px 32px; border-radius: 12px; text-align: center; box-shadow: 0 8px 24px rgba(184, 255, 0, 0.28);">
                      Ver Cartão da Minha Semana →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td class="email-pad" style="padding: 24px 36px; background-color: #080A0E; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="font-size: 11px; color: #6D747D; margin: 0; font-family: monospace;">
                Trajetta • Disciplina serena, sustentável e sem punição.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderProWelcomeEmail(data: {
  userName: string;
  email: string;
  temporaryPassword?: string;
  planName?: string;
  isNewUser?: boolean;
}): string {
  const planDisplay = data.planName === 'pro_monthly' ? 'Trajetta Pro Mensal' : data.planName === 'founding' ? 'Trajetta Membro Fundador' : 'Trajetta Pro Anual';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Seu Acesso ao Trajetta Pro foi Liberado!</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 480px) {
      .email-wrap { padding: 10px 6px !important; }
      .email-container { width: 100% !important; max-width: 100% !important; border-radius: 14px !important; }
      .email-pad { padding: 22px 18px !important; }
      .header-pad { padding: 20px 18px 16px 18px !important; }
      .banner-img { max-height: 110px !important; height: auto !important; }
      .creds-box { padding: 16px 14px !important; }
      .cta-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 16px 18px !important; font-size: 13px !important; }
      .mobile-title { font-size: 21px !important; line-height: 1.25 !important; }
      .stack-row td { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 2px 0 !important; }
      .badge-tag { font-size: 9px !important; padding: 3px 8px !important; }
    }
    @media only screen and (max-width: 360px) {
      .email-wrap { padding: 4px 2px !important; }
      .email-pad { padding: 18px 12px !important; }
      .header-pad { padding: 14px 12px 12px 12px !important; }
      .mobile-title { font-size: 19px !important; line-height: 1.25 !important; }
      .creds-box { padding: 14px 10px !important; }
      .cta-btn { padding: 14px 10px !important; font-size: 12.5px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #060709; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F2F1ED; -webkit-font-smoothing: antialiased;">
  <table class="email-wrap" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #060709; padding: 32px 12px 40px 12px;">
    <tr>
      <td align="center">
        <table class="email-container" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #0B0E14; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 35px 80px rgba(0,0,0,0.85);">
          
          <!-- Banner Atmosférico Editorial de Fundo com Scrim Suave -->
          <tr>
            <td style="padding: 0; background-color: #080A0F; border-bottom: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <a href="https://trajettacompany.com.br" target="_blank" style="text-decoration: none; display: block;">
                <img class="banner-img" src="https://trajettacompany.com.br/trajetta-email-banner.jpg" alt="Trajetta" width="600" style="display: block; width: 100%; max-height: 150px; object-fit: cover; opacity: 0.88;" />
              </a>
            </td>
          </tr>

          <!-- Cabeçalho -->
          <tr>
            <td class="header-pad" style="padding: 26px 36px 20px 36px; background-color: #0B0E14; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 12px;">
                          <a href="https://trajettacompany.com.br" target="_blank" style="text-decoration: none; display: inline-block;">
                            <img src="https://trajettacompany.com.br/trajetta-logo-white.png" alt="Trajetta" width="32" height="32" style="display: block; border-radius: 8px;" />
                          </a>
                        </td>
                        <td style="vertical-align: middle;">
                          <span style="font-size: 19px; font-weight: 800; letter-spacing: -0.6px; color: #FFFFFF; display: block; line-height: 1;">trajetta</span>
                          <span style="font-size: 9px; font-family: monospace; letter-spacing: 1.5px; text-transform: uppercase; color: #8E9499; display: block; margin-top: 3px;">SISTEMA DE EVOLUÇÃO</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span class="badge-tag" style="display: inline-block; background-color: rgba(184, 255, 0, 0.15); border: 1px solid rgba(184, 255, 0, 0.4); color: #B8FF00; font-family: monospace; font-size: 10px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; padding: 5px 12px; border-radius: 100px; white-space: nowrap;">
                      ● PRO ATIVO
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Corpo -->
          <tr>
            <td class="email-pad" style="padding: 36px 36px 28px 36px;">
              <h1 class="mobile-title" style="font-size: 24px; font-weight: 800; line-height: 1.25; margin: 0 0 14px 0; color: #FFFFFF; letter-spacing: -0.6px;">
                Seu acesso ao Trajetta Pro está confirmado, <span style="color: #B8FF00;">${data.userName}</span>.
              </h1>
              <p style="font-size: 14px; line-height: 1.65; color: #BAC2CC; margin: 0 0 24px 0;">
                Obrigado por confiar na Trajetta como seu sistema de vida. Seu plano <strong>${planDisplay}</strong> foi ativado com sucesso e você já possui acesso imediato e irrestrito.
              </p>

              <!-- Bloco de Credenciais / Acesso -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 0 28px 0; background: linear-gradient(145deg, #13171F 0%, #0B0E13 100%); border: 1.5px solid rgba(184, 255, 0, 0.35); border-radius: 14px; overflow: hidden;">
                <tr>
                  <td class="creds-box" style="padding: 22px 26px;">
                    <div style="font-size: 10px; font-family: monospace; color: #B8FF00; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 700; margin-bottom: 12px;">
                      SEUS DADOS DE ACESSO
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px;">
                      <tr class="stack-row">
                        <td style="color: #8E9499; padding: 4px 0; width: 120px;">E-mail:</td>
                        <td style="color: #FFFFFF; font-weight: 600; font-family: monospace; word-break: break-all;">${data.email}</td>
                      </tr>
                      ${
                        data.temporaryPassword
                          ? `<tr class="stack-row">
                              <td style="color: #8E9499; padding: 4px 0;">Senha Temporária:</td>
                              <td style="color: #B8FF00; font-weight: 700; font-family: monospace; letter-spacing: 0.5px;">${data.temporaryPassword}</td>
                            </tr>`
                          : `<tr class="stack-row">
                              <td style="color: #8E9499; padding: 4px 0;">Senha:</td>
                              <td style="color: #C9CDD1;">A mesma que você definiu no cadastro</td>
                            </tr>`
                      }
                      <tr class="stack-row">
                        <td style="color: #8E9499; padding: 4px 0;">Status do Plano:</td>
                        <td style="color: #58D6A7; font-weight: 700;">Ativo e Liberado ✓</td>
                      </tr>
                    </table>
                    ${
                      data.temporaryPassword
                        ? `<p style="font-size: 11px; color: #8E9499; margin: 12px 0 0 0; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;">
                            Dica: Você pode alterar sua senha a qualquer momento nas configurações do seu perfil.
                          </p>`
                        : ''
                    }
                  </td>
                </tr>
              </table>

              <!-- Botão Principal de Ação -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <a class="cta-btn" href="https://trajettacompany.com.br/app" style="display: block; width: 100%; box-sizing: border-box; background-color: #B8FF00; color: #060709; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; font-weight: 800; letter-spacing: 0.3px; text-transform: uppercase; text-decoration: none; padding: 16px 24px; border-radius: 12px; text-align: center; box-shadow: 0 10px 25px rgba(184,255,0,0.35);">
                      ACESSAR MEU PAINEL PRO AGORA →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- O Que Você Pode Fazer Agora -->
              <h2 style="font-size: 12px; font-family: monospace; text-transform: uppercase; letter-spacing: 1.5px; color: #8E9499; margin: 0 0 14px 0;">
                SEU AMBIENTE DE EVOLUÇÃO
              </h2>
              <div style="background-color: #12151B; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 18px; margin-bottom: 24px; font-size: 13px; line-height: 1.6; color: #C9CDD1;">
                <p style="margin: 0 0 8px 0;">✦ <strong>4 Áreas da Vida:</strong> Estruture Corpo, Dinheiro, Carreira e Vida Pessoal com clareza matemática.</p>
                <p style="margin: 0 0 8px 0;">✦ <strong>Piso Mínimo & Volume Acumulado:</strong> Dias difíceis não quebram sua evolução; o que importa é a consistência sustentável.</p>
                <p style="margin: 0 0 8px 0;">✦ <strong>Trajetta IA com Memória Longitudinal:</strong> Seu estrategista pessoal que evolui com seu histórico semanal.</p>
                <p style="margin: 0;">✦ <strong>Instale o Aplicativo:</strong> No iPhone ou Android, adicione o Trajetta à tela de início para acesso rápido diário.</p>
              </div>

              <!-- Garantia & Governança CDC -->
              <div style="background-color: #0A0D11; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 16px; margin-bottom: 12px;">
                <div style="font-size: 11px; font-weight: 700; color: #F2F1ED; margin-bottom: 4px;">Transparência & Cancelamento em 1 Clique</div>
                <p style="font-size: 11px; color: #8E9499; margin: 0; line-height: 1.5;">
                  Você tem garantia incondicional de 7 dias conforme o Código de Defesa do Consumidor. Pode gerenciar faturas ou cancelar sua renovação a qualquer momento diretamente no seu painel em <em>Configurações > Cancelamento em 1 clique</em>.
                </p>
              </div>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td class="email-pad" style="padding: 24px 36px; background-color: #080A0D; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <p style="font-size: 11px; color: #6D747D; margin: 0 0 8px 0; font-family: monospace;">
                TRAJETTA • DISCIPLINA SUSTENTÁVEL • CONTATO: companytrajetta@gmail.com
              </p>
              <p style="font-size: 11px; color: #50565E; margin: 0; line-height: 1.5;">
                Você está recebendo este e-mail pela confirmação do plano ${planDisplay} em <a href="https://trajettacompany.com.br" style="color: #8E9499; text-decoration: underline;">trajettacompany.com.br</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderNewsletterWelcomeEmail(email: string): string {
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Bem-vindo à Trajetta • 3 Dias de Degustação Gratuita</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 480px) {
      .email-wrap { padding: 10px 6px !important; }
      .email-container { width: 100% !important; max-width: 100% !important; border-radius: 14px !important; }
      .email-content { padding: 22px 18px !important; }
      .header-pad { padding: 18px 18px 16px 18px !important; }
      .banner-img { max-height: 110px !important; height: auto !important; }
      .gift-box { padding: 18px 16px !important; }
      .cta-button { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 16px 18px !important; font-size: 13px !important; text-align: center !important; }
      .mobile-title { font-size: 21px !important; line-height: 1.25 !important; }
      .badge-tag { font-size: 9px !important; padding: 3px 8px !important; }
    }
    @media only screen and (max-width: 360px) {
      .email-wrap { padding: 4px 2px !important; }
      .email-content { padding: 18px 12px !important; }
      .header-pad { padding: 14px 12px 12px 12px !important; }
      .mobile-title { font-size: 19px !important; line-height: 1.25 !important; }
      .gift-box { padding: 14px 10px !important; }
      .cta-button { padding: 14px 10px !important; font-size: 12.5px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #060709; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #F2F1ED; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;">
  <table class="email-wrap" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #060709; padding: 28px 10px 40px 10px;">
    <tr>
      <td align="center">
        <!-- Container Master com Borda de Alta Precisão -->
        <table class="email-container" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 580px; background-color: #0B0E14; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 35px 80px rgba(0, 0, 0, 0.85);">
          
          <!-- Banner Atmosférico Editorial de Fundo com Scrim Suave -->
          <tr>
            <td style="padding: 0; position: relative; background-color: #080A0F; border-bottom: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <a href="https://trajettacompany.com.br" target="_blank" style="text-decoration: none; display: block;">
                <img class="banner-img" src="https://trajettacompany.com.br/trajetta-email-banner.jpg" alt="Trajetta" width="580" style="display: block; width: 100%; max-height: 150px; object-fit: cover; opacity: 0.88;" />
              </a>
            </td>
          </tr>

          <!-- Cabeçalho de Marca com o Logo Oficial -->
          <tr>
            <td class="header-pad" style="padding: 30px 36px 22px 36px; background-color: #0B0E14; border-bottom: 1px solid rgba(255, 255, 255, 0.05);">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 12px;">
                          <a href="https://trajettacompany.com.br" target="_blank" style="text-decoration: none; display: inline-block;">
                            <img src="https://trajettacompany.com.br/trajetta-logo-white.png" alt="Trajetta Logo" width="34" height="34" style="display: block; border-radius: 8px;" />
                          </a>
                        </td>
                        <td style="vertical-align: middle;">
                          <span style="font-size: 21px; font-weight: 800; letter-spacing: -0.6px; color: #FFFFFF; display: block; line-height: 1.1;">trajetta</span>
                          <span style="font-size: 10px; font-family: -apple-system, BlinkMacSystemFont, monospace; letter-spacing: 1.6px; text-transform: uppercase; color: #7E8590; display: block; margin-top: 4px;">SISTEMA DE EVOLUÇÃO</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span class="badge-tag" style="display: inline-block; background-color: rgba(184, 255, 0, 0.08); border: 1px solid rgba(184, 255, 0, 0.28); color: #B8FF00; font-family: -apple-system, BlinkMacSystemFont, monospace; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 5px 12px; border-radius: 9999px; white-space: nowrap;">
                      ● 3 DIAS GRÁTIS
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Conteúdo Principal Escrito em Tom Humano e Direto -->
          <tr>
            <td class="email-content" style="padding: 36px 36px 32px 36px;">
              <h1 class="mobile-title" style="font-size: 24px; font-weight: 700; line-height: 1.3; margin: 0 0 16px 0; color: #FFFFFF; letter-spacing: -0.5px;">
                Que bom ter você aqui.
              </h1>
              
              <p style="font-size: 15px; line-height: 1.7; color: #BAC2CC; margin: 0 0 20px 0;">
                Obrigado por acompanhar a Trajetta. A maioria dos métodos de produtividade falha porque tenta transformar seres humanos em máquinas — punindo qualquer dia difícil com números zerados e frustração acumulada.
              </p>

              <p style="font-size: 15px; line-height: 1.7; color: #BAC2CC; margin: 0 0 28px 0;">
                Construímos a Trajetta sobre o princípio oposto: <strong>disciplina serena, piso mínimo inegociável e inteligência com memória viva</strong> para sustentar o seu crescimento nas 4 áreas essenciais: Corpo, Dinheiro, Carreira e Vida Pessoal.
              </p>

              <!-- Bloco Exclusivo do Presente: 3 Dias de Degustação -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 0 32px 0; background: linear-gradient(145deg, #121620 0%, #0E1219 100%); border: 1px solid rgba(184, 255, 0, 0.3); border-radius: 14px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.5);">
                <tr>
                  <td class="gift-box" style="padding: 24px 26px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="left">
                          <span style="font-size: 11px; font-family: monospace; color: #B8FF00; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 700;">✦ SEU PRESENTE DE BOAS-VINDAS</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-top: 10px; padding-bottom: 8px;">
                          <div style="font-size: 18px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px; line-height: 1.3;">
                            3 Dias de Degustação Gratuita no Trajetta Pro
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <p style="font-size: 13px; line-height: 1.6; color: #9AA3AF; margin: 0 0 16px 0;">
                            Liberamos o acesso total para você experimentar na prática: configure sua estrela-guia, converse com a Trajetta AI e organize sua semana sem pagar nada hoje.
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td align="left">
                          <span style="display: inline-block; font-size: 12px; color: #58D6A7; font-weight: 600;">
                            ✓ R$ 0,00 cobrado hoje • Cancele com 1 clique quando quiser
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Botão Principal com Design Sofisticado -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 30px;">
                <tr>
                  <td align="center">
                    <a class="cta-button" href="https://trajettacompany.com.br/#planos" target="_blank" style="display: inline-block; background-color: #B8FF00; color: #080A0D; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 800; letter-spacing: 0.3px; text-decoration: none; padding: 16px 36px; border-radius: 12px; text-align: center; box-shadow: 0 8px 24px rgba(184, 255, 0, 0.28);">
                      Começar Meus 3 Dias Grátis →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; line-height: 1.6; color: #767E8A; margin: 0; text-align: center;">
                Sem pegadinhas ou fidelidade. Se o sistema não fizer sentido para a sua rotina, cancele com um único clique direto no painel.
              </p>
            </td>
          </tr>

          <!-- Rodapé Sóbrio & Transparente -->
          <tr>
            <td style="padding: 26px 36px; background-color: #080A0E; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 12px;">
                <tr>
                  <td align="center">
                    <img src="https://trajettacompany.com.br/trajetta-logo-white.png" alt="Trajetta" width="22" height="22" style="display: inline-block; vertical-align: middle; opacity: 0.7;" />
                    <span style="font-size: 12px; font-weight: 700; color: #8C949E; margin-left: 8px; vertical-align: middle; letter-spacing: -0.2px;">trajetta</span>
                  </td>
                </tr>
              </table>
              <p style="font-size: 11px; color: #5B626C; margin: 0 0 6px 0; line-height: 1.5;">
                Trajetta • Sistema Pessoal de Evolução Sustentável • São Paulo, SP
              </p>
              <p style="font-size: 11px; color: #4B525B; margin: 0; line-height: 1.5;">
                Você recebeu esta mensagem porque cadastrou seu e-mail no rodapé de <a href="https://trajettacompany.com.br" target="_blank" style="color: #7E8691; text-decoration: underline;">trajettacompany.com.br</a>.<br>
                Contato direto: <a href="mailto:companytrajetta@gmail.com" style="color: #7E8691; text-decoration: underline;">companytrajetta@gmail.com</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderTrialWelcomeEmail(data: {
  userName: string;
  email: string;
}): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Bem-vindo à Trajetta — Sua Conta foi Criada com Sucesso</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 480px) {
      .email-wrap { padding: 10px 6px !important; }
      .email-container { width: 100% !important; max-width: 100% !important; border-radius: 14px !important; }
      .email-pad { padding: 22px 18px !important; }
      .header-pad { padding: 20px 18px 16px 18px !important; }
      .banner-img { max-height: 110px !important; height: auto !important; }
      .creds-box { padding: 16px 14px !important; }
      .cta-btn { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 16px 18px !important; font-size: 13px !important; text-align: center !important; }
      .mobile-title { font-size: 21px !important; line-height: 1.25 !important; }
      .stack-row td { display: block !important; width: 100% !important; box-sizing: border-box !important; padding: 2px 0 !important; }
      .badge-tag { font-size: 9px !important; padding: 3px 8px !important; }
    }
    @media only screen and (max-width: 360px) {
      .email-wrap { padding: 4px 2px !important; }
      .email-pad { padding: 18px 12px !important; }
      .header-pad { padding: 14px 12px 12px 12px !important; }
      .mobile-title { font-size: 19px !important; line-height: 1.25 !important; }
      .creds-box { padding: 14px 10px !important; }
      .cta-btn { padding: 14px 10px !important; font-size: 12.5px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #060709; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F2F1ED; -webkit-font-smoothing: antialiased;">
  <table class="email-wrap" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #060709; padding: 32px 12px 40px 12px;">
    <tr>
      <td align="center">
        <table class="email-container" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #0B0E14; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 35px 80px rgba(0,0,0,0.85);">
          
          <!-- Banner Atmosférico Editorial de Fundo com Scrim Suave -->
          <tr>
            <td style="padding: 0; background-color: #080A0F; border-bottom: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <a href="https://trajettacompany.com.br" target="_blank" style="text-decoration: none; display: block;">
                <img class="banner-img" src="https://trajettacompany.com.br/trajetta-email-banner.jpg" alt="Trajetta" width="600" style="display: block; width: 100%; max-height: 150px; object-fit: cover; opacity: 0.88;" />
              </a>
            </td>
          </tr>

          <!-- Cabeçalho -->
          <tr>
            <td class="header-pad" style="padding: 26px 36px 20px 36px; background-color: #0B0E14; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 12px;">
                          <a href="https://trajettacompany.com.br" target="_blank" style="text-decoration: none; display: inline-block;">
                            <img src="https://trajettacompany.com.br/trajetta-logo-white.png" alt="Trajetta" width="32" height="32" style="display: block; border-radius: 8px;" />
                          </a>
                        </td>
                        <td style="vertical-align: middle;">
                          <span style="font-size: 19px; font-weight: 800; letter-spacing: -0.6px; color: #FFFFFF; display: block; line-height: 1;">trajetta</span>
                          <span style="font-size: 9px; font-family: monospace; letter-spacing: 1.5px; text-transform: uppercase; color: #8E9499; display: block; margin-top: 3px;">SISTEMA DE EVOLUÇÃO</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span class="badge-tag" style="display: inline-block; background-color: rgba(184, 255, 0, 0.15); border: 1px solid rgba(184, 255, 0, 0.4); color: #B8FF00; font-family: monospace; font-size: 10px; font-weight: 800; letter-spacing: 0.8px; text-transform: uppercase; padding: 5px 12px; border-radius: 100px; white-space: nowrap;">
                      ● CONTA ATIVA
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Corpo -->
          <tr>
            <td class="email-pad" style="padding: 36px 36px 28px 36px;">
              <h1 class="mobile-title" style="font-size: 24px; font-weight: 800; line-height: 1.25; margin: 0 0 14px 0; color: #FFFFFF; letter-spacing: -0.6px;">
                Sua conta está criada, <span style="color: #B8FF00;">${data.userName}</span>.
              </h1>
              <p style="font-size: 14px; line-height: 1.65; color: #BAC2CC; margin: 0 0 24px 0;">
                Seu ambiente na Trajetta já está liberado. Você tem acesso para estruturar suas metas nas 4 Áreas da Vida, fixar hábitos sustentáveis com Piso Mínimo e experimentar o motor de inteligência artificial da Trajetta.
              </p>

              <!-- Dados de Acesso -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 0 28px 0; background: linear-gradient(145deg, #13171F 0%, #0B0E13 100%); border: 1.5px solid rgba(184, 255, 0, 0.35); border-radius: 14px; overflow: hidden;">
                <tr>
                  <td class="creds-box" style="padding: 22px 26px;">
                    <div style="font-size: 10px; font-family: monospace; color: #B8FF00; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 700; margin-bottom: 12px;">
                      SEUS DADOS DE ACESSO
                    </div>
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px;">
                      <tr class="stack-row">
                        <td style="color: #8E9499; padding: 4px 0; width: 120px;">E-mail:</td>
                        <td style="color: #FFFFFF; font-weight: 600; font-family: monospace; word-break: break-all;">${data.email}</td>
                      </tr>
                      <tr class="stack-row">
                        <td style="color: #8E9499; padding: 4px 0;">Status:</td>
                        <td style="color: #58D6A7; font-weight: 700;">Conta Criada & Acesso Liberado ✓</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Botão Principal -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 28px;">
                <tr>
                  <td align="center">
                    <a class="cta-btn" href="https://trajettacompany.com.br/app" style="display: block; width: 100%; box-sizing: border-box; background-color: #B8FF00; color: #060709; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 14px; font-weight: 900; letter-spacing: 0.3px; text-transform: uppercase; text-decoration: none; padding: 16px 24px; border-radius: 12px; text-align: center; box-shadow: 0 10px 25px rgba(184,255,0,0.35);">
                      ACESSAR MEU PAINEL AGORA →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- 3 Passos Iniciais Recomendados -->
              <h2 style="font-size: 11px; font-family: monospace; text-transform: uppercase; letter-spacing: 1.5px; color: #8E9499; margin: 0 0 14px 0;">
                PRIMEIROS PASSOS SUGERIDOS
              </h2>
              <div style="background-color: #12151B; border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 18px; margin-bottom: 24px; font-size: 13px; line-height: 1.6; color: #C9CDD1;">
                <p style="margin: 0 0 8px 0;">1. <strong>Defina sua Estrela-Guia:</strong> Escolha 1 foco para os próximos 90 dias.</p>
                <p style="margin: 0 0 8px 0;">2. <strong>Fixe seu Piso Mínimo:</strong> O menor esforço inegociável nos dias difíceis (ex: 15 min de caminhada ou leitura).</p>
                <p style="margin: 0;">3. <strong>Abra a Trajetta AI:</strong> Peça uma análise inicial da sua semana no chat integrado.</p>
              </div>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td class="email-pad" style="padding: 24px 36px; background-color: #080A0E; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="font-size: 11px; color: #6D747D; margin: 0 0 6px 0; font-family: monospace;">
                TRAJETTA • SISTEMA PESSOAL DE EVOLUÇÃO • CONTATO: companytrajetta@gmail.com
              </p>
              <p style="font-size: 10px; color: #50565E; margin: 0; line-height: 1.5;">
                Você está recebendo este e-mail pela criação da sua conta em <a href="https://trajettacompany.com.br" style="color: #8E9499; text-decoration: underline;">trajettacompany.com.br</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderSubscriptionCancellationEmail(data: {
  userName: string;
  accessUntilFormatted: string;
}): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
  <title>Confirmação de Cancelamento de Renovação — Trajetta</title>
  <style>
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    @media only screen and (max-width: 480px) {
      .email-wrap { padding: 10px 6px !important; }
      .email-container { width: 100% !important; max-width: 100% !important; border-radius: 14px !important; }
      .email-pad { padding: 22px 18px !important; }
      .header-pad { padding: 20px 18px 16px 18px !important; }
      .banner-img { max-height: 110px !important; height: auto !important; }
      .mobile-title { font-size: 21px !important; line-height: 1.25 !important; }
      .badge-tag { font-size: 9px !important; padding: 3px 8px !important; }
    }
    @media only screen and (max-width: 360px) {
      .email-wrap { padding: 4px 2px !important; }
      .email-pad { padding: 18px 12px !important; }
      .header-pad { padding: 14px 12px 12px 12px !important; }
      .mobile-title { font-size: 19px !important; line-height: 1.25 !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #060709; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F2F1ED; -webkit-font-smoothing: antialiased;">
  <table class="email-wrap" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #060709; padding: 32px 12px 40px 12px;">
    <tr>
      <td align="center">
        <table class="email-container" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 600px; background-color: #0B0E14; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; overflow: hidden; box-shadow: 0 35px 80px rgba(0,0,0,0.85);">
          
          <!-- Banner Atmosférico Editorial de Fundo com Scrim Suave -->
          <tr>
            <td style="padding: 0; background-color: #080A0F; border-bottom: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <a href="https://trajettacompany.com.br" target="_blank" style="text-decoration: none; display: block;">
                <img class="banner-img" src="https://trajettacompany.com.br/trajetta-email-banner.jpg" alt="Trajetta" width="600" style="display: block; width: 100%; max-height: 150px; object-fit: cover; opacity: 0.88;" />
              </a>
            </td>
          </tr>

          <!-- Cabeçalho com Logo Oficial -->
          <tr>
            <td class="header-pad" style="padding: 26px 36px 20px 36px; background-color: #0B0E14; border-bottom: 1px solid rgba(255, 255, 255, 0.06);">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td style="vertical-align: middle; padding-right: 12px;">
                          <a href="https://trajettacompany.com.br" target="_blank" style="text-decoration: none; display: inline-block;">
                            <img src="https://trajettacompany.com.br/trajetta-logo-white.png" alt="Trajetta" width="32" height="32" style="display: block; border-radius: 8px;" />
                          </a>
                        </td>
                        <td style="vertical-align: middle;">
                          <span style="font-size: 19px; font-weight: 800; letter-spacing: -0.6px; color: #FFFFFF; display: block; line-height: 1;">trajetta</span>
                          <span style="font-size: 9px; font-family: monospace; letter-spacing: 1.5px; text-transform: uppercase; color: #8E9499; display: block; margin-top: 3px;">TRANSPARÊNCIA TOTAL</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.2); color: #C9CDD1; font-family: monospace; font-size: 10px; font-weight: 700; letter-spacing: 0.8px; text-transform: uppercase; padding: 4px 10px; border-radius: 100px; white-space: nowrap;">
                      RENOVAÇÃO CANCELADA
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Conteúdo -->
          <tr>
            <td class="email-pad" style="padding: 36px 36px 28px 36px;">
              <h1 class="mobile-title" style="font-size: 24px; font-weight: 700; line-height: 1.3; margin: 0 0 14px 0; color: #FFFFFF; letter-spacing: -0.5px;">
                Cancelamento confirmado, ${data.userName}.
              </h1>
              
              <p style="font-size: 14px; line-height: 1.7; color: #BAC2CC; margin: 0 0 24px 0;">
                Confirmamos o cancelamento da renovação automática da sua assinatura no Trajetta. Como prezamos pela serenidade e pelo respeito absoluto aos nossos membros, não haverá qualquer cobrança futura.
              </p>

              <!-- Box Acesso Vigente -->
              <div style="background-color: #12151B; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 18px; margin-bottom: 24px;">
                <div style="font-size: 10px; font-family: monospace; color: #B8FF00; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
                  ✦ PERÍODO JÁ CONTRATADO PRESERVADO
                </div>
                <p style="font-size: 13px; line-height: 1.6; color: #F2F1ED; margin: 0;">
                  Seu acesso continuará ativo normalmente até <strong>${data.accessUntilFormatted}</strong>. Seus dados, histórico semanal e reflexões ficarão salvos caso decida retornar futuramente.
                </p>
              </div>

              <p style="font-size: 12px; color: #8E9499; margin: 0 0 16px 0; line-height: 1.5;">
                Se precisar de qualquer assistência ou quiser nos contar como podemos melhorar, responda diretamente a este e-mail.
              </p>
            </td>
          </tr>

          <!-- Rodapé -->
          <tr>
            <td class="email-pad" style="padding: 24px 36px; background-color: #080A0E; border-top: 1px solid rgba(255, 255, 255, 0.05); text-align: center;">
              <p style="font-size: 11px; color: #6D747D; margin: 0 0 6px 0; font-family: monospace;">
                TRAJETTA • DISCIPLINA SUSTENTÁVEL • CONTATO: companytrajetta@gmail.com
              </p>
              <p style="font-size: 10px; color: #50565E; margin: 0; line-height: 1.4;">
                Este e-mail é um comprovante oficial do cancelamento de cobranças futuras da sua conta Trajetta.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

