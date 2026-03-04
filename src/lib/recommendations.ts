export type UserData = {
    lifeGoal?: string | null;
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
    },
    geranio: {
        name: "Gerânio Bourbon",
        botanicalName: "Pelargonium graveolens",
        benefit: "Equilíbrio Hormonal",
        description: "",
        ritual: "",
        colorClass: "bg-rose-100 text-rose-800 border-rose-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20geranio%20via%20aroma",
    },
    salvia: {
        name: "Sálvia Esclareia",
        botanicalName: "Salvia sclarea",
        benefit: "Tônico Feminino",
        description: "",
        ritual: "",
        colorClass: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200",
        shopeeLink: "https://shopee.com.br/search?keyword=oleo%20essencial%20salvia%20esclareia%20via%20aroma",
    }
};

export type Synergy = {
    id: string;
    title: string;
    oils: Oil[];
    actionName: string;
    actionDesc: string;
    recipe?: string;
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
                    title: "Sinergia 1 (Despertar Seguro)",
                    oils: [OILS_CATALOG.limao, OILS_CATALOG.hortela],
                    actionName: "Ação de Acordar e Foco",
                    actionDesc: "O Limão Siciliano clareia a mente sem elevar a pressão arterial, enquanto a Hortelã desperta de forma suave.",
                    recipe: "Inalação a vapor matinal: Pingue 2 gotas de Limão Siciliano e 1 gota de Hortelã-Pimenta no piso do box do banheiro na hora do banho quente."
                },
                {
                    id: "foco_2_seguro",
                    title: "Sinergia 2 (Clareza Mental Constante)",
                    oils: [OILS_CATALOG.limao, OILS_CATALOG.capim_limao],
                    actionName: "Ação de Produtividade Diurna",
                    actionDesc: "O Limão dissolve a névoa mental e o Capim-Limão traz ânimo constante para o ambiente de trabalho.",
                    recipe: "No difusor de ambiente: pingue 4 gotas de Limão Siciliano e 3 gotas de Capim-Limão. Deixe ligado no seu escritório ou mesa de trabalho."
                },
                {
                    id: "foco_3_seguro",
                    title: "Sinergia 3 (Foco sem Ansiedade)",
                    oils: [OILS_CATALOG.capim_limao, OILS_CATALOG.hortela],
                    actionName: "Ação Equilibrante Pós-Almoço",
                    actionDesc: "Ideal para aquela queda de energia das 15h. Mantém o alerta de forma serena e segura.",
                    recipe: "Inalação Rápida: pingue 1 gota de Hortelã e 1 de Capim-Limão na palma das mãos, esfregue levemente e inale profundamente em concha por 2 minutos."
                },
                {
                    id: "foco_4_seguro",
                    title: "Sinergia 4 (Descompressão Controlada)",
                    oils: [OILS_CATALOG.bergamota, OILS_CATALOG.lavanda],
                    actionName: "Ação de Limpeza do Estresse",
                    actionDesc: "Abaixa o ritmo do cérebro para sinalizar o fim do expediente, protegendo o sistema cardiovascular da tensão acumulada.",
                    recipe: "Massagem (Roll-on 10ml): Misture 10ml de Óleo de Coco Fracionado com 3 gotas de Lavanda e 2 de Bergamota. Aplique nos pulsos e nuca às 18h."
                },
                {
                    id: "foco_5_seguro",
                    title: "Sinergia 5 (Sono Restaurador Seguro)",
                    oils: [OILS_CATALOG.lavanda, OILS_CATALOG.camomila],
                    actionName: "Ação Sedativa e Reparadora",
                    actionDesc: "A exaustão mental exige sono reparador sem sobrecarga ao sistema nervoso. Induz relaxamento físico profundo.",
                    recipe: "Spray de Travesseiro: Em 30ml de álcool de cereais com 20ml de água, misture 8 gotas de Lavanda e 4 de Camomila Romana. Borrife no travesseiro 10 min antes de dormir."
                }
            ];
        } else {
            synergies = [
                {
                    id: "foco_1",
                    title: "Sinergia 1 (Despertar Matinal)",
                    oils: [OILS_CATALOG.alecrim, OILS_CATALOG.hortela],
                    actionName: "Ação de Acordar e Foco Rápido",
                    actionDesc: "O Alecrim estimula a retenção de dados e a Hortelã desperta a mente de forma imediata, tirando a inércia do sono.",
                    recipe: "Pingue 2 gotas de Alecrim e 1 gota de Hortelã-Pimenta no piso do box do banheiro na hora do banho quente matinal (Inalação a vapor)."
                },
                {
                    id: "foco_2",
                    title: "Sinergia 2 (Clareza Mental e Disposição)",
                    oils: [OILS_CATALOG.limao, OILS_CATALOG.alecrim],
                    actionName: "Ação de Produtividade no Trabalho",
                    actionDesc: "O Limão Siciliano dissolve a névoa mental e traz ânimo constante para o ambiente de trabalho.",
                    recipe: "No difusor de ambiente: pingue 5 gotas de Limão Siciliano e 3 gotas de Alecrim. Deixe ligado no seu escritório ou mesa."
                },
                {
                    id: "foco_3",
                    title: "Sinergia 3 (Foco sem Ansiedade Pós-Almoço)",
                    oils: [OILS_CATALOG.capim_limao, OILS_CATALOG.hortela],
                    actionName: "Ação Antifadiga da Tarde",
                    actionDesc: "Ideal para aquela queda de energia das 15h. Mantém o alerta de forma serena.",
                    recipe: "Inalação Rápida: pingue 1 gota de Hortelã e 1 de Capim-Limão na palma das mãos, esfregue e inale profundamente em concha por 3 minutos."
                },
                {
                    id: "foco_4",
                    title: "Sinergia 4 (Descompressão Fim de Tarde)",
                    oils: [OILS_CATALOG.bergamota, OILS_CATALOG.lavanda],
                    actionName: "Ação de Limpeza do Estresse",
                    actionDesc: "Abaixa o ritmo do cérebro para sinalizar que o dia de trabalho acabou, sem causar sonolência extrema ainda.",
                    recipe: "Massagem (Roll-on 10ml): Misture 10ml de Óleo de Coco Fracionado com 3 gotas de Lavanda e 2 de Bergamota. Aplique nos pulsos e nuca às 18h."
                },
                {
                    id: "foco_5",
                    title: "Sinergia 5 (Sono de Reparo Cognitivo)",
                    oils: [OILS_CATALOG.lavanda, OILS_CATALOG.camomila],
                    actionName: "Ação de Limpeza Cerebral",
                    actionDesc: "Exaustão mental só se cura com sono profundo. Essa combinação força o corpo a atingir o estágio REM.",
                    recipe: "Spray de Travesseiro: Em 30ml de álcool de cereais com 20ml de água, pingue 10 gotas de Lavanda e 5 de Camomila Romana. Borrife no travesseiro 10 min antes de deitar."
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
                title: "Sinergia 1 (Purificadora Matinal)",
                oils: [OILS_CATALOG.limao, OILS_CATALOG.melaleuca],
                actionName: "Ação Imunoestimulante",
                actionDesc: "O Limão estimula a produção de glóbulos brancos e a Melaleuca age como um tônico matinal de defesa.",
                recipe: "Banho Matinal: Pingue 2 gotas de Limão Siciliano e 1 de Melaleuca no piso do box durante o banho quente para limpar as vias aéreas ao acordar."
            },
            {
                id: "imune_2",
                title: "Sinergia 2 (Blindagem Ambiental)",
                oils: [OILS_CATALOG.melaleuca, OILS_CATALOG.eucalipto],
                actionName: "Ação Protetora Antiviral",
                actionDesc: "A combinação mais poderosa da aromaterapia para eliminar vírus e bactérias do ar e blindar a saúde e o espaço de trabalho.",
                recipe: "No difusor de ambiente: misture 4 gotas de Melaleuca e 4 gotas de Eucalipto. Deixe ligado no cômodo em que você passa mais tempo no dia."
            },
            {
                id: "imune_3",
                title: "Sinergia 3 (Desobstrução SOS)",
                oils: [OILS_CATALOG.eucalipto, OILS_CATALOG.hortela],
                actionName: "Ação Expectorante Imediata",
                actionDesc: "Perfeita para crises de rinite, sinusite ou sensação de peito e nariz carregados. Abre as vias respiratórias rapidamente.",
                recipe: "Inalação Direta SOS: pingue 1 gota de Eucalipto e 1 de Hortelã na palma das mãos, esfregue e inale profundamente em formato de concha até o alívio."
            },
            {
                id: "imune_4",
                title: "Sinergia 4 (Recuperação Imune)",
                oils: [OILS_CATALOG.lavanda, OILS_CATALOG.melaleuca],
                actionName: "Ação Reparadora Noturna",
                actionDesc: "Durante a noite o corpo mais consolida a imunidade. A Lavanda reduz o estresse (que derruba a imunidade) e a Melaleuca combate patógenos.",
                recipe: "Massagem (Roll-on 10ml): Misture 10ml de Óleo Vegetal de Coco com 3 gotas de Melaleuca e 3 de Lavanda. Aplique na sola dos pés antes de deitar."
            },
            {
                id: "imune_5",
                title: "Sinergia 5 (Acolhimento Respiratório)",
                oils: [OILS_CATALOG.cedro, OILS_CATALOG.eucalipto],
                actionName: "Ação Antisséptica Suave",
                actionDesc: "O Cedro atua como um expectorante mucolítico excelente e traz suporte físico para fortalecer o sistema contra gripes prolongadas.",
                recipe: "Massagem Torácica: Em 1 colher de sopa de óleo vegetal (ou creme neutro), misture 1 gota de Eucalipto e 2 gotas de Cedro e massageie o peito ao deitar."
            }
        ];
    } else if (user.mainComplaint === "energetico") {
        protocolId = "aterramento";
        diagnosisTitle = "Sobrecarga Energética e Desgaste Profundo";
        diagnosisText = "A sensação de desgaste energético profundo exige aromas densos, resinas milenares que atuam estabilizando as emoções e criando uma âncora olfativa. É a formulação exata para acalmar a mente e limpar o ambiente de tensões acumuladas. As suas sinergias de aterramento são:";

        synergies = [
            {
                id: "aterramento_1",
                title: "Sinergia 1 (Âncora Matinal)",
                oils: [OILS_CATALOG.cedro, OILS_CATALOG.laranja],
                actionName: "Ação de Segurança e Leveza",
                actionDesc: "O Cedro traz a força da madeira, aterrando o corpo fisicamente. A Laranja tira o peso da rotina e traz energia vital luminosa.",
                recipe: "Banho de Descarrego Matinal: Pingue 2 gotas de Cedro e 1 de Laranja no piso do box no banho quente para entrar no dia com firmeza."
            },
            {
                id: "aterramento_2",
                title: "Sinergia 2 (Limpeza e Proteção Ambiental)",
                oils: [OILS_CATALOG.mirra, OILS_CATALOG.olibano],
                actionName: "Ação Purificadora e Restauradora",
                actionDesc: "Resinas milenares que atuam curando as emoções. Essenciais para blindar o seu ambiente de trabalho contra intrusões energéticas.",
                recipe: "No difusor de ambiente: misture 3 gotas de Mirra e 3 gotas de Olíbano. Deixe ligado em momentos onde a tensão do ambiente fica mais pesada."
            },
            {
                id: "aterramento_3",
                title: "Sinergia 3 (Check-in Mental / Respiro Diurno)",
                oils: [OILS_CATALOG.olibano, OILS_CATALOG.bergamota],
                actionName: "Ação Moduladora Rápida",
                actionDesc: "Quando o peso do dia causar exaustão emocional ou crises de respiração curta, essa sinergia religa a mente ao corpo.",
                recipe: "Inalação Rápida SOS: pingue 1 gota de Olíbano e 1 de Bergamota na palma das mãos, esfregue e inale profundamente por 2 minutos."
            },
            {
                id: "aterramento_4",
                title: "Sinergia 4 (Desconexão Noturna)",
                oils: [OILS_CATALOG.lavanda, OILS_CATALOG.cedro],
                actionName: "Ação Calmante Estrutural",
                actionDesc: "Auxilia a transição da produtividade para o descanso. Dissolve a tenção muscular e prepara a mente para desligar de vez.",
                recipe: "Massagem (Roll-on 10ml): Misture 10ml de Óleo de Coco Fracionado com 3 gotas de Lavanda e 2 de Cedro. Aplique nos pulsos e sola dos pés às 19h."
            },
            {
                id: "aterramento_5",
                title: "Sinergia 5 (Paz Interior para o Sono)",
                oils: [OILS_CATALOG.olibano, OILS_CATALOG.lavanda],
                actionName: "Ação Meditativa e Sedativa",
                actionDesc: "Induz estados de ondas cerebrais profundas. O Olíbano desliga a tagarelice mental e a Lavanda convida o corpo ao repouso.",
                recipe: "Spray de Travesseiro: Em 30ml de álcool de cereais com 20ml de água, misture 8 gotas de Lavanda e 4 de Olíbano. Borrife no travesseiro ao deitar."
            }
        ];
    } else if (user.mainComplaint === "saude_mulher" || user.lifeGoal === "hormonal") {
        protocolId = "saude_mulher";
        diagnosisTitle = "Desequilíbrio Endócrino e Tensão Feminina";
        diagnosisText = "O seu corpo está pedindo suporte para transições hormonais, como TPM, cólicas intensas ou menopausa. É fundamental utilizar óleos essenciais com composição rica em fitohormônios e ésteres relaxantes, que ajudam a simular ou equilibrar os receptores do corpo sem efeitos colaterais. O resultado é o resgate do conforto físico e emocional nas piores fases do ciclo. As suas sinergias indicadas são:";

        synergies = [
            {
                id: "mulher_1",
                title: "Sinergia 1 (Acolhimento Matinal e Humor)",
                oils: [OILS_CATALOG.bergamota, OILS_CATALOG.geranio],
                actionName: "Ação Antidepressiva Diária",
                actionDesc: "O Gerânio modula emoções flutuantes típicas dos ciclos, enquanto a Bergamota traz leveza e afasta a irritabilidade ao acordar.",
                recipe: "Banho Matinal: Pingue 2 gotas de Bergamota e 1 gota de Gerânio no piso do box durante o banho quente para regular o humor do dia."
            },
            {
                id: "mulher_2",
                title: "Sinergia 2 (Controle de Oscilações)",
                oils: [OILS_CATALOG.geranio, OILS_CATALOG.lavanda],
                actionName: "Ação Estabilizadora de Receptores",
                actionDesc: "Ajuda o corpo a entender e simular suporte estrogênico e acalmar o sistema nervoso central contra episódios de raiva/choro.",
                recipe: "No difusor de ambiente: pingue 4 gotas de Lavanda e 3 de Gerânio. Use durante o dia ou final de tarde em momentos críticos da fase lútea/menopausa."
            },
            {
                id: "mulher_3",
                title: "Sinergia 3 (Alívio de Cólicas / SOS Pélvico)",
                oils: [OILS_CATALOG.salvia, OILS_CATALOG.lavanda],
                actionName: "Ação Antiespasmódica e Analgésica",
                actionDesc: "A Sálvia Esclareia é a rainha do equilíbrio endócrino e relaxa a musculatura do útero, com forte propriedade antiespasmódica.",
                recipe: "Massagem (Roll-on 10ml): Misture 10ml de Óleo Vegetal com 3 gotas de Sálvia e 2 de Lavanda. Massageie diretamente no baixo ventre e lombar 2x ao dia."
            },
            {
                id: "mulher_4",
                title: "Sinergia 4 (Fogachos e Resgate da Autoestima)",
                oils: [OILS_CATALOG.ylang, OILS_CATALOG.hortela],
                actionName: "Ação Fito-hormonal e Termorreguladora",
                actionDesc: "O Ylang Ylang ajuda a resgatar a libido e autoestima. A Hortelã atua no sistema de forma refrescante, excelente para ondas de calor severas.",
                recipe: "Inalação Rápida SOS: pingue 1 gota de Ylang Ylang e 1 de Hortelã na palma das mãos (ou no colar aromático), esfregue e inale profundamente na crise."
            },
            {
                id: "mulher_5",
                title: "Sinergia 5 (Sono Fluido Sem Tensão)",
                oils: [OILS_CATALOG.lavanda, OILS_CATALOG.salvia],
                actionName: "Ação Sedativa do Sistema Misto",
                actionDesc: "Desliga a hiperatividade noturna que frequentemente ocorre nos períodos de transição ou pré-menstruação, promovendo sono de alto reparo.",
                recipe: "Spray de Travesseiro: Em 30ml de álcool de cereais com 20ml de água, misture 8 gotas de Lavanda e 4 de Sálvia Esclareia. Borrife no ambiente ao deitar."
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
                title: "Sinergia 1 (Despertar com Leveza)",
                oils: [OILS_CATALOG.laranja, OILS_CATALOG.lavanda],
                actionName: "Ação de Positividade Matinal",
                actionDesc: "Reduz a taquicardia ou angústia ao acordar. A Laranja Doce traz alegria e conforto, enquanto a Lavanda previne os picos de cortisol matinais.",
                recipe: "Banho Relaxante: Pingue 2 gotas de Laranja Doce e 1 gota de Lavanda no piso do box do banheiro na hora do banho quente da manhã."
            },
            {
                id: "ansiedade_2",
                title: "Sinergia 2 (Escudo Diário Antiestresse)",
                oils: [OILS_CATALOG.bergamota, OILS_CATALOG.lavanda],
                actionName: "Ação Moduladora Diurna",
                actionDesc: "Estabiliza o humor e reduz a produção de cortisol induzida pelo estresse, criando uma redoma de proteção emocional duradoura.",
                recipe: "No difusor de ambiente: pingue 4 gotas de Bergamota e 4 gotas de Lavanda. Use na sala ou escritório durante suas tarefas."
            },
            {
                id: "ansiedade_3",
                title: "Sinergia 3 (Resgate Rápido SOS de Pânico)",
                oils: [OILS_CATALOG.bergamota, OILS_CATALOG.ylang],
                actionName: "Ação Ansiolítica de Resgate",
                actionDesc: "Manda uma mensagem química quase instantânea para a amígdala cerebral (centro do medo) e modula os batimentos cardíacos agitados.",
                recipe: "Inalação SOS: Em crise, pingue 1 gota de Bergamota e 1 gota de Ylang na palma das mãos, esfregue e inale em concha de 3 a 5 minutos profundamente."
            },
            {
                id: "ansiedade_4",
                title: "Sinergia 4 (Botão de Desligar do Estresse)",
                oils: [OILS_CATALOG.lavanda, OILS_CATALOG.camomila],
                actionName: "Ação Miorrelaxante (Tensão Acumulada)",
                actionDesc: "Ideal para quando a ansiedade trava os ombros, nuca e mandíbula. Atua soltando a musculatura no fim da tarde/início da noite.",
                recipe: "Massagem (Roll-on 10ml): Misture 10ml de Óleo de Coco Fracionado com 3 gotas de Lavanda e 2 de Camomila. Aplique na nuca e ombros às 19h."
            },
            {
                id: "ansiedade_5",
                title: "Sinergia 5 (Indução Farmacológica Natural ao Sono)",
                oils: [OILS_CATALOG.lavanda, OILS_CATALOG.camomila],
                actionName: "Ação Sedativa Intensa",
                actionDesc: "Para quem não consegue silenciar a tagarelice mental. Prepara o cérebro fisiologicamente para repouso sem efeitos sedativos perigosos.",
                recipe: "Spray de Travesseiro: Em 30ml de álcool de cereais com 20ml de água, misture 10 gotas de Lavanda e 5 de Camomila. Borrife no ambiente minutos antes de deitar."
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
