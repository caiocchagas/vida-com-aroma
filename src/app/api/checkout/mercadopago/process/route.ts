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

        const payment = new Payment(client);
        const paymentData = await payment.create({
            body: {
                ...formData,
                payer: {
                    email: userEmail,
                },
                metadata: {
                    user_email: userEmail,
                },
            },
        });

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

                console.log(`✅ Pagamento aprovado e acesso liberado para: ${userEmail}`);
            }
        }

        return NextResponse.json({ status, paymentId });
    } catch (error: any) {
        console.error("Erro ao processar pagamento MP:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
