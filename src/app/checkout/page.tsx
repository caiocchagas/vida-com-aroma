"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function formatCPF(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");
    const brickControllerRef = useRef<any>(null);
    const [brickStatus, setBrickStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [cpf, setCpf] = useState("");
    const [cpfError, setCpfError] = useState("");

    function handleCpfChange(e: React.ChangeEvent<HTMLInputElement>) {
        const formatted = formatCPF(e.target.value);
        setCpf(formatted);
        if (cpfError) setCpfError("");
    }

    function validateCpf(raw: string) {
        const digits = raw.replace(/\D/g, "");
        return digits.length === 11;
    }

    function handleStartPayment() {
        if (!validateCpf(cpf)) {
            setCpfError("CPF inválido. Digite os 11 dígitos.");
            return;
        }
        setBrickStatus("loading");
        initMercadoPago();
    }

    async function initMercadoPago() {
        try {
            const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!;

            const createBrick = () => {
                const mp = new (window as any).MercadoPago(publicKey, { locale: "pt-BR" });
                const bricksBuilder = mp.bricks();

                const cpfDigits = cpf.replace(/\D/g, "");

                bricksBuilder.create("payment", "paymentBrick_container", {
                    initialization: {
                        amount: 1.00,
                        payer: {
                            email: email || "",
                            identification: {
                                type: "CPF",
                                number: cpfDigits,
                            },
                        },
                    },
                    customization: {
                        paymentMethods: {
                            creditCard: "all",
                            debitCard: "all",
                            bankTransfer: "all",
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
                                            transaction_amount: 1.00,
                                            installments: formData.installments || 1,
                                            payer: {
                                                ...formData.payer,
                                                identification: {
                                                    type: "CPF",
                                                    number: cpfDigits,
                                                },
                                            },
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
    }

    useEffect(() => {
        if (!email) {
            router.push("/");
        }
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
                    <p className="text-emerald-200 text-sm">Acesso Vitalício · R$ 1,00 · Pagamento Único</p>
                </div>

                {/* CPF */}
                {brickStatus === "idle" && (
                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-stone-200 space-y-4">
                        <div>
                            <label htmlFor="cpf" className="block text-sm font-semibold text-stone-700 mb-1">
                                CPF do pagador <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="cpf"
                                type="text"
                                inputMode="numeric"
                                placeholder="000.000.000-00"
                                value={cpf}
                                onChange={handleCpfChange}
                                className={`w-full border rounded-xl px-4 py-3 text-stone-800 text-base outline-none focus:ring-2 focus:ring-emerald-500 transition ${cpfError ? "border-red-400" : "border-stone-300"
                                    }`}
                            />
                            {cpfError && <p className="text-red-500 text-xs mt-1">{cpfError}</p>}
                        </div>
                        <button
                            onClick={handleStartPayment}
                            className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition text-base"
                        >
                            Continuar para Pagamento →
                        </button>
                    </div>
                )}

                {/* Brick */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-stone-200 min-h-[80px]">
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
