export type UserData = {
    mainComplaint?: string | null;
    chronology?: string | null;
    energyLevel?: string | null;
    clinicalRestrictions?: string | null;
    environment?: string | null;
    preferredMethod?: string | null;
};

export type Oil = {
    name: string;
    botanicalName: string;
    benefit: string;
    description: string;
    ritual: string;
    colorClass: string;
    shopeeLink: string;
};

const OILS_CATALOG: Record<string, Oil> = {
    lavanda: {
        name: "Lavanda Francesa",
        botanicalName: "Lavandula angustifolia",
        benefit: "Relaxamento",
        description: "",
        ritual: "",
        colorClass: "bg-purple-100 text-purple-800 border-purple-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20lavanda%20via%20aroma",
    },
    laranja: {
        name: "Laranja Doce",
        botanicalName: "Citrus aurantium dulcis",
        benefit: "Alegria/Calma",
        description: "",
        ritual: "",
        colorClass: "bg-orange-100 text-orange-800 border-orange-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20laranja%20doce%20via%20aroma",
    },
    alecrim: {
        name: "Alecrim",
        botanicalName: "Rosmarinus officinalis",
        benefit: "Foco/Memória",
        description: "",
        ritual: "",
        colorClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20alecrim%20via%20aroma",
    },
    hortela: {
        name: "Hortelã-Pimenta",
        botanicalName: "Mentha piperita",
        benefit: "Energia",
        description: "",
        ritual: "",
        colorClass: "bg-cyan-100 text-cyan-800 border-cyan-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20hortela%20pimenta%20via%20aroma",
    },
    melaleuca: {
        name: "Melaleuca (Tea Tree)",
        botanicalName: "Melaleuca alternifolia",
        benefit: "Imunidade",
        description: "",
        ritual: "",
        colorClass: "bg-teal-100 text-teal-800 border-teal-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20melaleuca%20via%20aroma",
    },
    eucalipto: {
        name: "Eucalipto Globulus",
        botanicalName: "Eucalyptus globulus",
        benefit: "Respiração",
        description: "",
        ritual: "",
        colorClass: "bg-blue-100 text-blue-800 border-blue-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20eucalipto%20via%20aroma",
    },
    mirra: {
        name: "Mirra",
        botanicalName: "Commiphora myrrha",
        benefit: "Aterramento",
        description: "",
        ritual: "",
        colorClass: "bg-stone-200 text-stone-800 border-stone-300",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20mirra%20via%20aroma",
    },
    olibano: {
        name: "Olíbano (Frankincense)",
        botanicalName: "Boswellia carterii",
        benefit: "Equilíbrio Emocional",
        description: "",
        ritual: "",
        colorClass: "bg-amber-100 text-amber-800 border-amber-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20olibano%20via%20aroma",
    },
    limao: {
        name: "Limão Siciliano",
        botanicalName: "Citrus limon",
        benefit: "Foco Suave",
        description: "",
        ritual: "",
        colorClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20limao%20siciliano%20via%20aroma",
    }
};

export function getRecommendations(user: UserData) {
    // Defaults (Ansiedade)
    let primaryOil = OILS_CATALOG.lavanda;
    let secondaryOil = OILS_CATALOG.laranja;

    let diagnosisTitle = "Sinergia Ansiolítica Profunda";
    let diagnosisText = "A sua anamnese indica uma sobrecarga crônica no sistema nervoso, mantendo seu corpo em constante estado de alerta. A combinação do óleo essencial de Lavanda com a Laranja Doce é comprovada por estudos clínicos por atuar como um calmante natural de ação rápida. Quando inalada, essa sinergia interage diretamente com o centro das emoções no seu cérebro, reduzindo a produção de cortisol (hormônio do estresse) em minutos e induzindo a um relaxamento profundo.";
    let protocolId = "ansiedade";

    const isHipertenso = user.clinicalRestrictions?.includes("hipertenso");
    const isEpileptico = user.clinicalRestrictions?.includes("epilepsia");
    const isAsma = user.clinicalRestrictions?.includes("asma");

    const isPregnant = user.environment?.includes("gestante");
    const hasBaby = user.environment?.includes("bebe");
    const hasPet = user.environment?.includes("pet");

    // Lógica Q1
    if (user.mainComplaint === "fadiga") {
        if (isHipertenso || isEpileptico) {
            // Blend Foco Suave
            primaryOil = OILS_CATALOG.limao;
            secondaryOil = OILS_CATALOG.hortela;
            diagnosisTitle = "Sinergia de Foco Suave (Segura)";
            diagnosisText = "A exaustão mental gera uma névoa cognitiva. Devido ao seu histórico clínico, formulamos uma sinergia segura focada em Limão Siciliano com um leve toque de Hortelã. Essa mistura age clareando a mente e estimulando a concentração sem elevar a pressão arterial ou causar agitação extrema.";
            protocolId = "foco_suave";
        } else {
            // Blend Estimulante Cognitivo
            primaryOil = OILS_CATALOG.alecrim;
            secondaryOil = OILS_CATALOG.hortela;
            diagnosisTitle = "Sinergia de Estimulação Cognitiva";
            diagnosisText = "A exaustão mental que você relatou gera uma verdadeira névoa cognitiva. O óleo de Alecrim, aliado ao frescor da Hortelã-Pimenta, demonstrou em testes clínicos a capacidade de aumentar a oxigenação cerebral. Essa mistura age melhorando a velocidade de processamento mental, o foco e a retenção de memória, funcionando como um estimulante natural poderoso, mas sem os efeitos colaterais de agitação da cafeína.";
            protocolId = "foco_forte";
        }
    } else if (user.mainComplaint === "imunidade") {
        primaryOil = OILS_CATALOG.melaleuca;
        secondaryOil = OILS_CATALOG.eucalipto;
        diagnosisTitle = "Sinergia Purificadora de Defesa";
        diagnosisText = "As suas respostas apontam para uma vulnerabilidade no sistema imunológico. O óleo essencial de Melaleuca (muito conhecido como Tea Tree) junto com o Eucalipto formam um poderoso agente com propriedades antimicrobianas, antivirais e anti-inflamatórias documentadas na ciência. Eles agem purificando o ar do ambiente e fortalecendo rapidamente a resposta de defesa do seu trato respiratório.";
        protocolId = "imunidade";
    } else if (user.mainComplaint === "energetico") {
        primaryOil = OILS_CATALOG.mirra;
        secondaryOil = OILS_CATALOG.olibano;
        diagnosisTitle = "Sinergia de Aterramento e Modulação";
        diagnosisText = "A sensação de desgaste energético profundo exige aromas densos e estabilizadores. A Mirra e o Olíbano são resinas milenares que atuam diretamente no sistema límbico, modulando o estresse profundo e criando uma âncora olfativa. É a formulação exata para restaurar a sua integridade emocional, acalmar a mente e limpar o ambiente de tensões acumuladas.";
        protocolId = "aterramento";
    }

    return {
        primaryOil,
        secondaryOil,
        diagnosisTitle,
        diagnosisText,
        protocolId,
        alerts: {
            isPregnant,
            hasBaby,
            hasPet,
            isAsma,
        }
    };
}
