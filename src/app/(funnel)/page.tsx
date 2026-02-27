"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Tipagem para os passos do quiz
type QuizAnswers = {
  focusArea: string;
  preferences: string;
  safety: string;
};

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    focusArea: "",
    preferences: "",
    safety: "",
  });
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Manipulador para avançar etapas
  const handleAnswer = (field: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    if (step < 3) setStep(step + 1);
    else setStep(4); // Vai para captura de e-mail ao final
  };

  // Submissão do Lead
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Integração com a API
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...answers }),
      });

      if (res.ok) {
        // Redireciona para gerar escassez/urgência (Results/Checkout)
        router.push(`/results?email=${encodeURIComponent(email)}`);
      } else {
        alert("Ocorreu um erro. Tente novamente.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro de conexão.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-stone-50 p-4 text-stone-800">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 md:p-8 shadow-xl">
        {/* Progresso UI */}
        <div className="mb-6 flex items-center justify-between text-sm font-medium text-stone-400">
          <span>Aroma Match</span>
          <span>Passo {step > 3 ? 3 : step} de 3</span>
        </div>
        
        <div className="mb-8 h-2 w-full rounded-full bg-stone-100">
          <div 
            className="h-2 rounded-full bg-emerald-500 transition-all duration-300" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Pergunta 1 */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="mb-6 text-2xl font-bold">O que você mais deseja melhorar hoje?</h1>
            <div className="flex flex-col gap-3">
              {['Reduzir a Ansiedade', 'Melhorar o Foco', 'Ter um Sono Profundo'].map((opt) => (
               <button 
                 key={opt}
                 onClick={() => handleAnswer("focusArea", opt)}
                 className="rounded-xl border border-stone-200 p-4 text-left font-medium hover:border-emerald-500 hover:bg-emerald-50 transition"
               >
                 {opt}
               </button>
              ))}
            </div>
          </div>
        )}

        {/* Pergunta 2 */}
        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="mb-6 text-2xl font-bold">Qual perfil aromático te atrai mais?</h1>
            <div className="flex flex-col gap-3">
              {['Amadeirado e Terroso', 'Floral e Doce', 'Cítrico e Refrescante'].map((opt) => (
               <button 
                 key={opt}
                 onClick={() => handleAnswer("preferences", opt)}
                 className="rounded-xl border border-stone-200 p-4 text-left font-medium hover:border-emerald-500 hover:bg-emerald-50 transition"
               >
                 {opt}
               </button>
              ))}
            </div>
          </div>
        )}

        {/* Pergunta 3 */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="mb-6 text-2xl font-bold">Alguma restrição de segurança no seu ambiente?</h1>
            <div className="flex flex-col gap-3">
              {['Tenho Pets (Cães/Gatos)', 'Tenho Crianças pequenas', 'Nenhuma restrição especial'].map((opt) => (
               <button 
                 key={opt}
                 onClick={() => handleAnswer("safety", opt)}
                 className="rounded-xl border border-stone-200 p-4 text-left font-medium hover:border-emerald-500 hover:bg-emerald-50 transition"
               >
                 {opt}
               </button>
              ))}
            </div>
          </div>
        )}

        {/* Captura de Lead */}
        {step === 4 && (
          <div className="animate-in fade-in zoom-in-95 duration-500 text-center">
            <h1 className="mb-2 text-3xl font-bold text-emerald-800">Seu Ritual está pronto!</h1>
            <p className="mb-6 text-stone-600">
              Analisamos seu perfil. Digite seu melhor e-mail para descobrir a combinação perfeita de óleos essenciais para você.
            </p>
            <form onSubmit={handleSubmitLead} className="flex flex-col gap-4">
              <input 
                type="email" 
                required
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-stone-300 p-4 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full rounded-xl bg-emerald-600 p-4 font-bold text-white shadow-lg hover:bg-emerald-700 disabled:opacity-70 transition"
              >
                {isLoading ? "Processando..." : "Revelar Meu Resultado ->"}
              </button>
            </form>
            <p className="mt-4 text-xs text-stone-400">Odiamos spam. Seus dados estão seguros.</p>
          </div>
        )}
      </div>
    </main>
  );
}
