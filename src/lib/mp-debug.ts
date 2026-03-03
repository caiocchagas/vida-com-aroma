export async function fetchPaymentFromMP(paymentId: string) {
    const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
    });
    return res.json();
}
