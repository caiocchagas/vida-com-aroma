"use client";

import { useState } from "react";

type HabitTrackerProps = {
    txId: string;
    initialDays: number[];
};

export default function HabitTracker({ txId, initialDays }: HabitTrackerProps) {
    const [trackedDays, setTrackedDays] = useState<number[]>(initialDays || []);
    const [isLoading, setIsLoading] = useState(false);

    const toggleDay = async (day: number) => {
        if (isLoading) return;
        setIsLoading(true);

        const isTracked = trackedDays.includes(day);
        const newDays = isTracked
            ? trackedDays.filter((d) => d !== day)
            : [...trackedDays, day];

        // Optimistic update
        setTrackedDays(newDays);

        try {
            const res = await fetch("/api/tracker", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ txId, trackedDays: newDays }),
            });

            if (!res.ok) {
                // Revert on failure
                setTrackedDays(trackedDays);
                console.error("Failed to save tracker state");
            }
        } catch (error) {
            setTrackedDays(trackedDays);
            console.error("Error saving tracker:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const totalDays = 21;
    const progress = Math.round((trackedDays.length / totalDays) * 100);

    return (
        <div className="rounded-2xl bg-white p-8 md:p-10 shadow-sm border border-stone-200 mt-8 mb-8">
            <h2 className="mb-2 text-2xl font-bold text-emerald-900 flex items-center gap-2">
                <span className="text-3xl">🗓️</span> O Seu Rastreador de Hábitos (21 Dias)
            </h2>
            <p className="text-stone-600 mb-8 text-lg">
                Para que a aromaterapia funcione silenciosamente no seu sistema límbico e endócrino, a consistência é o segredo. Marque os dias em que você concluiu o seu protocolo básico para visualizar a sua evolução.
            </p>

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between text-sm font-semibold mb-2 text-stone-500">
                    <span>Progresso do Tratamento</span>
                    <span className="text-emerald-700">{progress}% Concluído</span>
                </div>
                <div className="h-3 w-full rounded-full bg-stone-100 overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Grid of 21 Days */}
            <div className="grid grid-cols-7 gap-3 sm:gap-4 md:grid-cols-7 lg:gap-5">
                {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
                    const isChecked = trackedDays.includes(day);
                    return (
                        <button
                            key={day}
                            onClick={() => toggleDay(day)}
                            disabled={isLoading}
                            className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl border-2 transition-all ${isChecked
                                    ? "bg-emerald-500 border-emerald-600 text-white shadow-md shadow-emerald-200 scale-105"
                                    : "bg-white border-stone-200 text-stone-400 hover:border-emerald-300 hover:bg-stone-50"
                                }`}
                        >
                            <span className="text-xs sm:text-sm font-bold opacity-80 mb-1">Dia</span>
                            <span className="text-lg sm:text-xl font-black">{day}</span>
                            {isChecked && (
                                <svg className="w-4 h-4 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </button>
                    );
                })}
            </div>

            {progress === 100 && (
                <div className="mt-8 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-center font-semibold animate-pulse">
                    🎉 Parabéns! Você completou os 21 dias do seu protocolo olfativo com perfeição!
                </div>
            )}
        </div>
    );
}
