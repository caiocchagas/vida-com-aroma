import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRecommendations } from "@/lib/recommendations";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const userEmail = session.user.email;

    // Verifica no banco se o usuário realmente pagou
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: {
            hasPaid: true,
            name: true,
            focusArea: true,
            interest: true,
            safety: true,
            stressLevel: true,
            physicalSymptoms: true,
            experience: true,
            scentSensitivity: true
        },
    });

    if (!user || !user.hasPaid) {
        redirect("/results");
    }


    const recs = getRecommendations(user);
    const { primaryOil, secondaryOil, environmentOil } = recs;

    const showIncense = recs.showIncense;
    const hasPets = recs.hasPets;
    const hasKids = recs.hasKids;

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
                        {(hasPets || hasKids) && (
                            <div className="rounded-xl bg-amber-50 p-6 border border-amber-100">
                                <h3 className="font-bold text-amber-900 mb-3 text-lg">
                                    Atenção Específica para {hasPets && hasKids ? "Pets e Crianças" : hasPets ? "seus Pets" : "suas Crianças"}
                                </h3>
                                <ul className="space-y-3 text-amber-800">
                                    <li className="flex items-start gap-2"><span>✅</span> <span>Mantenha a porta do ambiente <strong>sempre aberta</strong>. Animais e crianças precisam poder sair se o cheiro ficar forte.</span></li>
                                    <li className="flex items-start gap-2"><span>❌</span> <span>Nunca aplique a gota pura diretamente na pele ou no pelo do animal.</span></li>
                                    {hasPets && <li className="flex items-start gap-2"><span>❌</span> <span>Óleo de Melaleuca é altamente tóxico se ingerido por gatos. Use apenas no difusor longe do alcance.</span></li>}
                                    {hasKids && <li className="flex items-start gap-2"><span>⚠️</span> <span>Para crianças menores de 3 anos, a diluição de óleos deve ser de no máximo 0.5% (1 gota para cada 10ml de óleo carreador).</span></li>}
                                </ul>
                            </div>
                        )}

                        {!hasPets && !hasKids && (
                            <div className="rounded-xl bg-emerald-50 p-6 border border-emerald-100">
                                <h3 className="font-bold text-emerald-900 mb-3 text-lg">Ambiente Seguro detectado!</h3>
                                <p className="text-emerald-800 mb-3">
                                    Como você não marcou restrições com pets ou crianças, você tem total liberdade para usar os difusores ultrassônicos em ambientes fechados para potencializar a absorção.
                                </p>
                            </div>
                        )}

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
                        {[
                            { role: "Essencial Diário", oil: primaryOil },
                            { role: "Suporte Específico", oil: secondaryOil },
                            { role: "Tratamento de Ambiente", oil: environmentOil }
                        ].map((item, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row gap-6 items-start">
                                <div className={`${item.oil.colorClass} p-4 rounded-xl w-full md:w-1/3 flex-shrink-0 text-center font-bold text-xl border`}>
                                    🌿 {item.oil.name}
                                    <span className="block mt-2 text-sm font-normal opacity-80">({item.oil.botanicalName})</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-stone-800 mb-2">Para: {item.oil.benefit} <span className="text-sm font-normal text-stone-500">({item.role})</span></h3>
                                    <p className="text-stone-600 mb-4">{item.oil.description}</p>
                                    <div className="bg-stone-50 p-3 rounded-lg text-sm text-stone-700 border border-stone-200">
                                        <strong>Aplicação:</strong> {item.oil.ritual}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Módulo Incensos (Condicional) */}
                {showIncense && (
                    <div className="rounded-2xl bg-indigo-50 p-8 shadow-sm border border-indigo-100">
                        <h2 className="mb-6 text-2xl font-bold text-indigo-900 border-b border-indigo-200 pb-4 flex items-center gap-2">
                            <span className="text-3xl">✨</span> Bônus: O Poder Oculto dos Incensos
                        </h2>

                        <p className="text-indigo-800 mb-6 text-lg">
                            Como você demonstrou interesse em incensos, preparamos este material avançado. Incensos naturais não apenas perfumam, o elemento do <strong className="font-black">Fogo</strong> e a queima de resinas sagradas limpam energias pesadas e miasmas (memórias densas) do ambiente.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
                                <h3 className="font-bold text-indigo-900 text-lg mb-3">Palo Santo (Madeira Sagrada)</h3>
                                <p className="text-stone-600 mb-2"><strong>Ação:</strong> Limpeza profunda e elevação espiritual.</p>
                                <p className="text-stone-600 text-sm">Ótimo para queimar no fim da tarde ou após discussões pesadas na casa. Diferente de incensos comuns, um bastão de Palo Santo apaga sozinho e dura semanas.</p>
                            </div>

                            <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
                                <h3 className="font-bold text-indigo-900 text-lg mb-3">Incenso de Sândalo</h3>
                                <p className="text-stone-600 mb-2"><strong>Ação:</strong> Introspecção, Meditação e Calma.</p>
                                <p className="text-stone-600 text-sm">Sândalo é usado há milênios em templos indianos. É o parceiro perfeito para acender 10 minutos antes de tentar dormir ou praticar yoga.</p>
                            </div>
                        </div>

                        <div className="mt-8 bg-indigo-900 text-indigo-100 p-6 rounded-xl">
                            <h4 className="font-bold text-white mb-2 flex items-center gap-2">⚠️ Alerta de Saúde</h4>
                            <p className="text-sm opacity-90">
                                90% dos incensos baratos de prateleira são feitos com carvão tóxico e essências de petróleo (sintéticas). Queimar isso causa dor de cabeça e alergias. Compre <strong className="text-white">apenas</strong> incensos de resina orgânica ou formato massala.
                            </p>
                        </div>
                    </div>
                )}

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
                            { nome: `Óleo de ${primaryOil.name}`, desc: "10ml - Marca Original Via Aroma", link: primaryOil.shopeeLink },
                            { nome: `Óleo de ${secondaryOil.name}`, desc: "10ml - Marca Original Via Aroma", link: secondaryOil.shopeeLink },
                            { nome: `Óleo de ${environmentOil.name}`, desc: "10ml - Marca Original Via Aroma", link: environmentOil.shopeeLink },
                            { nome: "Óleo Carreador de Semente de Uva / Coco", desc: "100ml - Puro para massagem", link: "https://shopee.com.br/search?keyword=oleo%20carreador%20vegetal" },
                            { nome: "Difusor Ultrassônico Básico", desc: "300ml - Com cromoterapia (led)", link: "https://shopee.com.br/search?keyword=difusor%20oleo%20essencial" },
                            ...(showIncense ? [
                                { nome: "Incensário em Cerâmica", desc: "Base para queima com efeito cascata", link: "https://shopee.com.br" },
                                { nome: "Palo Santo Original do Peru", desc: "Caixa com 5 bastões puros", link: "https://shopee.com.br" },
                                { nome: "Incenso Massala Sândalo (Goloka)", desc: "Caixa mista premium - Sem carvão", link: "https://shopee.com.br" },
                            ] : [])
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
