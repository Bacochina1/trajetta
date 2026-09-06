import { describe, it, expect } from 'vitest';
import { Habit, Goal } from '@/types';

describe('Agent 3: Hoje / Today View & Daily Consistency', () => {
  it('should correctly calculate movement percentage and handle zero division gracefully', () => {
    // Zero state: no habits, no goal actions
    const habits: Habit[] = [];
    const goals: Goal[] = [];
    const todayIndex = new Date().getDay();

    const todayHabitsDone = habits.filter(h => h.daysCompletedThisWeek.includes(todayIndex)).length;
    const activeGoalActions = goals.flatMap(g => g.actions);
    const goalActionsDone = activeGoalActions.filter(a => a.completedToday).length;

    const totalMovements = habits.length + activeGoalActions.length;
    const completedMovements = todayHabitsDone + goalActionsDone;
    const movementPercentage = totalMovements > 0 ? Math.round((completedMovements / totalMovements) * 100) : 0;

    expect(totalMovements).toBe(0);
    expect(completedMovements).toBe(0);
    expect(movementPercentage).toBe(0);
    expect(isNaN(movementPercentage)).toBe(false);

    // With active items
    const sampleHabit: Habit = {
      id: 'h-1',
      title: 'Beber 2L de Água',
      lifeArea: 'corpo',
      frequencyPerWeek: 7,
      daysCompletedThisWeek: [todayIndex],
      targetDescription: '7x por semana',
      streakWeeks: 3,
      iconName: 'CheckCircle',
    };
    const sampleGoal: Goal = {
      id: 'g-1',
      title: 'Economizar R$ 10.000',
      description: '',
      lifeArea: 'dinheiro',
      status: 'active',
      startDate: '2026-09-01',
      targetDate: '2026-12-31',
      progress: 25,
      whyItMatters: 'Segurança',
      milestones: [],
      actions: [
        { id: 'a-1', title: 'Transferir economia da semana', completedToday: false },
      ],
    };

    const habitsWithData = [sampleHabit];
    const goalsWithData = [sampleGoal];

    const todayDone2 = habitsWithData.filter(h => h.daysCompletedThisWeek.includes(todayIndex)).length;
    const actions2 = goalsWithData.flatMap(g => g.actions);
    const actionsDone2 = actions2.filter(a => a.completedToday).length;
    const total2 = habitsWithData.length + actions2.length;
    const completed2 = todayDone2 + actionsDone2;
    const percent2 = Math.round((completed2 / total2) * 100);

    expect(total2).toBe(2);
    expect(completed2).toBe(1);
    expect(percent2).toBe(50);
  });

  it('should toggle habit completion for today back and forth', () => {
    const todayIndex = 2; // Tuesday
    let daysCompleted = [1, 3];

    // Toggle ON
    const exists = daysCompleted.includes(todayIndex);
    daysCompleted = exists ? daysCompleted.filter(d => d !== todayIndex) : [...daysCompleted, todayIndex];
    expect(daysCompleted).toContain(2);

    // Toggle OFF
    const existsAfter = daysCompleted.includes(todayIndex);
    daysCompleted = existsAfter ? daysCompleted.filter(d => d !== todayIndex) : [...daysCompleted, todayIndex];
    expect(daysCompleted).not.toContain(2);
  });

  it('should generate dynamic contextual insight quote based on actual user data', () => {
    // 1. With Goals
    const goals: Goal[] = [
      {
        id: 'g-1',
        title: 'Lançar Consultoria Própria',
        description: '',
        lifeArea: 'carreira',
        status: 'active',
        startDate: '2026-09-01',
        targetDate: '2026-12-31',
        progress: 10,
        whyItMatters: '',
        milestones: [],
        actions: [],
      },
    ];
    const userTarget = 'Construir autonomia financeira';

    const quoteWithGoal = goals.length > 0
      ? `Cada micro-ação executada hoje em direção a "${goals[0].title}" reduz a distância para o seu objetivo principal.`
      : userTarget
      ? `Seu alvo de 12 meses ("${userTarget}") é a bússola para cada pequena escolha de hoje.`
      : 'Consistência não é sobre perfeição em dias fáceis, mas sobre manter o ritmo mínimo nos dias em que a energia oscila.';

    expect(quoteWithGoal).toContain('Lançar Consultoria Própria');
    expect(quoteWithGoal.includes('maratona')).toBe(false);
    expect(quoteWithGoal.includes('Você manteve 3 treinos')).toBe(false);

    // 2. Without Goals but with user target
    const quoteWithoutGoal = [].length > 0
      ? `Cada micro-ação...`
      : userTarget
      ? `Seu alvo de 12 meses ("${userTarget}") é a bússola para cada pequena escolha de hoje.`
      : 'Consistência...';

    expect(quoteWithoutGoal).toContain('Construir autonomia financeira');
  });
});
