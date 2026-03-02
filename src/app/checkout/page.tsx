"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [errorMsg, setErrorMsg] = useState("");
    const [initPoint, setInitPoint] = useState<string | null>(null);

    useEffect(() => {
        if (!email) {
            router.push("/");
            return;
        }

        const createPreference = async () => {
            try {
                const res = await fetch("/api/checkout/mercadopago", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });
                const data = await res.json();

                if (!res.ok || !data.initPoint) {
                    setErrorMsg(data.error || "Erro ao criar sessão de pagamento.");
                    setStatus("error");
                    return;
                }

                setInitPoint(data.initPoint);
                setStatus("ready");
            } catch (error: any) {
                setErrorMsg(error.message || "Erro ao criar sessão de pagamento.");
                setStatus("error");
            }
        };

        createPreference();
    }, [email, router]);

    const handleGoToPayment = () => {
        if (initPoint) {
            window.location.href = initPoint;
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center bg-stone-50 p-4 font-sans">
            <div className="w-full max-w-2xl mt-8 mb-20 space-y-6">

                {/* Cabeçalho */}
                <div className="rounded-2xl bg-emerald-900 p-6 text-white text-center shadow-xl">
                    <span className="inline-block rounded-full bg-emerald-800 border border-emerald-700 px-4 py-1 text-xs font-bold text-emerald-300 mb-4 tracking-wider uppercase">
                        Pagamento 100% Seguro
                    </span>
                    <h1 className="text-2xl font-extrabold mb-1">Guia Aromático de 21 Dias</h1>
                    <p className="text-emerald-200 text-sm">Acesso Vitalício · R$ 19,90 · Pagamento Único</p>
                </div>

                {/* Conteúdo */}
                <div className="rounded-2xl bg-white p-8 shadow-sm border border-stone-200 text-center">
                    {status === "loading" && (
                        <div className="flex flex-col items-center justify-center py-12 text-stone-500">
                            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p>Preparando o seu pagamento seguro...</p>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="text-center py-8">
                            <p className="text-red-600 font-bold mb-2">Ops! Algo deu errado.</p>
                            <p className="text-stone-500 text-sm mb-4">{errorMsg}</p>
                            <button onClick={() => router.back()} className="text-emerald-700 underline text-sm">
                                ← Voltar para os Resultados
                            </button>
                        </div>
                    )}

                    {status === "ready" && (
                        <div className="py-6">
                            <div className="text-5xl mb-6">🔐</div>
                            <h2 className="text-xl font-bold text-stone-900 mb-3">Tudo pronto para o pagamento!</h2>
                            <p className="text-stone-500 mb-8 max-w-sm mx-auto">
                                Você será levado para a página segura do <strong>Mercado Pago</strong> para pagar com <strong>PIX, Cartão de Crédito ou Boleto</strong>.
                            </p>

                            <div className="flex flex-col gap-3 items-center mb-8">
                                <div className="flex items-center gap-2 text-stone-600 text-sm">
                                    <span className="text-green-500 text-lg">✓</span> PIX (aprovação instantânea)
                                </div>
                                <div className="flex items-center gap-2 text-stone-600 text-sm">
                                    <span className="text-green-500 text-lg">✓</span> Cartão de Crédito / Débito
                                </div>
                                <div className="flex items-center gap-2 text-stone-600 text-sm">
                                    <span className="text-green-500 text-lg">✓</span> Boleto Bancário
                                </div>
                            </div>

                            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-8">
                                <p className="text-emerald-800 font-bold text-2xl">R$ 19,90</p>
                                <p className="text-emerald-600 text-sm">Pagamento único · Acesso vitalício</p>
                            </div>

                            <button
                                onClick={handleGoToPayment}
                                className="w-full rounded-xl bg-[#009ee3] hover:bg-[#007cb7] py-4 px-8 text-lg font-bold text-white shadow-lg transition-all hover:-translate-y-0.5"
                            >
                                Pagar com Mercado Pago →
                            </button>
                        </div>
                    )}
                </div>

                <p className="text-center text-xs text-stone-400">
                    🔒 Ambiente 100% seguro · Seus dados são protegidos pelo Mercado Pago
                </p>
            </div>
        </main>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-stone-50 flex items-center justify-center">Carregando...</div>}>
            <CheckoutContent />
        </Suspense>
    );
}
