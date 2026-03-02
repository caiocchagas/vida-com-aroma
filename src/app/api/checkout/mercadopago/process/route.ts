import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import prisma from "@/lib/prisma";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN as string,
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userEmail, ...formData } = body;

        if (!userEmail) {
            return NextResponse.json({ error: "Email não encontrado" }, { status: 400 });
        }

        console.log("📦 formData recebido do Brick:", JSON.stringify(formData, null, 2));
        console.log("👤 userEmail:", userEmail);

        const payment = new Payment(client);

        // Constrói o payload corretamente usando os dados do Brick
        const paymentPayload = {
            token: formData.token,
            issuer_id: formData.issuer_id,
            payment_method_id: formData.payment_method_id,
            transaction_amount: Number(formData.transaction_amount) || 19.90,
            installments: Number(formData.installments) || 1,
            description: "Guia Prático de Aromaterapia - Protocolo 21 Dias",
            payer: {
                email: formData?.payer?.email || userEmail,
                identification: formData?.payer?.identification,
            },
            metadata: {
                user_email: userEmail,
            },
        };

        console.log("📤 Payload enviado para o MP:", JSON.stringify(paymentPayload, null, 2));

        const paymentData = await payment.create({ body: paymentPayload });

        console.log("✅ Resposta do MP:", JSON.stringify({
            id: paymentData.id,
            status: paymentData.status,
            status_detail: paymentData.status_detail,
        }));

        const status = paymentData.status;
        const paymentId = String(paymentData.id);

        if (status === "approved") {
            const user = await prisma.user.findUnique({ where: { email: userEmail } });

            if (user && !user.hasPaid) {
                await prisma.user.update({
                    where: { email: userEmail },
                    data: { hasPaid: true },
                });

                await prisma.transaction.create({
                    data: {
                        userId: user.id,
                        amount: paymentData.transaction_amount || 19.9,
                        status: "paid",
                        paymentId,
                    },
                });

                console.log(`✅ Acesso liberado para: ${userEmail}`);
            }
        }

        return NextResponse.json({
            status,
            statusDetail: paymentData.status_detail,
            paymentId
        });
    } catch (error: any) {
        console.error("❌ Erro ao processar pagamento MP:", JSON.stringify(error?.cause || error?.message || error));
        const errorMsg = error?.cause?.message || error?.message || "Erro ao processar pagamento";
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}
