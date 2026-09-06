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

  // 1. Prompts baseados em METAS
  if (goals.length > 0) {
    const mainGoal = goals[0];
    suggestions.push({
      id: 'g-1',
      category: 'metas',
      badge: `Meta: ${mainGoal.title.slice(0, 18)}...`,
      badgeColor: 'text-[#A98CF7] bg-[#A98CF7]/10 border-[#A98CF7]/20',
      text: `Como está meu avanço rumo a "${mainGoal.title}" (${mainGoal.progress}% concluído) e qual o próximo ponto de alavancagem?`,
    });

    if (goals.length > 1) {
      const secondGoal = goals[1];
      suggestions.push({
        id: 'g-2',
        category: 'metas',
        badge: `${secondGoal.lifeArea.toUpperCase()} (${secondGoal.progress}%)`,
        badgeColor: 'text-[#F08A76] bg-[#F08A76]/10 border-[#F08A76]/20',
        text: `Qual a menor ação diária realizável para destravar "${secondGoal.title}" esta semana?`,
      });
    }
  }

  // 2. Prompts baseados no OBJETIVO DE 12 MESES
  if (user.target12Months) {
    suggestions.push({
      id: 'u-target',
      category: 'estrategia',
      badge: `${user.completedWeeksCount} sem. consistentes`,
      badgeColor: 'text-[#B8FF00] bg-[#B8FF00]/10 border-[#B8FF00]/25',
      text: `Considerando meu compromisso de 12 meses ("${user.target12Months}"), meu ritmo atual de ${user.completedWeeksCount} semanas é sustentável ou estou correndo risco de exaustão?`,
    });
  }

  // 3. Prompts baseados em HÁBITOS E STREAKS
  const streakHabit = [...habits].sort((a, b) => b.streakWeeks - a.streakWeeks)[0];
  if (streakHabit && streakHabit.streakWeeks > 0) {
    suggestions.push({
      id: 'h-streak',
      category: 'habitos',
      badge: `🔥 ${streakHabit.streakWeeks} semanas de streak`,
      badgeColor: 'text-[#F08A76] bg-[#F08A76]/10 border-[#F08A76]/25',
      text: `Já acumulei ${streakHabit.streakWeeks} semanas de consistência em "${streakHabit.title}". Como evitar complacência e blindar esse hábito contra imprevistos?`,
    });
  }

  // Hábito com menor consistência na semana
  const strugglingHabit = habits.find(h => h.daysCompletedThisWeek.length <= 1);
  if (strugglingHabit) {
    suggestions.push({
      id: 'h-struggle',
      category: 'habitos',
      badge: 'Ajuste de hábito',
      badgeColor: 'text-[#8E9499] bg-white/5 border-white/10',
      text: `Estou com atrito para manter "${strugglingHabit.title}" esta semana. Como reduzir a fricção sem abandonar a identidade?`,
    });
  }

  // 4. Prompts baseados no LIFE SCORE
  const areas = ['corpo', 'dinheiro', 'carreira', 'vida'] as const;
  const sortedByScore = [...areas].sort((a, b) => lifeScore[a].score - lifeScore[b].score);
  const lowestArea = sortedByScore[0];
  const highestArea = sortedByScore[sortedByScore.length - 1];

  const areaLabels: Record<string, string> = {
    corpo: 'Corpo & Energia',
    dinheiro: 'Dinheiro & Reserva',
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
      text: `Meu pilar de ${areaLabels[lowestArea]} está em ${areaData.score}/100 no Life Score. O que posso ajustar nos próximos 7 dias sem me culpar?`,
    });
  }

  if (highestArea && highestArea !== lowestArea) {
    const strongData = lifeScore[highestArea];
    suggestions.push({
      id: 'ls-strong',
      category: 'lifescore',
      badge: `Forte: ${areaLabels[highestArea]} (${strongData.score}/100)`,
      badgeColor: 'text-[#58D6A7] bg-[#58D6A7]/10 border-[#58D6A7]/25',
      text: `Minha área de ${areaLabels[highestArea]} está exemplar com nota ${strongData.score}. Como posso transferir essa clareza mental para o restante da minha rotina?`,
    });
  }

  // 5. Prompts de JORNADA E ESTRATÉGIA REAL
  if (journeys.length > 0) {
    const activeJ = journeys[0];
    suggestions.push({
      id: 'j-1',
      category: 'estrategia',
      badge: `Jornada dia ${activeJ.currentDay}/${activeJ.totalDays}`,
      badgeColor: 'text-[#6FAEF7] bg-[#6FAEF7]/10 border-[#6FAEF7]/25',
      text: `Estou no dia ${activeJ.currentDay} da jornada "${activeJ.title}". Quais são os pontos cegos comuns desta fase e como me antecipar a eles?`,
    });
  }

  // 6. Dilema clássico da vida real (Trabalho vs Treinos / Sobrecarga)
  suggestions.push({
    id: 'd-1',
    category: 'estrategia',
    badge: 'Calibragem de Carga',
    badgeColor: 'text-[#B8FF00] bg-[#B8FF00]/10 border-[#B8FF00]/20',
    text: 'Estou sentindo sobrecarga no trabalho este mês. Como recalibrar temporariamente meus treinos sem quebrar a consistência acumulada?',
  });

  return suggestions;
}
