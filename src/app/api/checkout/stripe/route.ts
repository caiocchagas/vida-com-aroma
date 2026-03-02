import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2023-10-16" as any,
});

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
        }

        // Verifica o lead no banco
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        // Cria a sessão de checkout na Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card", "boleto"], // Add PIX if Brazilian account is fully verified
            customer_email: user.email,
            line_items: [
                {
                    price_data: {
                        currency: "brl",
                        product_data: {
                            name: "Guia Prático de Aromaterapia Clínica",
                            description: "O Seu Protocolo Completo de 21 Dias",
                        },
                        unit_amount: 1990, // R$ 19,90 = 1990 centavos
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${baseUrl}/register?email=${encodeURIComponent(user.email)}`,
            cancel_url: `${baseUrl}/results?email=${encodeURIComponent(user.email)}`,
            metadata: {
                userEmail: user.email, // Importante para o Webhook achar o cara
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Erro no checkout da Stripe:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
