import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getRecommendations } from "@/lib/recommendations";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const userEmail = session.user.email;

    // Check if user has paid and get clinical variables
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: {
            hasPaid: true,
            name: true,
            mainComplaint: true,
            chronology: true,
            energyLevel: true,
            clinicalRestrictions: true,
            environment: true,
            preferredMethod: true
        },
    });

    if (!user || !user.hasPaid) {
        redirect("/results");
    }

    const recs = getRecommendations(user as any);
    const { primaryOil, secondaryOil, environmentOil, protocolId } = recs;

    return (
        <main className="flex min-h-screen flex-col items-center bg-stone-50 p-4 md:p-8 text-stone-800 font-sans">
            <div className="w-full max-w-4xl mt-8 mb-20 space-y-8">

                {/* Cabeçalho */}
                <div className="rounded-2xl bg-emerald-900 p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
                    <div className="relative z-10">
                        <span className="inline-block rounded-full bg-emerald-800 border border-emerald-700 px-4 py-1 text-xs font-bold text-emerald-300 mb-6 tracking-wider uppercase">
                            ACESSO PREMIUM LIBERADO
                        </span>
                        <h1 className="mb-4 text-3xl md:text-5xl font-extrabold leading-tight">
                            O Seu Protocolo Prático <br /> de 21 Dias 🌿
                        </h1>
                        <p className="text-emerald-100 text-lg max-w-2xl leading-relaxed mt-6">
                            <strong>Seja muito bem-vindo(a) ao uso seguro e eficiente da aromaterapia.</strong>
                            <br /><br />
                            Vejo muitas pessoas a desistirem dos óleos essenciais porque não sabiam a quantidade certa a usar ou porque compraram essências sintéticas que não passam de &quot;cheirinhos&quot; sem qualquer valor terapêutico.
                            <br /><br />
                            A partir de hoje, isso muda. Durante os próximos 21 dias, vamos reeducar o seu sistema nervoso e respiratório. Siga exatamente as dosagens abaixo.
                        </p>
                    </div>
                </div>

                {/* Módulo 1: A Regra de Ouro */}
                <div className="rounded-2xl bg-white p-8 md:p-10 shadow-sm border border-stone-200">
                    <h2 className="mb-6 text-2xl font-bold text-emerald-900 border-b pb-4 flex items-center gap-2">
                        <span className="text-3xl">🛡️</span> Módulo 1: A Regra de Ouro (Diluição e Segurança)
                    </h2>

                    <p className="text-stone-700 mb-6 text-lg">
                        Nunca aplique um óleo essencial puro diretamente na pele. Eles são altamente concentrados e podem causar reações severas. Para uso tópico (massagens ou roll-on), precisamos de um <strong>&quot;Óleo Carreador&quot;</strong> (como o óleo de coco fracionado, óleo de semente de uva ou de amêndoas doces).
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                        <div className="rounded-xl bg-stone-50 p-6 border border-stone-200">
                            <h3 className="font-bold text-stone-900 mb-4 text-lg text-center">Tabela de Diluição Segura <br /><span className="text-sm font-normal text-stone-500">(Uso Diário - 2%)</span></h3>

                            <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-sm text-center mb-4">
                                <span className="font-bold text-emerald-700 block">10 ml de Óleo Carreador</span>
                                <span className="text-sm text-stone-500 block">(aproximadamente uma colher de sopa)</span>
                                <div className="text-stone-400 my-2">+</div>
                                <span className="font-bold text-emerald-700 block">Máximo de 4 a 5 gotas</span>
                                <span className="text-sm text-stone-500 block">da sua Sinergia (Mistura de óleos)</span>
                            </div>
                        </div>

                        <div className="rounded-xl bg-stone-50 p-6 border border-stone-200">
                            <h3 className="font-bold text-stone-900 mb-4 text-lg text-center">Para o Difusor de Ambiente</h3>

                            <ul className="space-y-4 text-stone-700">
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 mt-1">✓</span>
                                    <span>Utilize de <strong>5 a 8 gotas</strong> no total para um recanto de tamanho médio.</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-500 mt-1">✓</span>
                                    <span>Deixe ligado no máximo durante <strong>2 horas seguidas</strong> para evitar a fadiga olfativa (quando o cérebro deixa de absorver os benefícios).</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Módulo 2: O Protocolo Diário */}
                <div className="rounded-2xl bg-white p-8 md:p-10 shadow-sm border border-stone-200">
                    <h2 className="mb-6 text-2xl font-bold text-emerald-900 border-b pb-4 flex items-center gap-2">
                        <span className="text-3xl">📅</span> Módulo 2: O Seu Protocolo Diário
                    </h2>

                    <p className="text-stone-600 mb-8 text-lg">
                        Siga a rotina abaixo correspondente ao Perfil Aromático que recebeu no seu diagnóstico. A consistência nos próximos 21 dias é o segredo do sucesso.
                    </p>

                    <div className="bg-emerald-50 rounded-2xl p-6 md:p-8 border border-emerald-100">
                        {protocolId === "ansiedade" && (
                            <>
                                <h3 className="text-2xl font-bold text-emerald-900 mb-6">Protocolo de Ansiedade e Sono <span className="block text-lg font-normal text-emerald-700 mt-1">({primaryOil.name} + {secondaryOil.name})</span></h3>
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-xl shadow-sm">
                                        <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-2">☀️ Manhã/Tarde (SOS Ansiedade)</h4>
                                        <p className="text-stone-700"><strong>Inalação a frio.</strong> Coloque 1 gota de {secondaryOil.name} na palma das mãos, esfregue levemente, feche os olhos em formato de concha sobre o nariz e faça 5 respirações profundas.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm">
                                        <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-2">🌙 Noite (Indução ao Sono)</h4>
                                        <p className="text-stone-700">30 minutos antes de dormir, ligue o difusor no quarto com <strong>4 gotas de {primaryOil.name} e 2 gotas de {secondaryOil.name}</strong>. Se preferir uso tópico, aplique a diluição (Módulo 1) na sola dos pés e na nuca.</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {(protocolId === "foco_forte" || protocolId === "foco_suave") && (
                            <>
                                <h3 className="text-2xl font-bold text-emerald-900 mb-6">Protocolo de Foco e Fadiga Mental <span className="block text-lg font-normal text-emerald-700 mt-1">({primaryOil.name} + {secondaryOil.name})</span></h3>
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-xl shadow-sm">
                                        <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-2">🚀 Manhã (Arranque)</h4>
                                        <p className="text-stone-700">Ao iniciar o trabalho ou os estudos, coloque no difusor <strong>3 gotas de {primaryOil.name} e 2 gotas de {secondaryOil.name}</strong>.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm">
                                        <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-2">🔋 Tarde (Pico de Cansaço)</h4>
                                        <p className="text-stone-700">Aplique a versão diluída desta sinergia num frasco roll-on e passe nos pulsos e nas têmporas (longe dos olhos). <br /><br /><strong className="text-amber-600">Nota:</strong> Evite usar após as 16h para não interferir com o seu sono.</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {protocolId === "imunidade" && (
                            <>
                                <h3 className="text-2xl font-bold text-emerald-900 mb-6">Protocolo de Imunidade e Purificação <span className="block text-lg font-normal text-emerald-700 mt-1">({primaryOil.name} + {secondaryOil.name})</span></h3>
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-xl shadow-sm">
                                        <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-2">🚿 Banho Terapêutico</h4>
                                        <p className="text-stone-700">Pingue <strong>3 gotas de {secondaryOil.name}</strong> no chão do chuveiro (longe do ralo) durante o banho quente. O vapor fará uma desobstrução das vias respiratórias.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm">
                                        <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-2">💨 Purificação do Ambiente</h4>
                                        <p className="text-stone-700">No difusor, misture <strong>3 gotas de {primaryOil.name} com 3 gotas de {secondaryOil.name}</strong>. Excelente para eliminar microrganismos do ar, especialmente em fases de transição de estação.</p>
                                    </div>
                                </div>
                            </>
                        )}

                        {protocolId === "aterramento" && (
                            <>
                                <h3 className="text-2xl font-bold text-emerald-900 mb-6">Protocolo de Aterramento e Limpeza <span className="block text-lg font-normal text-emerald-700 mt-1">({primaryOil.name} + {secondaryOil.name})</span></h3>
                                <div className="space-y-6">
                                    <div className="bg-white p-6 rounded-xl shadow-sm">
                                        <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-2">🧘‍♀️ Meditação/Relaxamento</h4>
                                        <p className="text-stone-700">Coloque no difusor <strong>3 gotas de {secondaryOil.name} e 2 gotas de {primaryOil.name}</strong>.</p>
                                    </div>
                                    <div className="bg-white p-6 rounded-xl shadow-sm">
                                        <h4 className="font-bold text-stone-900 mb-2 flex items-center gap-2">🛡️ Blindagem Diária</h4>
                                        <p className="text-stone-700">Aplique a versão diluída em roll-on na região do peito (sobre o timo) e nos pulsos todas as manhãs antes de sair de casa.</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Módulo 3: Incensos e Velas */}
                <div className="rounded-2xl bg-indigo-50 p-8 md:p-10 shadow-sm border border-indigo-100">
                    <h2 className="mb-6 text-2xl font-bold text-indigo-900 border-b border-indigo-200 pb-4 flex items-center gap-2">
                        <span className="text-3xl">✨</span> Módulo 3: O Poder Oculto dos Incensos e Velas
                    </h2>

                    <p className="text-indigo-800 mb-6 text-lg">
                        Para acelerar a limpeza energética do seu ambiente e potencializar o efeito dos óleos essenciais, a queima de Incensos Naturais e Velas Aromáticas é o complemento perfeito.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
                            <h3 className="font-bold text-indigo-900 text-lg mb-3">Palo Santo e Sândalo</h3>
                            <p className="text-stone-600 mb-2"><strong>Ação:</strong> Limpeza profunda e elevação espiritual.</p>
                            <p className="text-stone-600 text-sm">Queime um bastão de Palo Santo ou um incenso de Sândalo natural no fim da tarde. O elemento Fogo desintegra as energias densas acumuladas no dia a dia, preparando o ambiente para a sinergia noturna.</p>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
                            <h3 className="font-bold text-indigo-900 text-lg mb-3">Velas Aromáticas</h3>
                            <p className="text-stone-600 mb-2"><strong>Ação:</strong> Aconchego e foco indireto.</p>
                            <p className="text-stone-600 text-sm">Opte sempre por velas feitas de cera vegetal e pavio de algodão. Acender uma vela durante a leitura ou no banho reduz a fadiga visual e traz conforto imediato.</p>
                        </div>
                    </div>

                    <div className="mt-8 bg-indigo-900 text-indigo-100 p-6 rounded-xl">
                        <h4 className="font-bold text-white mb-2 flex items-center gap-2">⚠️ Atenção à Qualidade</h4>
                        <p className="text-sm opacity-90">
                            Grande parte dos incensos e velas de supermercado são feitos com carvão tóxico, parafina (derivado de petróleo) e essências sintéticas. Respirar isso causa dor de cabeça e alergias. Compre <strong className="text-white">apenas</strong> incensos de resina/massala e velas vegetais livres de parafina.
                        </p>
                    </div>
                </div>

                {/* Módulo 4: Farmácia Aromática (Links Afiliados) */}
                <div className="rounded-2xl bg-orange-50 p-8 md:p-10 shadow-sm border border-orange-100">
                    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-orange-200 pb-4">
                        <h2 className="text-2xl font-bold text-orange-900 flex items-center gap-2">
                            <span className="text-3xl">🛒</span> Módulo 4: A Sua Farmácia Aromática
                        </h2>
                    </div>

                    <p className="text-orange-900 mb-8 text-lg bg-orange-100/50 p-6 rounded-xl border border-orange-200">
                        A eficácia do seu tratamento depende a 100% da pureza da planta. Óleos falsificados não possuem os princípios ativos necessários para atuar no seu sistema límbico.
                        <br /><br />
                        Para facilitar o seu processo e garantir a sua segurança, selecionei os fornecedores de confiança onde costumo adquirir os óleos para os meus pacientes. <strong>Todos eles apresentam laudos de cromatografia.</strong>
                        <br /><br />
                        Adquira os seus óleos 100% puros nos links abaixo:
                    </p>

                    <h3 className="font-bold text-stone-800 text-xl mb-4 mt-8">🌿 Os Essenciais (Destaques)</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <AffiliateCard title="Lavanda" subt="Relaxamento" emoji="🌿" link="https://shopee.com.br/search?keyword=oleo%20essencial%20lavanda%20via%20aroma" />
                        <AffiliateCard title="Laranja Doce" subt="Alegria/Calma" emoji="🍊" link="https://shopee.com.br/search?keyword=oleo%20essencial%20laranja%20doce%20via%20aroma" />
                        <AffiliateCard title="Alecrim" subt="Foco/Memória" emoji="🌿" link="https://shopee.com.br/search?keyword=oleo%20essencial%20alecrim%20via%20aroma" />
                        <AffiliateCard title="Hortelã-Pimenta" subt="Energia" emoji="🌱" link="https://shopee.com.br/search?keyword=oleo%20essencial%20hortela%20pimenta%20via%20aroma" />
                    </div>

                    <h3 className="font-bold text-stone-800 text-xl mb-4 mt-10">🍃 Purificação e Resinas</h3>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                        <AffiliateCard title="Melaleuca / Tea Tree" subt="Imunidade" emoji="🍃" link="https://shopee.com.br/search?keyword=oleo%20essencial%20melaleuca%20via%20aroma" />
                        <AffiliateCard title="Eucalipto" subt="Respiração" emoji="🌳" link="https://shopee.com.br/search?keyword=oleo%20essencial%20eucalipto%20via%20aroma" />
                        <AffiliateCard title="Mirra" subt="Aterramento" emoji="🪵" link="https://shopee.com.br/search?keyword=oleo%20essencial%20mirra%20via%20aroma" />
                        <AffiliateCard title="Olíbano" subt="Equilíbrio Emocional" emoji="🪵" link="https://shopee.com.br/search?keyword=oleo%20essencial%20olibano%20via%20aroma" />
                    </div>

                    <h3 className="font-bold text-stone-800 text-xl mb-4 mt-10">🛠️ Acessórios Recomendados</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        <AffiliateCard title="Óleo de Coco Fracionado" subt="Para diluição na pele" emoji="🥥" link="https://shopee.com.br/search?keyword=oleo%20carreador%20vegetal" />
                        <AffiliateCard title="Difusor Ultrassônico" subt="Ambientes fechados" emoji="💨" link="https://shopee.com.br/search?keyword=difusor%20oleo%20essencial" />
                        <AffiliateCard title="Kit Frascos Roll-on" subt="Para levar na mala" emoji="🧴" link="https://shopee.com.br/search?keyword=frasco%20roll%20on%20vidro" />
                    </div>
                </div>

            </div>
        </main>
    );
}

// Componente helper para os blocos da lojinha
function AffiliateCard({ title, subt, emoji, link }: { title: string, subt: string, emoji: string, link: string }) {
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col bg-white rounded-xl border border-orange-200 p-4 hover:border-orange-500 hover:shadow-lg transition-all"
        >
            <div className="mb-4">
                <span className="block font-bold text-stone-900 text-md leading-tight">{emoji} Óleo de {title}</span>
                <span className="text-xs text-stone-500 mt-1 block">({subt})</span>
            </div>
            <span className="mt-auto inline-block w-full text-center rounded-lg bg-orange-500 py-2 text-xs font-bold text-white shadow-sm group-hover:bg-orange-600 transition-colors uppercase tracking-wider">
                Comprar via Shopee
            </span>
        </a>
    );
}
