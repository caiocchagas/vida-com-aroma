import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import prisma from "@/lib/prisma";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN as string,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            token,
            issuer_id,
            payment_method_id,
            transaction_amount,
            installments,
            payer,
            userEmail,
        } = body;

        if (!userEmail || !token) {
            return NextResponse.json({ error: "Dados incompletos para processar o pagamento." }, { status: 400 });
        }

        console.log("📦 Processando pagamento para:", userEmail);
        console.log("💳 Método:", payment_method_id, "| Token:", token?.slice(0, 10) + "...");

        const payment = new Payment(client);

        const paymentData = await payment.create({
            body: {
                token,
                issuer_id,
                payment_method_id,
                transaction_amount: Number(transaction_amount) || 19.90,
                installments: Number(installments) || 1,
                description: "Guia Aromático — Protocolo 21 Dias",
                payer: {
                    email: payer?.email || userEmail,
                    identification: payer?.identification,
                },
                metadata: {
                    user_email: userEmail,
                },
            },
        });

        console.log("✅ Resposta MP:", paymentData.status, paymentData.status_detail);

        const status = paymentData.status;
        const paymentId = String(paymentData.id);

        if (status === "approved") {
            const user = await prisma.user.findUnique({ where: { email: userEmail } });
            if (user && !user.hasPaid) {
                await prisma.user.update({ where: { email: userEmail }, data: { hasPaid: true } });
                await prisma.transaction.create({
                    data: {
                        userId: user.id,
                        amount: paymentData.transaction_amount || 19.9,
                        status: "paid",
                        paymentId,
                    },
                });
                console.log(`🎉 Acesso liberado para: ${userEmail}`);
            }
        }

        return NextResponse.json({ status, statusDetail: paymentData.status_detail, paymentId });
    } catch (error: any) {
        const cause = error?.cause;
        console.error("❌ Erro MP:", JSON.stringify(cause || error?.message || error));
        const msg = cause?.[0]?.description || error?.message || "Erro ao processar pagamento";
        return NextResponse.json({ error: msg }, { status: 500 });
    }
}
