import { buildRagContext, TrajettaRagContext } from './ragService';

export { type TrajettaRagContext };

const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const CHAT_MODEL = process.env.NVIDIA_CHAT_MODEL || 'deepseek-ai/deepseek-v4-pro-0813';
const REASONING_MODEL = process.env.NVIDIA_REASONING_MODEL || 'deepseek-ai/deepseek-v4-pro-0813';

const TRAJETTA_SYSTEM_PROMPT = `Você é a inteligência estratégica e reflexiva da Trajetta — um sistema pessoal de evolução para adultos ambiciosos.
Seu princípio fundamental: "Planeje para sua vida real, não para sua versão perfeita".
Seu tom é sóbrio, calmo, perspicaz, sem clichês motivacionais e sem falsas celebrações.
PROIBIÇÃO ESTRITA: NUNCA use o emoji de brilhos (✨) ou emojis infantis.
Responda diretamente em português sem expor rascunhos ou etapas de raciocínio.
Foque em ritmo sustentável, recuperação rápida após deslizes ("um deslize não anula 17 dias de disciplina") e consistência acumulada.`;


export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

function cleanAiOutput(text: string): string {
  // Strip <think>...</think> tags
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // If model produced a thinking process / scratchpad:
  if (cleaned.toLowerCase().includes("thinking process") || cleaned.toLowerCase().includes("analyze user input")) {
    const parts = cleaned.split(/\n\s*(?:Final Answer|Final Response|Conclusion|Resposta Final|Refine:?)\s*:?\s*\n?/i);
    if (parts.length > 1 && parts[parts.length - 1].trim().length > 20) {
      cleaned = parts[parts.length - 1].trim();
    } else {
      const drafts = cleaned.split(/(?:Draft(?:ing)?\s*(?:-\s*Attempt)?\s*\d+\s*:|Tentativa\s*\d+\s*:)/i);
      if (drafts.length > 1) {
        const lastDraft = drafts[drafts.length - 1];
        const quoteMatch = lastDraft.match(/["“]([^"”]{25,})["”]/);
        if (quoteMatch && quoteMatch[1]) {
          cleaned = quoteMatch[1].trim();
        } else {
          const cleanLines = lastDraft
            .split('\n')
            .filter(l => !l.trim().startsWith('→') && !l.trim().startsWith('-') && !l.trim().toLowerCase().startsWith('critique') && !l.trim().toLowerCase().startsWith('refine'))
            .join(' ')
            .trim();
          if (cleanLines.length > 20) {
            cleaned = cleanLines;
          }
        }
      }
    }
  }

  // If still polluted with thinking process prefix, provide clean Trajetta synthesis
  if (cleaned.toLowerCase().includes("analyze user input") || cleaned.toLowerCase().includes("here's a thinking process")) {
    cleaned = 'Sua trajetória não exige perfeição cega, mas continuidade adaptável. Em semanas de sobrecarga profissional, preserve seu piso de consistência reduzindo o volume sem abrir mão do hábito.';
  }

  // Strictly enforce Zero Sparkles
  return cleaned.replace(/✨/g, '✦').trim();
}

export async function callNvidiaAI(
  messages: ChatMessage[],
  options?: { heavyReasoning?: boolean; maxTokens?: number; ragContext?: TrajettaRagContext }
): Promise<string> {
  const model = options?.heavyReasoning ? REASONING_MODEL : CHAT_MODEL;
  const maxTokens = options?.maxTokens || 800;
  const userQuery = messages[messages.length - 1]?.content || '';

  const ragSection = options?.ragContext
    ? `\n\n--- DADOS REAIS RECUPERADOS DA TRAJETÓRIA DO USUÁRIO (RAG ATIVO) ---\n${buildRagContext(
        userQuery,
        options.ragContext
      )}\n--- FIM DOS DADOS RECUPERADOS ---\n
DIRETRIZES FUNDAMENTAIS DE RAG:
1. Responda fundamentando-se diretamente nas metas reais, hábitos específicos, semanas concluídas, deslizes e intenção da semana do usuário.
2. Demonstre continuidade: o usuário não é um estranho. Trate-o pelo nome e faça referências diretas à sua trajetória real.
3. Se perguntado sobre algo que não consta no histórico, admita com honestidade.
4. PROIBIÇÃO ABSOLUTA: NUNCA use o emoji de brilhos (✨).`
    : '';



  const systemContent = `${TRAJETTA_SYSTEM_PROMPT}${ragSection}`;

  try {
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: systemContent },
      ...messages,
    ];

    const res = await fetch(`${NVIDIA_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${NVIDIA_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages: fullMessages,
        max_tokens: maxTokens,
        temperature: 0.6,
      }),
      // 25 seconds timeout for remote LLM inference
      signal: AbortSignal.timeout(25000),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.warn(`[NVIDIA AI API Warning] Status: ${res.status}. Body: ${errorText}`);
      return getFallbackChatResponse(userQuery, options?.ragContext);
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      return getFallbackChatResponse(userQuery, options?.ragContext);
    }

    return cleanAiOutput(reply);
  } catch (err) {
    console.error('[NVIDIA AI Call Error]:', err);
    return getFallbackChatResponse(userQuery, options?.ragContext);
  }
}

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

  return callNvidiaAI([{ role: 'user', content: prompt }], { heavyReasoning: true });
}

function getFallbackChatResponse(userPrompt: string, ragContext?: TrajettaRagContext): string {
  const lower = userPrompt.toLowerCase();
  const userName = ragContext?.user?.name || 'Explorador';
  const target12m = ragContext?.user?.target12Months || 'sua visão de 12 meses';
  const weeks = ragContext?.user?.completedWeeksCount ?? 14;

  if (lower.includes('deslize') || lower.includes('falhei') || lower.includes('perdi')) {
    return `Um deslize isolado não tem o poder de anular as ${weeks} semanas de disciplina que você já construiu, ${userName}. A verdadeira maestria está em fechar a brecha no dia seguinte: reduza a fricção do próximo hábito e retome sua trajetória com calma.`;
  }
  if (lower.includes('meta') || lower.includes('começar') || lower.includes('objetivo')) {
    return `Para alcançar "${target12m}", o erro mais comum é planejar pelo pico de motivação e não pelo piso de um dia exaustivo. Que fração mínima da sua meta você consegue sustentar até mesmo nas semanas mais turbulentas?`;
  }
  if (lower.includes('treino') || lower.includes('reduzir') || lower.includes('trabalho')) {
    return `Reduzir os treinos temporariamente por conta de pico no trabalho não é retrocesso, ${userName} — é gestão de energia. Mantenha 2 sessões curtas de manutenção para proteger o hábito sem sobrecarregar sua rotina.`;
  }
  return `O progresso real é sutil e cumulativo, ${userName}. Você já acumula ${weeks} semanas de trajetória na Trajetta. O mais valioso não é a perfeição de um dia, mas a consistência de não abandonar o processo.`;
}

