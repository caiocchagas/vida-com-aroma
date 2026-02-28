export type UserData = {
    focusArea?: string | null;
    preferences?: string | null;
    stressLevel?: string | null;
    physicalSymptoms?: string | null;
    experience?: string | null;
    scentSensitivity?: string | null;
    interest?: string | null;
    safety?: string | null;
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
        benefit: "Calmante e Regulador do Sono",
        description: "O regulador oficial do sistema nervoso. Ele reduz os batimentos cardíacos e abaixa os níveis de cortisol induzindo a um estado de calma profunda.",
        ritual: "Ritual Noturno: Pingue 1 gota no travesseiro 10 min antes de deitar ou use no difusor.",
        colorClass: "bg-purple-100 text-purple-800 border-purple-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20lavanda%20via%20aroma",
    },
    alecrim: {
        name: "Alecrim",
        botanicalName: "Rosmarinus officinalis",
        benefit: "Foco, Memória e Energia",
        description: "Estimulante cognitivo poderoso. Estudos mostram que inalar alecrim melhora a memorização e tira o 'nevoeiro mental' do cansaço.",
        ritual: "Ritual Matinal: Inale profundamente o frasco por 3 respirações lentas ao acordar ou antes do trabalho.",
        colorClass: "bg-emerald-100 text-emerald-800 border-emerald-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20alecrim%20via%20aroma",
    },
    melaleuca: {
        name: "Melaleuca (Tea Tree)",
        botanicalName: "Melaleuca alternifolia",
        benefit: "Imunidade e Purificação",
        description: "Antisséptico, antiviral e bactericida. Excelente para purificar ambientes e fortalecer a imunidade em períodos de muito estresse.",
        ritual: "Ritual de Limpeza: Coloque 3 gotas no difusor para purificar o ar do ambiente.",
        colorClass: "bg-teal-100 text-teal-800 border-teal-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20melaleuca%20via%20aroma",
    },
    laranja: {
        name: "Laranja Doce",
        botanicalName: "Citrus aurantium dulcis",
        benefit: "Alegria e Redução de Ansiedade",
        description: "O 'óleo da alegria'. Extremamente leve, cítrico e excelente para reduzir ansiedade leve e animar o ambiente sem sobrecarregar.",
        ritual: "Ritual da Tarde: Use no colar difusor ou 4 gotas no difusor de ambiente para melhorar o humor.",
        colorClass: "bg-orange-100 text-orange-800 border-orange-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20laranja%20doce%20via%20aroma",
    },
    hortela: {
        name: "Hortelã-Pimenta",
        botanicalName: "Mentha piperita",
        benefit: "Alívio de Dores e Clareza",
        description: "Perfeito para dores de cabeça tensionais e exaustão física. Tem efeito analgésico e refrescante imediato.",
        ritual: "Ritual de Alívio: Dilua 1 gota em base carreadora e passe nas têmporas e nuca quando tiver dor de cabeça.",
        colorClass: "bg-cyan-100 text-cyan-800 border-cyan-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20hortela%20pimenta%20via%20aroma",
    },
    cedro: {
        name: "Cedro Virgínia",
        botanicalName: "Juniperus virginiana",
        benefit: "Aterramento e Força",
        description: "Aroma amadeirado profundo que traz segurança, estrutura e ajuda a centrar mentes muito aceleradas ou dispersas.",
        ritual: "Ritual Noturno: Massageie a sola dos pés com 1 gota diluída para 'desligar' a mente antes de dormir.",
        colorClass: "bg-stone-200 text-stone-800 border-stone-300",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20cedro%20via%20aroma",
    },
    geranio: {
        name: "Gerânio",
        botanicalName: "Pelargonium graveolens",
        benefit: "Equilíbrio Emocional",
        description: "O óleo da mulher e do equilíbrio das emoções. Floral intenso, excelente para lidar com variações de humor e estresse alto.",
        ritual: "Ritual Pessoal: Faça inalação direta ou use no escalda-pés após um dia extremamente estressante.",
        colorClass: "bg-pink-100 text-pink-800 border-pink-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20geranio%20via%20aroma",
    },
};

export function getRecommendations(user: UserData) {
    let primaryOil = OILS_CATALOG.lavanda;
    let secondaryOil = OILS_CATALOG.alecrim;
    let environmentOil = OILS_CATALOG.melaleuca;

    // Análise do Foco Principal
    if (user.focusArea === 'Reduzir a Ansiedade') {
        primaryOil = OILS_CATALOG.lavanda;
    } else if (user.focusArea === 'Melhorar o Foco') {
        primaryOil = OILS_CATALOG.alecrim;
    } else if (user.focusArea === 'Ter um Sono Profundo') {
        primaryOil = OILS_CATALOG.lavanda;
    }

    // Análise de Sintomas Físicos
    const symptoms = user.physicalSymptoms || "";
    if (symptoms.includes("Dores de cabeça")) {
        secondaryOil = OILS_CATALOG.hortela;
    } else if (symptoms.includes("Tensão muscular")) {
        secondaryOil = OILS_CATALOG.hortela;
    } else if (symptoms.includes("estômago")) {
        secondaryOil = OILS_CATALOG.laranja;
    }

    // Preferências Aromáticas (Ajusta o ambiente/suporte)
    if (user.preferences === 'Amadeirado e Terroso') {
        environmentOil = OILS_CATALOG.cedro;
    } else if (user.preferences === 'Floral e Doce') {
        environmentOil = OILS_CATALOG.geranio;
    } else if (user.preferences === 'Cítrico e Refrescante') {
        environmentOil = OILS_CATALOG.laranja;
    }

    // Sensibilidade (Substitui intensos por leves se a pessoa for sensível)
    if (user.scentSensitivity?.includes("dor de cabeça")) {
        if (environmentOil.name === "Gerânio") {
            environmentOil = OILS_CATALOG.laranja; // Troca floral intenso por cítrico leve
        }
        if (primaryOil.name === "Alecrim") {
            primaryOil = OILS_CATALOG.laranja; // Troca canforados por cítricos
        }
    }

    // Diagnóstico Texto
    let diagnosisTitle = "Exaustão Mental e Tensão Acumulada";
    if (user.stressLevel?.includes("Alto")) {
        diagnosisTitle = "Sobrecarga Límbica Severa";
    } else if (user.focusArea === "Ter um Sono Profundo") {
        diagnosisTitle = "Ciclo Circadiano Desregulado";
    } else if (user.focusArea === "Melhorar o Foco") {
        diagnosisTitle = "Bruma Mental (Brain Fog) e Fadiga";
    }

    return {
        primaryOil,
        secondaryOil,
        environmentOil,
        diagnosisTitle,
        showIncense: user.interest !== "Apenas Óleos Essenciais",
        hasPets: user.safety?.includes("Pets"),
        hasKids: user.safety?.includes("Crianças"),
    };
}
