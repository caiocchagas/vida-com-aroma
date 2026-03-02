import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            email,
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
                mainComplaint,
                chronology,
                energyLevel,
                clinicalRestrictions: restrictionsStr,
                environment: environmentStr,
                preferredMethod
            },
            create: {
                email,
                mainComplaint,
                chronology,
                energyLevel,
                clinicalRestrictions: restrictionsStr,
                environment: environmentStr,
                preferredMethod
            },
        });

        // Retorna o e-mail para manter o fluxo funcionando com a lógica atual de params
        return NextResponse.json({ success: true, user: { email: user.email } }, { status: 200 });

    } catch (error) {
        console.error('Quiz Submission Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
