import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// ROTA TEMPORÁRIA DE DIAGNÓSTICO — remover após resolver o problema
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const secret = searchParams.get('secret');

    if (secret !== process.env.ADMIN_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!email) {
        return NextResponse.json({ error: 'email param required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            hasPaid: true,
            password: true, // só verifica se existe, não expõe
            lifeGoal: true,
            mainComplaint: true,
            chronology: true,
            energyLevel: true,
            clinicalRestrictions: true,
            environment: true,
            preferredMethod: true,
            createdAt: true,
            transactions: {
                select: {
                    paymentId: true,
                    amount: true,
                    status: true,
                    createdAt: true,
                }
            }
        },
    });

    if (!user) {
        return NextResponse.json({ found: false, message: 'Usuário não encontrado no banco' });
    }

    return NextResponse.json({
        found: true,
        user: {
            ...user,
            hasPassword: !!user.password,
            password: undefined, // não expõe o hash
        }
    });
}
