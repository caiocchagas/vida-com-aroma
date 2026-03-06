import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, buildPurchaseConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // O Mercado Pago manda o tipo de notificação
        const topic = body.type || body.topic;
        const dataId = body.data?.id || body.resource;

        if (!dataId) {
            return NextResponse.json({ received: true });
        }

        // Só processa pagamentos aprovados
        if (topic !== "payment") {
            return NextResponse.json({ received: true });
        }

        // Busca os detalhes do pagamento na API do MP
        const mpResponse = await fetch(`https://api.mercadopago.com/v1/payments/${dataId}`, {
            headers: {
                Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            },
        });

        if (!mpResponse.ok) {
            console.error("Erro ao buscar pagamento MP:", await mpResponse.text());
            return NextResponse.json({ error: "Falha ao verificar pagamento" }, { status: 500 });
        }

        const payment = await mpResponse.json();

        // Só libera se pagamento foi aprovado
        if (payment.status !== "approved") {
            console.log(`Pagamento ${dataId} não aprovado (status: ${payment.status}). Ignorando.`);
            return NextResponse.json({ received: true });
        }

        // Buscar email em todas as camadas possiveis
        const email = payment.payer?.email ||
            payment.metadata?.user_email ||
            payment.additional_info?.payer?.email ||
            body.data?.payer?.email ||
            body.payer?.email;

        if (!email) {
            console.warn(`Webhook MP: pagamento aprovado, mas email não encontrado. ID: ${dataId}`);
            console.warn("Payload recebido:", JSON.stringify(payment));
            return NextResponse.json({ received: true });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (user && !user.hasPaid) {
            await prisma.user.update({
                where: { email },
                data: { hasPaid: true },
            });

            await prisma.transaction.create({
                data: {
                    userId: user.id,
                    amount: payment.transaction_amount || 19.9,
                    status: "paid",
                    paymentId: String(dataId),
                },
            });

            console.log(`✅ Pagamento MP aprovado e acesso liberado para: ${email}`);

            // Envia email de confirmação de compra (PIX)
            try {
                await sendEmail(
                    email,
                    'Seu Guia Aromático foi liberado! 🌿 — A Vida com Aroma',
                    buildPurchaseConfirmationEmail()
                );
            } catch (emailError) {
                console.error('⚠️ Falha ao enviar email de confirmação (PIX webhook):', emailError);
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Erro ao processar webhook MP:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
