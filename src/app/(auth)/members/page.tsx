import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function MembersPage({
    searchParams,
}: {
    searchParams: Promise<{ email?: string }>;
}) {
    const { email } = await searchParams;

    if (!email) {
        redirect("/");
    }

    // Verifica no banco se o usuário realmente pagou
    const user = await prisma.user.findUnique({
        where: { email },
        select: { hasPaid: true, name: true, focusArea: true },
    });

    if (!user || !user.hasPaid) {
        // Se não existir ou não tiver pago, redireciona para o Quiz
        redirect("/");
    }

    return (
        <main className="flex min-h-screen flex-col items-center bg-stone-50 p-4 md:p-8 text-stone-800 font-sans">
            <div className="w-full max-w-4xl mt-8 mb-20 space-y-8">

                {/* Cabeçalho */}
                <div className="rounded-2xl bg-emerald-900 p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="inline-block rounded-full bg-emerald-800 border border-emerald-700 px-4 py-1 text-xs font-bold text-emerald-300 mb-6 tracking-wider">
                            ACESSO PREMIUM LIBERADO
                        </span>
                        <h1 className="mb-4 text-3xl md:text-5xl font-extrabold leading-tight">
                            O Seu Guia Prático <br /> de Aromaterapia Clínica 🌿
                        </h1>
                        <p className="text-emerald-100 text-lg md:text-xl max-w-2xl leading-relaxed">
                            Bem-vindo(a)! Abaixo você encontra o passo a passo exato para reconfigurar seu sistema límbico, focado no seu objetivo principal de <strong>{user.focusArea || "equilíbrio"}</strong>.
                        </p>
                    </div>
                    <div className="absolute top-0 right-0 opacity-10 text-[200px] leading-none transform translate-x-1/4 -translate-y-1/4">
                        🌿
                    </div>
                </div>

                {/* 1. Módulo de Segurança Essencial */}
                <div className="rounded-2xl bg-white p-8 shadow-sm border border-stone-100">
                    <h2 className="mb-6 text-2xl font-bold text-emerald-900 border-b pb-4 flex items-center gap-2">
                        <span className="text-3xl">🛡️</span> 1. Regra de Ouro da Segurança
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="rounded-xl bg-amber-50 p-6 border border-amber-100">
                            <h3 className="font-bold text-amber-900 mb-3 text-lg">Para quem tem Pets e Crianças</h3>
                            <ul className="space-y-3 text-amber-800">
                                <li className="flex items-start gap-2"><span>✅</span> <span>Mantenha a porta do ambiente <strong>sempre aberta</strong>. Animais e crianças precisam poder sair se o cheiro ficar forte.</span></li>
                                <li className="flex items-start gap-2"><span>❌</span> <span>Nunca aplique a gota pura diretamente na pele ou no pelo do animal.</span></li>
                                <li className="flex items-start gap-2"><span>❌</span> <span>Óleo de Melaleuca é altamente tóxico se ingerido por gatos. Use apenas no difusor.</span></li>
                            </ul>
                        </div>

                        <div className="rounded-xl bg-stone-50 p-6 border border-stone-100">
                            <h3 className="font-bold text-stone-900 mb-3 text-lg">Diluição Correta (Uso Tópico)</h3>
                            <p className="text-stone-600 mb-4">Óleos essenciais são altamente concentrados. Você deve diluí-los antes de encostar na pele (Massagem nas têmporas, pulsos ou sola do pé).</p>
                            <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm text-center">
                                <span className="font-bold text-emerald-700 text-xl">1 Gota de Óleo Essencial</span>
                                <div className="text-stone-400 my-1">+</div>
                                <span className="font-bold text-emerald-700 text-xl">1 Colher de Óleo Coco</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Conteúdo do Ritual (Os 3 Óleos de Ouro) */}
                <div className="rounded-2xl bg-white p-8 shadow-sm border border-stone-100">
                    <h2 className="mb-6 text-2xl font-bold text-emerald-900 border-b pb-4 flex items-center gap-2">
                        <span className="text-3xl">💧</span> 2. Os 3 Óleos do Seu Ritual
                    </h2>

                    <div className="space-y-8">
                        {/* Lavanda */}
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="bg-purple-100 text-purple-800 p-4 rounded-xl w-full md:w-1/3 flex-shrink-0 text-center font-bold text-xl border border-purple-200">
                                🌿 Lavanda Francesa
                                <span className="block mt-2 text-sm font-normal text-purple-600">(Lavandula angustifolia)</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-stone-800 mb-2">Para: Ansiedade e Insônia</h3>
                                <p className="text-stone-600 mb-4">O regulador oficial do sistema nervoso. Ele reduz os batimentos cardíacos e abaixa os níveis de cortisol induzindo a um estado de calma profunda.</p>
                                <div className="bg-stone-50 p-3 rounded-lg text-sm text-stone-700 border border-stone-200">
                                    <strong>Ritual Noturno:</strong> Pingue 1 gota pura no canto do travesseiro 10 min antes de deitar ou coloque 4 gotas no difusor com água.
                                </div>
                            </div>
                        </div>

                        {/* Alecrim */}
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="bg-emerald-100 text-emerald-800 p-4 rounded-xl w-full md:w-1/3 flex-shrink-0 text-center font-bold text-xl border border-emerald-200">
                                🌿 Alecrim
                                <span className="block mt-2 text-sm font-normal text-emerald-600">(Rosmarinus officinalis)</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-stone-800 mb-2">Para: Foco, Memória e Energia</h3>
                                <p className="text-stone-600 mb-4">Estimulante cognitivo poderoso. Estudos mostram que inalar alecrim melhora a memorização em até 75% e tira o "nevoeiro mental" da exaustão.</p>
                                <div className="bg-stone-50 p-3 rounded-lg text-sm text-stone-700 border border-stone-200">
                                    <strong>Ritual Matinal:</strong> Inale profundamente o frasco por 3 respirações lentas ao acordar ou antes de uma tarefa difícil no trabalho.
                                </div>
                            </div>
                        </div>

                        {/* Melaleuca */}
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="bg-teal-100 text-teal-800 p-4 rounded-xl w-full md:w-1/3 flex-shrink-0 text-center font-bold text-xl border border-teal-200">
                                🌿 Melaleuca (Tea Tree)
                                <span className="block mt-2 text-sm font-normal text-teal-600">(Melaleuca alternifolia)</span>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-stone-800 mb-2">Para: Imunidade e Purificação</h3>
                                <p className="text-stone-600 mb-4">Antisséptico, antiviral e bactericida. Excelente para períodos onde a imunidade cai devido ao estresse prolongado.</p>
                                <div className="bg-stone-50 p-3 rounded-lg text-sm text-stone-700 border border-stone-200">
                                    <strong>Ritual de Limpeza:</strong> Coloque 3 gotas no difusor para purificar o ar do ambiente de trabalho se sentir que vai gripar.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Arsenal (Links de Afiliados) */}
                <div className="rounded-2xl bg-orange-50 p-8 shadow-sm border border-orange-100">
                    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-orange-200 pb-4">
                        <h2 className="text-2xl font-bold text-orange-900 flex items-center gap-2">
                            <span className="text-3xl">🛒</span> 3. Onde Comprar (Seu Arsenal)
                        </h2>
                        <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-orange-600 border border-orange-200">
                            Links Oficiais & Baratos
                        </span>
                    </div>

                    <p className="text-orange-800 mb-6">
                        Não compre óleos sintéticos de farmácia (eles não têm efeito terapêutico). Abaixo filtrei lojas da Shopee que vendem óleos <strong>puros, originais e com laudo técnico</strong>, pagando até 4x menos que grandes marcas de multinível.
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">
                        {[
                            { nome: "Óleo Essencial de Lavanda Francesa (Via Aroma)", desc: "10ml - Marca Original", link: "https://shopee.com.br" },
                            { nome: "Óleo Essencial de Alecrim (Via Aroma)", desc: "10ml - Marca Original", link: "https://shopee.com.br" },
                            { nome: "Óleo Carreador de Semente de Uva / Coco", desc: "100ml - Puro para massagem", link: "https://shopee.com.br" },
                            { nome: "Difusor Ultrassônico Básico", desc: "300ml - Com cromoterapia (led)", link: "https://shopee.com.br" },
                        ].map((item, index) => (
                            <a
                                key={index}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex flex-col bg-white rounded-xl border border-orange-200/60 p-5 hover:border-orange-500 hover:shadow-lg transition-all"
                            >
                                <div className="mb-4">
                                    <span className="block font-bold text-stone-900 text-lg">{item.nome}</span>
                                    <span className="text-sm text-stone-500">{item.desc}</span>
                                </div>
                                <span className="mt-auto inline-block w-full text-center rounded-lg bg-orange-500 py-3 text-sm font-bold text-white shadow-md group-hover:bg-orange-600 transition-colors">
                                    🛒 Ver na Shopee
                                </span>
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </main>
    );
}
