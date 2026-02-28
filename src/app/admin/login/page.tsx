"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const res = await fetch("/api/admin/auth", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });

        if (res.ok) {
            router.push("/admin");
            router.refresh();
        } else {
            setError("Senha incorreta. Tente novamente.");
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-stone-900 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-stone-800 p-8 shadow-2xl border border-stone-700">
                <div className="mb-8 text-center">
                    <span className="text-4xl">🌿</span>
                    <h1 className="mt-4 text-2xl font-bold text-white">Admin Panel</h1>
                    <p className="mt-1 text-sm text-stone-400">Vida com Aroma</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-300 mb-1">Senha de Acesso</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full rounded-xl border border-stone-600 bg-stone-700 p-3 text-white placeholder-stone-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                    </div>
                    {error && (
                        <p className="rounded-lg bg-red-900/50 border border-red-700 p-3 text-sm text-red-300">{error}</p>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white hover:bg-emerald-500 disabled:opacity-60 transition"
                    >
                        {loading ? "Verificando..." : "Entrar →"}
                    </button>
                </form>
            </div>
        </main>
    );
}
