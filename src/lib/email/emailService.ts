interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;

  if (apiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: 'Trajetta <suporte@trajetta.app>',
          to: [to],
          subject,
          html,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.warn(`[Resend Email Error]: ${err}`);
        return { success: false, error: err };
      }

      const data = await res.json();
      return { success: true, id: data.id };
    } catch (e) {
      console.error('[Email Dispatch Error]:', e);
      return { success: false, error: String(e) };
    }
  }

  // Development Fallback: Safe Mock Dispatcher
  console.log(`\n📨 [DEV EMAIL SIMULATED] -> To: ${to} | Subject: "${subject}"`);
  console.log(`Preview: ${html.substring(0, 200)}...\n`);
  return { success: true, id: `mock_email_${Date.now()}` };
}

export function renderWelcomeEmail(userName: string): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Bem-vindo à Trajetta</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0D0F10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F2F1ED;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #171A1D; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
    <tr>
      <td style="padding: 36px 40px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background-color: #111315;">
        <table width="100%">
          <tr>
            <td>
              <span style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #F2F1ED;">trajetta</span>
              <span style="font-size: 10px; color: #8E9499; letter-spacing: 1.5px; text-transform: uppercase; margin-left: 8px;">Evolução Pessoal</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px;">
        <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 16px 0; color: #F2F1ED; letter-spacing: -0.5px;">
          Sua trajetória começa agora, <span style="color: #B8FF00;">${userName}</span>.
        </h1>
        <p style="font-size: 15px; line-height: 1.6; color: #8E9499; margin: 0 0 24px 0;">
          Você não começou mais um gerenciador de tarefas para se frustrar no terceiro dia. A Trajetta foi desenhada para a sua vida real — com altos, baixos e a paciência necessária para construir evolução duradoura.
        </p>
        <div style="background-color: #1F2328; border-left: 3px solid #B8FF00; padding: 16px 20px; border-radius: 8px; margin-bottom: 32px;">
          <p style="font-size: 14px; font-style: italic; color: #F2F1ED; margin: 0;">
            “Um deslize isolado não anula 17 dias de consistência. O que define sua trajetória é a rapidez com que você volta ao seu ritmo.”
          </p>
        </div>
        <table cellpadding="0" cellspacing="0">
          <tr>
            <td style="background-color: #B8FF00; border-radius: 8px; text-align: center;">
              <a href="https://trajetta-app.vercel.app" style="display: inline-block; padding: 12px 28px; font-size: 13px; font-weight: 700; color: #0D0F10; text-decoration: none; border-radius: 8px;">
                Acessar Meu Sistema →
              </a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding: 24px 40px; background-color: #111315; border-top: 1px solid rgba(255, 255, 255, 0.08); text-align: center;">
        <p style="font-size: 11px; color: #8E9499; margin: 0;">
          Trajetta • Sistema Pessoal de Evolução • Disciplina serena e sustentável.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function renderWeeklyReviewEmail(data: {
  userName: string;
  weekNumber: number;
  streakWeeks: number;
  reflection: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Fechamento da Semana ${data.weekNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0D0F10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F2F1ED;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #171A1D; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden;">
    <tr>
      <td style="padding: 32px 40px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); background-color: #111315;">
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
        <div style="background-color: #111315; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 24px; margin-bottom: 28px;">
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
  </table>
</body>
</html>
  `;
}
