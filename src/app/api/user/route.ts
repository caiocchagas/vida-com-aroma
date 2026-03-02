import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getRecommendations } from "@/lib/recommendations";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                name: true,
                mainComplaint: true,
                chronology: true,
                energyLevel: true,
                clinicalRestrictions: true,
                environment: true,
                preferredMethod: true
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Processa as recomendações baseadas nas respostas do usuário
        const recommendations = getRecommendations(user);

        return NextResponse.json({ user, recommendations }, { status: 200 });
    } catch (error) {
        console.error("Fetch User Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
