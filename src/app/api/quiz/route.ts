import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            email,
            focusArea,
            preferences,
            safety,
            interest,
            stressLevel,
            physicalSymptoms,
            experience,
            scentSensitivity
        } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Como safety e physicalSymptoms agora são arrays de múltipla escolha, vamos converter para string
        // para salvar na coluna genérica String do banco de dados de maneira fácil.
        const safetyString = Array.isArray(safety) ? JSON.stringify(safety) : safety;
        const symptomsString = Array.isArray(physicalSymptoms) ? JSON.stringify(physicalSymptoms) : physicalSymptoms;

        // Tenta encontrar o usuário pelo email, ou cria um novo
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                focusArea,
                preferences,
                safety: safetyString,
                interest,
                stressLevel,
                physicalSymptoms: symptomsString,
                experience,
                scentSensitivity
            },
            create: {
                email,
                focusArea,
                preferences,
                safety: safetyString,
                interest,
                stressLevel,
                physicalSymptoms: symptomsString,
                experience,
                scentSensitivity
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
