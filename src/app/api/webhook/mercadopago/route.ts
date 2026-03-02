import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

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

        const email = payment.payer?.email || payment.metadata?.user_email;

        if (!email) {
            console.warn(`Webhook MP: pagamento aprovado, mas email não encontrado. ID: ${dataId}`);
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
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("Erro ao processar webhook MP:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
