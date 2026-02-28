import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Only available in development or when ADMIN_SEED_SECRET is provided
export async function POST(request: NextRequest) {
    const { seedSecret, name, email, password } = await request.json();

    if (!process.env.ADMIN_SEED_SECRET || seedSecret !== process.env.ADMIN_SEED_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await prisma.user.upsert({
        where: { email },
        update: { name, password: hashedPassword, role: "ADMIN" },
        create: { name, email, password: hashedPassword, role: "ADMIN", hasPaid: true },
    });

    return NextResponse.json({ success: true, email: admin.email, role: admin.role });
}
