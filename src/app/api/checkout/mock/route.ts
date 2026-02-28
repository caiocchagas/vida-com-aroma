import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // 1. Encontra o usuário
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // 2. Cria a transação mockada e atualiza o status de pagamento
        await prisma.$transaction(async (tx) => {
            await tx.transaction.create({
                data: {
                    userId: user.id,
                    amount: 19.90,
                    status: 'paid_mock',
                    paymentId: `mock_${Date.now()}`,
                },
            });

            await tx.user.update({
                where: { id: user.id },
                data: { hasPaid: true },
            });
        });

        return NextResponse.json({ success: true, redirectUrl: `/members?email=${encodeURIComponent(email)}` }, { status: 200 });

    } catch (error) {
        console.error('Mock Checkout Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
