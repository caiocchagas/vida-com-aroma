"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Tipagem para os 6 passos clínicos
type QuizAnswers = {
  lifeGoal: string;
  mainComplaint: string;
  chronology: string;
  energyLevel: string;
  clinicalRestrictions: string[];
  environment: string[];
  preferredMethod: string;
};

export default function ClinicalQuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    lifeGoal: "",
    mainComplaint: "",
    chronology: "",
    energyLevel: "",
    clinicalRestrictions: [],
    environment: [],
    preferredMethod: "",
  });
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Manipulador para resposta única (avança automaticamente)
  const handleSingleAnswer = (field: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    nextStep();
  };

  // Manipulador para respostas múltiplas (array)
  const toggleMultiAnswer = (field: keyof QuizAnswers, value: string) => {
    setAnswers((prev) => {
      let currentArray = (prev[field] as string[]) || [];

      // Lógica de exclusão mútua ("seguro" e "ambiente_seguro" limpam o resto)
      if (value === "seguro" || value === "ambiente_seguro") {
        return { ...prev, [field]: [value] };
      } else {
        // Remove a opção excludente se estiver clicando em outra coisa
        currentArray = currentArray.filter(i => i !== "seguro" && i !== "ambiente_seguro");
      }

      const hasValue = currentArray.includes(value);

      return {
        ...prev,
        [field]: hasValue
          ? currentArray.filter((i) => i !== value)
          : [...currentArray, value],
      };
    });
  };

  const nextStep = () => {
    if (step < 7) setStep(step + 1);
    else setStep(8); // Passo 8 é o formulário de Email
  };

  const startQuiz = () => setStep(1);

  // Submissão do Lead
  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...answers }),
      });

      if (res.ok) {
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
      <div className="w-full max-w-md rounded-2xl bg-white p-6 md:p-8 shadow-xl border border-stone-200">

        {/* Header Análise Aromática */}
        {step > 0 && (
          <div className="mb-6 flex flex-col items-center border-b border-stone-100 pb-4">
            <span className="text-3xl mb-2">🌿</span>
            <h1 className="text-xl font-bold text-stone-700 tracking-tight">Análise Aromática Personalizada</h1>
          </div>
        )}

        {/* === TELA DE BOAS-VINDAS (Passo 0) === */}
        {step === 0 && (
          <div className="text-center py-4">
            <div className="text-6xl mb-5">🌿</div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 leading-tight mb-3">
              Descubra os Óleos Essenciais<br />
              <span className="text-emerald-700">Feitos para o Seu Corpo</span>
            </h1>
            <p className="text-stone-600 text-base leading-relaxed mb-6 max-w-sm mx-auto">
              Em menos de <strong>2 minutos</strong>, a nossa análise cruza o seu perfil com mais de <strong>40 combinações de sinergias aromáticas</strong> e entrega uma prescrição 100% personalizada — gratuita.
            </p>

            <div className="flex flex-col gap-2 text-sm text-stone-500 mb-8">
              <div className="flex items-center justify-center gap-2">
                <span className="text-emerald-500">✓</span> Descubra por que o seu corpo pede aromas específicos
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-emerald-500">✓</span> Receba 3 sinergias personalizadas para o seu perfil
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-emerald-500">✓</span> Saiba exatamente onde comprar os 100% puros (e baratos)
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="w-full rounded-xl bg-emerald-700 py-4 px-6 text-lg font-black text-white shadow-lg hover:bg-emerald-800 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Quero a Minha Análise Gratuita →
            </button>

            <p className="text-xs text-stone-400 mt-4">
              🔒 Gratuito · Sem compromisso · Resultado em 2 minutos
            </p>
          </div>
        )}

        {/* Progresso UI — só aparece durante as perguntas */}
        {step > 0 && step <= 8 && (
          <div className="mb-4 flex items-center justify-between text-xs font-semibold text-stone-400 uppercase tracking-wider">
            <span>{step <= 7 ? "Avaliação Clínica" : "Gerando Laudo"}</span>
            <span>Etapa {step > 7 ? 7 : step} de 7</span>
          </div>
        )}

        {step > 0 && (
          <div className="mb-10 h-1.5 w-full rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${(step / 8) * 100}%` }}
            />
          </div>
        )}

        {/* Perguntas */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

          {/* === NOVA PERGUNTA 1: Objetivo de vida === */}
          {step === 1 && (
            <div>
              <h2 className="mb-2 text-xl font-extrabold text-stone-800 leading-tight">
                O que você mais deseja transformar na sua vida?
              </h2>
              <p className="mb-6 text-sm text-stone-500">Isso guiará toda a sua prescrição aromática.</p>
              <div className="space-y-3">
                <button
                  onClick={() => handleSingleAnswer("lifeGoal", "sono")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  😴 Dormir melhor e acordar com disposição real.
                </button>
                <button
                  onClick={() => handleSingleAnswer("lifeGoal", "foco")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  🎯 Ter mais foco, clareza mental e produtividade.
                </button>
                <button
                  onClick={() => handleSingleAnswer("lifeGoal", "equilibrio")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  🧘 Reduzir o estresse e ter mais equilíbrio emocional.
                </button>
                <button
                  onClick={() => handleSingleAnswer("lifeGoal", "energia")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  ⚡ Ter mais energia e vitalidade ao longo do dia.
                </button>
                <button
                  onClick={() => handleSingleAnswer("lifeGoal", "imunidade")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  🛡️ Fortalecer a imunidade e respirar melhor.
                </button>
                <button
                  onClick={() => handleSingleAnswer("lifeGoal", "hormonal")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  🌸 Equilibrar meus hormônios (Menopausa, TPM, Saúde Feminina).
                </button>
              </div>
            </div>
          )}

          {/* === PERGUNTA 2 (antiga 1): Queixa principal === */}
          {step === 2 && (
            <div>
              <h2 className="mb-6 text-xl font-extrabold text-stone-800 leading-tight">
                Qual o aspecto que mais tem impactado negativamente a sua qualidade de vida hoje?
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => handleSingleAnswer("mainComplaint", "ansiedade")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  Mente acelerada, ansiedade ou dificuldade para relaxar.
                </button>
                <button
                  onClick={() => handleSingleAnswer("mainComplaint", "fadiga")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  Cansaço mental extremo, falta de foco ou procrastinação.
                </button>
                <button
                  onClick={() => handleSingleAnswer("mainComplaint", "imunidade")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  Baixa imunidade, alergias ou problemas respiratórios frequentes.
                </button>
                <button
                  onClick={() => handleSingleAnswer("mainComplaint", "energetico")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  Sensação de ambiente pesado, necessidade de aterramento e proteção.
                </button>
                <button
                  onClick={() => handleSingleAnswer("mainComplaint", "saude_mulher")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  Desconfortos femininos (TPM crônica, menopausa, cólicas, ovários policísticos).
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="mb-6 text-xl font-extrabold text-stone-800 leading-tight">
                Em relação a essa queixa principal, há quanto tempo você convive com esse sintoma?
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => handleSingleAnswer("chronology", "agudo")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  ⏳ Começou há poucos dias/semanas.
                </button>
                <button
                  onClick={() => handleSingleAnswer("chronology", "cronico")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  🔄 Há vários meses, já faz parte da rotina.
                </button>
                <button
                  onClick={() => handleSingleAnswer("chronology", "resistente")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  🧱 Há anos, sinto que nada resolve definitivamente.
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="mb-6 text-xl font-extrabold text-stone-800 leading-tight">
                Como acontece o seu ciclo diário e o comportamento do seu nível de energia?
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => handleSingleAnswer("energyLevel", "energia_baixa")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  🛌 Já acordo exausto(a), sem vontade de sair da cama.
                </button>
                <button
                  onClick={() => handleSingleAnswer("energyLevel", "pico_tarde")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  📉 Tenho uma queda brusca de energia no meio da tarde.
                </button>
                <button
                  onClick={() => handleSingleAnswer("energyLevel", "hiperativo_noite")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  🦉 Fico hiperativo(a) à noite, a mente simplesmente não desliga.
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="mb-2 text-xl font-extrabold text-stone-800 leading-tight">
                Para a sua segurança clínica, marque se você possui alguma destas condições:
              </h2>
              <p className="mb-6 text-sm text-stone-500">Isso ajustará as contraindicações do seu protocolo. Pode marcar mais de uma.</p>

              <div className="space-y-3">
                {[
                  { id: "hipertenso", label: "Hipertensão arterial (Pressão alta)" },
                  { id: "asma", label: "Asma ou bronquite severa" },
                  { id: "epilepsia", label: "Epilepsia ou histórico de convulsões" },
                  { id: "seguro", label: "Nenhuma pré-existente (Totalmente seguro)" },
                ].map((option) => {
                  const isSelected = answers.clinicalRestrictions.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleMultiAnswer("clinicalRestrictions", option.id)}
                      className={`flex w-full items-center rounded-xl border-2 p-4 text-left transition active:scale-[0.98] ${isSelected
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-stone-200 text-stone-600 hover:border-emerald-300 hover:bg-stone-50"
                        }`}
                    >
                      <div
                        className={`mr-4 flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${isSelected ? "border-emerald-500 bg-emerald-500" : "border-stone-300"
                          }`}
                      >
                        {isSelected && (
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={nextStep}
                disabled={answers.clinicalRestrictions.length === 0}
                className="mt-6 w-full rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-500 disabled:opacity-50 disabled:shadow-none"
              >
                Registrar Segurança Clínica →
              </button>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="mb-2 text-xl font-extrabold text-stone-800 leading-tight">
                Como é o ambiente onde você fará o seu tratamento profilático?
              </h2>
              <p className="mb-6 text-sm text-stone-500">Pode marcar mais de uma opção se aplicável à sua rotina.</p>

              <div className="space-y-3">
                {[
                  { id: "gestante", label: "Sou gestante ou lactante" },
                  { id: "bebe", label: "Tenho bebês menores de 2 anos em casa" },
                  { id: "pet", label: "Tenho cães ou gatos que ficam no mesmo ambiente" },
                  { id: "ambiente_seguro", label: "Moro sozinho(a) ou com adultos/crianças maiores" },
                ].map((option) => {
                  const isSelected = answers.environment.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      onClick={() => toggleMultiAnswer("environment", option.id)}
                      className={`flex w-full items-center rounded-xl border-2 p-4 text-left transition active:scale-[0.98] ${isSelected
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                        : "border-stone-200 text-stone-600 hover:border-emerald-300 hover:bg-stone-50"
                        }`}
                    >
                      <div
                        className={`mr-4 flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${isSelected ? "border-emerald-500 bg-emerald-500" : "border-stone-300"
                          }`}
                      >
                        {isSelected && (
                          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="font-medium">{option.label}</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={nextStep}
                disabled={answers.environment.length === 0}
                className="mt-6 w-full rounded-xl bg-emerald-600 py-4 font-bold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-500 disabled:opacity-50 disabled:shadow-none"
              >
                Avançar →
              </button>
            </div>
          )}

          {step === 7 && (
            <div>
              <h2 className="mb-6 text-xl font-extrabold text-stone-800 leading-tight">
                Como você prefere receber a terapia aromática no seu dia a dia?
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => handleSingleAnswer("preferredMethod", "difusor")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  💨 No difusor de ambiente (enquanto trabalho ou durmo).
                </button>
                <button
                  onClick={() => handleSingleAnswer("preferredMethod", "topico")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  💆‍♀️ Em massagens relaxantes ou rolon direto na pele.
                </button>
                <button
                  onClick={() => handleSingleAnswer("preferredMethod", "inalacao")}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-left font-medium text-stone-600 transition hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 active:scale-[0.98]"
                >
                  👃 Inalação rápida (no banho ou direto do frasco).
                </button>
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="text-center">
              <div className="mb-6 mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h2 className="mb-2 text-2xl font-black text-stone-800">A sua análise está pronta.</h2>
              <p className="mb-8 text-stone-500">
                Insira o seu melhor e-mail para que eu possa cruzar as suas variáveis e liberar o seu Laudo Aromático e Prescrição Clínica.
              </p>

              <form onSubmit={handleSubmitLead} className="space-y-4">
                <input
                  type="email"
                  required
                  placeholder="Seu melhor e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border-2 border-stone-200 p-4 text-lg outline-none transition focus:border-emerald-500"
                />

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full rounded-xl bg-emerald-700 py-4 font-bold text-white shadow-xl shadow-emerald-200 transition hover:bg-emerald-600 disabled:opacity-70 disabled:shadow-none"
                >
                  {isLoading ? "Processando laudo clínico..." : "Liberar o Meu Laudo Exclusivo →"}
                </button>
              </form>
              <p className="mt-6 text-xs text-stone-400 font-medium tracking-wide uppercase">
                🔒 Clínica Segura • Suas informações não serão compartilhadas.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
