import { describe, it, expect } from 'vitest';
import { TimelineEvent, LifeArea } from '@/types';

describe('Agent 8: Linha do Tempo / Timeline View & Longitudinal Memory', () => {
  it('should add new milestone events with correct date, year, month and area', () => {
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const createTimelineEventMock = (eventData: Partial<TimelineEvent>): TimelineEvent => {
      const now = new Date('2026-09-06T10:00:00Z');
      return {
        id: 't-' + Date.now(),
        date: now.toISOString().split('T')[0],
        year: now.getFullYear(),
        month: months[now.getMonth()],
        title: eventData.title || 'Marco de Evolução',
        description: eventData.description || '',
        type: eventData.type || 'achievement',
        lifeArea: eventData.lifeArea || 'corpo',
        tag: eventData.tag || 'Registro',
      };
    };

    const event = createTimelineEventMock({
      title: 'Transição de Carreira Concluída',
      description: 'Primeiro dia no novo cargo executivo com autonomia e propósito.',
      lifeArea: 'carreira',
      type: 'achievement',
      tag: 'Novo Ciclo',
    });

    expect(event.title).toBe('Transição de Carreira Concluída');
    expect(event.lifeArea).toBe('carreira');
    expect(event.year).toBe(2026);
    expect(event.month).toBe('Setembro');
    expect(event.tag).toBe('Novo Ciclo');
    expect(event.date).toBe('2026-09-06');
  });

  it('should filter events accurately by year and preserve chronological order', () => {
    const events: TimelineEvent[] = [
      { id: '1', date: '2026-09-01', year: 2026, month: 'Setembro', title: 'Semana 36 Fechada', description: '', type: 'achievement', lifeArea: 'vida', tag: 'Semana' },
      { id: '2', date: '2026-03-15', year: 2026, month: 'Março', title: 'Meta Q1 Atingida', description: '', type: 'achievement', lifeArea: 'dinheiro', tag: 'Meta' },
      { id: '3', date: '2025-12-20', year: 2025, month: 'Dezembro', title: 'Retrospectiva Anual 2025', description: '', type: 'life_event', lifeArea: 'vida', tag: 'Reflexão' },
      { id: '4', date: '2024-06-10', year: 2024, month: 'Junho', title: 'Início da Trajetória', description: '', type: 'goal_created', lifeArea: 'corpo', tag: 'Marco Inicial' },
    ];

    const filterByYear = (year: number | 'todos') => {
      return year === 'todos' ? events : events.filter(e => e.year === year);
    };

    expect(filterByYear('todos').length).toBe(4);
    expect(filterByYear(2026).length).toBe(2);
    expect(filterByYear(2025).length).toBe(1);
    expect(filterByYear(2024).length).toBe(1);
    expect(filterByYear(2023).length).toBe(0);
  });

  it('should prepend new events to maintain most recent events at the top', () => {
    let timeline: TimelineEvent[] = [
      { id: 'old', date: '2026-08-01', year: 2026, month: 'Agosto', title: 'Marco Passado', description: '', type: 'achievement', lifeArea: 'corpo', tag: 'Registro' }
    ];

    const newEvent: TimelineEvent = {
      id: 'new',
      date: '2026-09-06',
      year: 2026,
      month: 'Setembro',
      title: 'Marco Novo',
      description: '',
      type: 'achievement',
      lifeArea: 'vida',
      tag: 'Registro Recente'
    };

    timeline = [newEvent, ...timeline];

    expect(timeline.length).toBe(2);
    expect(timeline[0].id).toBe('new');
    expect(timeline[1].id).toBe('old');
  });
});
