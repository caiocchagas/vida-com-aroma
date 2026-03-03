"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

interface PixData {
    paymentId: string;
    qrCode: string;
    qrCodeBase64: string;
}

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get("email");
    const brickControllerRef = useRef<any>(null);
    const [brickStatus, setBrickStatus] = useState<"loading" | "ready" | "error">("loading");
    const [errorMsg, setErrorMsg] = useState("");
    const [pixData, setPixData] = useState<PixData | null>(null);
    const [copied, setCopied] = useState(false);

    function handleCopy() {
        if (!pixData?.qrCode) return;
        navigator.clipboard.writeText(pixData.qrCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
    }

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
                            amount: 1.00,
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
                                        } else if (data.status === "pending" && data.qrCode) {
                                            // PIX: mostrar QR Code na tela
                                            resolve();
                                            setPixData({
                                                paymentId: data.paymentId,
                                                qrCode: data.qrCode,
                                                qrCodeBase64: data.qrCodeBase64,
                                            });
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

    // Tela de PIX gerado
    if (pixData) {
        return (
            <main className="flex min-h-screen flex-col items-center bg-stone-50 p-4 font-sans">
                <div className="w-full max-w-md mt-8 mb-20 space-y-6">
                    <div className="rounded-2xl bg-emerald-900 p-6 text-white text-center shadow-xl">
                        <span className="text-3xl mb-2 block">✅</span>
                        <h1 className="text-xl font-extrabold mb-1">PIX gerado com sucesso!</h1>
                        <p className="text-emerald-200 text-sm">Escaneie o QR Code ou copie o código abaixo</p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm border border-stone-200 flex flex-col items-center gap-4">
                        {pixData.qrCodeBase64 && (
                            <img
                                src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                                alt="QR Code PIX"
                                className="w-56 h-56 rounded-xl border border-stone-200"
                            />
                        )}

                        <p className="text-stone-500 text-sm text-center">ou use o código copia e cola:</p>

                        <div className="w-full bg-stone-100 rounded-xl p-3 text-xs text-stone-600 break-all font-mono select-all">
                            {pixData.qrCode}
                        </div>

                        <button
                            onClick={handleCopy}
                            className={`w-full py-3 rounded-xl font-bold text-white transition text-sm ${copied ? "bg-emerald-500" : "bg-emerald-700 hover:bg-emerald-600"
                                }`}
                        >
                            {copied ? "✓ Código copiado!" : "📋 Copiar código PIX"}
                        </button>
                    </div>

                    <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-amber-800 text-sm text-center">
                        ⏳ Após o pagamento, seu acesso será liberado automaticamente em instantes.
                    </div>

                    <p className="text-center text-xs text-stone-400">
                        🔒 Dados protegidos com criptografia SSL · Mercado Pago
                    </p>
                </div>
            </main>
        );
    }

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
