import { PrismaClient } from '@prisma/client';

async function enableRLS() {
    const prisma = new PrismaClient();
    try {
        console.log("Enabling Row Level Security (RLS) on public tables...");

        // Ativando RLS na tabela User
        await prisma.$executeRawUnsafe(`ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;`);
        console.log("✅ RLS enabled for 'User' table.");

        // Ativando RLS na tabela Transaction
        await prisma.$executeRawUnsafe(`ALTER TABLE "Transaction" ENABLE ROW LEVEL SECURITY;`);
        console.log("✅ RLS enabled for 'Transaction' table.");

        console.log("\nAs tabelas agora estão protegidas contra acessos anônimos via API do Supabase.");
        console.log("O Prisma continuará funcionando normalmente pois usa conexão direta com privilégios adequados.");

    } catch (e) {
        console.error("Erro ao ativar RLS:", e);
    } finally {
        await prisma.$disconnect();
    }
}

enableRLS();
