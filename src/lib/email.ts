import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const FROM_EMAIL = process.env.SES_FROM_EMAIL || 'contato@avidacomaroma.com.br';

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const command = new SendEmailCommand({
    Source: `Vida com Aroma <${FROM_EMAIL}>`,
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject, Charset: 'UTF-8' },
      Body: { Html: { Data: html, Charset: 'UTF-8' } },
    },
  });

  await sesClient.send(command);
  console.log(`📧 Email enviado para: ${to} | Assunto: ${subject}`);
}

// ─── Template: Boas-vindas / Nurturing ───────────────────────────────────────
export function buildWelcomeEmail(): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Sua análise está pronta</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a5c3a 0%,#2e7d52 100%);padding:40px 48px;text-align:center;">
              <div style="font-size:36px;margin-bottom:8px;">🌿</div>
              <h1 style="color:#fff;font-size:22px;font-weight:400;margin:0;letter-spacing:1px;">VIDA COM AROMA</h1>
              <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:6px 0 0;letter-spacing:2px;text-transform:uppercase;">Aromaterapia Personalizada</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 48px 32px;">
              <h2 style="color:#1a5c3a;font-size:24px;font-weight:600;margin:0 0 16px;line-height:1.3;">
                Sua análise aromática está pronta! ✨
              </h2>
              <p style="color:#4a5568;font-size:16px;line-height:1.7;margin:0 0 20px;">
                Olá! Ficamos felizes em saber que você quer descobrir quais óleos essenciais foram feitos para o seu corpo.
              </p>
              <p style="color:#4a5568;font-size:16px;line-height:1.7;margin:0 0 20px;">
                Com base nas suas respostas, cruzamos o seu perfil com mais de <strong>40 combinações de sinergias aromáticas</strong> e preparamos uma prescrição 100% personalizada para você.
              </p>
              <p style="color:#4a5568;font-size:16px;line-height:1.7;margin:0 0 32px;">
                Sua análise inclui:
              </p>
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f0f0ea;">
                    <span style="color:#2e7d52;font-size:18px;margin-right:10px;">🌸</span>
                    <span style="color:#4a5568;font-size:15px;">Os 3 óleos essenciais ideais para o seu perfil</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;border-bottom:1px solid #f0f0ea;">
                    <span style="color:#2e7d52;font-size:18px;margin-right:10px;">💡</span>
                    <span style="color:#4a5568;font-size:15px;">Por que o seu corpo pede esses aromas específicos</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0;">
                    <span style="color:#2e7d52;font-size:18px;margin-right:10px;">🛍️</span>
                    <span style="color:#4a5568;font-size:15px;">Onde comprar com qualidade e segurança</span>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="https://app.avidacomaroma.com.br/" 
                       style="display:inline-block;background:linear-gradient(135deg,#1a5c3a,#2e7d52);color:#fff;text-decoration:none;font-size:16px;font-weight:700;padding:18px 40px;border-radius:50px;letter-spacing:0.5px;">
                      Ver Minha Análise Personalizada →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#9ca3af;font-size:13px;line-height:1.6;text-align:center;margin:0;">
                Com carinho,<br/>
                <strong style="color:#2e7d52;">Equipe Vida com Aroma</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f7;padding:24px 48px;text-align:center;border-top:1px solid #ede9e0;">
              <p style="color:#b0b0a0;font-size:12px;margin:0;line-height:1.6;">
                Você recebeu este email porque completou nossa análise aromática gratuita.<br/>
                © 2025 Vida com Aroma · contato@avidacomaroma.com.br
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

// ─── Template: Confirmação de Compra ─────────────────────────────────────────
export function buildPurchaseConfirmationEmail(): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Seu guia foi liberado!</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a5c3a 0%,#2e7d52 100%);padding:40px 48px;text-align:center;">
              <div style="font-size:48px;margin-bottom:12px;">🎉</div>
              <h1 style="color:#fff;font-size:22px;font-weight:400;margin:0;letter-spacing:1px;">PAGAMENTO CONFIRMADO</h1>
              <p style="color:rgba(255,255,255,0.75);font-size:13px;margin:6px 0 0;letter-spacing:2px;text-transform:uppercase;">Vida com Aroma</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:48px 48px 32px;">
              <h2 style="color:#1a5c3a;font-size:24px;font-weight:600;margin:0 0 16px;line-height:1.3;">
                Seu Guia Aromático foi liberado! 🌿
              </h2>
              <p style="color:#4a5568;font-size:16px;line-height:1.7;margin:0 0 20px;">
                Parabéns pela sua decisão! Seu acesso ao <strong>Guia Aromático Completo — Protocolo 21 Dias</strong> foi ativado com sucesso.
              </p>
              <p style="color:#4a5568;font-size:16px;line-height:1.7;margin:0 0 32px;">
                A partir de agora você tem acesso a:
              </p>

              <!-- Items -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;background:#f9fdf9;border-radius:12px;padding:4px 0;">
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #e8f5e9;">
                    <span style="color:#2e7d52;font-size:20px;margin-right:12px;">📖</span>
                    <span style="color:#4a5568;font-size:15px;">Protocolo aromático personalizado de 21 dias</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #e8f5e9;">
                    <span style="color:#2e7d52;font-size:20px;margin-right:12px;">🫧</span>
                    <span style="color:#4a5568;font-size:15px;">Receitas exclusivas de sinergias aromáticas</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;border-bottom:1px solid #e8f5e9;">
                    <span style="color:#2e7d52;font-size:20px;margin-right:12px;">🛒</span>
                    <span style="color:#4a5568;font-size:15px;">Guia de compras com marcas verificadas</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;">
                    <span style="color:#2e7d52;font-size:20px;margin-right:12px;">♾️</span>
                    <span style="color:#4a5568;font-size:15px;">Acesso vitalício ao conteúdo</span>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="https://app.avidacomaroma.com.br/guia" 
                       style="display:inline-block;background:linear-gradient(135deg,#1a5c3a,#2e7d52);color:#fff;text-decoration:none;font-size:16px;font-weight:700;padding:18px 40px;border-radius:50px;letter-spacing:0.5px;">
                      Acessar Meu Guia Agora →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color:#9ca3af;font-size:13px;line-height:1.6;text-align:center;margin:0;">
                Obrigada pela confiança 💚<br/>
                <strong style="color:#2e7d52;">Equipe Vida com Aroma</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9f7;padding:24px 48px;text-align:center;border-top:1px solid #ede9e0;">
              <p style="color:#b0b0a0;font-size:12px;margin:0;line-height:1.6;">
                Dúvidas? Responda este email ou entre em contato: contato@avidacomaroma.com.br<br/>
                © 2025 Vida com Aroma
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
