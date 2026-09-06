'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { CheckCircle } from '@/components/ui/CheckCircle';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Flame, Compass, ArrowUpRight, Plus, Check, ChevronRight } from 'lucide-react';
import { LIFE_AREAS } from '@/lib/constants';

export function TodayView() {
  const {
    habits,
    toggleHabitToday,
    goals,
    toggleGoalActionToday,
    journeys,
    incrementJourneyDay,
    setActiveView,
    setIsNewGoalModalOpen,
  } = useTrajetta();

  const [dailyNote, setDailyNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);

  // Calculate daily movements progress
  const todayIndex = new Date().getDay();
  const todayHabitsDone = habits.filter(h => h.daysCompletedThisWeek.includes(todayIndex)).length;
  const totalHabits = habits.length;

  const activeGoalActions = goals.flatMap(g =>
    g.actions.map(a => ({ ...a, goalTitle: g.title, lifeArea: g.lifeArea, goalId: g.id }))
  );
  const goalActionsDone = activeGoalActions.filter(a => a.completedToday).length;

  const totalMovements = totalHabits + activeGoalActions.length;
  const completedMovements = todayHabitsDone + goalActionsDone;
  const movementPercentage = totalMovements > 0 ? Math.round((completedMovements / totalMovements) * 100) : 0;

  // Active primary journey
  const activeJourney = journeys[0];

  const handleSaveNote = () => {
    if (!dailyNote.trim()) return;
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#8E9499] uppercase">
              O Que Importa Hoje
            </span>
            <span className="w-8 h-px bg-[#B8FF00]/40 inline-block" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F2F1ED] mt-2">
            Seu próximo <span className="text-[#B8FF00]">movimento.</span>
          </h1>
          <p className="text-sm text-[#8E9499] mt-1.5">
            Sem sobrecarga. Apenas as ações que mantêm sua trajetória viva hoje.
          </p>
        </div>

        {/* Daily Progress Gauge */}
        <div className="bg-[#171A1D] border border-white/8 rounded-2xl p-4 min-w-[200px] flex items-center justify-between gap-4">
          <div>
            <span className="text-[11px] text-[#8E9499] uppercase tracking-wider block font-semibold">
              Consistência do dia
            </span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-2xl font-black text-[#F2F1ED] tabular-numbers">
                {completedMovements}
              </span>
              <span className="text-xs text-[#8E9499]">de {totalMovements} concluídos</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full border-2 border-white/10 flex items-center justify-center font-bold text-xs text-[#B8FF00] tabular-numbers relative">
            <span>{movementPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Hero Grid: Habits & Goal Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Daily Habits (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#F2F1ED]">Hábitos de Hoje</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[#8E9499]">
                {todayHabitsDone}/{totalHabits}
              </span>
            </div>
            <button
              onClick={() => setActiveView('habitos')}
              className="text-xs font-semibold text-[#B8FF00] hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="space-y-2.5">
            {habits.map(habit => {
              const isDone = habit.daysCompletedThisWeek.includes(todayIndex);
              const areaConfig = LIFE_AREAS[habit.lifeArea];

              return (
                <div
                  key={habit.id}
                  onClick={() => toggleHabitToday(habit.id)}
                  className="trajetta-card p-4 flex items-center gap-3.5 cursor-pointer hover:border-white/20 transition-all select-none group"
                >
                  <CheckCircle
                    checked={isDone}
                    onClick={() => toggleHabitToday(habit.id)}
                    color={areaConfig.color}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold transition-colors ${
                          isDone ? 'line-through text-[#8E9499]' : 'text-[#F2F1ED]'
                        }`}
                      >
                        {habit.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-[#8E9499]">
                        {habit.targetDescription}
                      </span>
                      <span className="text-white/20">·</span>
                      <span className="text-[11px] font-medium text-[#B8FF00] flex items-center gap-1">
                        <Flame size={12} /> {habit.streakWeeks} sem. seguidas
                      </span>
                    </div>
                  </div>

                  <AreaBadge area={habit.lifeArea} size="sm" showIcon={false} />
                </div>
              );
            })}
          </div>

          {/* Goal Actions Section */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-[#F2F1ED]">Ações das Metas</h2>
              <button
                onClick={() => setActiveView('metas')}
                className="text-xs font-semibold text-[#B8FF00] hover:underline flex items-center gap-1"
              >
                Metas completas <ArrowUpRight size={13} />
              </button>
            </div>

            <div className="space-y-2.5">
              {activeGoalActions.map(action => (
                <div
                  key={action.id}
                  onClick={() => toggleGoalActionToday(action.goalId, action.id)}
                  className="trajetta-card p-3.5 flex items-center gap-3.5 cursor-pointer hover:border-white/20 transition-all select-none"
                >
                  <CheckCircle
                    checked={!!action.completedToday}
                    onClick={() => toggleGoalActionToday(action.goalId, action.id)}
                  />
                  <div className="flex-1 min-w-0">
                    <span
                      className={`text-sm font-medium ${
                        action.completedToday ? 'line-through text-[#8E9499]' : 'text-[#F2F1ED]'
                      }`}
                    >
                      {action.title}
                    </span>
                    <span className="block text-[11px] text-[#8E9499] mt-0.5 truncate">
                      Meta: {action.goalTitle}
                    </span>
                  </div>
                  <AreaBadge area={action.lifeArea} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Active Journey & AI Reflection (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Journey Card */}
          {activeJourney && (
            <div className="trajetta-card p-5 border border-[#B8FF00]/20 bg-gradient-to-br from-[#171A1D] to-[#121416] relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-[#B8FF00] uppercase flex items-center gap-1.5">
                  <Compass size={13} /> Jornada em Andamento
                </span>
                <AreaBadge area={activeJourney.lifeArea} size="sm" />
              </div>

              <h3 className="text-lg font-bold text-[#F2F1ED] mt-3">
                {activeJourney.title}
              </h3>
              <p className="text-xs text-[#8E9499] mt-1 line-clamp-2">
                {activeJourney.description}
              </p>

              {/* Visual Trajectory Progress */}
              <div className="mt-4 pt-3 border-t border-white/8 space-y-2">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-[#F2F1ED]">
                    Dia {activeJourney.currentDay} de {activeJourney.totalDays}
                  </span>
                  <span className="text-[#8E9499]">
                    {Math.round((activeJourney.currentDay / activeJourney.totalDays) * 100)}%
                  </span>
                </div>
                <ProgressBar
                  value={activeJourney.currentDay}
                  max={activeJourney.totalDays}
                  height="h-2"
                />
              </div>

              {/* Compassionate Recovery Note */}
              <div className="mt-3.5 p-2.5 rounded-xl bg-white/5 border border-white/8 text-[11px] text-[#8E9499] flex items-center justify-between">
                <span>
                  {activeJourney.currentDay} dias construídos · {activeJourney.slipDays} deslize
                </span>
                <span className="text-[#B8FF00] font-semibold text-[10px]">
                  Trajetória continua viva
                </span>
              </div>

              <div className="mt-4 flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => incrementJourneyDay(activeJourney.id)}
                  className="w-full text-xs"
                >
                  <Check size={13} /> Marcar Dia Concluído
                </Button>
              </div>
            </div>
          )}

          {/* Quick Contextual Coach Insight */}
          <div className="trajetta-card p-5 border border-white/8 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#A98CF7]/15 text-[#A98CF7] flex items-center justify-center text-xs">
                ✦
              </div>
              <span className="text-xs font-bold text-[#F2F1ED]">Insight da Trajetta</span>
            </div>
            <blockquote className="text-xs text-[#8E9499] leading-relaxed border-l-2 border-[#B8FF00] pl-3 italic">
              &ldquo;Você manteve 3 treinos nas últimas semanas mesmo com o aumento das demandas de trabalho. Isso não é sorte, é consistência deliberada.&rdquo;
            </blockquote>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveView('ia')}
              className="text-xs w-full text-[#B8FF00] justify-between px-0"
            >
              <span>Conversar com a Trajetta IA</span>
              <ChevronRight size={14} />
            </Button>
          </div>

          {/* Quick Evening Reflection */}
          <div className="trajetta-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E9499] block">
                Registro Rápido do Dia
              </span>
              <span className="text-[10px] text-[#B8FF00] font-semibold">Evidência Real</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pb-1">
              {[
                'Vitória discreta:',
                'Desafio contornado:',
                'Insight do dia:',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setDailyNote((prev) => (prev ? `${prev} ` : '') + chip + ' ')}
                  className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/8 text-[10px] text-[#8E9499] hover:text-[#F2F1ED] transition-colors"
                >
                  + {chip.replace(':', '')}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={dailyNote}
              onChange={e => setDailyNote(e.target.value)}
              placeholder="Qual vitória discreta você construiu hoje?"
              className="w-full bg-[#111315] border border-white/10 rounded-lg px-3 py-2.5 text-xs text-[#F2F1ED] placeholder-[#8E9499]/60 focus:outline-none focus:border-[#B8FF00] transition-colors"
            />
            <div className="flex items-center justify-between">
              {noteSaved ? (
                <span className="text-[11px] text-[#B8FF00] font-medium flex items-center gap-1">
                  <Check size={12} /> Gravado na sua trajetória
                </span>
              ) : (
                <span className="text-[11px] text-[#8E9499]">Armazenado no seu histórico pessoal</span>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveNote}
                disabled={!dailyNote.trim()}
                className="text-xs"
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
