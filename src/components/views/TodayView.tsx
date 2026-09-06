'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { CheckCircle } from '@/components/ui/CheckCircle';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Flame, Compass, ArrowUpRight, Plus, Check, ChevronRight, Brain, Share2, RotateCcw, Sparkles } from 'lucide-react';
import { ShareCardModal } from '@/components/ui/ShareCardModal';
import { startGuidedTour } from '@/components/ui/GuidedTour';
import { LIFE_AREAS } from '@/lib/constants';

export function TodayView() {
  const {
    habits,
    toggleHabitToday,
    goals,
    toggleGoalActionToday,
    journeys,
    incrementJourneyDay,
    undoJourneyDay,
    setActiveView,
    setIsNewGoalModalOpen,
    lifeScore,
    user,
  } = useTrajetta();

  const [dailyNote, setDailyNote] = useState('');
  const [noteSaved, setNoteSaved] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

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

  // Active primary journey (prefer active over completed)
  const activeJourney = journeys.find(j => j.status === 'active') || journeys[0];
  const todayStr = new Date().toISOString().split('T')[0];
  const isJourneyCompletedToday = activeJourney
    ? activeJourney.lastCompletedDate === todayStr || (activeJourney.completedDates || []).includes(todayStr)
    : false;
  const isJourneyFinished = activeJourney
    ? activeJourney.status === 'completed' || activeJourney.currentDay >= activeJourney.totalDays
    : false;

  const handleSaveNote = () => {
    if (!dailyNote.trim()) return;
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/8" data-tour="today-header">
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

        {/* Daily Progress Gauge & Share */}
        <div className="flex items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <div className="bg-[#171A1D] border border-white/8 rounded-2xl p-2.5 sm:p-4 flex-1 sm:min-w-[200px] flex items-center justify-between gap-2.5 sm:gap-4">
            <div>
              <span className="text-[10px] sm:text-[11px] text-[#8E9499] uppercase tracking-wider block font-semibold">
                Consistência do dia
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5 sm:mt-1">
                <span className="text-xl sm:text-2xl font-black text-[#F2F1ED] tabular-numbers">
                  {completedMovements}
                </span>
                <span className="text-[10px] sm:text-[11px] text-[#8E9499]">de {totalMovements}</span>
              </div>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white/10 flex items-center justify-center font-bold text-xs text-[#B8FF00] tabular-numbers relative flex-shrink-0">
              <span>{movementPercentage}%</span>
            </div>
          </div>

          <button
            onClick={startGuidedTour}
            title="Iniciar Tour Guiado do Sistema"
            aria-label="Iniciar Tour Guiado"
            className="px-3 sm:px-3.5 py-2 sm:h-[74px] min-h-[44px] rounded-2xl bg-[#171A1D] hover:bg-[#B8FF00]/10 hover:border-[#B8FF00]/40 border border-white/8 text-[#8E9499] hover:text-[#B8FF00] transition-all flex flex-col items-center justify-center gap-1 group tactile-btn flex-shrink-0"
          >
            <Sparkles size={16} className="text-[#B8FF00] group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Tour</span>
          </button>

          <button
            onClick={() => setIsShareOpen(true)}
            title="Compartilhar no Instagram / WhatsApp"
            aria-label="Compartilhar consistência do dia"
            className="px-3 sm:px-3.5 py-2 sm:h-[74px] min-h-[44px] rounded-2xl bg-[#171A1D] hover:bg-[#B8FF00]/10 hover:border-[#B8FF00]/40 border border-white/8 text-[#8E9499] hover:text-[#B8FF00] transition-all flex flex-col items-center justify-center gap-1 group tactile-btn flex-shrink-0"
          >
            <Share2 size={16} className="group-hover:scale-110 transition-transform" />
            <span className="text-[9px] font-mono uppercase font-bold tracking-wider">Share</span>
          </button>
        </div>
      </div>

      {/* Hero Grid: Habits & Goal Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Daily Habits (7 cols) */}
        <div className="lg:col-span-7 space-y-4" data-tour="today-movements">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#F2F1ED]">Hábitos de Hoje</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[#8E9499]">
                {todayHabitsDone}/{totalHabits}
              </span>
            </div>
            <button
              onClick={() => setActiveView('habitos')}
              className="text-xs font-semibold text-[#B8FF00] hover:underline flex items-center gap-1 min-h-[36px] px-1"
            >
              Ver todos <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="space-y-2.5">
            {habits.length === 0 ? (
              <div className="trajetta-card p-6 text-center space-y-2 border border-white/8">
                <p className="text-xs text-[#8E9499]">Nenhum hábito configurado ainda.</p>
                <button
                  onClick={() => setActiveView('habitos')}
                  className="text-xs font-bold text-[#B8FF00] hover:underline"
                >
                  + Cadastrar Hábitos
                </button>
              </div>
            ) : (
              habits.map(habit => {
                const isDone = habit.daysCompletedThisWeek.includes(todayIndex);
                const areaConfig = LIFE_AREAS[habit.lifeArea];

                return (
                  <div
                    key={habit.id}
                    onClick={() => toggleHabitToday(habit.id)}
                    className="trajetta-card p-3 sm:p-4 flex items-center justify-between gap-2 sm:gap-3.5 cursor-pointer hover:border-white/20 transition-all select-none group min-w-0"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                      <div className="flex-shrink-0">
                        <CheckCircle
                          checked={isDone}
                          onClick={() => toggleHabitToday(habit.id)}
                          color={areaConfig.color}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs sm:text-sm font-semibold transition-colors break-words line-clamp-2 ${
                              isDone ? 'line-through text-[#8E9499]' : 'text-[#F2F1ED]'
                            }`}
                          >
                            {habit.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 flex-wrap">
                          <span className="text-[10px] sm:text-[11px] text-[#8E9499]">
                            {habit.targetDescription}
                          </span>
                          <span className="text-white/20">·</span>
                          <span className="text-[10px] sm:text-[11px] font-medium text-[#B8FF00] flex items-center gap-1 flex-shrink-0">
                            <Flame size={11} /> {habit.streakWeeks} sem.
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 hidden xs:block">
                      <AreaBadge area={habit.lifeArea} size="sm" showIcon={false} />
                    </div>
                  </div>
                );
              })
            )}
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
              {activeGoalActions.length === 0 ? (
                <div className="trajetta-card p-5 text-center border border-white/8 space-y-2">
                  <p className="text-xs text-[#8E9499]">Nenhuma ação de meta pendente hoje.</p>
                  <button
                    onClick={() => setIsNewGoalModalOpen(true)}
                    className="text-xs font-bold text-[#B8FF00] hover:underline"
                  >
                    + Adicionar Meta ou Ação
                  </button>
                </div>
              ) : (
                activeGoalActions.map(action => (
                  <div
                    key={action.id}
                    onClick={() => toggleGoalActionToday(action.goalId, action.id)}
                    className="trajetta-card p-3 sm:p-3.5 flex items-center justify-between gap-2.5 sm:gap-3.5 cursor-pointer hover:border-white/20 transition-all select-none min-w-0"
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 flex-1">
                      <div className="flex-shrink-0">
                        <CheckCircle
                          checked={!!action.completedToday}
                          onClick={() => toggleGoalActionToday(action.goalId, action.id)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className={`text-xs sm:text-sm font-medium break-words line-clamp-2 ${
                            action.completedToday ? 'line-through text-[#8E9499]' : 'text-[#F2F1ED]'
                          }`}
                        >
                          {action.title}
                        </span>
                        <span className="block text-[10px] sm:text-[11px] text-[#8E9499] mt-0.5 truncate">
                          Meta: {action.goalTitle}
                        </span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <AreaBadge area={action.lifeArea} size="sm" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Active Journey & AI Reflection (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Journey Card */}
          {activeJourney ? (
            <div className="trajetta-card p-4 sm:p-5 border border-[#B8FF00]/20 bg-gradient-to-br from-[#171A1D] to-[#121416] relative overflow-hidden" data-tour="active-journey">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] font-bold tracking-widest text-[#B8FF00] uppercase flex items-center gap-1.5 truncate">
                  <Compass size={13} className="flex-shrink-0" /> Jornada em Andamento
                </span>
                <div className="flex-shrink-0">
                  <AreaBadge area={activeJourney.lifeArea} size="sm" />
                </div>
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
                  {activeJourney.currentDay} dias construídos · {activeJourney.slipDays} {activeJourney.slipDays === 1 ? 'deslize' : 'deslizes'}
                </span>
                <span className="text-[#B8FF00] font-semibold text-[10px]">
                  {isJourneyFinished
                    ? '🏆 Desafio Concluído'
                    : isJourneyCompletedToday
                    ? '✓ Check-in de hoje feito'
                    : 'Trajetória continua viva'}
                </span>
              </div>

              <div className="mt-4">
                {isJourneyFinished ? (
                  <div className="space-y-1.5">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled
                      className="w-full text-xs bg-[#B8FF00]/10 border border-[#B8FF00]/30 text-[#B8FF00] font-medium cursor-default flex items-center justify-center gap-1.5"
                    >
                      🏆 100% dos Dias Concluídos
                    </Button>
                    <p className="text-[10px] text-center text-[#8E9499]">
                      Você finalizou todos os {activeJourney.totalDays} dias desta jornada com consistência.
                    </p>
                  </div>
                ) : isJourneyCompletedToday ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled
                        className="flex-1 text-xs bg-white/5 border border-white/10 text-[#F2F1ED]/70 cursor-default flex items-center justify-center gap-1.5"
                      >
                        <Check size={13} className="text-[#B8FF00]" /> Concluído por hoje
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => undoJourneyDay(activeJourney.id)}
                        className="text-[11px] text-[#8E9499] hover:text-[#F08A76] hover:bg-white/5 px-2.5 flex items-center gap-1"
                        title="Desfazer check-in de hoje"
                      >
                        <RotateCcw size={12} /> Desfazer
                      </Button>
                    </div>
                    <p className="text-[10px] text-center text-[#8E9499]">
                      Próximo dia liberado amanhã · Um passo por dia com calma
                    </p>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => incrementJourneyDay(activeJourney.id)}
                    className="w-full text-xs flex items-center justify-center gap-1.5"
                  >
                    <Check size={13} /> Marcar Dia Concluído
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="trajetta-card p-5 border border-white/8 bg-gradient-to-br from-[#171A1D] to-[#121416] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-widest text-[#B8FF00] uppercase flex items-center gap-1.5">
                  <Compass size={13} /> Jornada de Foco
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#F2F1ED]">
                Inicie um ciclo fechado de evolução
              </h3>
              <p className="text-xs text-[#8E9499]">
                Desafios temporais de 21, 30 ou 90 dias com recuperação humana e sem punição.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setActiveView('jornadas')}
                className="w-full text-xs"
              >
                Ver Jornadas Disponíveis
              </Button>
            </div>
          )}

          {/* Quick Contextual Coach Insight */}
          <div className="trajetta-card p-5 border border-white/8 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-[#A98CF7]/15 text-[#A98CF7] flex items-center justify-center">
                <Brain size={13} strokeWidth={2} />
              </div>
              <span className="text-xs font-bold text-[#F2F1ED]">Insight da Trajetta</span>
            </div>
            <blockquote className="text-xs text-[#8E9499] leading-relaxed border-l-2 border-[#B8FF00] pl-3 italic">
              &ldquo;
              {goals.length > 0
                ? `Cada micro-ação executada hoje em direção a "${goals[0].title}" reduz a distância para o seu objetivo principal.`
                : user.target12Months
                ? `Seu alvo de 12 meses ("${user.target12Months.slice(0, 70)}...") é a bússola para cada pequena escolha de hoje.`
                : 'Consistência não é sobre perfeição em dias fáceis, mas sobre manter o ritmo mínimo nos dias em que a energia oscila.'}
              &rdquo;
            </blockquote>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveView('ia')}
              className="w-full text-[#B8FF00] justify-between px-0"
            >
              <span>Conversar com a Trajetta IA</span>
              <ChevronRight size={14} />
            </Button>
          </div>

          {/* Quick Evening Reflection */}
          <div className="trajetta-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="quick-reflection" className="text-xs font-bold uppercase tracking-wider text-[#8E9499] block cursor-pointer">
                Registro Rápido do Dia
              </label>
              <span className="text-[11px] text-[#B8FF00] font-semibold">Evidência Real</span>
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
                  className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/8 text-[11px] text-[#8E9499] hover:text-[#F2F1ED] transition-colors"
                >
                  + {chip.replace(':', '')}
                </button>
              ))}
            </div>

            <input
              id="quick-reflection"
              type="text"
              value={dailyNote}
              onChange={e => setDailyNote(e.target.value)}
              placeholder="Qual vitória discreta você construiu hoje?"
              className="w-full h-10 bg-[#111315] border border-white/10 rounded-xl px-4 text-sm text-[#F2F1ED] placeholder:text-white/40 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] transition-colors focus:outline-none"
            />
            <div className="flex items-center justify-between pt-1">
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
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Card Modal */}
      <ShareCardModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        data={{
          userName: user?.name || 'Explorador',
          overallScore: Math.round(
            (lifeScore.corpo.score + lifeScore.dinheiro.score + lifeScore.carreira.score + lifeScore.vida.score) / 4
          ),
          scoreStatus: 'Ritmo Consistente',
          streakDays: 14,
          consistencyRate: movementPercentage,
          completedHabitsCount: todayHabitsDone,
          areas: {
            corpo: lifeScore.corpo.score,
            dinheiro: lifeScore.dinheiro.score,
            carreira: lifeScore.carreira.score,
            vida: lifeScore.vida.score,
          },
        }}
      />
    </div>
  );
}
