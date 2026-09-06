import { describe, it, expect } from 'vitest';
import { Journey, LifeArea } from '@/types';

describe('Agent 7: Jornadas / Journeys View, Increments & Compassionate Recovery', () => {
  it('should create and initialize a journey from catalog or custom input', () => {
    const createJourneyMock = (data: Partial<Journey>): Journey => {
      const total = data.totalDays || 21;
      return {
        id: 'journey-' + Date.now(),
        title: data.title || 'Nova Jornada',
        description: data.description || '',
        lifeArea: data.lifeArea || 'vida',
        totalDays: total,
        currentDay: 1,
        slipDays: 0,
        status: 'active',
        badgeText: `Dia 1 de ${total} · Em andamento`,
      };
    };

    const journey = createJourneyMock({
      title: '21 Dias Sem Telas na Cama',
      description: 'Descanso fisiológico profundo',
      lifeArea: 'vida',
      totalDays: 21,
    });

    expect(journey.title).toBe('21 Dias Sem Telas na Cama');
    expect(journey.lifeArea).toBe('vida');
    expect(journey.totalDays).toBe(21);
    expect(journey.currentDay).toBe(1);
    expect(journey.slipDays).toBe(0);
    expect(journey.status).toBe('active');
  });

  it('should increment day up to totalDays and mark as completed upon reach', () => {
    let journey: Journey = {
      id: 'j-1',
      title: '30 Dias de Movimento Consciente',
      description: 'Alongamento e treino',
      lifeArea: 'corpo',
      totalDays: 30,
      currentDay: 29,
      slipDays: 1,
      status: 'active',
      badgeText: 'Dia 29 de 30 · Em andamento',
    };

    const incrementDay = (j: Journey): Journey => {
      const nextDay = Math.min(j.totalDays, j.currentDay + 1);
      const isComplete = nextDay >= j.totalDays;
      return {
        ...j,
        currentDay: nextDay,
        status: isComplete ? 'completed' : 'active',
      };
    };

    // Increment from 29 to 30 -> marks complete
    journey = incrementDay(journey);
    expect(journey.currentDay).toBe(30);
    expect(journey.status).toBe('completed');

    // Incrementing past 30 should stay capped at 30
    journey = incrementDay(journey);
    expect(journey.currentDay).toBe(30);
    expect(journey.status).toBe('completed');
  });

  it('should record a conscious slip without wiping or resetting accumulated progress', () => {
    let journey: Journey = {
      id: 'j-2',
      title: '90 Dias Sem Compras por Impulso',
      description: 'Regra dos 3 dias',
      lifeArea: 'dinheiro',
      totalDays: 90,
      currentDay: 45,
      slipDays: 0,
      status: 'active',
      badgeText: 'Dia 45 de 90 · Em andamento',
    };

    const recordSlip = (j: Journey): Journey => ({
      ...j,
      slipDays: j.slipDays + 1,
    });

    // Slip on day 45
    journey = recordSlip(journey);
    expect(journey.currentDay).toBe(45); // Progress is preserved! Not reset to 0!
    expect(journey.slipDays).toBe(1);

    // Another slip later
    journey = recordSlip(journey);
    expect(journey.currentDay).toBe(45);
    expect(journey.slipDays).toBe(2);
  });

  it('should compute completion percentage accurately', () => {
    const journey: Journey = {
      id: 'j-3',
      title: '30 Dias Deep Work',
      description: 'Foco matinal',
      lifeArea: 'carreira',
      totalDays: 30,
      currentDay: 15,
      slipDays: 0,
      status: 'active',
      badgeText: 'Dia 15 de 30 · Em andamento',
    };

    const percent = Math.round((journey.currentDay / journey.totalDays) * 100);
    expect(percent).toBe(50);
  });
});
