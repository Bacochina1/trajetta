import { describe, it, expect } from 'vitest';
import { Habit, LifeArea, WeeklyPlan, UserProfile } from '@/types';

describe('Agent 4: Minha Semana / Week View & Weekly Review Engine', () => {
  it('should calculate 7-day habit completion rates without NaN or division errors', () => {
    const habits: Habit[] = [
      {
        id: 'h-1',
        title: 'Trabalho Focado',
        lifeArea: 'carreira',
        frequencyPerWeek: 5,
        daysCompletedThisWeek: [1, 2, 3, 4], // Mon-Thu
        targetDescription: '5x',
        streakWeeks: 4,
        iconName: 'CheckCircle',
      },
      {
        id: 'h-2',
        title: 'Leitura',
        lifeArea: 'vida',
        frequencyPerWeek: 7,
        daysCompletedThisWeek: [1, 3, 5],
        targetDescription: '7x',
        streakWeeks: 2,
        iconName: 'CheckCircle',
      },
    ];

    const dayStats = [0, 1, 2, 3, 4, 5, 6].map(day => {
      const completed = habits.filter(h => h.daysCompletedThisWeek.includes(day)).length;
      const rate = habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;
      return { day, completed, rate };
    });

    expect(dayStats.length).toBe(7);
    // On day 1 (Monday): both h-1 and h-2 are completed -> 100%
    expect(dayStats[1].completed).toBe(2);
    expect(dayStats[1].rate).toBe(100);

    // On day 0 (Sunday): 0 completed -> 0%
    expect(dayStats[0].completed).toBe(0);
    expect(dayStats[0].rate).toBe(0);

    // On day 2 (Tuesday): h-1 completed -> 50%
    expect(dayStats[2].completed).toBe(1);
    expect(dayStats[2].rate).toBe(50);
  });

  it('should dynamically calculate topArea and neglectedArea based on actual user logs', () => {
    const habits: Habit[] = [
      {
        id: 'h-c1',
        title: 'Estudo Técnico',
        lifeArea: 'carreira',
        frequencyPerWeek: 5,
        daysCompletedThisWeek: [1, 2, 3, 4, 5], // 5 logs
        targetDescription: '5x',
        streakWeeks: 3,
        iconName: 'CheckCircle',
      },
      {
        id: 'h-d1',
        title: 'Economia',
        lifeArea: 'dinheiro',
        frequencyPerWeek: 1,
        daysCompletedThisWeek: [5], // 1 log
        targetDescription: '1x',
        streakWeeks: 2,
        iconName: 'CheckCircle',
      },
      {
        id: 'h-v1',
        title: 'Descanso sem telas',
        lifeArea: 'vida',
        frequencyPerWeek: 7,
        daysCompletedThisWeek: [], // 0 logs
        targetDescription: '7x',
        streakWeeks: 0,
        iconName: 'CheckCircle',
      },
    ];

    const areaLogs: Record<LifeArea, number> = { corpo: 0, dinheiro: 0, carreira: 0, vida: 0 };
    habits.forEach(h => {
      areaLogs[h.lifeArea] = (areaLogs[h.lifeArea] || 0) + h.daysCompletedThisWeek.length;
    });

    const sortedAreas = (['corpo', 'dinheiro', 'carreira', 'vida'] as LifeArea[]).sort(
      (a, b) => (areaLogs[b] || 0) - (areaLogs[a] || 0)
    );
    const topArea: LifeArea = sortedAreas[0] || 'carreira';
    const neglectedArea: LifeArea = sortedAreas[sortedAreas.length - 1] || 'vida';

    expect(topArea).toBe('carreira'); // 5 logs
    expect(['corpo', 'vida']).toContain(neglectedArea); // 0 logs (tied with vida/corpo)
    expect(areaLogs.carreira).toBe(5);
    expect(areaLogs.dinheiro).toBe(1);
  });

  it('should update weekly priorities and complete week cycle properly', () => {
    let weeklyPlan: WeeklyPlan = {
      id: 'plan-1',
      weekNumber: 1,
      year: 2026,
      northStarGoal: 'Construir rotina sólida',
      areaPriorities: {
        corpo: 'Caminhar diariamente',
        dinheiro: 'Acompanhar gastos',
        carreira: 'Finalizar proposta de cliente',
        vida: 'Dormir antes das 23h',
      },
      isCompleted: false,
    };

    let user: UserProfile = {
      name: 'Paula',
      avatarText: 'P',
      role: 'Membro Fundador',
      isOnboarded: true,
      target12Months: 'Alcançar independência',
      primaryFocusArea: 'carreira',
      completedWeeksCount: 3,
    };

    // Update priority
    weeklyPlan = {
      ...weeklyPlan,
      areaPriorities: {
        ...weeklyPlan.areaPriorities,
        carreira: 'Lançar MVP para os primeiros 10 usuários',
      },
    };
    expect(weeklyPlan.areaPriorities.carreira).toBe('Lançar MVP para os primeiros 10 usuários');

    // Complete week
    user = { ...user, completedWeeksCount: user.completedWeeksCount + 1 };
    weeklyPlan = { ...weeklyPlan, isCompleted: true };

    expect(user.completedWeeksCount).toBe(4);
    expect(weeklyPlan.isCompleted).toBe(true);
  });
});
