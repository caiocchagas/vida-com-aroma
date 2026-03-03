import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendEmail, buildWelcomeEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            email,
            lifeGoal,
            mainComplaint,
            chronology,
            energyLevel,
            clinicalRestrictions,
            environment,
            preferredMethod
        } = body;

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        // Convert arrays to comma-separated strings for storage
        const restrictionsStr = Array.isArray(clinicalRestrictions) ? clinicalRestrictions.join(', ') : clinicalRestrictions;
        const environmentStr = Array.isArray(environment) ? environment.join(', ') : environment;

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                lifeGoal,
                mainComplaint,
                chronology,
                energyLevel,
                clinicalRestrictions: restrictionsStr,
                environment: environmentStr,
                preferredMethod
            },
            create: {
                email,
                lifeGoal,
                mainComplaint,
                chronology,
                energyLevel,
                clinicalRestrictions: restrictionsStr,
                environment: environmentStr,
                preferredMethod
            },
        });

        // Envia email de boas-vindas/nurturing apenas se a pessoa ainda NÃO pagou
        if (!user.hasPaid) {
            try {
                await sendEmail(
                    email,
                    'Sua análise aromática está pronta ✨ — Vida com Aroma',
                    buildWelcomeEmail()
                );
            } catch (emailError) {
                // Não interrompe o fluxo se o email falhar
                console.error('⚠️ Falha ao enviar email de boas-vindas:', emailError);
            }
        }

        // Retorna o e-mail para manter o fluxo funcionando com a lógica atual de params
        return NextResponse.json({ success: true, user: { email: user.email } }, { status: 200 });

    } catch (error) {
        console.error('Quiz Submission Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
