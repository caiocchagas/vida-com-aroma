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

        // Opção 3: Enviar o email de boas vindas IMEDIATAMENTE após o quiz
        // @ts-ignore - campo adicionado remotamente, TS local crasha por causa do Prisma Studio
        if (!user.nurturingSent) {
            try {
                await sendEmail(
                    user.email,
                    'Sua análise aromática está pronta ✨ — A Vida com Aroma',
                    buildWelcomeEmail(user.email)
                );
                await prisma.user.update({
                    where: { id: user.id },
                    // @ts-ignore
                    data: { nurturingSent: true }
                });
                console.log(`✅ Immediate welcome email sent to: ${user.email}`);
            } catch (emailError) {
                console.error(`⚠️ Failed to send immediate welcome email to ${user.email}:`, emailError);
            }
        }

        // Retorna o e-mail para manter o fluxo funcionando com a lógica atual de params
        return NextResponse.json({ success: true, user: { email: user.email } }, { status: 200 });

    } catch (error) {
        console.error('Quiz Submission Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
