import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, sessionId, metadata } = body;

        if (!name || !sessionId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Use Prisma Studio local client crash workaround for the remote deployment
        // @ts-ignore
        await prisma.event.create({
            data: {
                name,
                sessionId,
                metadata: metadata ? JSON.stringify(metadata) : null,
            },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("Tracking Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
