import { buildRagContext, TrajettaRagContext } from './ragService';
import { ContextPack } from './memoryService';

export { type TrajettaRagContext };

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.1-flash-lite';
const GEMINI_REASONING_MODEL = process.env.GEMINI_REASONING_MODEL || 'gemini-3.1-flash-lite';

const TRAJETTA_SYSTEM_PROMPT = `Você é a inteligência estratégica e reflexiva da Trajetta — um sistema pessoal de evolução para adultos ambiciosos.
Seu princípio fundamental: "Planeje para sua vida real, não para sua versão perfeita".
Seu tom é sóbrio, calmo, perspicaz, sem clichês motivacionais baratos e sem falsas celebrações.
PROIBIÇÃO ESTRITA: NUNCA use o emoji de brilhos (✨) ou emojis infantis.
Responda diretamente em português sem expor rascunhos, planos internos ou etapas de raciocínio.
Foque em ritmo sustentável, recuperação rápida após deslizes ("um deslize não anula 17 dias de disciplina") e consistência acumulada.
Forneça respostas específicas, personalizadas e práticas de 1 a 3 parágrafos.`;

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
    } else {
      const quotes = cleaned.match(/["“]([^"”]{30,})["”]/g);
      if (quotes && quotes.length > 0) {
        cleaned = quotes[quotes.length - 1].replace(/^["“]|["”]$/g, '').trim();
      } else {
        const lines = cleaned.split('\n')
          .map(l => l.trim())
          .filter(l => {
            const lLow = l.toLowerCase();
            return (
              !lLow.startsWith("here's a thinking") &&
              !lLow.startsWith('1.') &&
              !lLow.startsWith('2.') &&
              !lLow.startsWith('3.') &&
              !lLow.startsWith('4.') &&
              !lLow.startsWith('5.') &&
              !lLow.startsWith('**analyze') &&
              !lLow.startsWith('**identify') &&
              !lLow.startsWith('**formulate') &&
              !lLow.startsWith('**draft') &&
              !lLow.startsWith('**refine') &&
              !lLow.startsWith('- user asks') &&
              !lLow.startsWith('- language') &&
              !lLow.startsWith('- tone') &&
              !lLow.startsWith('- persona') &&
              !lLow.startsWith('check against')
            );
          })
          .join('\n')
          .trim();

        if (lines.length > 30) {
          cleaned = lines;
        }
      }
    }
  }

  return cleaned.replace(/[✨✦]/g, '').trim();
}

/**
 * Calls Google Gemini Flash API (gemini-3.1-flash-lite)
 * with robust fallback handling and dynamic strategic responses.
 */
export async function callGeminiAI(
  messages: ChatMessage[],
  options?: {
    heavyReasoning?: boolean;
    maxTokens?: number;
    ragContext?: TrajettaRagContext;
    contextPack?: ContextPack;
  }
): Promise<string> {
  const preferredModel = options?.heavyReasoning ? GEMINI_REASONING_MODEL : GEMINI_MODEL;
  const maxTokens = options?.maxTokens || 600;
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

  // Filter messages for Gemini contents array
  const contents = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

  if (contents.length === 0) {
    contents.push({ role: 'user', parts: [{ text: 'Olá' }] });
  }

  // Priority order of Gemini Flash models
  const modelsToTry = [
    preferredModel,
    'gemini-3.1-flash-lite',
    'gemini-3.1-flash-lite-preview',
    'gemini-3.6-flash',
    'gemini-2.0-flash'
  ].filter((m, i, arr) => arr.indexOf(m) === i && Boolean(m));

  for (const model of modelsToTry) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: systemContent }]
          },
          generationConfig: {
            temperature: 0.5,
            maxOutputTokens: maxTokens
          }
        }),
        signal: AbortSignal.timeout(20000)
      });

      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 429 && errText.includes('prepayment credits')) {
          console.warn(
            `[Google Gemini] Prepayment credits depleted on Google AI Studio for ${model}. Visit https://ai.studio/projects to manage credits. Using dynamic contextual strategy.`
          );
          break; // Don't loop through all models if project quota is depleted
        }
        console.warn(`[Google Gemini] Model ${model} failed (${res.status}): ${errText.slice(0, 150)}`);
        continue;
      }

      const data = await res.json();
      const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      const cleaned = cleanAiOutput(rawContent);
      if (cleaned && cleaned.length > 15) {
        return cleaned;
      }
    } catch (err: any) {
      console.warn(`[Google Gemini] Model ${model} error: ${err?.message || err}`);
    }
  }

  // Fallback to high-calibre dynamic strategic response
  console.info('[Trajetta AI] Using dynamic strategic fallback for query:', userQuery);
  return getDynamicStrategicFallback(userQuery, options?.ragContext);
}

// Backward-compatible alias
export const callNvidiaAI = callGeminiAI;

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

Forneça um olhar objetivo: reconheça o esforço real, aponte um ajuste sutil para a próxima semana e feche com uma frase que fortaleça a continuidade da jornada.`;

  return callGeminiAI([{ role: 'user', content: prompt }], { heavyReasoning: true });
}

function getDynamicStrategicFallback(query: string, ragContext?: TrajettaRagContext): string {
  const q = query.trim();
  const userName = ragContext?.user?.name || 'Explorador';
  const target = ragContext?.user?.target12Months;

  const qLower = q.toLowerCase();

  // 1. Fatigue, overload, exhaustion
  if (qLower.includes('cansa') || qLower.includes('exausto') || qLower.includes('sobrecarga') || qLower.includes('parar') || qLower.includes('reduzir') || qLower.includes('pesad')) {
    return `${userName}, o princípio fundamental da Trajetta é planejar para sua vida real, especialmente nas semanas de alta demanda. Quando a energia cai, o erro comum é o abandono completo por frustração. Em vez de pausar tudo, ative seu piso de segurança: reduza o volume das metas para 30% e proteja apenas o hábito essencial de base. Um deslize ou uma semana em baixa não anula as semanas que você já construiu.`;
  }

  // 2. Procrastination, motivation, discipline, waking up
  if (qLower.includes('procrastin') || qLower.includes('acordar') || qLower.includes('disciplina') || qLower.includes('preguiça') || qLower.includes('começar') || qLower.includes('foco')) {
    return `Para superar o atrito com "${q.slice(0, 45)}", desmonte a barreira de entrada usando a regra do primeiro minuto: determine qual é o menor gesto físico possível que inicia a ação sem exigir força de vontade. A motivação quase nunca precede o início; ela surge após o movimento começar. Ajuste seu ambiente na véspera para que a decisão já esteja tomada antes de você acordar.`;
  }

  // 3. Goals, finance, milestones
  if (qLower.includes('meta') || qLower.includes('dinheiro') || qLower.includes('finance') || qLower.includes('carreira') || qLower.includes('trabalho') || qLower.includes('faturamento')) {
    const goalMention = ragContext?.goals?.[0]?.title ? ` (como "${ragContext.goals[0].title}")` : '';
    return `Ao avaliar seus avanços${goalMention}, o foco estratégico deve ser a cadência de entrega e não a ansiedade do resultado final. Divida o horizonte dos próximos 14 dias em marcos binários: o que precisa estar inegavelmente concluído até a próxima sexta-feira? Priorize a tração desses blocos antes de assumir novos compromissos.`;
  }

  // 4. Balance, sleep, health, Life Score
  if (qLower.includes('sono') || qLower.includes('saúde') || qLower.includes('score') || qLower.includes('vida') || qLower.includes('equilíbrio') || qLower.includes('família') || qLower.includes('ansiedade') || qLower.includes('domingo')) {
    return `O equilíbrio sustentável não significa dividir as horas do dia em partes iguais, mas proteger as margens de recuperação. Se você sente tensão ou ansiedade, crie um ritual de encerramento diário: defina um horário inegociável para desligar telas e organize a lista de pendências da manhã seguinte em um papel antes de deitar. Sua mente descansa quando sabe que nada está esquecido.`;
  }

  // 5. Default dynamic response addressing the specific question
  const targetPart = target ? ` Em direção ao seu objetivo de "${target}", ` : ' ';
  return `${userName}, analisando sua pergunta sobre "${q.length > 50 ? q.slice(0, 47) + '...' : q}":${targetPart}o maior ganho de clareza acontece quando você isola o ruído do dia a dia e define qual é o próximo passo real e viável para hoje. Em vez de tentar resolver todas as variáveis de uma vez, concentre sua atenção na decisão imediata e execute-a com calma.`;
}
