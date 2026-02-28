import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, focusArea, preferences, safety } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Tenta encontrar o usuário pelo email, ou cria um novo
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                focusArea,
                preferences,
                safety,
            },
            create: {
                email,
                focusArea,
                preferences,
                safety,
            },
        });

        return NextResponse.json({ success: true, user }, { status: 200 });
    } catch (error) {
        console.error('Error saving quiz lead:', error);
        return NextResponse.json(
            { error: 'Failed to process quiz submission' },
            { status: 500 }
        );
    }
}
