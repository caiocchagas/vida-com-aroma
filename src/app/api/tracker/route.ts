import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { txId, trackedDays } = body;

        if (!txId || !Array.isArray(trackedDays)) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        // Verify that this transaction belongs to the current user
        const tx = await prisma.transaction.findUnique({
            where: { id: txId },
            include: { user: true }
        });

        if (!tx || tx.user.email !== session.user.email) {
            return NextResponse.json({ error: "Transaction not found or unauthorized" }, { status: 403 });
        }

        // Update the tracked days
        await prisma.transaction.update({
            where: { id: txId },
            data: {
                // @ts-ignore - type generated on remote db
                trackedDays
            }
        });

        return NextResponse.json({ success: true, trackedDays });

    } catch (error) {
        console.error("Error updating tracker:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
