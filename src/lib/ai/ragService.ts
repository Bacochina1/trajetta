import { LifeArea } from '@/types';

export interface TrajettaRagContext {
  user?: {
    name?: string;
    target12Months?: string;
    primaryFocusArea?: LifeArea;
    completedWeeksCount?: number;
    role?: string;
    timezone?: string;
  };
  goals?: Array<{
    id: string;
    title: string;
    lifeArea: LifeArea;
    progress: number;
    targetDate?: string;
    whyItMatters?: string;
    milestones?: Array<{ title: string; completed: boolean }>;
    actions?: Array<{ title: string; completedToday?: boolean }>;
  }>;
  habits?: Array<{
    id: string;
    title: string;
    lifeArea: LifeArea;
    frequencyPerWeek: number;
    daysCompletedThisWeek: number[];
    targetDescription?: string;
    streakWeeks?: number;
  }>;
  journeys?: Array<{
    id: string;
    title: string;
    lifeArea: LifeArea;
    totalDays: number;
    currentDay: number;
    slipDays: number;
    status: string;
  }>;
  weeklyPlan?: {
    weekNumber: number;
    year: number;
    weekIntention?: string;
    perceivedCapacity?: 'leve' | 'normal' | 'intensa';
    areaPriorities?: Record<string, string>;
  };
  weeklyReviews?: Array<{
    weekNumber: number;
    year: number;
    date: string;
    habitsRate: number;
    topArea: LifeArea;
    neglectedArea: LifeArea;
    reflectionWhatAdvanced: string;
    reflectionWhatDistracted: string;
    reflectionProudOf: string;
    reflectionNextWeekAdjustment: string;
    aiReflection?: string;
  }>;
  timeline?: Array<{
    date: string;
    title: string;
    description: string;
    type: string;
    lifeArea?: LifeArea;
  }>;
  lifeScore?: Record<string, {
    score: number;
    status: 'attention' | 'evolving' | 'strong';
    label: string;
    insight: string;
  }>;
}

const AREA_LABELS: Record<string, string> = {
  corpo: 'Corpo (Saúde & Energia)',
  dinheiro: 'Dinheiro (Finanças & Patrimônio)',
  carreira: 'Carreira (Trabalho & Negócios)',
  vida: 'Vida (Relações & Presença)',
};

const DAY_NAMES = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];

export function buildRagContext(userQuery: string, context?: TrajettaRagContext): string {
  if (!context) {
    return '[NENHUM HISTÓRICO LOCAL REGISTRADO - MODO ACOLHIMENTO GERAL]';
  }

  const queryLower = (userQuery || '').toLowerCase();
  const sections: string[] = [];

  // 1. Identidade e North Star Baseline
  const u = context.user || {};
  const userName = u.name || 'Explorador';
  const target12m = u.target12Months || 'Evolução integral sustentável';
  const weeksCount = u.completedWeeksCount ?? 14;
  const primaryArea = u.primaryFocusArea ? AREA_LABELS[u.primaryFocusArea] || u.primaryFocusArea : 'Corpo';

  sections.push(`[PERFIL DO USUÁRIO & MÉTRICA NORTH STAR]
• Nome: ${userName}
• Visão de 12 Meses: "${target12m}"
• Área Prioritária Declarada: ${primaryArea}
• Métrica North Star: ${weeksCount} semanas concluídas com consistência na Trajetta.`);

  // 2. Semana Vigente & Intenção
  const wp = context.weeklyPlan;
  if (wp) {
    const intention = wp.weekIntention || 'Construir consistência diária sem sobrecarga';
    const capacity = wp.perceivedCapacity || 'normal';
    let prioStr = '';
    if (wp.areaPriorities) {
      prioStr = Object.entries(wp.areaPriorities)
        .map(([area, txt]) => `  - ${AREA_LABELS[area] || area}: ${txt || 'Foco regular'}`)
        .join('\n');
    }
    sections.push(`[SEMANA ATUAL (${wp.weekNumber || 36}/${wp.year || 2026})]
• Intenção da Semana: "${intention}"
• Capacidade Percebida: ${capacity.toUpperCase()} (${capacity === 'leve' ? 'Semana atípica/viagem, foco apenas no piso' : capacity === 'intensa' ? 'Pico de entrega e alta demanda' : 'Ritmo sustentável e equilibrado'})
• Focos por Área nesta Semana:
${prioStr || '  - Metas balanceadas nas 4 áreas'}`);
  }

  // 3. Metas Ativas e Marcos Relevantes
  const goals = context.goals || [];
  if (goals.length > 0) {
    // Rank goals by query relevance or priority
    const sortedGoals = [...goals].sort((a, b) => {
      const aMatches = queryLower.includes(a.title.toLowerCase()) || queryLower.includes(a.lifeArea.toLowerCase());
      const bMatches = queryLower.includes(b.title.toLowerCase()) || queryLower.includes(b.lifeArea.toLowerCase());
      if (aMatches && !bMatches) return -1;
      if (!aMatches && bMatches) return 1;
      return b.progress - a.progress;
    });

    const goalLines = sortedGoals.slice(0, 4).map(g => {
      const doneMilestones = g.milestones?.filter(m => m.completed).length || 0;
      const totalMilestones = g.milestones?.length || 0;
      const nextMilestone = g.milestones?.find(m => !m.completed)?.title;
      return `• "${g.title}" (${AREA_LABELS[g.lifeArea] || g.lifeArea}) — ${g.progress}% concluída
  - Prazo: ${g.targetDate || '2026'} | Por que importa: "${g.whyItMatters || 'Consistência de vida'}"
  - Marcos: ${doneMilestones}/${totalMilestones} atingidos${nextMilestone ? ` | Próximo marco: "${nextMilestone}"` : ' (Todos marcos concluídos)'}`;
    }).join('\n');

    sections.push(`[METAS ATIVAS & MARCOS EM ANDAMENTO]\n${goalLines}`);
  }

  // 4. Hábitos e Execuções na Semana
  const habits = context.habits || [];
  if (habits.length > 0) {
    const habitLines = habits.map(h => {
      const completedDays = (h.daysCompletedThisWeek || []).map(d => DAY_NAMES[d] || d).join(', ');
      const countDone = h.daysCompletedThisWeek?.length || 0;
      return `• "${h.title}" (${AREA_LABELS[h.lifeArea] || h.lifeArea}):
  - Meta: ${h.frequencyPerWeek}x na semana | Realizado nesta semana: ${countDone} dias (${completedDays || 'Nenhum dia ainda'})
  - Streak histórico acumulado: ${h.streakWeeks || 1} semanas consecutivas.`;
    }).join('\n');

    sections.push(`[HÁBITOS & EXECUÇÃO SEMANAL]\n${habitLines}`);
  }

  // 5. Jornadas & Recuperação de Deslizes
  const journeys = context.journeys || [];
  if (journeys.length > 0) {
    const journeyLines = journeys.map(j => {
      const percent = Math.round((j.currentDay / j.totalDays) * 100);
      return `• "${j.title}" (${AREA_LABELS[j.lifeArea] || j.lifeArea}):
  - Progresso: Dia ${j.currentDay} de ${j.totalDays} (${percent}%)
  - Deslizes registrados: ${j.slipDays} (${j.slipDays === 0 ? 'Constância contínua sem deslizes' : 'Deslizes superados com continuidade preservada'})`;
    }).join('\n');

    sections.push(`[JORNADAS DE COMPROMISSO ATIVAS]\n${journeyLines}`);
  }

  // 6. Último Weekly Review
  const reviews = context.weeklyReviews || [];
  if (reviews.length > 0) {
    const lastRev = reviews[0];
    sections.push(`[ÚLTIMO WEEKLY REVIEW CONCLUÍDO (Semana ${lastRev.weekNumber})]
• O que avançou: "${lastRev.reflectionWhatAdvanced || 'Constância mantida'}"
• O que atrapalhou: "${lastRev.reflectionWhatDistracted || 'Imprevistos de rotina'}"
• Ajuste planejado para a semana seguinte: "${lastRev.reflectionNextWeekAdjustment || 'Manter o ritmo'}"
• Reflexão gerada: "${lastRev.aiReflection || 'Consistência excelente'}"`);
  }

  // 7. Life Score (Diagnóstico Atual)
  const ls = context.lifeScore;
  if (ls) {
    const lsLines = Object.entries(ls).map(([area, data]) => {
      const statusPt = data.status === 'strong' ? 'Forte atualmente' : data.status === 'evolving' ? 'Em evolução' : 'Precisa de atenção';
      return `• ${AREA_LABELS[area] || area}: ${data.score}% (${statusPt}) — Insight: "${data.insight}"`;
    }).join('\n');

    sections.push(`[DIAGNÓSTICO LIFE SCORE DAS 4 ÁREAS]\n${lsLines}`);
  }

  // 8. Eventos Marcantes Recentes na Timeline
  const timeline = context.timeline || [];
  if (timeline.length > 0) {
    const recentEvents = timeline.slice(0, 3).map(e => `• [${e.date}] ${e.title}: ${e.description}`).join('\n');
    sections.push(`[EVENTOS RECENTES NA LINHA DO TEMPO]\n${recentEvents}`);
  }

  return sections.join('\n\n');
}

export function getRagSummary(context?: TrajettaRagContext) {
  if (!context) return null;
  return {
    userName: context.user?.name || 'Explorador',
    weeksCount: context.user?.completedWeeksCount ?? 14,
    goalsCount: context.goals?.length || 0,
    habitsCount: context.habits?.length || 0,
    journeysCount: context.journeys?.length || 0,
    currentWeekNumber: context.weeklyPlan?.weekNumber || 36,
  };
}
