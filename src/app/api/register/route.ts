import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Todos os campos são obrigatórios." }, { status: 400 });
        }

        if (password.length < 6) {
            return NextResponse.json({ error: "A senha deve ter pelo menos 6 caracteres." }, { status: 400 });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Upsert: se o lead já existe (veio do quiz), só adiciona nome e senha
        // Se não existe, cria um novo registro limpo
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                name,
                password: hashedPassword,
            },
            create: {
                name,
                email,
                password: hashedPassword,
                role: "CUSTOMER",
            },
        });

        return NextResponse.json({ success: true, userId: user.id }, { status: 201 });
    } catch (error: any) {
        if (error.code === "P2002") {
            // Unique constraint — email already has a password set
            return NextResponse.json({ error: "Este email já possui conta. Faça login." }, { status: 409 });
        }
        console.error(error);
        return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
    }
}
