const { MercadoPagoConfig, Payment } = require('mercadopago');

const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || "APP_USR-419381638325855-041917-84fc63d529831735f2818812340687ba-177591691",
});

async function findPayment() {
    try {
        const payment = new Payment(client);

        const search = await payment.search({
            options: {
                criteria: "desc",
                sort: "date_created",
                limit: 10,
                offset: 0
            }
        });

        const results = search.results || [];
        console.log(`Encontrados ${results.length} pagamentos recentes.`);

        const caioPayments = results.filter(p =>
            p.payer?.email === 'caiochagas1@gmail.com' ||
            (p.metadata && p.metadata.user_email === 'caiochagas1@gmail.com')
        );

        if (caioPayments.length > 0) {
            console.log("\n💳 Pagamentos encontrados para caiochagas1@gmail.com:");
            caioPayments.forEach(p => {
                console.log(`ID: ${p.id} | Status: ${p.status} | Detalhe: ${p.status_detail} | Método: ${p.payment_method_id} | Valor: ${p.transaction_amount}`);
            });
        } else {
            console.log("\nNenhum pagamento encontrado para este email nos últimos 10 registros.");
            console.log("Últimos 3 pagamentos recebidos no Mercado Pago:");
            results.slice(0, 3).forEach(p => {
                const mail = (p.payer && p.payer.email) || (p.metadata && p.metadata.user_email) || "Sem email";
                console.log(`ID: ${p.id} | Status: ${p.status} | Email: ${mail}`);
            });
        }
    } catch (e) {
        console.error("Erro MP:", e.message || e);
    }
}

findPayment();
