"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function ResultsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    const [mounted, setMounted] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleMockCheckout = async () => {
        if (!email) {
            alert("Email não encontrado para o checkout.");
            return;
        }

        setIsProcessing(true);

        try {
            const res = await fetch("/api/checkout/mock", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok && data.redirectUrl) {
                // Redireciona para a área de membros após "pagamento" mockado
                router.push(data.redirectUrl);
            } else {
                alert("Erro no checkout mockado: " + (data.error || "Desconhecido"));
                setIsProcessing(false);
            }
        } catch (error) {
            console.error(error);
            alert("Erro de conexão com o checkout.");
            setIsProcessing(false);
        }
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
                    <h1 className="mb-6 text-3xl md:text-5xl font-extrabold text-stone-900 leading-tight">
                        Descobrimos a Causa da Sua <br className="hidden md:block" /> Falta de Energia e Foco.
                    </h1>
                    <p className="mb-6 text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
                        Os dados do seu quiz mostram que você está enfrentando um esgotamento mental comum. A boa notícia? <strong>Não é culpa sua.</strong> O seu sistema límbico precisa de um reset, e a intervenção natural ideal para o seu caso já existe.
                    </p>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-6 md:p-8 mt-8 text-left">
                        <h2 className="mb-4 text-xl font-bold text-emerald-900 flex items-center gap-2">
                            <span className="text-2xl">🌿</span> O Seu Ritual Ideal: A Tríade do Equilíbrio
                        </h2>
                        <p className="text-stone-700 mb-6">
                            Baseado nas suas respostas, a combinação exata de <strong>Lavanda (calmante nervoso)</strong>, <strong>Alecrim (estimulante cognitivo)</strong> e <strong>Melaleuca (purificador ambiental)</strong> é o atalho para resultados em até 7 dias.
                        </p>

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
                </div>

                {/* Bloco 2: Depoimentos (Prova Social) */}
                <div className="rounded-2xl bg-stone-100 p-8 text-center">
                    <h3 className="text-2xl font-bold text-stone-800 mb-6">Pessoas reais. Resultados reais.</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm text-left">
                            <p className="text-stone-600 italic mb-4">"Eu testei o difusor com a proporção sugerida para foco no trabalho. Minha produtividade dobrou nesta semana e não me sinto mais exausta às 18h."</p>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-orange-200 rounded-full flex items-center justify-center font-bold text-orange-800">M</div>
                                <div>
                                    <p className="font-bold text-stone-900 text-sm">Mariana Costa</p>
                                    <p className="text-stone-400 text-xs">Testou o Ritual há 12 dias</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm text-left">
                            <p className="text-stone-600 italic mb-4">"Comprei o óleo na Shopee como o guia indicou e segui a diluição noturna para ansiedade. Fazia meses que eu não dormia 8 horas seguidas."</p>
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
                        Desbloqueie o "Guia do Ritual Completo" Agora
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
                        onClick={handleMockCheckout}
                        disabled={isProcessing}
                        className="w-full md:w-2/3 mx-auto flex items-center justify-center rounded-xl bg-orange-500 py-5 px-8 text-xl md:text-2xl font-black text-white shadow-[0_4px_14px_0_rgba(249,115,22,0.39)] hover:bg-orange-600 hover:shadow-[0_6px_20px_rgba(249,115,22,0.23)] hover:-translate-y-1 active:translate-y-0 disabled:opacity-75 disabled:hover:translate-y-0 disabled:hover:shadow-none transition-all duration-200"
                    >
                        {isProcessing ? "LIBERANDO ACESSO..." : "QUERO MEU ACESSO AGORA →"}
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
