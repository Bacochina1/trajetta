import { describe, it, expect } from 'vitest';
import { generatePersonalizedPrompts } from '@/lib/ai/promptSuggestions';
import { UserProfile, Goal, Habit, Journey, WeeklyPlan, LifeScoreData, WeeklyReview } from '@/types';

describe('Agent 10: IA Coach, Prompt Suggestions & Mascot Floating Popup', () => {
  const baseUser: UserProfile = {
    name: 'Sofia',
    avatarText: 'S',
    role: 'USER',
    isOnboarded: true,
    completedWeeksCount: 0,
    target12Months: 'Transição equilibrada',
    primaryFocusArea: 'carreira',
  };

  const baseLifeScore: LifeScoreData = {
    corpo: { score: 70, trend: 'stable', status: 'evolving', label: 'Corpo', insight: 'Corpo estável' },
    dinheiro: { score: 60, trend: 'stable', status: 'evolving', label: 'Dinheiro', insight: 'Dinheiro melhorando' },
    carreira: { score: 80, trend: 'up', status: 'strong', label: 'Carreira', insight: 'Foco na carreira' },
    vida: { score: 65, trend: 'down', status: 'evolving', label: 'Vida', insight: 'Atenção aos relacionamentos' },
  };

  const baseWeeklyPlan: WeeklyPlan = {
    id: 'wp-test',
    weekNumber: 36,
    year: 2026,
    northStarGoal: 'Evolução consistente',
    perceivedCapacity: 'normal',
    isCompleted: false,
    areaPriorities: {
      corpo: 'Dormir 7h por noite',
      dinheiro: 'Revisar extrato bancário',
      carreira: 'Finalizar proposta de consultoria',
      vida: 'Jantar em família no sábado',
    },
  };

  it('should generate neutral, non-runner prompts when goals and habits are empty', () => {
    const prompts = generatePersonalizedPrompts({
      user: baseUser,
      goals: [],
      habits: [],
      journeys: [],
      weeklyPlan: baseWeeklyPlan,
      weeklyReviews: [],
      lifeScore: baseLifeScore,
    });

    expect(prompts.length).toBeGreaterThan(0);

    // Verify zero marathon or running references exist in generated prompts
    const fullText = prompts.map(p => `${p.badge} ${p.text}`).join(' ').toLowerCase();
    expect(fullText).not.toContain('maratona');
    expect(fullText).not.toContain('21 km');
    expect(fullText).not.toContain('correr');

    // Should include a neutral prompt for defining first goal
    const goalPrompt = prompts.find(p => p.category === 'metas');
    expect(goalPrompt).toBeDefined();
    expect(goalPrompt?.text).toContain('Ainda não defini uma meta clara');
  });

  it('should dynamically inject user goals, milestones and whyItMatters into prompts', () => {
    const customGoal: Goal = {
      id: 'g-user-1',
      title: 'Lançar Plataforma de Mentorias',
      description: 'Estruturar o produto digital',
      lifeArea: 'carreira',
      status: 'active',
      startDate: '2026-09-01',
      targetDate: '2026-11-30',
      progress: 35,
      whyItMatters: 'Conquistar independência financeira e liberdade de agenda',
      milestones: [
        { id: 'm-1', title: 'Gravar 5 aulas piloto', completed: true, order: 1 },
        { id: 'm-2', title: 'Validar página de vendas', completed: false, order: 2 },
      ],
      actions: [],
    };

    const prompts = generatePersonalizedPrompts({
      user: { ...baseUser, completedWeeksCount: 4 },
      goals: [customGoal],
      habits: [
        {
          id: 'h-1',
          title: 'Bloco de 90 min de escrita',
          lifeArea: 'carreira',
          frequencyPerWeek: 5,
          daysCompletedThisWeek: [1, 2, 3],
          targetDescription: '5x por semana',
          streakWeeks: 3,
          iconName: 'PenTool',
        },
      ],
      journeys: [],
      weeklyPlan: baseWeeklyPlan,
      weeklyReviews: [],
      lifeScore: baseLifeScore,
    });

    // Check dynamic inclusion of goal title
    const goalPrompts = prompts.filter(p => p.category === 'metas');
    expect(goalPrompts.some(p => p.text.includes('Lançar Plataforma de Mentorias'))).toBe(true);

    // Check dynamic next milestone prompt
    const milestonePrompt = prompts.find(p => p.id === 'g-next-milestone');
    expect(milestonePrompt).toBeDefined();
    expect(milestonePrompt?.text).toContain('Validar página de vendas');

    // Check whyItMatters inclusion
    const purposePrompt = prompts.find(p => p.id === 'g-purpose');
    expect(purposePrompt).toBeDefined();
    expect(purposePrompt?.text).toContain('Conquistar independência');

    // Check habit streak inclusion
    const habitPrompt = prompts.find(p => p.id === 'h-streak');
    expect(habitPrompt).toBeDefined();
    expect(habitPrompt?.text).toContain('Bloco de 90 min de escrita');
    expect(habitPrompt?.badge).toContain('3 Semanas');
  });

  it('should categorize suggestions across the 5 canonical dimensions', () => {
    const prompts = generatePersonalizedPrompts({
      user: baseUser,
      goals: [],
      habits: [],
      journeys: [],
      weeklyPlan: baseWeeklyPlan,
      weeklyReviews: [],
      lifeScore: baseLifeScore,
    });

    const categories = new Set(prompts.map(p => p.category));
    expect(categories.has('evolucao')).toBe(true);
    expect(categories.has('metas')).toBe(true);
    expect(categories.has('lifescore')).toBe(true);
  });
});
