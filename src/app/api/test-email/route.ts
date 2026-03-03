import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, buildWelcomeEmail, buildPurchaseConfirmationEmail } from '@/lib/email';

// ROTA TEMPORÁRIA DE TESTE — remover após validar o SES
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const to = searchParams.get('to');
    const type = searchParams.get('type') || 'welcome'; // 'welcome' ou 'purchase'

    if (!to) {
        return NextResponse.json({ error: 'Parâmetro "to" é obrigatório. Ex: /api/test-email?to=seu@email.com' }, { status: 400 });
    }

    try {
        const subject = type === 'purchase'
            ? 'Seu Guia Aromático foi liberado! 🌿 — A Vida com Aroma'
            : 'Sua análise aromática está pronta ✨ — A Vida com Aroma';

        const html = type === 'purchase'
            ? buildPurchaseConfirmationEmail()
            : buildWelcomeEmail();

        await sendEmail(to, subject, html);

        return NextResponse.json({
            success: true,
            message: `Email do tipo "${type}" enviado para ${to}`
        });
    } catch (error: any) {
        console.error('❌ Erro ao enviar email de teste:', error);
        return NextResponse.json({ error: error.message || 'Erro ao enviar email' }, { status: 500 });
    }
}
