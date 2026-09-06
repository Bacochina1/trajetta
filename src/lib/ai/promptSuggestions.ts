import { UserProfile, Goal, Habit, Journey, WeeklyPlan, LifeScoreData } from '@/types';

export interface PromptSuggestion {
  id: string;
  category: 'metas' | 'habitos' | 'lifescore' | 'estrategia';
  badge: string;
  badgeColor: string;
  text: string;
}

export function generatePersonalizedPrompts(params: {
  user: UserProfile;
  goals: Goal[];
  habits: Habit[];
  journeys: Journey[];
  weeklyPlan: WeeklyPlan;
  lifeScore: LifeScoreData;
}): PromptSuggestion[] {
  const { user, goals, habits, journeys, weeklyPlan, lifeScore } = params;
  const suggestions: PromptSuggestion[] = [];

  // 1. Prompts baseados estritamente em METAS do usuário
  if (goals.length > 0) {
    const mainGoal = goals[0];
    suggestions.push({
      id: 'g-1',
      category: 'metas',
      badge: `Meta: ${mainGoal.title.slice(0, 20)}...`,
      badgeColor: 'text-[#A98CF7] bg-[#A98CF7]/10 border-[#A98CF7]/20',
      text: `Como está meu avanço rumo a "${mainGoal.title}" (${mainGoal.progress}% concluído) e qual o próximo ponto de alavancagem para esta semana?`,
    });

    if (goals.length > 1) {
      const secondGoal = goals[1];
      suggestions.push({
        id: 'g-2',
        category: 'metas',
        badge: `${secondGoal.lifeArea.toUpperCase()} (${secondGoal.progress}%)`,
        badgeColor: 'text-[#F08A76] bg-[#F08A76]/10 border-[#F08A76]/20',
        text: `Qual a menor ação prática realizável para destravar "${secondGoal.title}" nos próximos dias?`,
      });
    }
  } else {
    // Se o usuário ainda não cadastrou meta
    suggestions.push({
      id: 'g-empty',
      category: 'metas',
      badge: 'Definição de Meta',
      badgeColor: 'text-[#A98CF7] bg-[#A98CF7]/10 border-[#A98CF7]/20',
      text: `Ainda não defini uma meta clara para este ciclo. Como estruturar um primeiro objetivo realista para a minha rotina sem me sobrecarregar?`,
    });
  }

  // 2. Prompts baseados no OBJETIVO DE 12 MESES
  if (user.target12Months && user.target12Months.trim()) {
    suggestions.push({
      id: 'u-target',
      category: 'estrategia',
      badge: user.completedWeeksCount > 0 ? `${user.completedWeeksCount} sem. consistentes` : 'Alvo de 12 Meses',
      badgeColor: 'text-[#B8FF00] bg-[#B8FF00]/10 border-[#B8FF00]/25',
      text: `Considerando meu compromisso de 12 meses ("${user.target12Months}"), qual é o maior ponto cego ou distração que devo evitar neste momento?`,
    });
  } else {
    suggestions.push({
      id: 'u-clarity',
      category: 'estrategia',
      badge: 'Alinhamento Estratégico',
      badgeColor: 'text-[#B8FF00] bg-[#B8FF00]/10 border-[#B8FF00]/25',
      text: 'O que devo priorizar esta semana para ter certeza de que estou construindo progresso real e sustentável?',
    });
  }

  // 3. Prompts baseados em HÁBITOS REAIS DO USUÁRIO
  if (habits.length > 0) {
    const streakHabit = [...habits].sort((a, b) => b.streakWeeks - a.streakWeeks)[0];
    if (streakHabit && streakHabit.streakWeeks > 0) {
      suggestions.push({
        id: 'h-streak',
        category: 'habitos',
        badge: `🔥 ${streakHabit.streakWeeks} sem. de consistência`,
        badgeColor: 'text-[#F08A76] bg-[#F08A76]/10 border-[#F08A76]/25',
        text: `Já acumulei ${streakHabit.streakWeeks} semanas de consistência em "${streakHabit.title}". Como proteger esse hábito em dias de rotina atípica?`,
      });
    }

    const strugglingHabit = habits.find(h => h.daysCompletedThisWeek.length <= 1);
    if (strugglingHabit) {
      suggestions.push({
        id: 'h-struggle',
        category: 'habitos',
        badge: 'Redução de Atrito',
        badgeColor: 'text-[#8E9499] bg-white/5 border-white/10',
        text: `Estou sentindo atrito para manter "${strugglingHabit.title}" esta semana. Como diminuir a fricção sem abandonar o hábito?`,
      });
    }
  } else {
    suggestions.push({
      id: 'h-empty',
      category: 'habitos',
      badge: 'Hábito Chave',
      badgeColor: 'text-[#F08A76] bg-[#F08A76]/10 border-[#F08A76]/20',
      text: 'Quais seriam 1 ou 2 hábitos simples que trariam o maior retorno de energia e clareza para a minha semana?',
    });
  }

  // 4. Prompts baseados no LIFE SCORE
  const areas = ['corpo', 'dinheiro', 'carreira', 'vida'] as const;
  const sortedByScore = [...areas].sort((a, b) => lifeScore[a].score - lifeScore[b].score);
  const lowestArea = sortedByScore[0];
  const highestArea = sortedByScore[sortedByScore.length - 1];

  const areaLabels: Record<string, string> = {
    corpo: 'Corpo & Energia',
    dinheiro: 'Dinheiro & Finanças',
    carreira: 'Carreira & Impacto',
    vida: 'Vida & Equilíbrio',
  };

  if (lowestArea) {
    const areaData = lifeScore[lowestArea];
    suggestions.push({
      id: 'ls-attention',
      category: 'lifescore',
      badge: `Atenção: ${areaLabels[lowestArea]} (${areaData.score}/100)`,
      badgeColor: 'text-[#F08A76] bg-[#F08A76]/10 border-[#F08A76]/25',
      text: `Minha dimensão de ${areaLabels[lowestArea]} está com nota ${areaData.score}/100 no Life Score. Qual é o ajuste mais simples e indolor para os próximos 7 dias?`,
    });
  }

  if (highestArea && highestArea !== lowestArea) {
    const strongData = lifeScore[highestArea];
    suggestions.push({
      id: 'ls-strong',
      category: 'lifescore',
      badge: `Pilar Forte: ${areaLabels[highestArea]} (${strongData.score}/100)`,
      badgeColor: 'text-[#58D6A7] bg-[#58D6A7]/10 border-[#58D6A7]/25',
      text: `Minha área de ${areaLabels[highestArea]} está sólida com ${strongData.score}/100. Como posso usar esse mesmo método mental para fortalecer minhas outras áreas?`,
    });
  }

  // 5. Prompts de Jornada (apenas se existir jornada ativa)
  if (journeys.length > 0) {
    const activeJ = journeys[0];
    suggestions.push({
      id: 'j-1',
      category: 'estrategia',
      badge: `Jornada: ${activeJ.currentDay}/${activeJ.totalDays} dias`,
      badgeColor: 'text-[#6FAEF7] bg-[#6FAEF7]/10 border-[#6FAEF7]/25',
      text: `Estou no dia ${activeJ.currentDay} da jornada "${activeJ.title}". Como evitar a perda de ritmo na reta intermediária?`,
    });
  }

  return suggestions;
}
