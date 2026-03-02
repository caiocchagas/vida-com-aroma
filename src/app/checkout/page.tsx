"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");
    const brickControllerRef = useRef<any>(null);
    const [brickStatus, setBrickStatus] = useState<"loading" | "ready" | "error">("loading");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!email) {
            router.push("/");
            return;
        }

        const initMercadoPago = async () => {
            try {
                const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!;

                const createBrick = () => {
                    const mp = new (window as any).MercadoPago(publicKey, { locale: "pt-BR" });
                    const bricksBuilder = mp.bricks();

                    bricksBuilder.create("payment", "paymentBrick_container", {
                        initialization: {
                            // Apenas o valor. SEM preferenceId.
                            // O Brick vai capturar o token do cartão e nos devolver no onSubmit.
                            amount: 19.90,
                        },
                        customization: {
                            paymentMethods: {
                                creditCard: "all",
                                debitCard: "all",
                                maxInstallments: 1,
                            },
                            visual: {
                                style: {
                                    theme: "default",
                                    customVariables: {
                                        baseColor: "#065f46",
                                        baseColorFirstVariant: "#047857",
                                        baseColorSecondVariant: "#059669",
                                    },
                                },
                            },
                        },
                        callbacks: {
                            onReady: () => setBrickStatus("ready"),

                            // O Brick devolve o token aqui — nós processamos no backend
                            onSubmit: ({ formData }: any) => {
                                return new Promise<void>(async (resolve, reject) => {
                                    try {
                                        const res = await fetch("/api/checkout/mercadopago/process", {
                                            method: "POST",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({
                                                token: formData.token,
                                                issuer_id: formData.issuer_id,
                                                payment_method_id: formData.payment_method_id,
                                                transaction_amount: 19.90,
                                                installments: formData.installments || 1,
                                                payer: formData.payer,
                                                userEmail: email,
                                            }),
                                        });

                                        const data = await res.json();

                                        if (!res.ok) {
                                            reject(new Error(data.error || "Falha no processamento"));
                                            return;
                                        }

                                        if (data.status === "approved") {
                                            resolve();
                                            window.location.href = `/register?email=${encodeURIComponent(email!)}`;
                                        } else if (data.status === "pending") {
                                            resolve();
                                            window.location.href = `/results?email=${encodeURIComponent(email!)}&status=pending`;
                                        } else {
                                            reject(new Error(data.statusDetail || "Pagamento recusado. Verifique os dados."));
                                        }
                                    } catch (err: any) {
                                        reject(err);
                                    }
                                });
                            },

                            onError: (error: any) => {
                                console.error("Brick error:", JSON.stringify(error));
                            },
                        },
                    }).then((controller: any) => {
                        brickControllerRef.current = controller;
                    });
                };

                if (!(window as any).MercadoPago) {
                    const script = document.createElement("script");
                    script.src = "https://sdk.mercadopago.com/js/v2";
                    script.onload = createBrick;
                    document.head.appendChild(script);
                } else {
                    createBrick();
                }
            } catch (error: any) {
                setErrorMsg(error.message || "Erro ao carregar o formulário.");
                setBrickStatus("error");
            }
        };

        initMercadoPago();

        return () => {
            if (brickControllerRef.current) {
                try { brickControllerRef.current.unmount(); } catch (_) { }
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

                <div className="rounded-2xl bg-white p-6 shadow-sm border border-stone-200 min-h-[280px]">
                    {brickStatus === "loading" && (
                        <div className="flex flex-col items-center justify-center py-12 text-stone-500">
                            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p>Carregando métodos de pagamento...</p>
                        </div>
                    )}
                    {brickStatus === "error" && (
                        <div className="text-center py-8">
                            <p className="text-red-600 font-bold mb-2">Erro ao carregar o formulário.</p>
                            <p className="text-stone-500 text-sm mb-4">{errorMsg}</p>
                            <button onClick={() => router.back()} className="text-emerald-700 underline text-sm">← Voltar</button>
                        </div>
                    )}
                    <div id="paymentBrick_container"></div>
                </div>

                <p className="text-center text-xs text-stone-400">
                    🔒 Dados protegidos com criptografia SSL · Mercado Pago
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
