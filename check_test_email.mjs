import { PrismaClient } from '@prisma/client';

async function checkUser() {
    const prisma = new PrismaClient();
    try {
        const user = await prisma.user.findUnique({
            where: { email: 'caio_chagas_1@hotmail.com' }
        });
        if (user) {
            console.log("User found:", {
                email: user.email,
                hasPaid: user.hasPaid,
                nurturingSent: user.nurturingSent,
                createdAt: user.createdAt,
                minutesAgo: (Date.now() - new Date(user.createdAt).getTime()) / 1000 / 60
            });
        } else {
            console.log("User not found!");
        }
    } finally {
        await prisma.$disconnect();
    }
}
checkUser();
