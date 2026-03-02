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
    camomila: {
        name: "Camomila Romana",
        botanicalName: "Anthemis nobilis",
        benefit: "Sedativo Suave",
        description: "",
        ritual: "",
        colorClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20camomila%20romana%20via%20aroma",
    },
    bergamota: {
        name: "Bergamota LFC",
        botanicalName: "Citrus bergamia",
        benefit: "Modulador Emocional",
        description: "",
        ritual: "",
        colorClass: "bg-lime-100 text-lime-800 border-lime-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20bergamota%20via%20aroma",
    },
    ylang: {
        name: "Ylang Ylang",
        botanicalName: "Cananga odorata",
        benefit: "Resgate Emocional",
        description: "",
        ritual: "",
        colorClass: "bg-pink-100 text-pink-800 border-pink-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20ylang%20ylang%20via%20aroma",
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
    limao: {
        name: "Limão Siciliano",
        botanicalName: "Citrus limon",
        benefit: "Foco Suave",
        description: "",
        ritual: "",
        colorClass: "bg-yellow-100 text-yellow-800 border-yellow-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20limao%20siciliano%20via%20aroma",
    },
    capim_limao: {
        name: "Capim-Limão (Lemongrass)",
        botanicalName: "Cymbopogon flexuosus",
        benefit: "Foco Equilibrante",
        description: "",
        ritual: "",
        colorClass: "bg-green-100 text-green-800 border-green-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20lemongrass%20via%20aroma",
    },
    melaleuca: {
        name: "Melaleuca (Tea Tree)",
        botanicalName: "Melaleuca alternifolia",
        benefit: "Imunidade/Purificação",
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
    cedro: {
        name: "Cedro Virgínia",
        botanicalName: "Juniperus virginiana",
        benefit: "Força/Estrutura",
        description: "",
        ritual: "",
        colorClass: "bg-orange-50 text-orange-900 border-orange-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20cedro%20via%20aroma",
    }
};

export type Synergy = {
    id: string;
    title: string;
    oils: Oil[];
    actionName: string;
    actionDesc: string;
};

export function getRecommendations(user: UserData) {
    let diagnosisTitle = "";
    let diagnosisText = "";
    let protocolId = "";
    let synergies: Synergy[] = [];

    const isHipertenso = user.clinicalRestrictions?.includes("hipertenso");
    const isEpileptico = user.clinicalRestrictions?.includes("epilepsia");
    const isAsma = user.clinicalRestrictions?.includes("asma");

    const isPregnant = user.environment?.includes("gestante");
    const hasBaby = user.environment?.includes("bebe");
    const hasPet = user.environment?.includes("pet");

    // Lógica Q1
    if (user.mainComplaint === "fadiga") {
        protocolId = "foco_forte";
        diagnosisTitle = "Exaustão Mental e Falta de Foco";
        diagnosisText = "A exaustão mental que você relatou gera uma verdadeira névoa cognitiva. O seu cérebro precisa de moléculas que aumentem a oxigenação e a velocidade de processamento mental, funcionando como um estimulante natural sem causar a agitação e a ansiedade da cafeína. As suas sinergias ideais são:";

        if (isHipertenso || isEpileptico) {
            protocolId = "foco_suave";
            diagnosisTitle = "Exaustão Mental (Protocolo Seguro)";
            diagnosisText = "A exaustão mental gera uma névoa cognitiva. Devido ao seu histórico de saúde (Hipertensão/Epilepsia), substituímos estimulantes fortes (como o Alecrim) por alternativas seguras e cientificamente validadas. As suas sinergias ideais são:";

            synergies = [
                {
                    id: "foco_1_seguro",
                    title: "Sinergia 1 (Estimulação Segura)",
                    oils: [OILS_CATALOG.limao, OILS_CATALOG.hortela],
                    actionName: "Ação de Foco Seguro",
                    actionDesc: "O Limão Siciliano clareia a mente sem elevar a pressão, enquanto a Hortelã desperta de forma suave e controlada."
                },
                {
                    id: "foco_2_seguro",
                    title: "Sinergia 2 (Clareza Mental)",
                    oils: [OILS_CATALOG.limao, OILS_CATALOG.capim_limao],
                    actionName: "Ação de Produtividade",
                    actionDesc: "O Limão dissolve a névoa mental e o Capim-Limão traz ânimo constante para o início do dia de trabalho."
                },
                {
                    id: "foco_3_seguro",
                    title: "Sinergia 3 (Foco sem Ansiedade)",
                    oils: [OILS_CATALOG.capim_limao, OILS_CATALOG.hortela],
                    actionName: "Ação Equilibrante",
                    actionDesc: "Ideal para quem precisa de muita concentração, mas não pode ficar muito agitado. Mantém o alerta de forma serena."
                }
            ];
        } else {
            synergies = [
                {
                    id: "foco_1",
                    title: "Sinergia 1 (Estimulação Cognitiva Máxima)",
                    oils: [OILS_CATALOG.alecrim, OILS_CATALOG.hortela],
                    actionName: "Ação de Foco",
                    actionDesc: "O Alecrim estimula a memória e a retenção de dados, enquanto a Hortelã desperta a mente de forma imediata."
                },
                {
                    id: "foco_2",
                    title: "Sinergia 2 (Clareza Mental e Disposição)",
                    oils: [OILS_CATALOG.limao, OILS_CATALOG.alecrim],
                    actionName: "Ação de Produtividade",
                    actionDesc: "O Limão Siciliano dissolve a névoa mental e traz ânimo, excelente para começar o dia de trabalho associado ao Alecrim."
                },
                {
                    id: "foco_3",
                    title: "Sinergia 3 (Foco sem Ansiedade)",
                    oils: [OILS_CATALOG.capim_limao, OILS_CATALOG.hortela],
                    actionName: "Ação Equilibrante",
                    actionDesc: "Ideal para quem precisa de muita concentração, mas não pode ficar muito agitado. Mantém o alerta de forma serena."
                }
            ];
        }
    } else if (user.mainComplaint === "imunidade") {
        protocolId = "imunidade";
        diagnosisTitle = "Vulnerabilidade Imunológica e Respiratória";
        diagnosisText = "As suas respostas apontam para uma vulnerabilidade no sistema imunológico e respiratório. O seu corpo precisa de compostos com propriedades antimicrobianas, antivirais e anti-inflamatórias documentadas na ciência para purificar o ar e fortalecer as suas defesas. As suas melhores opções são:";

        synergies = [
            {
                id: "imune_1",
                title: "Sinergia 1 (Purificadora de Defesa)",
                oils: [OILS_CATALOG.melaleuca, OILS_CATALOG.eucalipto],
                actionName: "Ação Protetora",
                actionDesc: "A combinação mais poderosa da aromaterapia para eliminar microrganismos do ambiente e blindar a saúde."
            },
            {
                id: "imune_2",
                title: "Sinergia 2 (Desobstrução Imediata)",
                oils: [OILS_CATALOG.eucalipto, OILS_CATALOG.hortela],
                actionName: "Ação Expectorante",
                actionDesc: "Perfeita para crises de rinite, sinusite ou sensação de peito e nariz carregados. Abre as vias respiratórias em minutos."
            },
            {
                id: "imune_3",
                title: "Sinergia 3 (Estímulo de Imunidade)",
                oils: [OILS_CATALOG.limao, OILS_CATALOG.melaleuca],
                actionName: "Ação de Limpeza Linfática",
                actionDesc: "Excelente para usar durante o dia, fortalece as defesas do organismo enquanto purifica o ar de forma leve e agradável."
            }
        ];
    } else if (user.mainComplaint === "energetico") {
        protocolId = "aterramento";
        diagnosisTitle = "Sobrecarga Energética e Desgaste Profundo";
        diagnosisText = "A sensação de desgaste energético profundo exige aromas densos, resinas milenares que atuam estabilizando as emoções e criando uma âncora olfativa. É a formulação exata para acalmar a mente e limpar o ambiente de tensões acumuladas. As suas sinergias de aterramento são:";

        synergies = [
            {
                id: "aterramento_1",
                title: "Sinergia 1 (Limpeza e Proteção)",
                oils: [OILS_CATALOG.mirra, OILS_CATALOG.olibano],
                actionName: "Ação Restauradora",
                actionDesc: "Duas das resinas mais antigas e estudadas do mundo, atuam curando o desgaste emocional profundo e blindando o ambiente."
            },
            {
                id: "aterramento_2",
                title: "Sinergia 2 (Paz Interior e Modulação)",
                oils: [OILS_CATALOG.olibano, OILS_CATALOG.lavanda],
                actionName: "Ação Calmante",
                actionDesc: "O Olíbano aterra e traz presença, enquanto a Lavanda dissolve a tensão. Ideal para meditação ou fim de tarde."
            },
            {
                id: "aterramento_3",
                title: "Sinergia 3 (Estrutura e Acolhimento)",
                oils: [OILS_CATALOG.cedro, OILS_CATALOG.laranja],
                actionName: "Ação de Força",
                actionDesc: "O Cedro traz a força e a estabilidade da madeira (aterramento físico), enquanto a Laranja adoça o ambiente, tirando o peso da rotina."
            }
        ];
    } else {
        // Defaults (Ansiedade)
        protocolId = "ansiedade";
        diagnosisTitle = "Sobrecarga Crônica no Sistema Nervoso";
        diagnosisText = "As suas respostas indicam uma sobrecarga crônica no sistema nervoso, mantendo o seu corpo em constante estado de alerta e elevando o seu cortisol (o hormônio do estresse). Para induzir um relaxamento profundo e rápido, atuando direto no centro das emoções do seu cérebro, o seu perfil tem altíssima compatibilidade com as seguintes sinergias:";

        synergies = [
            {
                id: "ansiedade_1",
                title: "Sinergia 1 (Ansiolítica Clássica)",
                oils: [OILS_CATALOG.lavanda, OILS_CATALOG.laranja],
                actionName: "Ação Rápida",
                actionDesc: "A Lavanda acalma o sistema nervoso central enquanto a Laranja Doce traz conforto emocional imediato."
            },
            {
                id: "ansiedade_2",
                title: "Sinergia 2 (Indução ao Sono Profundo)",
                oils: [OILS_CATALOG.lavanda, OILS_CATALOG.camomila],
                actionName: "Ação Sedativa",
                actionDesc: "Ideal para quem sofre de insônia severa e não consegue desligar os pensamentos na hora de deitar."
            },
            {
                id: "ansiedade_3",
                title: "Sinergia 3 (Resgate Emocional)",
                oils: [OILS_CATALOG.bergamota, OILS_CATALOG.ylang],
                actionName: "Ação Moduladora",
                actionDesc: "Perfeita para momentos de angústia, taquicardia ou sensação de aperto no peito, atuando como um estabilizador natural."
            }
        ];
    }

    // Compatibilidade com o sistema antigo (Pega os dois primeiros óleos da Primeira Sinergia)
    const primaryOil = synergies[0].oils[0];
    const secondaryOil = synergies[0].oils[1];
    const environmentOil = synergies[1].oils[0]; // Só pra ter algo

    return {
        primaryOil,
        secondaryOil,
        environmentOil,
        diagnosisTitle,
        diagnosisText,
        protocolId,
        synergies,
        alerts: {
            isPregnant,
            hasBaby,
            hasPet,
            isAsma,
        }
    };
}
