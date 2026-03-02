import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import prisma from "@/lib/prisma";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN as string,
});

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ error: "Lead não encontrado. Por favor, faça o Quiz novamente." }, { status: 404 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        const preference = new Preference(client);
        const response = await preference.create({
            body: {
                items: [
                    {
                        id: "guia-aromaterapia-21-dias",
                        title: "Guia Prático de Aromaterapia — Protocolo 21 Dias",
                        description: "Acesso Vitalício ao Guia Aromático Personalizado",
                        quantity: 1,
                        currency_id: "BRL",
                        unit_price: 19.9,
                    },
                ],
                payer: {
                    email: user.email,
                },
                back_urls: {
                    success: `${baseUrl}/register?email=${encodeURIComponent(user.email)}`,
                    failure: `${baseUrl}/results?email=${encodeURIComponent(user.email)}&status=failed`,
                    pending: `${baseUrl}/results?email=${encodeURIComponent(user.email)}&status=pending`,
                },
                auto_return: "approved",
                notification_url: `${baseUrl}/api/webhook/mercadopago`,
                metadata: {
                    user_email: user.email,
                },
                payment_methods: {
                    excluded_payment_methods: [],
                    excluded_payment_types: [],
                    installments: 1, // 1x sem juros
                },
            },
        });

        return NextResponse.json({
            preferenceId: response.id,
            initPoint: response.init_point,
        });
    } catch (error: any) {
        console.error("Erro ao criar preferência MP:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
