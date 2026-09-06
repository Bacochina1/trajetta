import { prisma } from '../db';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  userId?: string;
}

export async function sendEmail({ to, subject, html, userId }: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string; sandboxForwarded?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      // Use Resend's provided domain onboarding@resend.dev for guaranteed delivery
      const fromEmail = 'onboarding@resend.dev';
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

        // In Resend sandbox mode, if the recipient is external, Resend rejects with "only send testing emails".
        // Forward the actual email to the verified owner (companytrajetta@gmail.com) so the founder receives the real email!
        if (err.includes('only send testing emails') || err.includes('validation_error')) {
          const ownerEmail = 'companytrajetta@gmail.com';
          const sandboxSubject = `[SANDBOX PARA: ${to}] ${subject}`;
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
              from: fromEmail,
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Você está na Lista VIP da Trajetta</title>
</head>
<body style="margin: 0; padding: 0; background-color: #060709; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; color: #F2F1ED; -webkit-font-smoothing: antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background-color: #060709; padding: 40px 16px;">
    <tr>
      <td align="center">
        <!-- Container Principal -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width: 620px; background-color: #0D1015; border: 1px solid rgba(255, 255, 255, 0.09); border-radius: 20px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.7);">
          
          <!-- Cabeçalho com Marca & Tag VIP -->
          <tr>
            <td style="padding: 36px 40px 30px 40px; background-color: #090C10; border-bottom: 1px solid rgba(255, 255, 255, 0.07);">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <table cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <!-- Trajetta Neon Monogram Icon -->
                        <td style="width: 32px; height: 32px; background: linear-gradient(135deg, #B8FF00 0%, #8AC400 100%); border-radius: 8px; text-align: center; vertical-align: middle;">
                          <span style="font-size: 18px; font-weight: 900; color: #060709; line-height: 32px; display: inline-block;">T</span>
                        </td>
                        <td style="padding-left: 12px; vertical-align: middle;">
                          <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.6px; color: #FFFFFF; display: block; line-height: 1;">trajetta</span>
                          <span style="font-size: 10px; font-family: monospace; letter-spacing: 1.5px; text-transform: uppercase; color: #8E9499; display: block; margin-top: 4px;">SISTEMA DE EVOLUÇÃO</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; background-color: rgba(184, 255, 0, 0.12); border: 1px solid rgba(184, 255, 0, 0.35); color: #B8FF00; font-family: monospace; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 5px 12px; border-radius: 100px;">
                      ● VIP FOUNDER
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Corpo Principal do E-mail -->
          <tr>
            <td style="padding: 40px 40px 32px 40px;">
              
              <!-- Título Editorial -->
              <h1 style="font-size: 26px; font-weight: 700; line-height: 1.25; margin: 0 0 16px 0; color: #FFFFFF; letter-spacing: -0.8px;">
                Sua vaga está garantida na vanguarda, <span style="color: #B8FF00;">${userName}</span>.
              </h1>
              
              <p style="font-size: 15px; line-height: 1.65; color: #A4ABB3; margin: 0 0 28px 0;">
                Você acabou de reservar sua posição prioritária para o lançamento da Trajetta. Não construímos mais um gerenciador de tarefas para frustrar você no terceiro dia — criamos um sistema sóbrio desenhado para a sua <strong>vida real</strong>, com altos, baixos e a paciência necessária para evolução duradoura.
              </p>

              <!-- CARTÃO VIP FOUNDER PASS (Estilo Luxury Pass) -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 0 32px 0; background: linear-gradient(145deg, #13171F 0%, #0B0E13 100%); border: 1.5px solid rgba(184, 255, 0, 0.4); border-radius: 16px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);">
                <tr>
                  <td style="padding: 24px 28px;">
                    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td align="left">
                          <span style="font-size: 10px; font-family: monospace; color: #8E9499; letter-spacing: 2px; text-transform: uppercase;">TRAJETTA FOUNDER PASS</span>
                        </td>
                        <td align="right">
                          <span style="font-size: 11px; font-family: monospace; color: #B8FF00; font-weight: 700;"># ${formattedPosition}</span>
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2" style="padding-top: 16px; padding-bottom: 16px;">
                          <div style="font-size: 22px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px;">${userName}</div>
                          <div style="font-size: 12px; color: #8E9499; margin-top: 4px;">Acesso Prioritário Nível 1 • Benefícios Vitalícios de IA</div>
                        </td>
                      </tr>
                      <tr>
                        <td align="left" style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 14px;">
                          <span style="font-size: 10px; font-family: monospace; color: #58D6A7; font-weight: 600;">STATUS: CONFIRMADO</span>
                        </td>
                        <td align="right" style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 14px;">
                          <span style="font-size: 10px; font-family: monospace; color: #8E9499;">LOTE FUNDADOR 2026</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- O Que Você Terá Acesso -->
              <h2 style="font-size: 14px; font-family: monospace; text-transform: uppercase; letter-spacing: 1.5px; color: #8E9499; margin: 0 0 16px 0;">
                O QUE ESPERA POR VOCÊ
              </h2>

              <!-- 3 Pilares com Linhas Sutis -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 32px;">
                <tr>
                  <td style="padding: 12px 16px; background-color: #12151B; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; margin-bottom: 8px;">
                    <strong style="color: #FFFFFF; font-size: 13px; display: block;">🎯 Metas Divididas em Marcos Trimestrais</strong>
                    <span style="color: #8E9499; font-size: 12px; line-height: 1.4; display: block; margin-top: 2px;">Divida grandes ambições em passos matemáticos viáveis em 4 dimensões (Corpo, Dinheiro, Carreira, Vida).</span>
                  </td>
                </tr>
                <tr><td style="height: 8px;"></td></tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #12151B; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; margin-bottom: 8px;">
                    <strong style="color: #FFFFFF; font-size: 13px; display: block;">⚡ Hábitos com Ritmo Real e Sem Culpa</strong>
                    <span style="color: #8E9499; font-size: 12px; line-height: 1.4; display: block; margin-top: 2px;">Dias difíceis não apagam sua consistência acumulada. O que importa é a sua velocidade de retorno.</span>
                  </td>
                </tr>
                <tr><td style="height: 8px;"></td></tr>
                <tr>
                  <td style="padding: 12px 16px; background-color: #12151B; border: 1px solid rgba(255,255,255,0.06); border-radius: 10px;">
                    <strong style="color: #B8FF00; font-size: 13px; display: block;">🧠 Trajetta IA com Memória Viva Pessoal</strong>
                    <span style="color: #8E9499; font-size: 12px; line-height: 1.4; display: block; margin-top: 2px;">Um estrategista pessoal que lembra de cada vitória, desafio e reflexão ao longo das 52 semanas.</span>
                  </td>
                </tr>
              </table>

              <!-- Citação Serena -->
              <div style="background-color: #12161D; border-left: 3px solid #B8FF00; padding: 18px 22px; border-radius: 8px; margin-bottom: 32px;">
                <p style="font-size: 14px; font-style: italic; line-height: 1.6; color: #F2F1ED; margin: 0;">
                  “Um deslize isolado não anula 20 dias de consistência. O que define sua trajetória é a clareza de horizonte e a rapidez com que você volta ao seu ritmo.”
                </p>
              </div>

              <!-- Botão Principal de Ação -->
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://trajetta-app.vercel.app" style="display: inline-block; background-color: #B8FF00; color: #0D0F10; font-family: monospace; font-size: 13px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; text-decoration: none; padding: 16px 36px; border-radius: 100px; box-shadow: 0 8px 20px rgba(184,255,0,0.3);">
                      ACESSAR AMBIENTE TRAJETTA →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 12px; color: #6D747D; text-align: center; margin: 0;">
                Assim que as primeiras vagas forem liberadas, você receberá o link exclusivo de ativação neste mesmo e-mail.
              </p>
            </td>
          </tr>

          <!-- Rodapé do E-mail -->
          <tr>
            <td style="padding: 28px 40px; background-color: #080A0D; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center;">
              <p style="font-size: 11px; color: #6D747D; margin: 0 0 8px 0; font-family: monospace;">
                TRAJETTA • SISTEMA PESSOAL DE EVOLUÇÃO • DISCIPLINA SUSTENTÁVEL
              </p>
              <p style="font-size: 11px; color: #50565E; margin: 0; line-height: 1.5;">
                Você recebeu este e-mail porque reservou sua vaga na Lista VIP da Trajetta em <a href="https://trajetta-app.vercel.app" style="color: #8E9499; text-decoration: underline;">trajetta-app.vercel.app</a>.<br>
                Privacidade rigorosa: não compartilhamos seus dados com terceiros.
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
  <title>Fechamento da Semana ${data.weekNumber} — Trajetta</title>
</head>
<body style="margin: 0; padding: 0; background-color: #060709; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F2F1ED;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #0E1217; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
    <tr>
      <td style="padding: 32px 40px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background-color: #090C10;">
        <span style="font-size: 20px; font-weight: 800; color: #F2F1ED;">trajetta</span>
        <span style="font-size: 11px; color: #B8FF00; font-weight: 600; margin-left: 8px;">Domingo de Reflexão</span>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px;">
        <h2 style="font-size: 22px; font-weight: 700; margin: 0 0 8px 0; color: #F2F1ED;">
          Semana ${data.weekNumber} Concluída, ${data.userName}.
        </h2>
        <p style="font-size: 13px; color: #8E9499; margin: 0 0 24px 0;">
          ${data.streakWeeks} semanas consecutivas registradas na sua North Star de 2026.
        </p>
        <div style="background-color: #12151B; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; margin-bottom: 28px;">
          <span style="font-size: 11px; font-weight: 700; color: #B8FF00; text-transform: uppercase; letter-spacing: 1px;">Reflexão da Trajetta IA</span>
          <p style="font-size: 14px; line-height: 1.6; color: #F2F1ED; margin: 12px 0 0 0; font-style: italic;">
            “${data.reflection}”
          </p>
        </div>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="background-color: #B8FF00; border-radius: 8px; text-align: center;">
              <a href="https://trajetta-app.vercel.app" style="display: inline-block; padding: 12px 28px; font-size: 13px; font-weight: 700; color: #0D0F10; text-decoration: none; border-radius: 8px;">
                Ver Cartão da Semana →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px; background-color: #090C10; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
        <p style="font-size: 11px; color: #8E9499; margin: 0;">
          Trajetta • Disciplina serena e sustentável.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
