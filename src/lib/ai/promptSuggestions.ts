import { UserProfile, Goal, Habit, Journey, WeeklyPlan, LifeScoreData, WeeklyReview } from '@/types';

export interface PromptSuggestion {
  id: string;
  category: 'evolucao' | 'metas' | 'habitos' | 'lifescore' | 'estrategia';
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
  weeklyReviews?: WeeklyReview[];
  lifeScore: LifeScoreData;
}): PromptSuggestion[] {
  const { user, goals, habits, journeys, weeklyPlan, weeklyReviews = [], lifeScore } = params;
  const suggestions: PromptSuggestion[] = [];

  const areaLabels: Record<string, string> = {
    corpo: 'Corpo & Energia',
    dinheiro: 'Dinheiro & Finanças',
    carreira: 'Carreira & Negócios',
    vida: 'Vida & Equilíbrio',
  };

  // =========================================================================
  // 1. EVOLUÇÃO & TRAJETÓRIA (Histórico Real, Semanas Acumuladas, Aprendizados)
  // =========================================================================
  if (user.completedWeeksCount > 0) {
    suggestions.push({
      id: 'evo-weeks',
      category: 'evolucao',
      badge: `🚀 ${user.completedWeeksCount} Semanas de Consistência`,
      badgeColor: 'text-[#B8FF00] bg-[#B8FF00]/10 border-[#B8FF00]/30',
      text: `Já completei ${user.completedWeeksCount} semanas consecutivas de consistência no Trajetta. Olhando para a minha trajetória acumulada, qual é o próximo patamar de evolução que devo buscar agora?`,
    });
  } else {
    suggestions.push({
      id: 'evo-start',
      category: 'evolucao',
      badge: '🌱 Início da Trajetória',
      badgeColor: 'text-[#58D6A7] bg-[#58D6A7]/10 border-[#58D6A7]/25',
      text: 'Estou no início da minha jornada no Trajetta. Qual é a regra de ouro para garantir que eu complete meus primeiros 7 dias sem cair na armadilha do tudo-ou-nada?',
    });
  }

  // Aprendizados da última revisão semanal
  if (weeklyReviews && weeklyReviews.length > 0) {
    const lastRev = weeklyReviews[0];
    if (lastRev.reflectionWhatDistracted && lastRev.reflectionWhatDistracted.trim()) {
      suggestions.push({
        id: 'evo-distraction',
        category: 'evolucao',
        badge: `🔍 Aprendizado Semana ${lastRev.weekNumber}`,
        badgeColor: 'text-[#F08A76] bg-[#F08A76]/10 border-[#F08A76]/25',
        text: `Na minha última revisão identifiquei que "${lastRev.reflectionWhatDistracted.slice(0, 45)}..." me tirou do ritmo. Quais são 2 salvaguardas práticas para isso não se repetir esta semana?`,
      });
    }

    if (lastRev.reflectionProudOf && lastRev.reflectionProudOf.trim()) {
      suggestions.push({
        id: 'evo-win',
        category: 'evolucao',
        badge: `🏆 Vitória Recente`,
        badgeColor: 'text-[#B8FF00] bg-[#B8FF00]/10 border-[#B8FF00]/25',
        text: `Na última semana me orgulhei de ter "${lastRev.reflectionProudOf.slice(0, 40)}...". Como usar esse mesmo sentimento de conquista nos dias em que a procrastinação ameaçar?`,
      });
    }

    if (lastRev.reflectionNextWeekAdjustment && lastRev.reflectionNextWeekAdjustment.trim()) {
      suggestions.push({
        id: 'evo-adjust',
        category: 'evolucao',
        badge: `⚙️ Ajuste de Rota`,
        badgeColor: 'text-[#6FAEF7] bg-[#6FAEF7]/10 border-[#6FAEF7]/25',
        text: `Meu ajuste planejado é "${lastRev.reflectionNextWeekAdjustment.slice(0, 40)}...". Como desmembrar isso na menor ação possível para executar hoje?`,
      });
    }
  }

  // Capacidade percebida da semana
  if (weeklyPlan?.perceivedCapacity === 'intensa') {
    suggestions.push({
      id: 'evo-capacity-high',
      category: 'evolucao',
      badge: '⚡ Semana de Alta Carga',
      badgeColor: 'text-[#F08A76] bg-[#F08A76]/10 border-[#F08A76]/25',
      text: 'Defini minha semana como intensa. Como manter o alto rendimento e foco sem comprometer meu sono, saúde e paciência?',
    });
  } else if (weeklyPlan?.perceivedCapacity === 'leve') {
    suggestions.push({
      id: 'evo-capacity-low',
      category: 'evolucao',
      badge: '🌿 Semana de Recuperação',
      badgeColor: 'text-[#58D6A7] bg-[#58D6A7]/10 border-[#58D6A7]/25',
      text: 'Planejei uma semana mais leve e regenerativa. Como descansar com presença e sem a culpa irracional de "estar produzindo menos"?',
    });
  }

  // =========================================================================
  // 2. METAS & MARCOS CONCRETOS (Progresso, Ponto de Alavancagem e Próximo Marco)
  // =========================================================================
  if (goals.length > 0) {
    const mainGoal = goals[0];

    // Meta em fase final (>70%)
    if (mainGoal.progress >= 70) {
      suggestions.push({
        id: 'g-final-stretch',
        category: 'metas',
        badge: `🎯 Reta Final: ${mainGoal.title.slice(0, 18)}...`,
        badgeColor: 'text-[#B8FF00] bg-[#B8FF00]/10 border-[#B8FF00]/30',
        text: `Minha meta "${mainGoal.title}" já está em ${mainGoal.progress}%! Como fechar os últimos marcos com excelência e já antecipar o próximo desafio sem perder ritmo?`,
      });
    } else if (mainGoal.progress >= 25) {
      suggestions.push({
        id: 'g-traction',
        category: 'metas',
        badge: `🎯 Tração (${mainGoal.progress}%): ${mainGoal.title.slice(0, 16)}...`,
        badgeColor: 'text-[#A98CF7] bg-[#A98CF7]/10 border-[#A98CF7]/25',
        text: `Estou em ${mainGoal.progress}% rumo a "${mainGoal.title}". A fase intermediária costuma ter perda de entusiasmo... qual o próximo ponto de alavancagem para esta semana?`,
      });
    } else {
      suggestions.push({
        id: 'g-initial-push',
        category: 'metas',
        badge: `🎯 Primeiros Passos: ${mainGoal.title.slice(0, 16)}...`,
        badgeColor: 'text-[#6FAEF7] bg-[#6FAEF7]/10 border-[#6FAEF7]/25',
        text: `Acabei de começar a meta "${mainGoal.title}" (${mainGoal.progress}% concluído). Qual é a menor vitória rápida realizável nos próximos 3 dias para consolidar tração?`,
      });
    }

    // Encontrar próximo marco pendente concreto
    const nextMilestone = mainGoal.milestones?.find((m) => !m.completed);
    if (nextMilestone) {
      suggestions.push({
        id: 'g-next-milestone',
        category: 'metas',
        badge: `📌 Próximo Marco: ${nextMilestone.title.slice(0, 18)}...`,
        badgeColor: 'text-[#58D6A7] bg-[#58D6A7]/10 border-[#58D6A7]/25',
        text: `Meu próximo marco é "${nextMilestone.title}" na meta "${mainGoal.title}". Quais são os obstáculos mais prováveis para concluí-lo e como superá-los?`,
      });
    }

    // Segunda meta, se existir
    if (goals.length > 1) {
      const secondGoal = goals[1];
      suggestions.push({
        id: 'g-second',
        category: 'metas',
        badge: `${areaLabels[secondGoal.lifeArea] || secondGoal.lifeArea.toUpperCase()} (${secondGoal.progress}%)`,
        badgeColor: 'text-[#F08A76] bg-[#F08A76]/10 border-[#F08A76]/20',
        text: `Como equilibrar o avanço de "${secondGoal.title}" (${secondGoal.progress}%) sem que ela concorra por energia com a minha meta principal?`,
      });
    }

    // Propósito central da meta
    if (mainGoal.whyItMatters && mainGoal.whyItMatters.trim()) {
      suggestions.push({
        id: 'g-purpose',
        category: 'metas',
        badge: '💎 Propósito Central',
        badgeColor: 'text-[#A98CF7] bg-[#A98CF7]/10 border-[#A98CF7]/25',
        text: `Defini que "${mainGoal.title}" importa porque "${mainGoal.whyItMatters.slice(0, 45)}...". Como me reconectar com essa motivação quando a fadiga aparecer?`,
      });
    }
  } else {
    suggestions.push({
      id: 'g-empty',
      category: 'metas',
      badge: 'Definição de Meta',
      badgeColor: 'text-[#A98CF7] bg-[#A98CF7]/10 border-[#A98CF7]/20',
      text: 'Ainda não defini uma meta clara para este ciclo. Como estruturar um primeiro objetivo realista para a minha rotina sem me sobrecarregar?',
    });
  }

  // =========================================================================
  // 3. HÁBITOS, RITMO & CONSISTÊNCIA (Streaks, Fricção e Equilíbrio)
  // =========================================================================
  if (habits.length > 0) {
    const streakHabit = [...habits].sort((a, b) => b.streakWeeks - a.streakWeeks)[0];
    if (streakHabit && streakHabit.streakWeeks > 0) {
      suggestions.push({
        id: 'h-streak',
        category: 'habitos',
        badge: `🔥 ${streakHabit.streakWeeks} Semanas: ${streakHabit.title.slice(0, 16)}...`,
        badgeColor: 'text-[#F08A76] bg-[#F08A76]/10 border-[#F08A76]/25',
        text: `Já acumulei ${streakHabit.streakWeeks} semanas de consistência em "${streakHabit.title}". Como blindar esse hábito contra dias de rotina atípica ou viagens?`,
      });
    }

    const strugglingHabit = habits.find((h) => h.daysCompletedThisWeek.length <= 1);
    if (strugglingHabit) {
      suggestions.push({
        id: 'h-struggle',
        category: 'habitos',
        badge: `🛠️ Redução de Atrito: ${strugglingHabit.title.slice(0, 16)}...`,
        badgeColor: 'text-[#8E9499] bg-white/5 border-white/10',
        text: `Estou sentindo atrito para cumprir "${strugglingHabit.title}" esta semana. Como aplicar a "regra dos 2 minutos" para diminuir a fricção sem abandonar o hábito?`,
      });
    }

    if (habits.length >= 5) {
      suggestions.push({
        id: 'h-overload',
        category: 'habitos',
        badge: `⚖️ ${habits.length} Hábitos Ativos`,
        badgeColor: 'text-[#6FAEF7] bg-[#6FAEF7]/10 border-[#6FAEF7]/20',
        text: `Tenho ${habits.length} hábitos ativos. Quais são os 2 que realmente movem o ponteiro da minha vida e quais posso deixar em piloto automático?`,
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

  // =========================================================================
  // 4. LIFE SCORE & EQUILÍBRIO (Dissonância entre Pilares e Alavancagem)
  // =========================================================================
  const areas = ['corpo', 'dinheiro', 'carreira', 'vida'] as const;
  const sortedByScore = [...areas].sort((a, b) => lifeScore[a].score - lifeScore[b].score);
  const lowestArea = sortedByScore[0];
  const highestArea = sortedByScore[sortedByScore.length - 1];

  if (lowestArea && highestArea && lowestArea !== highestArea) {
    const lowScore = lifeScore[lowestArea].score;
    const highScore = lifeScore[highestArea].score;

    // Se houver dissonância relevante entre a área mais forte e a mais fraca
    if (highScore - lowScore >= 20) {
      suggestions.push({
        id: 'ls-dissonance',
        category: 'lifescore',
        badge: `⚖️ Dissonância: ${areaLabels[highestArea]} vs ${areaLabels[lowestArea]}`,
        badgeColor: 'text-[#F08A76] bg-[#F08A76]/10 border-[#F08A76]/25',
        text: `Minha área de ${areaLabels[highestArea]} está sólida (${highScore}/100), mas ${areaLabels[lowestArea]} caiu para ${lowScore}/100. Como reequilibrar meu tempo sem sentir que estou perdendo tração profissional?`,
      });
    }

    // Atenção ao pilar mais fraco
    suggestions.push({
      id: 'ls-attention',
      category: 'lifescore',
      badge: `⚠️ Atenção: ${areaLabels[lowestArea]} (${lowScore}/100)`,
      badgeColor: 'text-[#F08A76] bg-[#F08A76]/10 border-[#F08A76]/25',
      text: `Minha dimensão de ${areaLabels[lowestArea]} está em ${lowScore}/100 no Life Score. Qual é o micro-ajuste mais simples e indolor para os próximos 7 dias?`,
    });

    // Ponto forte para alavancar os fracos
    suggestions.push({
      id: 'ls-strong',
      category: 'lifescore',
      badge: `⭐ Pilar Forte: ${areaLabels[highestArea]} (${highScore}/100)`,
      badgeColor: 'text-[#58D6A7] bg-[#58D6A7]/10 border-[#58D6A7]/25',
      text: `Minha área de ${areaLabels[highestArea]} está forte com ${highScore}/100. Quais modelos mentais ou rituais que uso aqui posso replicar nas minhas outras áreas?`,
    });
  }

  // =========================================================================
  // 5. DESEJOS & VISÃO DE FUTURO ("O Que Ele Talvez Queira")
  // =========================================================================
  // Desejo: Mais tempo e foco
  suggestions.push({
    id: 'desire-time',
    category: 'estrategia',
    badge: '⏳ Mais Tempo & Foco',
    badgeColor: 'text-[#6FAEF7] bg-[#6FAEF7]/10 border-[#6FAEF7]/25',
    text: 'Sinto que meus dias voam e sobra pouco tempo de qualidade para mim. Quais são os ralos invisíveis de tempo que costumam sabotar rotinas parecidas com a minha?',
  });

  // Desejo: Aumento de renda e crescimento financeiro
  suggestions.push({
    id: 'desire-money',
    category: 'estrategia',
    badge: '💰 Acelerar Finanças',
    badgeColor: 'text-[#58D6A7] bg-[#58D6A7]/10 border-[#58D6A7]/25',
    text: 'Quero dar um salto financeiro neste ciclo. Como conectar minha rotina de hábitos e trabalho com um crescimento real de patrimônio e renda?',
  });

  // Desejo: Mais vitalidade e disposição física
  suggestions.push({
    id: 'desire-energy',
    category: 'estrategia',
    badge: '⚡ Mais Disposição Diária',
    badgeColor: 'text-[#B8FF00] bg-[#B8FF00]/10 border-[#B8FF00]/25',
    text: 'Quero acordar com mais disposição física e menos névoa mental. Quais ajustes na minha rotina noturna trariam o maior impacto logo pela manhã?',
  });

  // Desejo: Paz mental e satisfação no domingo
  suggestions.push({
    id: 'desire-peace',
    category: 'estrategia',
    badge: '🧘 Paz no Domingo',
    badgeColor: 'text-[#A98CF7] bg-[#A98CF7]/10 border-[#A98CF7]/25',
    text: 'Quero fechar o próximo domingo com a sensação profunda de dever cumprido em vez de ansiedade pela semana. O que preciso calibrar nos próximos 7 dias?',
  });

  // Alinhamento com objetivo de 12 meses
  if (user.target12Months && user.target12Months.trim()) {
    suggestions.push({
      id: 'desire-12months',
      category: 'estrategia',
      badge: '🚀 Alvo de 12 Meses',
      badgeColor: 'text-[#B8FF00] bg-[#B8FF00]/10 border-[#B8FF00]/30',
      text: `Considerando meu compromisso de 12 meses ("${user.target12Months}"), qual é a decisão corajosa que estou adiando e que destravaria meu próximo nível?`,
    });
  }

  // Se houver jornada ativa
  if (journeys.length > 0) {
    const activeJ = journeys[0];
    suggestions.push({
      id: 'j-1',
      category: 'estrategia',
      badge: `🧭 Jornada: ${activeJ.currentDay}/${activeJ.totalDays} dias`,
      badgeColor: 'text-[#6FAEF7] bg-[#6FAEF7]/10 border-[#6FAEF7]/25',
      text: `Estou no dia ${activeJ.currentDay} da jornada "${activeJ.title}". Como evitar a perda de ritmo na reta intermediária?`,
    });
  }

  return suggestions;
}
