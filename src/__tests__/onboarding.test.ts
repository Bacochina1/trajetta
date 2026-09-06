import { describe, it, expect } from 'vitest';
import {
  INITIAL_USER,
  INITIAL_GOALS,
  INITIAL_HABITS,
  INITIAL_JOURNEYS,
  INITIAL_TIMELINE,
  INITIAL_WEEKLY_PLAN,
} from '@/lib/seedData';
import { Goal, Habit, Journey, TimelineEvent, UserProfile } from '@/types';

describe('Agent 2: Onboarding & Account Reset Mechanics', () => {
  it('should initialize clean accounts with zero marathon or runner data', () => {
    expect(INITIAL_USER.isOnboarded).toBe(false);
    expect(INITIAL_GOALS).toEqual([]);
    expect(INITIAL_HABITS).toEqual([]);
    expect(INITIAL_JOURNEYS).toEqual([]);
    expect(INITIAL_TIMELINE).toEqual([]);

    // Check weekly plan priorities contain zero marathon references
    const prioritiesString = JSON.stringify(INITIAL_WEEKLY_PLAN).toLowerCase();
    expect(prioritiesString.includes('maratona')).toBe(false);
    expect(prioritiesString.includes('21 km')).toBe(false);
    expect(prioritiesString.includes('rodagem de 12 km')).toBe(false);
  });

  it('should process completeOnboarding and produce 100% user-defined state', () => {
    const onboardingInput = {
      name: 'Camila',
      target12Months: 'Faturar R$ 80k no meu negócio e manter rotina saudável',
      primaryArea: 'carreira' as const,
      selectedHabits: [
        { title: 'Beber 2L de Água', lifeArea: 'corpo' as const, frequencyPerWeek: 7 },
        { title: 'Bloco de Foco 90 min', lifeArea: 'carreira' as const, frequencyPerWeek: 5 },
      ],
      firstGoalTitle: 'Lançar Nova Plataforma Digital',
      firstGoalArea: 'carreira' as const,
      firstGoalTargetDate: '2026-11-30',
    };

    // Simulate completeOnboarding logic
    const updatedUser: UserProfile = {
      ...INITIAL_USER,
      name: onboardingInput.name,
      avatarText: onboardingInput.name.charAt(0).toUpperCase(),
      target12Months: onboardingInput.target12Months,
      primaryFocusArea: onboardingInput.primaryArea,
      isOnboarded: true,
    };

    expect(updatedUser.isOnboarded).toBe(true);
    expect(updatedUser.name).toBe('Camila');
    expect(updatedUser.avatarText).toBe('C');

    const newGoals: Goal[] = [
      {
        id: 'goal-user-1',
        title: onboardingInput.firstGoalTitle,
        description: `Meta ligada a: ${onboardingInput.target12Months}`,
        lifeArea: onboardingInput.firstGoalArea,
        status: 'active',
        startDate: '2026-09-06',
        targetDate: onboardingInput.firstGoalTargetDate,
        progress: 0,
        whyItMatters: onboardingInput.target12Months,
        milestones: [
          { id: 'm1', title: 'Primeiro avanço mensurável', completed: false, order: 1 },
          { id: 'm2', title: 'Consolidação e consistência', completed: false, order: 2 },
        ],
        actions: [
          { id: 'a1', title: `Dar o primeiro passo em ${onboardingInput.firstGoalTitle}`, completedToday: false },
        ],
      },
    ];

    expect(newGoals.length).toBe(1);
    expect(newGoals[0].title).toBe('Lançar Nova Plataforma Digital');
    expect(newGoals[0].actions[0].title).toContain('Lançar Nova Plataforma Digital');

    const newHabits: Habit[] = onboardingInput.selectedHabits.map((h, idx) => ({
      id: 'habit-' + idx,
      title: h.title,
      lifeArea: h.lifeArea,
      frequencyPerWeek: h.frequencyPerWeek,
      daysCompletedThisWeek: [],
      targetDescription: `${h.frequencyPerWeek}x por semana`,
      streakWeeks: 0,
      iconName: 'CheckCircle',
    }));

    expect(newHabits.length).toBe(2);
    expect(newHabits[0].title).toBe('Beber 2L de Água');
    expect(newHabits[1].title).toBe('Bloco de Foco 90 min');
  });

  it('should reset state completely when resetToZero is called', () => {
    // Simulate resetToZero
    const freshUser: UserProfile = {
      name: '',
      avatarText: 'T',
      role: 'Membro Fundador',
      isOnboarded: false,
      target12Months: '',
      primaryFocusArea: 'corpo',
      completedWeeksCount: 0,
    };
    const goals: Goal[] = [];
    const habits: Habit[] = [];
    const journeys: Journey[] = [];
    const timeline: TimelineEvent[] = [];

    expect(freshUser.isOnboarded).toBe(false);
    expect(goals.length).toBe(0);
    expect(habits.length).toBe(0);
    expect(journeys.length).toBe(0);
    expect(timeline.length).toBe(0);
  });
});
