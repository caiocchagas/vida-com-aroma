import 'dotenv/config';
import { sendEmail, buildWelcomeEmail } from './src/lib/email.js';

async function test() {
    const to = 'caio_chagas_1@hotmail.com';
    const subject = 'Sua análise aromática está pronta ✨ — A Vida com Aroma';
    const html = buildWelcomeEmail(to);

    try {
        await sendEmail(to, subject, html);
        console.log('✅ Email enviado com sucesso para', to);
    } catch (e) {
        console.error('❌ Erro:', e);
    }
}

test();
