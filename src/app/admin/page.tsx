import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
    // Server-side auth check
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_token")?.value;
    if (!token || token !== process.env.ADMIN_SECRET) {
        redirect("/admin/login");
    }

    // Fetch KPIs and data
    const [totalLeads, totalPaid, recentLeads, transactions] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { hasPaid: true } }),
        prisma.user.findMany({
            orderBy: { createdAt: "desc" },
            take: 100,
            select: {
                email: true,
                mainComplaint: true,
                energyLevel: true,
                clinicalRestrictions: true,
                environment: true,
                hasPaid: true,
                createdAt: true,
            },
        }),
        prisma.transaction.findMany({
            orderBy: { createdAt: "desc" },
            take: 50,
            include: {
                user: { select: { email: true } },
            },
        }),
    ]);

    const conversionRate = totalLeads > 0 ? ((totalPaid / totalLeads) * 100).toFixed(1) : "0.0";
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);

    return (
        <main className="min-h-screen bg-stone-950 text-stone-100 p-6 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
                <div>
                    <div className="flex items-center gap-3">
                        <span className="text-3xl">🌿</span>
                        <h1 className="text-2xl font-extrabold tracking-tight">Vida com Aroma — Admin</h1>
                    </div>
                    <p className="text-stone-500 text-sm mt-1">Painel de Gestão de Leads e Clientes</p>
                </div>
                <div className="flex gap-3">
                    <a
                        href="/api/admin/export"
                        className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-600 transition"
                    >
                        ⬇ Exportar CSV
                    </a>
                    <form action="/api/admin/logout" method="post">
                        <button className="flex items-center gap-2 rounded-xl bg-stone-800 px-4 py-2 text-sm font-bold text-stone-300 hover:bg-stone-700 transition border border-stone-700">
                            Sair
                        </button>
                    </form>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                    { label: "Total de Leads", value: totalLeads.toString(), icon: "🧑‍💻", color: "border-blue-700" },
                    { label: "Clientes Pagantes", value: totalPaid.toString(), icon: "💳", color: "border-emerald-600" },
                    { label: "Taxa de Conversão", value: `${conversionRate}%`, icon: "📈", color: "border-amber-500" },
                    { label: "Receita Total (R$)", value: `${totalRevenue.toFixed(2)}`, icon: "💰", color: "border-orange-500" },
                ].map((kpi) => (
                    <div key={kpi.label} className={`rounded-2xl bg-stone-900 border-l-4 ${kpi.color} p-6 border border-stone-800`}>
                        <div className="text-2xl mb-2">{kpi.icon}</div>
                        <div className="text-3xl font-black text-white">{kpi.value}</div>
                        <div className="text-sm text-stone-400 mt-1">{kpi.label}</div>
                    </div>
                ))}
            </div>

            {/* Leads Table */}
            <section className="mb-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                        <span>🧑‍💻</span> Leads Recentes
                    </h2>
                    <span className="text-xs text-stone-500 bg-stone-800 px-3 py-1 rounded-full border border-stone-700">
                        Mostrando os últimos {recentLeads.length}
                    </span>
                </div>
                <div className="rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-stone-800 text-stone-400 text-xs uppercase tracking-wider">
                                    <th className="text-left p-4">Email</th>
                                    <th className="text-left p-4">Queixa Principal</th>
                                    <th className="text-left p-4">Nível de Energia</th>
                                    <th className="text-left p-4">Restrições (Segurança)</th>
                                    <th className="text-left p-4">Status</th>
                                    <th className="text-left p-4">Cadastro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentLeads.map((lead, i) => (
                                    <tr
                                        key={lead.email}
                                        className={`border-b border-stone-800/50 hover:bg-stone-800/40 transition ${i % 2 === 0 ? "" : "bg-stone-900/50"}`}
                                    >
                                        <td className="p-4 font-medium text-stone-200">{lead.email}</td>
                                        <td className="p-4 text-stone-400 capitalize">{lead.mainComplaint ?? "—"}</td>
                                        <td className="p-4 text-stone-400 capitalize">
                                            {lead.energyLevel?.replace("_", " ") ?? "—"}
                                        </td>
                                        <td className="p-4 text-stone-400">
                                            {lead.clinicalRestrictions ? (
                                                <span className="text-xs bg-stone-800 px-2 py-1 rounded-md">{lead.clinicalRestrictions}</span>
                                            ) : "Seguro"}
                                        </td>
                                        <td className="p-4">
                                            {lead.hasPaid ? (
                                                <span className="bg-emerald-900/60 border border-emerald-700 text-emerald-400 text-xs font-bold px-2 py-1 rounded-full">
                                                    💳 Pago
                                                </span>
                                            ) : (
                                                <span className="bg-stone-800 border border-stone-700 text-stone-400 text-xs font-bold px-2 py-1 rounded-full">
                                                    Lead
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-stone-500 text-xs">
                                            {new Date(lead.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                                        </td>
                                    </tr>
                                ))}
                                {recentLeads.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-stone-500">Nenhum lead ainda. Comece a divulgar!</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* Transactions Table */}
            <section>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-stone-100 flex items-center gap-2">
                        <span>💳</span> Transações / Vendas
                    </h2>
                    <span className="text-xs text-stone-500 bg-stone-800 px-3 py-1 rounded-full border border-stone-700">
                        {transactions.length} registros
                    </span>
                </div>
                <div className="rounded-2xl bg-stone-900 border border-stone-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-stone-800 text-stone-400 text-xs uppercase tracking-wider">
                                    <th className="text-left p-4">Cliente</th>
                                    <th className="text-left p-4">Valor (R$)</th>
                                    <th className="text-left p-4">Status</th>
                                    <th className="text-left p-4">ID Pagamento</th>
                                    <th className="text-left p-4">Data</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((t, i) => (
                                    <tr
                                        key={t.id}
                                        className={`border-b border-stone-800/50 hover:bg-stone-800/40 transition ${i % 2 === 0 ? "" : "bg-stone-900/50"}`}
                                    >
                                        <td className="p-4 font-medium text-stone-200">{t.user.email}</td>
                                        <td className="p-4 text-emerald-400 font-bold">R$ {t.amount.toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full border ${t.status === "paid"
                                                ? "bg-emerald-900/60 border-emerald-700 text-emerald-400"
                                                : "bg-amber-900/60 border-amber-700 text-amber-400"
                                                }`}>
                                                {t.status === "paid" ? "✅ Pago" : t.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-stone-500 font-mono text-xs">{t.paymentId ?? "—"}</td>
                                        <td className="p-4 text-stone-500 text-xs">
                                            {new Date(t.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })}
                                        </td>
                                    </tr>
                                ))}
                                {transactions.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-stone-500">Nenhuma venda ainda. Você chega lá! 💚</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    );
}
