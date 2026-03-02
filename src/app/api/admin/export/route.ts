import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    // Token is already validated by middleware, but double check
    const token = request.cookies.get("admin_token")?.value;
    if (!token || token !== process.env.ADMIN_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            email: true,
            mainComplaint: true,
            chronology: true,
            energyLevel: true,
            clinicalRestrictions: true,
            environment: true,
            preferredMethod: true,
            hasPaid: true,
            createdAt: true,
        },
    });

    // Build CSV
    const headers = ["Email", "Queixa Principal", "Cronologia", "Nível de Energia", "Restrições Clínicas", "Ambiente", "Método Preferido", "Comprou", "Data Cadastro"];
    const rows = users.map(u => [
        u.email,
        u.mainComplaint ?? "",
        u.chronology ?? "",
        u.energyLevel ?? "",
        u.clinicalRestrictions ?? "",
        u.environment ?? "",
        u.preferredMethod ?? "",
        u.hasPaid ? "Sim" : "Não",
        new Date(u.createdAt).toLocaleDateString("pt-BR"),
    ]);

    const csv = [headers, ...rows]
        .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n");

    return new NextResponse(csv, {
        status: 200,
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="leads-vida-com-aroma.csv"`,
        },
    });
}
