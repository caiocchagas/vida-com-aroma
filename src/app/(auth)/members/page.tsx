import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function MembersDashboard() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const userEmail = session.user.email;

    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        include: {
            transactions: {
                where: { status: "paid" },
                orderBy: { createdAt: "desc" }
            }
        }
    });

    if (!user || !user.hasPaid) {
        redirect("/results");
    }

    const txs = user.transactions;
    const firstName = user.name?.split(' ')[0] ?? 'você';

    return (
        <main className="flex min-h-screen flex-col items-center bg-stone-50 p-4 md:p-8 text-stone-800 font-sans">
            <div className="w-full max-w-4xl mt-8 mb-20 space-y-8">

                {/* Cabeçalho do Dashboard */}
                <div className="rounded-2xl bg-emerald-900 p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="inline-block rounded-full bg-emerald-800 border border-emerald-700 px-4 py-1 text-xs font-bold text-emerald-300 mb-6 tracking-wider uppercase">
                            Painel do Aluno
                        </span>
                        <h1 className="mb-4 text-3xl md:text-5xl font-extrabold leading-tight">
                            Olá, {firstName} 🌿
                        </h1>
                        <p className="text-emerald-100 text-lg max-w-2xl leading-relaxed mt-4">
                            Aqui você encontra todos os seus Guias Aromáticos e análises personalizadas.
                        </p>
                    </div>
                </div>

                {/* Lista de Análises (Transações) */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-stone-900">Seus Protocolos</h2>

                    {txs.length === 0 ? (
                        <div className="bg-white p-8 rounded-2xl border border-stone-200 text-center">
                            <p className="text-stone-500">Você ainda não possui protocolos ativos.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2">
                            {txs.map((tx, idx) => (
                                <Link
                                    href={`/members/analysis/${tx.id}`}
                                    key={tx.id}
                                    className="group block bg-white border border-stone-200 rounded-2xl p-6 shadow-sm hover:border-emerald-500 hover:shadow-md transition-all"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xl font-bold group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                            🌿
                                        </div>
                                        <span className="text-xs font-bold text-stone-400">
                                            {tx.createdAt.toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-stone-800 mb-2 group-hover:text-emerald-700">
                                        Análise Aromática {idx === txs.length - 1 ? "(Primeira)" : `#${txs.length - idx}`}
                                    </h3>
                                    <p className="text-stone-500 text-sm">
                                        Clique para ver seu diagnóstico clínico e o protocolo de 21 dias.
                                    </p>
                                    <div className="mt-6 flex items-center text-emerald-600 font-bold text-sm">
                                        Acessar Guia Completeto <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* ─── UPSELL: NOVA ANÁLISE COM 50% DE DESCONTO ─── */}
                <div className="rounded-2xl overflow-hidden shadow-xl border border-emerald-200 mt-12">
                    <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-8 md:p-10 text-white text-center relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/5" />

                        <div className="relative z-10">
                            <span className="inline-block rounded-full bg-yellow-400 text-yellow-900 px-4 py-1 text-xs font-extrabold mb-4 tracking-widest uppercase shadow-lg">
                                🎁 Oferta Exclusiva
                            </span>
                            <h2 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">
                                Sua vida mudou? <br />
                                <span className="text-emerald-300">Refaça sua análise com 50% off.</span>
                            </h2>
                            <p className="text-emerald-100 text-lg max-w-xl mx-auto leading-relaxed mb-8">
                                As necessidades do corpo e da mente mudam com o tempo. Você também pode dar de presente para alguém. Refaça o quiz e ganhe 50% de desconto no novo guia.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/?returning=true" className="inline-block rounded-full bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-extrabold text-lg px-10 py-4 transition shadow-xl hover:shadow-yellow-400/30 hover:scale-105 active:scale-95">
                                    Quero Minha Análise Atualizada →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
