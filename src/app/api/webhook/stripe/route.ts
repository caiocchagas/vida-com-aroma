import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-10-16" as any,
});

export async function POST(req: NextRequest) {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event: Stripe.Event;

    try {
        if (webhookSecret && sig) {
            // Em produção com Webhook Secret configurado
            event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        } else {
            // Se testando sem Webhook CLI configurado, confia no payload puro (Apenas para Testes/Local!)
            // AVISO: Em produção SEMPRE tenha webhookSecret
            console.warn("⚠️ Webhook processado SEM validação de assinatura (STRIPE_WEBHOOK_SECRET não encontrado)");
            event = JSON.parse(body);
        }
    } catch (err: any) {
        console.error("Webhook signature verification failed:", err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Lida com o evento de Checkout concluído / Pagamento confirmado
    if (event.type === "checkout.session.completed" || event.type === "payment_intent.succeeded") {
        try {
            let email: string | undefined;
            let amountTotal = 19.90;

            if (event.type === "checkout.session.completed") {
                const session = event.data.object as Stripe.Checkout.Session;
                email = session.customer_details?.email || session.customer_email || (session.metadata?.userEmail as string);
                if (session.amount_total) {
                    amountTotal = session.amount_total / 100;
                }
            } else if (event.type === "payment_intent.succeeded") {
                const pi = event.data.object as Stripe.PaymentIntent;
                email = pi.receipt_email || (pi.metadata?.userEmail as string);
                if (pi.amount) {
                    amountTotal = pi.amount / 100;
                }
            }

            if (email) {
                // Pega o usuário do Prisma
                const user = await prisma.user.findUnique({ where: { email } });

                if (user && !user.hasPaid) {
                    // Update User
                    await prisma.user.update({
                        where: { email },
                        data: { hasPaid: true }
                    });

                    // Cria Transação
                    await prisma.transaction.create({
                        data: {
                            userId: user.id,
                            amount: amountTotal,
                            status: "paid",
                            paymentId: event.id,
                        }
                    });

                    console.log(`✅ Pagamento confirmado e acesso liberado para: ${email}`);
                }
            } else {
                console.warn(`Webhook: Pagamento recebido, mas email não encontrado na sessão.`, event.id);
            }
        } catch (error) {
            console.error("Erro interno ao processar webhook:", error);
            return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true });
}
