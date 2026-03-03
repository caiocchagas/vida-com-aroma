import { PrismaClient } from '@prisma/client';

async function fixUser() {
    const prisma = new PrismaClient();
    try {
        const email = 'caiochagas1@gmail.com';
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            console.log("Usuário não encontrado!");
            return;
        }

        await prisma.user.update({
            where: { email },
            data: { hasPaid: true }
        });

        // Add the transaction from MP (ID: 148685651248)
        const tx = await prisma.transaction.create({
            data: {
                userId: user.id,
                amount: 1.00,
                status: "paid",
                paymentId: "148685651248"
            }
        });

        console.log("✅ Usuário atualizado com sucesso. hasPaid = true.");
        console.log("Transação criada:", tx);
    } catch (e) {
        console.error("Erro:", e);
    } finally {
        await prisma.$disconnect();
    }
}

fixUser();
