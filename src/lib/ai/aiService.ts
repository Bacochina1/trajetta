import { buildRagContext, TrajettaRagContext } from './ragService';
import { ContextPack } from './memoryService';

export { type TrajettaRagContext };

const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';

// Primary default model: fast (<1.5s), responsive, high quality in PT-BR, no token dumping
const DEFAULT_CHAT_MODEL = 'meta/llama-3.2-11b-vision-instruct';
const CHAT_MODEL = process.env.NVIDIA_CHAT_MODEL || DEFAULT_CHAT_MODEL;
const REASONING_MODEL = process.env.NVIDIA_REASONING_MODEL || 'meta/llama-3.1-70b-instruct';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';

const TRAJETTA_SYSTEM_PROMPT = `Você é a inteligência estratégica e reflexiva da Trajetta — um sistema pessoal de evolução para adultos ambiciosos.
Seu princípio fundamental: "Planeje para sua vida real, não para sua versão perfeita".
Seu tom é sóbrio, lúcido, calmo, perspicaz, sem clichês motivacionais baratos e sem falsas celebrações.
PROIBIÇÃO ESTRITA: NUNCA use o emoji de brilhos (✨) ou emojis infantis.
Responda diretamente em português sem expor rascunhos, planos internos ou etapas de raciocínio.
Foque em ritmo sustentável, recuperação rápida após deslizes ("um deslize não anula semanas de disciplina") e consistência acumulada.
Forneça respostas específicas, personalizadas e práticas de 1 a 3 parágrafos bem articulados.`;

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
 * Primary Engine: NVIDIA NIM (Llama 3.2 / 70B)
 * Failover: Google Gemini Flash
 * Fallback: Strategic dynamic reasoning
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
  const preferredModel = options?.heavyReasoning ? REASONING_MODEL : CHAT_MODEL;
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
${memoriesList}
--- FIM DOS DADOS ---\n`;
  } else if (options?.ragContext) {
    // 2. Trajetta Rag Context if no contextPack
    contextSections += `\n\n--- CONTEXTO ATIVO ---\n${buildRagContext(
      userQuery,
      options.ragContext
    )}\n--- FIM DO CONTEXTO ---\n`;
  }

  if (contextSections) {
    contextSections += `\nDIRETRIZES:
1. Responda fundamentando-se nas metas reais e hábitos recuperados.
2. Seja prático e direto.
3. PROIBIÇÃO ABSOLUTA: NUNCA use o emoji de brilhos (✨).`;
  }

  const systemContent = `${TRAJETTA_SYSTEM_PROMPT}${contextSections}`;

  // -------------------------------------------------------------
  // 1. PRIMARY ENGINE: NVIDIA NIM (Llama 3.2 11B / 70B)
  // -------------------------------------------------------------
  if (NVIDIA_API_KEY) {
    const nvidiaModels = [
      'meta/llama-3.2-11b-vision-instruct',
      'mistralai/mistral-large-2-instruct',
      'deepseek-ai/deepseek-r1'
    ];

    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemContent },
      ...messages.filter(m => m.role !== 'system')
    ];

    for (const model of nvidiaModels) {
      try {
        const res = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${NVIDIA_API_KEY}`
          },
          body: JSON.stringify({
            model,
            messages: fullMessages,
            temperature: 0.65,
            max_tokens: maxTokens
          }),
          signal: AbortSignal.timeout(18000)
        });

        if (res.ok) {
          const data = await res.json();
          const rawContent = data.choices?.[0]?.message?.content || '';
          const cleaned = cleanAiOutput(rawContent);
          if (cleaned && cleaned.length > 20) {
            return cleaned;
          }
        } else {
          const errText = await res.text();
          console.warn(`[NVIDIA AI] Model ${model} failed (${res.status}): ${errText.slice(0, 100)}`);
        }
      } catch (err: any) {
        console.warn(`[NVIDIA AI] Model ${model} timeout or network error:`, err?.message || err);
      }
    }
  }

  // -------------------------------------------------------------
  // 2. FAILOVER ENGINE: Google Gemini Flash
  // -------------------------------------------------------------
  if (GEMINI_API_KEY) {
    try {
      const contents = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

      if (contents.length === 0) {
        contents.push({ role: 'user', parts: [{ text: 'Olá' }] });
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemContent }] },
          generationConfig: { temperature: 0.6, maxOutputTokens: maxTokens }
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
    } catch {}
  }

  // -------------------------------------------------------------
  // 3. TERTIARY FALLBACK: Strategic Dynamic Contextual Response
  // -------------------------------------------------------------
  console.info('[Trajetta AI] Using dynamic strategic fallback for query:', userQuery);
  return getDynamicStrategicFallback(userQuery, options?.ragContext);
}

// Aliases for full compatibility
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

function getDynamicStrategicFallback(query: string, ragContext?: TrajettaRagContext): string {
  const q = query.trim();
  const userName = ragContext?.user?.name || 'Membro';

  const qLower = q.toLowerCase();

  // 1. Fatigue, overload, exhaustion
  if (qLower.includes('cansa') || qLower.includes('exausto') || qLower.includes('sobrecarga') || qLower.includes('parar') || qLower.includes('reduzir') || qLower.includes('pesad')) {
    return `${userName}, o princípio fundamental da Trajetta é planejar para sua vida real, especialmente nas semanas de alta demanda. Quando a energia cai, o erro comum é o abandono completo por frustração. Em vez de pausar tudo, ative seu piso de segurança: reduza o volume das metas para 30% e proteja apenas o hábito essencial de base. Um deslize ou uma semana em baixa não anula as semanas que você já construiu.`;
  }

  // 2. Procrastination, motivation, discipline, first days
  if (qLower.includes('início') || qLower.includes('primeiro') || qLower.includes('7 dias') || qLower.includes('procrastin') || qLower.includes('disciplina') || qLower.includes('tudo-ou-nada')) {
    return `${userName}, para seus primeiros 7 dias sem cair na armadilha do tudo-ou-nada, a regra de ouro é: **o piso mínimo vence a ambição desmedida**.

Em vez de tentar transformar toda a sua rotina na primeira semana, concentre-se em cumprir apenas o essencial com consistência silenciosa. Se planejou treinar 1 hora e só tiver 15 minutos, faça os 15 minutos. Na metodologia Trajetta, um dia incompleto ainda é infinitamente superior a um dia zerado.

Proteja suas 3 prioridades e confie na cadência. A evolução sustentável se constrói na continuidade, não na intensidade esporádica.`;
  }

  // 3. Goals, finance, milestones
  if (qLower.includes('meta') || qLower.includes('dinheiro') || qLower.includes('finance') || qLower.includes('carreira') || qLower.includes('trabalho') || qLower.includes('faturamento')) {
    const goalMention = ragContext?.goals?.[0]?.title ? ` (como "${ragContext.goals[0].title}")` : '';
    return `Ao avaliar seus avanços${goalMention}, o foco estratégico deve ser a cadência de entrega e não a ansiedade do resultado final. Divida o horizonte dos próximos 14 dias em marcos binários: o que precisa estar inegavelmente concluído até a próxima sexta-feira? Priorize a tração desses blocos antes de assumir novos compromissos.`;
  }

  // 4. Default dynamic response
  return `${userName}, o maior ganho de clareza acontece quando você isola o ruído do dia a dia e define qual é o próximo passo real e viável para hoje. Em vez de tentar resolver todas as variáveis de uma vez, concentre sua atenção na decisão imediata e execute-a com calma.`;
}
