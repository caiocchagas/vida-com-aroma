import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN as string,
});

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("paymentId");

    if (!paymentId) {
        return NextResponse.json({ error: "paymentId obrigatório" }, { status: 400 });
    }

    try {
        const payment = new Payment(client);
        const data = await payment.get({ id: paymentId });

        return NextResponse.json({ status: data.status });
    } catch (error: any) {
        console.error("❌ Erro ao checar status:", error?.message);
        return NextResponse.json({ error: "Erro ao consultar pagamento" }, { status: 500 });
    }
}
