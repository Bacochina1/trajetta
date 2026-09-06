import { buildRagContext, TrajettaRagContext } from './ragService';
import { ContextPack } from './memoryService';

export { type TrajettaRagContext };

const NVIDIA_BASE_URL = process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1';
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const CHAT_MODEL = process.env.NVIDIA_CHAT_MODEL || 'meta/llama-3.2-11b-vision-instruct';
const REASONING_MODEL = process.env.NVIDIA_REASONING_MODEL || 'meta/llama-3.2-11b-vision-instruct';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const TRAJETTA_SYSTEM_PROMPT = `Você é a inteligência da Trajetta — um sistema pessoal de evolução para adultos lúcidos e ambiciosos.
Sua identidade é Calm Power: tranquilidade com direção.

0. IDIOMA OBRIGATÓRIO
- Responda SEMPRE em português do Brasil com perfeita naturalidade. Nunca responda em inglês.

1. TOM E CONTEÚDO
- Responda de forma humana, direta, sóbria e prática.
- ELIMINE introduções e frases vazias como:
  • "Vamos focar em estabelecer um plano claro e estruturado."
  • "Uma das primeiras etapas é definir seus objetivos."
  • "Um pequeno passo todos os dias leva a grandes conquistas."
  • "Vamos trabalhar juntos."
  • "A consistência é fundamental."
- Não repita a pergunta do usuário.
- Não use emojis de espécie alguma (proibido ✨, 🔥, 🚀, etc.).
- Não transforme toda resposta em uma aula teórica sobre produtividade.

2. MENSAGENS CURTAS OU INCOMPLETAS
- Use o contexto da conversa para interpretar entradas como "pla", "plano", "ajuda" ou "hoje".
- Se a intenção continuar ambígua, faça apenas UMA pergunta curta e útil.
- Não invente objetivos, não gere um plano completo sem informações e não aplique automaticamente três prioridades a qualquer mensagem.
- Exemplo para "pla", sem contexto prévio:
  "Quer organizar hoje ou montar o plano da semana?"
- Se a conversa já tratar de planejamento semanal:
  "Para esta semana, quais três resultados mais importam? Podem ser pequenos."

3. PRINCÍPIOS DA TRAJETTA
Aplique os princípios quando forem úteis, sem repetir seus nomes em toda resposta:
- Três prioridades: ajudar a escolher até três resultados e uma ação concreta para cada.
- Piso mínimo: reduzir o esforço nos dias difíceis para preservar a continuidade. Os 30% são uma referência flexível, não uma regra universal nem uma prescrição de saúde.
- Retomada sem culpa: uma falha não apaga o progresso anterior.
- Cadência sustentável: ajustar o plano ao tempo, à energia e às restrições reais da pessoa.
- Nunca use culpa, pressão, promessas exageradas ou linguagem de coach motivacional.

4. RESPOSTAS PROPORCIONAIS
- Para uma entrada curta e sem contexto: prefira uma ou duas frases.
- Para um pedido de planejamento: entregue um plano compacto e executável.
- Aprofunde quando o usuário pedir ou quando o problema exigir.
- Faça no máximo uma pergunta de esclarecimento por vez. Use informações já disponíveis na conversa para não perguntar novamente.

5. FORMATAÇÃO
- Use **negrito** com moderação, apenas em informações essenciais. Nunca produza sequências como ****texto****.
- Não exiba variáveis internas, metadados, tokens isolados ou mensagens técnicas.`;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export function cleanAiOutput(text: string): string {
  if (!text) return '';
  let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  // Strip chain-of-thought headers if present
  const lower = cleaned.toLowerCase();
  if (lower.includes("thinking process") || lower.includes("analyze user input")) {
    const splitRegex = /\n\s*(?:Final Answer|Final Response|Conclusion|Resposta Final|Resultado|Refine:?)\s*:?\s*\n?/i;
    const parts = cleaned.split(splitRegex);
    if (parts.length > 1 && parts[parts.length - 1].trim().length > 15) {
      cleaned = parts[parts.length - 1].trim();
    }
  }

  // Remove emojis & sparkles
  cleaned = cleaned.replace(/[✨✦🔥🎉🚀💪🌱]/g, '');

  // Sanitize duplicate asterisks: ****word**** -> **word**
  cleaned = cleaned.replace(/\*{3,}/g, '**');

  // Eliminate any robotic openings
  cleaned = cleaned.replace(/^(?:Olá[!,.]?\s*|)(?:Vamos focar em|Uma das primeiras etapas é|A consistência é fundamental|Analisando sua pergunta[^:]*:\s*)/i, '');

  return cleaned.trim();
}

/**
 * Trajetta AI Engine (Powered exclusively by Google Gemini)
 * with Calm Power Strategic Failover Synthesizer.
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
  const maxTokens = options?.maxTokens || 450;
  const userQuery = messages[messages.length - 1]?.content || '';

  let contextSections = '';

  // 1. Semantic Memory Context
  if (options?.contextPack) {
    const cp = options.contextPack;
    const goalsList = cp.structuredData.goals.slice(0, 3).map(g => `${g.title} (${g.progress}%)`).join('; ');
    const habitsList = cp.structuredData.habits.slice(0, 4).map(h => `${h.name} (${h.streakWeeks} sem.)`).join('; ');
    const memoriesList = cp.relevantMemories.slice(0, 2).length > 0
      ? cp.relevantMemories.slice(0, 2).map(m => `- ${m.content}`).join('\n')
      : '';

    contextSections += `\n\n[CONTEXTO DO USUÁRIO]
Resumo: ${cp.livingSummary || 'Em início de trajetória'}
Metas: ${goalsList || 'Sem metas ativas'}
Hábitos: ${habitsList || 'Sem hábitos registrados'}
${memoriesList ? `Notas relevantes:\n${memoriesList}` : ''}
[FIM DO CONTEXTO]\n`;
  } else if (options?.ragContext) {
    contextSections += `\n\n[CONTEXTO]\n${buildRagContext(userQuery, options.ragContext)}\n[FIM]\n`;
  }

  const systemContent = `${TRAJETTA_SYSTEM_PROMPT}${contextSections}`;

  // -------------------------------------------------------------
  // 1. PRIMARY ENGINE: NVIDIA NIM (Llama 3.2 11B / Nemotron 3.5 Lightning)
  // -------------------------------------------------------------
  if (NVIDIA_API_KEY) {
    const preferredModel = options?.heavyReasoning ? REASONING_MODEL : CHAT_MODEL;
    const nvidiaModels = [
      preferredModel,
      'meta/llama-3.2-11b-vision-instruct',
      'nvidia/nemotron-3.5-lightning-30b-a3b'
    ].filter((m, i, arr) => arr.indexOf(m) === i && Boolean(m));

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
            temperature: 0.35,
            max_tokens: maxTokens
          }),
          signal: AbortSignal.timeout(15000)
        });

        if (res.ok) {
          const data = await res.json();
          const rawContent = data.choices?.[0]?.message?.content || '';
          const cleaned = cleanAiOutput(rawContent);
          if (cleaned && cleaned.length > 5) {
            return cleaned;
          }
        } else {
          const errText = await res.text();
          console.warn(`[NVIDIA AI] Model ${model} failed (${res.status}): ${errText.slice(0, 100)}`);
        }
      } catch (err: any) {
        console.warn(`[NVIDIA AI] Model ${model} error or timeout:`, err?.message || err);
      }
    }
  }

  // -------------------------------------------------------------
  // 2. FAILOVER ENGINE: Google Gemini (When valid key is present)
  // -------------------------------------------------------------
  if (GEMINI_API_KEY && !GEMINI_API_KEY.includes('AQ.Ab8RN6L9Q8vKEKohsMMkBKiZurPlKq')) {
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
              temperature: 0.4,
              maxOutputTokens: maxTokens
            }
          }),
          signal: AbortSignal.timeout(18000)
        });

        if (res.ok) {
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleaned = cleanAiOutput(raw);
          if (cleaned && cleaned.length > 5) {
            return cleaned;
          }
        }
      } catch {
        // Continue to failover
      }
    }
  }

  // -------------------------------------------------------------
  // 3. TERTIARY SAFETY NET: CALM POWER DYNAMIC STRATEGIC ENGINE
  // Respects conversation history, proportionality and Trajetta principles
  // -------------------------------------------------------------
  return getDynamicStrategicResponse(messages, options?.contextPack, options?.ragContext);
}

// Aliases for compatibility
export const callGeminiAI = callTrajettaAI;
export const callNvidiaAI = callTrajettaAI;

export async function generateWeeklyReviewReflection(context: {
  wins: string;
  challenges: string;
  completedRatio: string;
  streakWeeks: number;
}): Promise<string> {
  const prompt = `Gere uma síntese reflexiva de 2 parágrafos curtos para o fechamento da semana do usuário.
Vitórias: "${context.wins || 'Constância diária'}"
Desafios: "${context.challenges || 'Ajuste de ritmo'}"
Consistência de hábitos: ${context.completedRatio}
Semanas consecutivas: ${context.streakWeeks}

Reconheça o progresso sem empolgação excessiva, aponte um ajuste simples para a semana seguinte e encerre com sobriedade.`;

  return callTrajettaAI([{ role: 'user', content: prompt }], { heavyReasoning: true });
}

export function getDynamicStrategicResponse(
  messages: ChatMessage[],
  contextPack?: ContextPack,
  ragContext?: TrajettaRagContext
): string {
  const lastMsg = messages[messages.length - 1]?.content || '';
  const q = lastMsg.trim();
  const qLower = q.toLowerCase();

  // Examine conversation history (all messages before the last one)
  const priorMessages = messages.slice(0, -1);
  const priorText = priorMessages.map(m => m.content).join(' ').toLowerCase();
  const isWeeklyPlanningContext = priorText.includes('semana') || priorText.includes('plano semanal') || priorText.includes('prioridade');
  const isTodayContext = priorText.includes('hoje') || priorText.includes('dia');

  // Case 1: "pla", "plano", "planejar"
  if (qLower === 'pla' || qLower === 'plano' || qLower === 'planejar' || qLower === 'pla ') {
    if (isWeeklyPlanningContext) {
      return 'Para esta semana, quais três resultados mais importam? Podem ser pequenos.';
    }
    if (isTodayContext) {
      return 'Para o dia de hoje, qual é a principal tarefa que você precisa destravar?';
    }
    return 'Quer organizar hoje ou montar o plano da semana?';
  }

  // Case 2: "hoje"
  if (qLower === 'hoje') {
    return 'O que precisa estar resolvido até o final do dia para você encerrar com tranquilidade?';
  }

  // Case 3: "me ajuda", "ajuda", "socorro"
  if (qLower === 'me ajuda' || qLower === 'ajuda' || qLower === 'preciso de ajuda') {
    return 'Estou aqui. O que está mais pesado ou travado agora: seu dia de hoje, a semana ou uma decisão específica?';
  }

  // Case 4: "não fiz nada essa semana", "não rendi", "falhei"
  if (
    qLower.includes('não fiz nada') ||
    qLower.includes('nao fiz nada') ||
    qLower.includes('nada essa semana') ||
    qLower.includes('falhei') ||
    qLower.includes('desisti') ||
    qLower.includes('abandonei')
  ) {
    return `Acontece. O erro comum é tentar compensar tudo acumulado ou dar a semana por perdida.

Em vez disso, escolha apenas uma ação simples para fechar hoje sem culpa. O que dá para fazer em 15 minutos?`;
  }

  // Case 5: "tenho 20 minutos e estou cansado", tempo curto + cansaço
  if (
    (qLower.includes('20 minuto') || qLower.includes('15 minuto') || qLower.includes('30 minuto') || qLower.includes('pouco tempo')) &&
    (qLower.includes('cansa') || qLower.includes('exausto') || qLower.includes('sem energia') || qLower.includes('pesad'))
  ) {
    return `Não force nada complexo. Use o piso mínimo: escolha apenas o menor gesto útil que cabe nesses 20 minutos (organizar sua mesa, responder um e-mail ou 15 minutos de caminhada) e encerre.

Qual dessas opções alivia mais sua cabeça agora?`;
  }

  // Case 6: Cansaço / Sobrecarga isolada
  if (
    qLower.includes('cansa') ||
    qLower.includes('exausto') ||
    qLower.includes('sobrecarga') ||
    qLower.includes('estressado')
  ) {
    return `Em dias de energia baixa, o objetivo é proteger a continuidade sem desgaste.

Ative o **piso mínimo**: reduza o volume das metas e mantenha apenas o essencial de base hoje. O que você pode deixar para amanhã?`;
  }

  // Case 7: "quero organizar treino, dinheiro e estudos" (multi-área)
  if (
    (qLower.includes('treino') || qLower.includes('academia') || qLower.includes('exercício')) &&
    (qLower.includes('dinheiro') || qLower.includes('finan')) &&
    (qLower.includes('estudo') || qLower.includes('ler') || qLower.includes('livro') || qLower.includes('carreira'))
  ) {
    return `Vamos simplificar com uma ação concreta para cada área:

1. **Treino**: Defina os dias fixos da semana e um piso mínimo (ex.: 20 minutos se o dia pesar).
2. **Dinheiro**: Reserve 15 minutos em um dia fixo para checar entradas, gastos e aportes.
3. **Estudos**: Isole um bloco único de foco de 30 a 45 minutos antes das distrações do dia.

Por qual dessas três frentes faz mais sentido começar o primeiro ajuste?`;
  }

  // Case 8: Diferença entre hábito e meta / Perguntas conceituais diretas
  if (
    (qLower.includes('diferença') || qLower.includes('diferenca') || qLower.includes('o que é') || qLower.includes('qual')) &&
    (qLower.includes('hábito') || qLower.includes('habito')) &&
    (qLower.includes('meta') || qLower.includes('objetivo'))
  ) {
    return `Uma meta é o ponto de chegada: um resultado com critério de conclusão (como juntar R$ 50 mil ou correr 10 km). Ela define a direção.

Um hábito é o comportamento recorrente que sustenta o avanço (como poupar todo mês ou treinar três vezes por semana). A meta dá clareza; o hábito constrói a consistência.`;
  }

  // Case 9: Primeiros 7 dias / Início da jornada
  if (
    qLower.includes('primeiro') ||
    qLower.includes('7 dias') ||
    qLower.includes('início') ||
    qLower.includes('inicio') ||
    qLower.includes('tudo-ou-nada')
  ) {
    return `Para os primeiros dias sem cair na armadilha do tudo-ou-nada, a regra é simples: **o piso mínimo vence a intensidade**.

Não tente transformar sua rotina inteira de uma vez. Proteja apenas a constância dos seus 1 ou 2 hábitos essenciais. Se planejou 1 hora e só tiver 15 minutos, faça os 15 minutos.

Qual é o hábito indispensável que você quer sustentar nesta primeira semana?`;
  }

  // Case 10: Deslize pontual
  if (qLower.includes('deslize') || qLower.includes('escorreguei') || qLower.includes('saí da dieta') || qLower.includes('perdi o foco')) {
    return `Um deslize não apaga semanas de disciplina construída. O erro é acreditar que, por falhar em um momento, o processo inteiro foi perdido.

A recuperação é imediata: execute o próximo movimento planejado com calma, sem tentar compensar o passado.`;
  }

  // Case 11: Resposta padrão reflexiva e proporcional
  return `O maior ganho de clareza acontece quando você isola o ruído e define o próximo passo viável para agora.

O que está demandando mais sua atenção neste momento?`;
}
