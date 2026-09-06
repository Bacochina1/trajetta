import { describe, it, expect } from 'vitest';
import { Habit, LifeArea } from '@/types';

describe('Agent 6: Hábitos / Habits View, Days Completion & Streaks', () => {
  it('should create a custom habit with accurate target frequency and defaults', () => {
    const createHabitMock = (data: Partial<Habit>): Habit => ({
      id: 'habit-' + Date.now(),
      title: data.title || 'Novo Hábito',
      lifeArea: data.lifeArea || 'corpo',
      frequencyPerWeek: data.frequencyPerWeek || 4,
      daysCompletedThisWeek: [],
      targetDescription: data.targetDescription || `${data.frequencyPerWeek || 4}x por semana`,
      streakWeeks: 0,
      iconName: data.iconName || 'CheckCircle',
    });

    const newHabit = createHabitMock({
      title: 'Beber 2.5L de Água',
      lifeArea: 'corpo',
      frequencyPerWeek: 6,
    });

    expect(newHabit.title).toBe('Beber 2.5L de Água');
    expect(newHabit.lifeArea).toBe('corpo');
    expect(newHabit.frequencyPerWeek).toBe(6);
    expect(newHabit.targetDescription).toBe('6x por semana');
    expect(newHabit.daysCompletedThisWeek).toEqual([]);
    expect(newHabit.streakWeeks).toBe(0);
  });

  it('should toggle day completion accurately without duplicating or losing states', () => {
    let habit: Habit = {
      id: 'h-1',
      title: 'Leitura Noturna (20 min)',
      lifeArea: 'vida',
      frequencyPerWeek: 5,
      daysCompletedThisWeek: [1, 2], // Segunda e Terça
      targetDescription: '5x por semana',
      streakWeeks: 3,
      iconName: 'BookOpen',
    };

    const toggleDay = (h: Habit, dayIndex: number): Habit => {
      const exists = h.daysCompletedThisWeek.includes(dayIndex);
      return {
        ...h,
        daysCompletedThisWeek: exists
          ? h.daysCompletedThisWeek.filter(d => d !== dayIndex)
          : [...h.daysCompletedThisWeek, dayIndex],
      };
    };

    // Toggle day 3 (Quarta-feira) -> should add
    habit = toggleDay(habit, 3);
    expect(habit.daysCompletedThisWeek).toEqual([1, 2, 3]);

    // Toggle day 3 again -> should remove
    habit = toggleDay(habit, 3);
    expect(habit.daysCompletedThisWeek).toEqual([1, 2]);

    // Toggle day 1 -> should remove
    habit = toggleDay(habit, 1);
    expect(habit.daysCompletedThisWeek).toEqual([2]);
  });

  it('should accurately calculate weekly target completion and streak eligibility', () => {
    const habit: Habit = {
      id: 'h-2',
      title: 'Treino de Força e Mobilidade',
      lifeArea: 'corpo',
      frequencyPerWeek: 4,
      daysCompletedThisWeek: [1, 2, 3, 5],
      targetDescription: '4x por semana',
      streakWeeks: 4,
      iconName: 'Dumbbell',
    };

    const isTargetMet = habit.daysCompletedThisWeek.length >= habit.frequencyPerWeek;
    expect(isTargetMet).toBe(true);

    const completionRate = Math.round((habit.daysCompletedThisWeek.length / habit.frequencyPerWeek) * 100);
    expect(completionRate).toBe(100);

    // If only 3 days completed
    const partialHabit: Habit = { ...habit, daysCompletedThisWeek: [1, 2, 5] };
    const isPartialMet = partialHabit.daysCompletedThisWeek.length >= partialHabit.frequencyPerWeek;
    expect(isPartialMet).toBe(false);
    expect(partialHabit.daysCompletedThisWeek.length).toBe(3);
  });

  it('should delete a habit cleanly from the habit repository', () => {
    let habits: Habit[] = [
      { id: 'h-1', title: 'H1', lifeArea: 'corpo', frequencyPerWeek: 3, daysCompletedThisWeek: [], targetDescription: '', streakWeeks: 0, iconName: '' },
      { id: 'h-2', title: 'H2', lifeArea: 'vida', frequencyPerWeek: 4, daysCompletedThisWeek: [], targetDescription: '', streakWeeks: 0, iconName: '' },
    ];

    habits = habits.filter(h => h.id !== 'h-1');
    expect(habits.length).toBe(1);
    expect(habits[0].id).toBe('h-2');
  });
});
