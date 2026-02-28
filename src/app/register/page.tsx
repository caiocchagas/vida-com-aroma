"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function RegisterContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailFromUrl = searchParams.get("email") ?? "";

    const [name, setName] = useState("");
    const [email, setEmail] = useState(emailFromUrl);
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirm) {
            setError("As senhas não coincidem.");
            return;
        }

        setLoading(true);

        const res = await fetch("/api/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.error || "Erro ao criar conta.");
            setLoading(false);
            return;
        }

        // Auto-login after registration
        const signInResult = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (signInResult?.ok) {
            router.push("/members");
        } else {
            setError("Conta criada! Faça login para continuar.");
            router.push("/login");
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-stone-950 via-emerald-950 to-stone-900 p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <span className="text-5xl">🌿</span>
                    <h1 className="mt-3 text-3xl font-extrabold text-white">Crie sua Conta</h1>
                    <p className="mt-2 text-emerald-300/80">Acesse seu Guia Personalizado de Aromaterapia</p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm shadow-2xl">
                    {emailFromUrl && (
                        <div className="mb-6 rounded-xl bg-emerald-900/50 border border-emerald-700 p-4 text-sm text-emerald-300">
                            🎉 <strong>Parabéns pela compra!</strong> Crie sua senha para acessar seu guia exclusivo.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-300 mb-1">Seu Nome</label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Maria Silva"
                                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-300 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="maria@email.com"
                                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-300 mb-1">Senha</label>
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Mínimo 6 caracteres"
                                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-300 mb-1">Confirmar Senha</label>
                            <input
                                type="password"
                                required
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="Repita a senha"
                                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-900/40 border border-red-700/60 p-3 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white shadow-lg hover:bg-emerald-500 disabled:opacity-60 transition mt-2"
                        >
                            {loading ? "Criando conta..." : "Criar Conta e Acessar Guia →"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-stone-500">
                        Já tem conta?{" "}
                        <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium transition">
                            Fazer login
                        </Link>
                    </p>
                </div>

                <p className="mt-4 text-center text-xs text-stone-600">
                    🔒 Seus dados estão seguros. Jamais compartilhamos com terceiros.
                </p>
            </div>
        </main>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-stone-950 flex items-center justify-center text-white">Carregando...</div>}>
            <RegisterContent />
        </Suspense>
    );
}
