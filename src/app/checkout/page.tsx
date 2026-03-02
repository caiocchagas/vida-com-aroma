"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");
    const brickContainerRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [errorMsg, setErrorMsg] = useState("");
    const brickControllerRef = useRef<any>(null);

    useEffect(() => {
        if (!email) {
            router.push("/");
            return;
        }

        const initMercadoPago = async () => {
            try {
                // 1. Cria a preferência no backend
                const res = await fetch("/api/checkout/mercadopago", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });
                const data = await res.json();

                if (!res.ok || !data.preferenceId) {
                    setErrorMsg(data.error || "Erro ao criar sessão de pagamento.");
                    setStatus("error");
                    return;
                }

                // 2. Carrega o SDK do Mercado Pago dinamicamente
                const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!;
                const mp = new (window as any).MercadoPago(publicKey, {
                    locale: "pt-BR",
                });

                // 3. Monta o Payment Brick
                const bricksBuilder = mp.bricks();
                const baseUrl = window.location.origin;

                brickControllerRef.current = await bricksBuilder.create("payment", "paymentBrick_container", {
                    initialization: {
                        amount: 19.90,
                        preferenceId: data.preferenceId,
                    },
                    customization: {
                        paymentMethods: {
                            creditCard: "all",
                            debitCard: "all",
                            ticket: "all",
                            bankTransfer: "all", // PIX
                            maxInstallments: 1,
                        },
                        visual: {
                            style: {
                                theme: "default",
                                customVariables: {
                                    baseColor: "#065f46",
                                    baseColorFirstVariant: "#047857",
                                    baseColorSecondVariant: "#059669",
                                    fontSizeXSmall: "12px",
                                    fontSizeMedium: "16px",
                                },
                            },
                        },
                    },
                    callbacks: {
                        onReady: () => {
                            setStatus("ready");
                        },
                        onSubmit: async ({ formData }: any) => {
                            // Processa o pagamento via backend
                            const payRes = await fetch("/api/checkout/mercadopago/process", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ ...formData, userEmail: email }),
                            });

                            const payData = await payRes.json();

                            if (!payRes.ok) {
                                throw new Error(payData.error || "Falha no pagamento");
                            }

                            if (payData.status === "approved") {
                                router.push(`/register?email=${encodeURIComponent(email)}`);
                            } else if (payData.status === "pending") {
                                router.push(`/results?email=${encodeURIComponent(email)}&status=pending`);
                            } else {
                                throw new Error("Pagamento não aprovado. Verifique os dados.");
                            }
                        },
                        onError: (error: any) => {
                            console.error("Erro no Payment Brick:", error);
                        },
                    },
                });
            } catch (error: any) {
                console.error("Erro ao inicializar MP:", error);
                setErrorMsg(error.message || "Erro desconhecido.");
                setStatus("error");
            }
        };

        // Injeta o script do MP dinamicamente se não existir
        if (!(window as any).MercadoPago) {
            const script = document.createElement("script");
            script.src = "https://sdk.mercadopago.com/js/v2";
            script.onload = initMercadoPago;
            document.head.appendChild(script);
        } else {
            initMercadoPago();
        }

        return () => {
            if (brickControllerRef.current) {
                brickControllerRef.current.unmount();
            }
        };
    }, [email, router]);

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

                {/* Brick Container */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-stone-200">
                    {status === "loading" && (
                        <div className="flex flex-col items-center justify-center py-12 text-stone-500">
                            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p>Carregando métodos de pagamento...</p>
                        </div>
                    )}
                    {status === "error" && (
                        <div className="text-center py-8">
                            <p className="text-red-600 font-bold mb-2">Ops! Algo deu errado.</p>
                            <p className="text-stone-500 text-sm mb-4">{errorMsg}</p>
                            <button
                                onClick={() => router.back()}
                                className="text-emerald-700 underline text-sm"
                            >
                                ← Voltar para os Resultados
                            </button>
                        </div>
                    )}

                    {/* O Brick do Mercado Pago será renderizado aqui */}
                    <div id="paymentBrick_container" ref={brickContainerRef}></div>
                </div>

                <p className="text-center text-xs text-stone-400">
                    🔒 Pagamento processado com segurança pelo Mercado Pago · SSL Certificado
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
