import { buildRagContext, TrajettaRagContext } from './ragService';
import { ContextPack } from './memoryService';

export { type TrajettaRagContext };

// -------------------------------------------------------------------
// GOOGLE GEMINI EXCLUSIVE ENGINE CONFIGURATION
// -------------------------------------------------------------------
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const TRAJETTA_SYSTEM_PROMPT = `Você é o estrategista de vida e inteligência artificial oficial do Trajetta — um sistema pessoal de evolução para pessoas lúcidas e ambiciosas.
Seu princípio inegociável: "Planeje para sua vida real, nunca para sua versão perfeita".
Seu tom é sóbrio, calmo, perspicaz, acolhedor, sem clichês motivacionais baratos, sem falsas celebrações e sem arrogância.

DIRETRIZES FUNDAMENTAIS DE COMPORTAMENTO:
1. PROIBIÇÃO ESTRITA: NUNCA use o emoji de brilhos (✨) ou qualquer emoji infantil.
2. PROIBIÇÃO ESTRITA: NUNCA comece repetindo a pergunta do usuário ou dizendo "Analisando sua pergunta...", "Em relação a...", ou "Você perguntou...". Vá direto ao cerne com elegância e maturidade.
3. NUNCA cite variáveis cruas, metadados soltos ou caracteres isolados (como objetivo de "k"). Integre o contexto de forma natural e invisível.
4. Se o usuário digitar algo curto, vago ou fragmentado (ex: "pla", "plano", "ajuda", "rotina", "hoje"), interprete como uma busca por foco ou planejamento e ofereça caminhos imediatos e estruturados.
5. Os 3 Pilares Trajetta:
   - **Piso Mínimo**: Em dias difíceis ou com energia baixa, reduza o volume para 30% e proteja a consistência em vez de zerar o dia.
   - **Retomada sem Culpa**: Um deslize consciente não destrói semanas de hábito construído. Não tente compensar com punição; apenas volte ao ritmo.
   - **Clareza de Ação**: Concentre-se nas 3 prioridades essenciais da semana.
6. Formatação: Responda em 2 a 3 parágrafos limpos e espaçados, destacando termos essenciais em **negrito**.`;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

function cleanAiOutput(text: string): string {
  if (!text) return '';
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  const lower = cleaned.toLowerCase();
  if (lower.includes("thinking process") || lower.includes("analyze user input")) {
    const splitRegex = /\n\s*(?:Final Answer|Final Response|Conclusion|Resposta Final|Resultado|Refine:?)\s*:?\s*\n?/i;
    const parts = cleaned.split(splitRegex);
    if (parts.length > 1 && parts[parts.length - 1].trim().length > 25) {
      cleaned = parts[parts.length - 1].trim();
    }
  }

  return cleaned.replace(/[✨✦]/g, '').trim();
}

/**
 * Trajetta AI Engine (Powered exclusively by Google Gemini):
 * 1. Google Gemini Flash / Pro (gemini-2.5-flash, gemini-2.0-flash, gemini-1.5-flash, gemini-3.1-flash-lite)
 * 2. High-Calibre Calm Power Dynamic RAG Synthesizer
 */
export async function callTrajettaAI(
  messages: ChatMessage[],
  options?: {
    heavyReasoning?: boolean;
    maxTokens?: number;
    ragContext?: TrajettaRagContext;
    contextPack?: ContextPack;
  }
): Promise<string> {
  const maxTokens = options?.maxTokens || 650;
  const userQuery = messages[messages.length - 1]?.content || '';

  let contextSections = '';

  // 1. Semantic Memory Engine Pack (Level 1, 2, 3)
  if (options?.contextPack) {
    const cp = options.contextPack;
    const goalsList = cp.structuredData.goals.slice(0, 4).map(g => `${g.title} (${g.progress}%)`).join('; ');
    const habitsList = cp.structuredData.habits.slice(0, 5).map(h => `${h.name} (${h.streakWeeks} sem.)`).join('; ');
    const memoriesList = cp.relevantMemories.slice(0, 3).length > 0
      ? cp.relevantMemories.slice(0, 3).map(m => `- ${m.content}`).join('\n')
      : '- Sem memórias conflitantes.';

    contextSections += `\n\n--- DADOS DO USUÁRIO ---
RESUMO: ${cp.livingSummary}
METAS: ${goalsList || 'Sem metas cadastradas'}
HÁBITOS: ${habitsList || 'Sem hábitos cadastrados'}
${cp.structuredData.lastReviewReflection ? `ÚLTIMA REFLEXÃO: "${cp.structuredData.lastReviewReflection}"` : ''}
MEMÓRIAS:
${memoriesList}
--- FIM DOS DADOS ---\n`;
  } else if (options?.ragContext) {
    contextSections += `\n\n--- CONTEXTO ATIVO ---\n${buildRagContext(
      userQuery,
      options.ragContext
    )}\n--- FIM DO CONTEXTO ---\n`;
  }

  if (contextSections) {
    contextSections += `\nDIRETRIZES DE TOM E FORMATAÇÃO:
1. Integre organicamente as metas e hábitos do usuário na resposta sem citar metadados brutos.
2. Seja prático, direto e reflexivo. Use negrito para dar peso às ideias-chave.
3. PROIBIÇÃO ABSOLUTA: NUNCA use o emoji de brilhos (✨) e nunca inicie repetindo a pergunta do usuário.`;
  }

  const systemContent = `${TRAJETTA_SYSTEM_PROMPT}${contextSections}`;

  // -------------------------------------------------------------
  // GOOGLE GEMINI ENGINE
  // -------------------------------------------------------------
  if (GEMINI_API_KEY) {
    const googleModels = [
      GEMINI_MODEL,
      'gemini-2.5-flash',
      'gemini-2.0-flash',
      'gemini-1.5-flash',
      'gemini-3.1-flash-lite',
      'gemini-pro'
    ].filter((m, i, arr) => arr.indexOf(m) === i && Boolean(m));

    const contents = messages
      .filter(m => m.role !== 'system')
      .map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

    if (contents.length === 0) {
      contents.push({ role: 'user', parts: [{ text: 'Olá' }] });
    }

    for (const model of googleModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents,
            systemInstruction: { parts: [{ text: systemContent }] },
            generationConfig: {
              temperature: 0.6,
              maxOutputTokens: maxTokens
            }
          }),
          signal: AbortSignal.timeout(18000)
        });

        if (res.ok) {
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleaned = cleanAiOutput(raw);
          if (cleaned && cleaned.length > 20) {
            return cleaned;
          }
        }
      } catch {
        // Fall through to next model or strategic engine
      }
    }
  }

  // -------------------------------------------------------------
  // CALM POWER DYNAMIC STRATEGIC ENGINE
  // -------------------------------------------------------------
  return getDynamicStrategicResponse(userQuery, options?.contextPack, options?.ragContext);
}

// Aliases for full backward compatibility
export const callGeminiAI = callTrajettaAI;
export const callNvidiaAI = callTrajettaAI;

export async function generateWeeklyReviewReflection(context: {
  wins: string;
  challenges: string;
  completedRatio: string;
  streakWeeks: number;
}): Promise<string> {
  const prompt = `Gere uma síntese reflexiva de 2 a 3 parágrafos para o fechamento da semana do usuário.
Contexto:
- Vitórias registradas: "${context.wins || 'Consistência diária mantida'}"
- Desafios enfrentados: "${context.challenges || 'Ajuste de ritmo e energia'}"
- Consistência de hábitos: ${context.completedRatio}
- Semanas consecutivas na trajetória: ${context.streakWeeks} semanas.

Forneça um olhar objetivo e acolhedor: reconheça o esforço real, aponte um ajuste sutil para a próxima semana e feche com uma frase que fortaleça a continuidade da jornada.`;

  return callTrajettaAI([{ role: 'user', content: prompt }], { heavyReasoning: true });
}

function getDynamicStrategicResponse(
  query: string,
  contextPack?: ContextPack,
  ragContext?: TrajettaRagContext
): string {
  const q = query.trim();
  const qLower = q.toLowerCase();

  // Extract relevant goals if available in context
  const goals = contextPack?.structuredData?.goals || ragContext?.goals || [];
  const primaryGoal = goals.find(g => g.title && g.title.length > 2)?.title;
  const goalRef = primaryGoal ? ` (como o avanço em **${primaryGoal}**)` : '';

  // 1. Fragmented or short queries: "pla", "plano", "planejar", "rotina"
  if (
    qLower === 'pla' ||
    qLower.startsWith('pla ') ||
    qLower === 'plano' ||
    qLower.includes('planej') ||
    qLower.includes('rotina') ||
    qLower.includes('semana')
  ) {
    return `Se você está buscando estruturar seu **plano semanal** ou precisa de alinhamento para o dia, a regra é manter o atrito baixo. O maior erro no planejamento é criar uma lista idealizada que não sobrevive à primeira terça-feira de correria.

Para calibrar sua trajetória com clareza agora:
1. **Defina seu Piso Mínimo**: proteja apenas os 30% inegociáveis dos seus hábitos essenciais.
2. **Isole 3 Prioridades Reais**: escolha as ações de maior alavancagem para a semana.
3. **Mantenha a Cadência**: mesmo em dias difíceis, um avanço incompleto é infinitamente superior a um dia zerado.

O que está demandando mais clareza no seu momento atual? Diga em uma frase e ajustamos a rota juntos.`;
  }

  // 2. Primeiros 7 dias / Início / Tudo-ou-nada
  if (
    qLower.includes('início') ||
    qLower.includes('inicio') ||
    qLower.includes('primeiro') ||
    qLower.includes('7 dias') ||
    qLower.includes('tudo-ou-nada') ||
    qLower.includes('regra de ouro')
  ) {
    return `Para os seus primeiros 7 dias sem cair na armadilha do tudo-ou-nada, a regra de ouro é: **o piso mínimo vence a intensidade desmedida**.

Em vez de tentar transformar toda a sua rotina logo na primeira semana, concentre sua energia em proteger a consistência silenciosa dos seus hábitos essenciais. Se planejou treinar 1 hora e só tiver 15 minutos, faça os 15 minutos. Na metodologia Trajetta, um dia incompleto ainda é infinitamente superior a um dia zerado.

Proteja suas 3 prioridades centrais e confie na cadência. A evolução sustentável se constrói na continuidade diária, nunca na intensidade esporádica.`;
  }

  // 3. Deslizes conscientes / Culpa / Recomeço
  if (
    qLower.includes('deslize') ||
    qLower.includes('falhei') ||
    qLower.includes('errei') ||
    qLower.includes('culpa') ||
    qLower.includes('do zero') ||
    qLower.includes('recomeçar') ||
    qLower.includes('quebrei')
  ) {
    return `Um deslize consciente não anula semanas de disciplina acumulada. O maior erro cognitivo é o efeito de *bola de neve*: acreditar que, por ter escorregado em uma refeição ou em um bloco de foco, todo o processo foi perdido.

Na Trajetta, a recuperação é imediata e sem drama. Você não precisa se punir nem dobrar o esforço amanhã; basta executar o próximo movimento planejado com calma. Consistência não é ausência de falhas, mas a velocidade com que você retoma o ritmo normal.`;
  }

  // 4. Cansaço / Exaustão / Sobrecarga
  if (
    qLower.includes('cansa') ||
    qLower.includes('exausto') ||
    qLower.includes('sobrecarga') ||
    qLower.includes('parar') ||
    qLower.includes('reduzir') ||
    qLower.includes('pesad') ||
    qLower.includes('estresse')
  ) {
    return `O princípio fundamental da Trajetta é planejar para a sua vida real, especialmente nos ciclos de alta demanda. Quando a energia física ou mental cai, o erro comum é a paralisia por sobrecarga.

Ative imediatamente o seu **piso de segurança**: reduza o volume das metas secundárias e proteja apenas o hábito essencial de sustentação${goalRef}. Mantenha a trajetória viva com o menor atrito possível até que sua capacidade se restabeleça.`;
  }

  // 5. Metas / Carreira / Dinheiro / Foco
  if (
    qLower.includes('meta') ||
    qLower.includes('dinheiro') ||
    qLower.includes('finance') ||
    qLower.includes('carreira') ||
    qLower.includes('trabalho') ||
    qLower.includes('faturamento') ||
    qLower.includes('projeto')
  ) {
    return `Ao avaliar seus avanços estratégicos${goalRef}, o foco deve estar na cadência de entrega e não na ansiedade do resultado distante. Divida o horizonte dos próximos 14 dias em marcos binários: o que precisa estar inegavelmente concluído até a próxima sexta-feira?

Isole o ruído diário e concentre sua energia no bloco de maior alavancagem para hoje, executando-o antes de assumir novos compromissos.`;
  }

  // 6. Procrastinação / Inércia / Falta de foco
  if (
    qLower.includes('procrastin') ||
    qLower.includes('foco') ||
    qLower.includes('disciplina') ||
    qLower.includes('preguiça') ||
    qLower.includes('começar')
  ) {
    return `Para superar o atrito e a procrastinação, desmonte a barreira de entrada usando a regra do primeiro minuto: determine qual é o menor gesto físico que inicia a ação sem exigir grande força de vontade.

A motivação quase nunca precede o início; ela surge após o movimento começar. Reduza os estímulos ao redor e tome a decisão antes de o atrito mental se consolidar.`;
  }

  // 7. Resposta padrão profunda
  return `O maior ganho de clareza acontece quando você isola o ruído do dia a dia e define qual é o próximo passo real e viável para hoje.

Em vez de tentar resolver todas as variáveis de uma vez só, concentre sua atenção na decisão imediata e execute-a com serenidade. Consistência é ritmo sustentável construído dia após dia.`;
}
