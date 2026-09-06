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
  // Strip <think> tags
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // Strip chain-of-thought prefixes if present
  if (cleaned.includes("Here's a thinking process:") || cleaned.includes("Here's a thinking process")) {
    const parts = cleaned.split(/\n\s*(?:Final Answer|Final Response|Conclusion|Resposta Final|Refine:?):?\s*\n?/i);
    if (parts.length > 1) {
      cleaned = parts[parts.length - 1].trim();
    } else {
      const attempts = cleaned.split(/(?:Drafting - Attempt \d+:|Draft \d+:)/i);
      if (attempts.length > 1) {
        cleaned = attempts[attempts.length - 1].split('\n→')[0].trim();
      }
    }
  }

  // Strictly enforce Zero Sparkles
  return cleaned.replace(/✨/g, '✦').trim();
}

export async function callNvidiaAI(
  messages: ChatMessage[],
  options?: { heavyReasoning?: boolean; maxTokens?: number }
): Promise<string> {
  const model = options?.heavyReasoning ? REASONING_MODEL : CHAT_MODEL;
  const maxTokens = options?.maxTokens || 600;

  try {
    const fullMessages: ChatMessage[] = [
      { role: 'system', content: TRAJETTA_SYSTEM_PROMPT },
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
      return getFallbackChatResponse(messages[messages.length - 1]?.content || '');
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content;
    if (!reply) {
      return getFallbackChatResponse(messages[messages.length - 1]?.content || '');
    }

    return cleanAiOutput(reply);
  } catch (err) {
    console.error('[NVIDIA AI Call Error]:', err);
    return getFallbackChatResponse(messages[messages.length - 1]?.content || '');
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

function getFallbackChatResponse(userPrompt: string): string {
  const lower = userPrompt.toLowerCase();
  if (lower.includes('deslize') || lower.includes('falhei') || lower.includes('perdi')) {
    return 'Um deslize isolado não tem o poder de anular semanas de disciplina construída. A verdadeira maestria está em fechar a brecha no dia seguinte: reduza a fricção do próximo hábito e retome sua trajetória com calma.';
  }
  if (lower.includes('meta') || lower.includes('começar') || lower.includes('objetivo')) {
    return 'O erro mais comum é definir a meta pelo pico de motivação e não pelo piso de um dia exaustivo. Que fração mínima dessa meta você consegue sustentar até mesmo nas semanas mais turbulentas?';
  }
  return 'O progresso real é sutil e cumulativo. Analisando sua trajetória recente, o mais valioso não é a perfeição pontual de um dia, mas a ausência de semanas abandonadas. Mantenha o foco no seu próximo movimento consciente.';
}
