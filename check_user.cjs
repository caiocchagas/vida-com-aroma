const { PrismaClient } = require('./src/generated/prisma');

async function main() {
    const prisma = new PrismaClient();
    const user = await prisma.user.findUnique({
        where: { email: 'caiochagas1@gmail.com' },
        include: { transactions: true },
    });
    console.log(JSON.stringify(user, null, 2));
    await prisma.$disconnect();
}

main().catch(console.error);
