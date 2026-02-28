"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.ok) {
            // Fetch session to decide where to redirect
            const sessionRes = await fetch("/api/auth/session");
            const session = await sessionRes.json();

            const role = session?.user?.role;
            const hasPaid = session?.user?.hasPaid;

            if (role === "ADMIN") {
                router.push("/admin");
            } else if (hasPaid) {
                router.push("/members");
            } else {
                router.push("/results");
            }
        } else {
            setError("Email ou senha incorretos.");
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-stone-950 via-emerald-950 to-stone-900 p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="mb-8 text-center">
                    <span className="text-5xl">🌿</span>
                    <h1 className="mt-3 text-3xl font-extrabold text-white">Bem-vindo(a) de volta</h1>
                    <p className="mt-2 text-emerald-300/80">Acesse seu Guia de Aromaterapia</p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-sm shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-stone-300 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-stone-300 mb-1">Senha</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
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
                            {loading ? "Entrando..." : "Entrar →"}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-stone-500">
                        Ainda não tem conta?{" "}
                        <Link href="/register" className="text-emerald-400 hover:text-emerald-300 font-medium transition">
                            Cadastre-se
                        </Link>
                    </p>
                </div>

                <p className="mt-4 text-center text-xs text-stone-600">
                    🔒 Acesso seguro. Seus dados são confidenciais.
                </p>
            </div>
        </main>
    );
}
