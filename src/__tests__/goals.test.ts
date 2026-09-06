import { describe, it, expect } from 'vitest';
import { Goal, LifeArea } from '@/types';

describe('Agent 5: Metas / Goals View, Milestones & Calculation', () => {
  it('should create goal and compute milestones progression accurately', () => {
    let goal: Goal = {
      id: 'g-test-1',
      title: 'Atingir R$ 20.000 em Reserva',
      description: 'Construir tranquilidade financeira',
      lifeArea: 'dinheiro',
      status: 'active',
      startDate: '2026-09-01',
      targetDate: '2026-12-31',
      progress: 0,
      whyItMatters: 'Tranquilidade para a família',
      milestones: [
        { id: 'm-1', title: 'Primeiros R$ 5k', completed: false, order: 1 },
        { id: 'm-2', title: 'R$ 10k acumulados', completed: false, order: 2 },
        { id: 'm-3', title: 'R$ 15k acumulados', completed: false, order: 3 },
        { id: 'm-4', title: 'R$ 20k na meta', completed: false, order: 4 },
      ],
      actions: [
        { id: 'a-1', title: 'Aportar R$ 500 da semana', completedToday: false },
      ],
    };

    expect(goal.progress).toBe(0);
    expect(goal.status).toBe('active');

    // Complete milestone 1
    let total = goal.milestones.length;
    goal = {
      ...goal,
      milestones: goal.milestones.map(m => m.id === 'm-1' ? { ...m, completed: true } : m),
    };
    let done = goal.milestones.filter(m => m.completed).length;
    goal.progress = Math.round((done / total) * 100);
    goal.status = goal.progress === 100 ? 'completed' : 'active';

    expect(goal.progress).toBe(25);
    expect(goal.status).toBe('active');

    // Complete all remaining milestones
    goal = {
      ...goal,
      milestones: goal.milestones.map(m => ({ ...m, completed: true })),
    };
    done = goal.milestones.filter(m => m.completed).length;
    goal.progress = Math.round((done / total) * 100);
    goal.status = goal.progress === 100 ? 'completed' : 'active';

    expect(goal.progress).toBe(100);
    expect(goal.status).toBe('completed');

    // Uncheck one milestone (revert to active)
    goal = {
      ...goal,
      milestones: goal.milestones.map(m => m.id === 'm-4' ? { ...m, completed: false } : m),
    };
    done = goal.milestones.filter(m => m.completed).length;
    goal.progress = Math.round((done / total) * 100);
    goal.status = goal.progress === 100 ? 'completed' : 'active';

    expect(goal.progress).toBe(75);
    expect(goal.status).toBe('active');
  });

  it('should filter goals by life area correctly', () => {
    const goals: Goal[] = [
      { id: '1', title: 'G1', description: '', lifeArea: 'dinheiro', status: 'active', startDate: '', targetDate: '', progress: 0, whyItMatters: '', milestones: [], actions: [] },
      { id: '2', title: 'G2', description: '', lifeArea: 'carreira', status: 'active', startDate: '', targetDate: '', progress: 0, whyItMatters: '', milestones: [], actions: [] },
      { id: '3', title: 'G3', description: '', lifeArea: 'vida', status: 'active', startDate: '', targetDate: '', progress: 0, whyItMatters: '', milestones: [], actions: [] },
    ];

    const filterArea = (area: LifeArea | 'todas') => {
      return area === 'todas' ? goals : goals.filter(g => g.lifeArea === area);
    };

    expect(filterArea('todas').length).toBe(3);
    expect(filterArea('dinheiro').length).toBe(1);
    expect(filterArea('carreira').length).toBe(1);
    expect(filterArea('corpo').length).toBe(0);
  });

  it('should delete a goal cleanly from the list', () => {
    let goals: Goal[] = [
      { id: 'g-1', title: 'Goal 1', description: '', lifeArea: 'corpo', status: 'active', startDate: '', targetDate: '', progress: 0, whyItMatters: '', milestones: [], actions: [] },
      { id: 'g-2', title: 'Goal 2', description: '', lifeArea: 'vida', status: 'active', startDate: '', targetDate: '', progress: 0, whyItMatters: '', milestones: [], actions: [] },
    ];

    goals = goals.filter(g => g.id !== 'g-1');
    expect(goals.length).toBe(1);
    expect(goals[0].id).toBe('g-2');
  });
});
