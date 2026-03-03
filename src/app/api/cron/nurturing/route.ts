import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendEmail, buildWelcomeEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    // Vercel Cron envia um auth header que podemos verificar
    // https://vercel.com/docs/cron-jobs/manage-cron-jobs#securing-cron-jobs
    const authHeader = request.headers.get("authorization");
    const isVercelCron = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;

    // Para teste local ou se não for cron da vercel, permitimos via secret customizado na URL
    const isLocalTest = request.nextUrl.searchParams.get("secret") === process.env.ADMIN_SECRET;

    if (!isVercelCron && !isLocalTest) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Busca usuários que:
        // 1. Criaram a conta há mais de 15 minutos (para dar tempo de passar no checkout)
        // 2. Não compraram (hasPaid: false)
        // 3. Ainda não receberam o email de nutrição (nurturingSent: false)

        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

        const usersToNurture = await prisma.user.findMany({
            where: {
                hasPaid: false,
                nurturingSent: false,
                createdAt: {
                    lte: fifteenMinutesAgo, // Criados há 15 min ou mais
                },
            },
            take: 50, // Processa em lotes menores para não dar timeout (Vercel tem limite de 10s-15s)
        });

        console.log(`⏱️ Cron: Encontrados ${usersToNurture.length} leads para nutrir.`);

        const sentEmails = [];
        const failedEmails = [];

        for (const user of usersToNurture) {
            try {
                await sendEmail(
                    user.email,
                    'Sua análise aromática está pronta ✨ — A Vida com Aroma',
                    buildWelcomeEmail()
                );

                // Marca como enviado e salva no array de sucessos
                await prisma.user.update({
                    where: { id: user.id },
                    data: { nurturingSent: true },
                });
                sentEmails.push(user.email);
            } catch (err) {
                console.error(`Falha ao enviar nurturing para ${user.email}:`, err);
                failedEmails.push(user.email);
            }
        }

        return NextResponse.json({
            success: true,
            processed: usersToNurture.length,
            sent: sentEmails,
            failed: failedEmails,
        });

    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
