import { buildRagContext, TrajettaRagContext } from './ragService';
import { ContextPack } from './memoryService';

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
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

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

  if (cleaned.toLowerCase().includes("analyze user input") || cleaned.toLowerCase().includes("here's a thinking process")) {
    cleaned = 'Sua trajetória não exige perfeição cega, mas continuidade adaptável. Em semanas de sobrecarga profissional, preserve seu piso de consistência reduzindo o volume sem abrir mão do hábito.';
  }

  return cleaned.replace(/[✨✦]/g, '').trim();
}

export async function callNvidiaAI(
  messages: ChatMessage[],
  options?: {
    heavyReasoning?: boolean;
    maxTokens?: number;
    ragContext?: TrajettaRagContext;
    contextPack?: ContextPack;
  }
): Promise<string> {
  const model = options?.heavyReasoning ? REASONING_MODEL : CHAT_MODEL;
  const maxTokens = options?.maxTokens || 800;
  const userQuery = messages[messages.length - 1]?.content || '';

  let contextSections = '';

  // 1. Semantic Memory Engine Pack (Level 1, 2, 3)
  if (options?.contextPack) {
    const cp = options.contextPack;
    const goalsList = cp.structuredData.goals.map(g => `${g.title} (${g.progress}% concluído) - Motivo: ${g.whyItMatters}`).join('; ');
    const habitsList = cp.structuredData.habits.map(h => `${h.name} (${h.area}, ${h.streakWeeks} semanas de streak)`).join('; ');
    const memoriesList = cp.relevantMemories.length > 0
      ? cp.relevantMemories.map(m => `- [${m.memoryType.toUpperCase()} | Confiança ${Math.round(m.confidence * 100)}%] ${m.content}`).join('\n')
      : '- Nenhuma memória pregressa conflitante registrada ainda.';

    contextSections += `\n\n--- MEMÓRIA VIVA & HISTÓRICO PESSOAL (MEMORY ENGINE TRAJETTA) ---
NÍVEL 1: RESUMO VIVO DO USUÁRIO (QUEM É ESTA PESSOA AGORA):
${cp.livingSummary}

NÍVEL 2: FATOS ESTRUTURADOS OBJETIVOS (SQL VERIFICADO):
- Metas Ativas: ${goalsList || 'Sem metas cadastradas'}
- Hábitos Principais: ${habitsList || 'Sem hábitos cadastrados'}
- Consistência Recente: ${cp.structuredData.recentConsistency}%
${cp.structuredData.lastReviewReflection ? `- Última Reflexão Semanal: "${cp.structuredData.lastReviewReflection}"` : ''}

NÍVEL 3: PADRÕES COMPORTAMENTAIS & MEMÓRIAS SEMÂNTICAS RELEVANTES:
${memoriesList}
--- FIM DA MEMÓRIA PESSOAL ---\n`;
  }

  // 2. Legacy Trajetta Rag Context if provided
  if (options?.ragContext) {
    contextSections += `\n\n--- DADOS REAIS RECUPERADOS DA TRAJETÓRIA (RAG ATIVO) ---\n${buildRagContext(
      userQuery,
      options.ragContext
    )}\n--- FIM DOS DADOS RECUPERADOS ---\n`;
  }

  if (contextSections) {
    contextSections += `\nDIRETRIZES DE CONTINUIDADE PESSOAL:
1. Responda fundamentando-se nas metas reais, hábitos e memórias recuperadas.
2. Demonstre continuidade: você conhece o usuário e a fase atual da vida dele.
3. Se o usuário estiver sobrecarregado, recomende sustentação de piso mínimo em vez de desistência total.
4. PROIBIÇÃO ABSOLUTA: NUNCA use o emoji de brilhos (✨).`;
  }

  const systemContent = `${TRAJETTA_SYSTEM_PROMPT}${contextSections}`;

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
        temperature: 0.5,
        top_p: 0.85,
        max_tokens: maxTokens,
      }),
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`NVIDIA API response error (${res.status}): ${errText}`);
      throw new Error(`NVIDIA API error: ${res.status}`);
    }

    const data = await res.json();
    const rawContent = data.choices?.[0]?.message?.content || '';
    return cleanAiOutput(rawContent);
  } catch (error) {
    console.error('NVIDIA AI invocation failed, using local Trajetta strategist fallback:', error);
    return getLocalStrategicFallback(userQuery);
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

function getLocalStrategicFallback(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('reduzir') || q.includes('treino') || q.includes('trabalho') || q.includes('corrida') || q.includes('tempo')) {
    return 'Reduzir temporariamente o volume para 2 ou 3 treinos leves de manutenção é uma decisão madura quando a demanda de trabalho se intensifica. O objetivo na Trajetta é manter a linha de base ativa, evitando que um período de sobrecarga quebre a identidade de constância que você já construiu.';
  }

  if (q.includes('meta') || q.includes('maratona') || q.includes('dinheiro') || q.includes('50k')) {
    return 'Olhando para suas metas, o ritmo atual está alinhado com o horizonte de longo prazo. O foco desta semana deve ser proteger os hábitos de base (sono, treino leve e aportes programados) sem adicionar atrito desnecessário à sua rotina.';
  }

  return 'Sua trajetória é construída pela consistência acumulada dos dias normais, não por picos isolados de heroísmo. Escolha a menor ação de avanço para hoje e mantenha o ritmo.';
}
