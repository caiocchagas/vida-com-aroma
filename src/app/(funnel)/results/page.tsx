"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function ResultsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [mounted, setMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [recommendations, setRecommendations] = useState<any>(null);

    useEffect(() => {
        setMounted(true);
        if (email) {
            fetch(`/api/user?email=${encodeURIComponent(email)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.recommendations) {
                        setRecommendations(data.recommendations);
                    }
                })
                .catch(err => console.error(err));
        }
    }, [email]);

    const handleCheckout = () => {
        if (!email) {
            alert("Email não encontrado. Por favor, refaça o Quiz.");
            return;
        }
        setIsProcessing(true);
        router.push(`/checkout?email=${encodeURIComponent(email)}`);
    };

    if (!mounted) return null;

    return (
        <main className="flex min-h-screen flex-col items-center bg-stone-50 p-4 text-stone-800 font-sans">
            <div className="w-full max-w-3xl mt-8 mb-20 space-y-6">

                {/* Bloco 1: A Promessa e o Diagnóstico */}
                <div className="rounded-2xl bg-white p-8 md:p-10 shadow-xl text-center border-t-8 border-emerald-600">
                    <span className="inline-block rounded-full bg-emerald-100 px-4 py-1 text-sm font-bold text-emerald-800 mb-6 animate-pulse">
                        Análise Concluída com Sucesso!
                    </span>
                    <h1 className="mb-6 text-3xl md:text-5xl font-extrabold text-stone-900 leading-tight flex flex-col gap-2">
                        <span className="text-xl md:text-2xl text-emerald-700 font-bold uppercase tracking-wider">O Seu Perfil Aromático:</span>
                        {recommendations ? recommendations.diagnosisTitle : "Gerando perfil..."}
                    </h1>
                    <div className="mb-6 text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto bg-stone-100 p-6 rounded-xl border-l-4 border-emerald-500 text-left">
                        <span className="font-bold text-stone-800 uppercase text-xs tracking-wider mb-2 block">A Nossa Análise:</span>
                        {recommendations ? recommendations.diagnosisText : "Processando variáveis..."}
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-6 md:p-8 mt-8 text-left">
                        <h2 className="mb-4 text-xl font-bold text-emerald-900 flex items-center gap-2">
                            <span className="text-2xl">🌿</span> As Suas Melhores Opções
                        </h2>
                        <p className="text-stone-700 mb-6">
                            Para o seu perfil, temos altíssima compatibilidade com as seguintes sinergias:
                        </p>

                        {recommendations?.synergies && (
                            <div className="space-y-4 mb-8">
                                {recommendations.synergies.map((syn: any, idx: number) => (
                                    <div key={idx} className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                                        <h3 className="font-bold text-emerald-900 text-lg mb-1">{syn.title}</h3>
                                        <p className="text-emerald-700 font-semibold mb-2 text-sm">{syn.oils.map((o: any) => o.name).join(" + ")}</p>
                                        <p className="text-stone-600 text-sm leading-relaxed"><strong>{syn.actionName}:</strong> {syn.actionDesc}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {(recommendations?.alerts?.isPregnant || recommendations?.alerts?.hasBaby || recommendations?.alerts?.hasPet || recommendations?.alerts?.isAsma) && (
                            <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                                <h4 className="font-bold text-amber-800 mb-1 flex items-center gap-2">⚠️ Atenção Específica Detectada</h4>
                                <ul className="text-sm text-amber-700 list-disc list-inside">
                                    {recommendations.alerts.isPregnant && <li>Ajuste de diluição para 1% obrigatório devido à gestação.</li>}
                                    {recommendations.alerts.hasBaby && <li>Protocolos específicos para ambientes com bebês adicionados ao guia.</li>}
                                    {recommendations.alerts.hasPet && <li>Orientações de ventilação segura para os seus pets incluídas.</li>}
                                    {recommendations.alerts.isAsma && <li>Inalação direta suspensa (substituída por difusão branda) devido ao histórico respiratório.</li>}
                                </ul>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                                <div className="mr-4 text-2xl">⚡</div>
                                <div>
                                    <h4 className="font-bold text-stone-900">Ação no Sistema Límbico em 22 Segundos</h4>
                                    <p className="text-stone-600 text-sm">As moléculas atingem o cérebro rapidamente, barrando o cortisol (hormônio do estresse).</p>
                                </div>
                            </div>
                            <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                                <div className="mr-4 text-2xl">👶</div>
                                <div>
                                    <h4 className="font-bold text-stone-900">100% Seguro para o seu Ambiente</h4>
                                    <p className="text-stone-600 text-sm">Ajustado para quem possui intolerâncias ou crianças/pets em casa.</p>
                                </div>
                            </div>
                            <div className="flex items-start bg-white p-4 rounded-lg shadow-sm">
                                <div className="mr-4 text-2xl">💤</div>
                                <div>
                                    <h4 className="font-bold text-stone-900">Sono Reparador & Acordar Disposto</h4>
                                    <p className="text-stone-600 text-sm">Regula seu ciclo circadiano naturalmente, sem remédios que causam dependência.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Novo Bloco: Incensos e Velas */}
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-6 md:p-8 mt-8 text-left">
                        <h2 className="mb-4 text-xl font-bold text-indigo-900 flex items-center gap-2">
                            <span className="text-2xl">✨</span> Potencializando com Incensos e Velas
                        </h2>
                        <p className="text-stone-700 mb-4">
                            Você pode maximizar ainda mais a ação da aromaterapia combinando o uso dos óleos com a queima de <strong>Incensos Naturais</strong> e <strong>Velas Aromáticas</strong>.
                        </p>
                        <p className="text-stone-700">
                            A união dessas ferramentas ajuda a limpar as energias pesadas do ambiente e cria uma atmosfera perfeita de relaxamento e acolhimento para a sua rotina.
                        </p>
                    </div>
                </div>

                {/* Bloco 2: Depoimentos (Prova Social) */}
                <div className="rounded-2xl bg-stone-100 p-8 text-center">
                    <h3 className="text-2xl font-bold text-stone-800 mb-6">Pessoas reais. Resultados reais.</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm text-left">
                            <p className="text-stone-600 italic mb-4">&quot;Eu testei o difusor com a proporção sugerida para foco no trabalho. Minha produtividade dobrou nesta semana e não me sinto mais exausta às 18h.&quot;</p>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-orange-200 rounded-full flex items-center justify-center font-bold text-orange-800">M</div>
                                <div>
                                    <p className="font-bold text-stone-900 text-sm">Mariana Costa</p>
                                    <p className="text-stone-400 text-xs">Testou o Ritual há 12 dias</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm text-left">
                            <p className="text-stone-600 italic mb-4">&quot;Comprei o óleo na Shopee como o guia indicou e segui a diluição noturna para ansiedade. Fazia meses que eu não dormia 8 horas seguidas.&quot;</p>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-emerald-200 rounded-full flex items-center justify-center font-bold text-emerald-800">R</div>
                                <div>
                                    <p className="font-bold text-stone-900 text-sm">Rafael Oliveira</p>
                                    <p className="text-stone-400 text-xs">Testou o Ritual há 3 semanas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bloco 3: Oferta Irresistível e CTA */}
                <div className="rounded-2xl bg-emerald-900 p-8 md:p-10 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
                        VAGAS LIMITADAS
                    </div>

                    <h3 className="text-2xl md:text-3xl font-extrabold mb-4">
                        Desbloqueie o &quot;Guia do Ritual Completo&quot; Agora
                    </h3>
                    <p className="text-emerald-100 mb-8 max-w-xl mx-auto">
                        Você terá acesso imediato à Área de Membros com o passo-a-passo exato, dosagens corretas, dicas de segurança e os links secretos (baratos e originais) para comprar seus óleos hoje.
                    </p>

                    <div className="bg-emerald-800/50 rounded-xl p-6 mb-8 border border-emerald-700 max-w-md mx-auto">
                        <p className="text-emerald-200 mb-2 font-medium">De <span className="line-through text-emerald-400">R$ 97,00</span> por apenas:</p>
                        <div className="text-6xl font-black text-white mb-2">R$ 19,90</div>
                        <p className="text-sm text-emerald-300">Pagamento único. Acesso vitalício.</p>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="w-full md:w-2/3 mx-auto flex items-center justify-center rounded-xl bg-orange-500 py-5 px-8 text-xl md:text-2xl font-black text-white shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:bg-orange-600 hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-75 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-200"
                    >
                        {isProcessing ? "ABRINDO CHECKOUT SEGURO..." : "QUERO MEU ACESSO AGORA →"}
                    </button>

                    <div className="mt-6 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-emerald-300/80">
                        <span className="flex items-center gap-1">🔒 Compra 100% Segura (Ambiente Teste)</span>
                        <span className="hidden md:inline">•</span>
                        <span className="flex items-center gap-1">✅ Garantia de 7 Dias</span>
                    </div>
                </div>

            </div>
        </main>
    );
}

export default function ResultsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center">Carregando Resultados Personalizados...</div>}>
            <ResultsContent />
        </Suspense>
    );
}
