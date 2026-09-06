'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LIFE_AREAS, NORTH_STAR_DESCRIPTION } from '@/lib/constants';
import { LifeArea } from '@/types';
import { DAY_NAMES, DAY_INITIALS } from '@/lib/utils';
import { CalendarCheck, CheckCircle2, TrendingUp, Edit3, Check } from 'lucide-react';

export function WeekView() {
  const { weeklyPlan, user, updateWeeklyPriority, setIsReviewModalOpen, habits } = useTrajetta();
  const [editingArea, setEditingArea] = useState<LifeArea | null>(null);
  const [editText, setEditText] = useState('');
  const [capacity, setCapacity] = useState<'leve' | 'normal' | 'intensa'>('normal');
  const [weekIntention, setWeekIntention] = useState('Manter constância no treino e preservar o ritmo de trabalho sem queimar a largada.');
  const [isEditingIntention, setIsEditingIntention] = useState(false);
  const [tempIntention, setTempIntention] = useState(weekIntention);

  const todayIndex = new Date().getDay();

  // Habit completion rates across 7 days
  const dayStats = [0, 1, 2, 3, 4, 5, 6].map(day => {
    const completed = habits.filter(h => h.daysCompletedThisWeek.includes(day)).length;
    const rate = habits.length > 0 ? Math.round((completed / habits.length) * 100) : 0;
    return {
      dayIndex: day,
      dayInitial: DAY_INITIALS[day],
      dayName: DAY_NAMES[day],
      rate,
      isToday: day === todayIndex,
    };
  });

  const handleStartEdit = (area: LifeArea) => {
    setEditingArea(area);
    setEditText(weeklyPlan.areaPriorities[area] || '');
  };

  const handleSaveEdit = (area: LifeArea) => {
    updateWeeklyPriority(area, editText);
    setEditingArea(null);
  };

  const areas: LifeArea[] = ['corpo', 'dinheiro', 'carreira', 'vida'];

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#8E9499] uppercase">
              Unidade Central de Progresso
            </span>
            <span className="w-8 h-px bg-[#B8FF00]/40 inline-block" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F2F1ED] mt-2">
            Minha <span className="text-[#B8FF00]">Semana.</span>
          </h1>
          <p className="text-sm text-[#8E9499] mt-1.5">
            O ano é composto por 52 semanas, não 1º de janeiro. O que você quer avançar agora?
          </p>
        </div>

        {/* Action: Open Review */}
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsReviewModalOpen(true)}
          className="shadow-[0_0_25px_rgba(184,255,0,0.25)]"
        >
          <CheckCircle2 size={16} strokeWidth={2.2} />
          <span>Fazer Weekly Review</span>
        </Button>
      </div>

      {/* North Star Metric Hero Card */}
      <div className="trajetta-card p-6 sm:p-8 bg-gradient-to-br from-[#171A1D] via-[#14171A] to-[#0E1012] border-[#B8FF00]/30 relative overflow-hidden">
        {/* Glow orb background */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#B8FF00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#B8FF00] uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp size={14} /> Métrica North Star
              </span>
              <span className="text-white/20">·</span>
              <span className="text-xs text-[#8E9499]">Semana {weeklyPlan.weekNumber} de 52</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl sm:text-6xl font-black text-[#F2F1ED] tracking-tight tabular-numbers">
                {user.completedWeeksCount}
              </span>
              <div className="text-base sm:text-xl font-bold text-[#8E9499]">
                semanas concluídas com consistência
              </div>
            </div>

            <p className="text-xs text-[#8E9499] leading-relaxed max-w-xl">
              {NORTH_STAR_DESCRIPTION}
            </p>

            {/* Annual Progress Bar */}
            <div className="pt-2">
              <div className="flex justify-between text-[11px] text-[#8E9499] mb-1.5">
                <span>Progresso Anual ({user.completedWeeksCount}/52 semanas)</span>
                <span className="text-[#B8FF00] font-bold">
                  {Math.round((user.completedWeeksCount / 52) * 100)}% do ano
                </span>
              </div>
              <ProgressBar
                value={user.completedWeeksCount}
                max={52}
                height="h-2.5"
                color="#B8FF00"
              />
            </div>
          </div>

          {/* 7-Day Heatmap / Pill Bar Chart */}
          <div className="md:col-span-4 bg-[#111315] border border-white/8 rounded-2xl p-4 flex flex-col justify-between">
            <span className="text-[11px] font-bold text-[#8E9499] uppercase tracking-wider block mb-3">
              Consistência nos 7 Dias
            </span>

            <div className="flex items-end justify-between gap-1.5 h-28 pt-2 pb-1 border-b border-white/8">
              {dayStats.map(stat => (
                <div key={stat.dayIndex} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div
                    className={`w-full max-w-[14px] rounded-t-md transition-all duration-300 ${
                      stat.isToday
                        ? 'bg-[#B8FF00] shadow-[0_0_10px_rgba(184,255,0,0.4)]'
                        : stat.rate > 0
                        ? 'bg-[#8E9499]/40'
                        : 'bg-white/5'
                    }`}
                    style={{ height: `${Math.max(12, stat.rate)}%` }}
                  />
                  <span
                    className={`text-[10px] font-bold ${
                      stat.isToday ? 'text-[#B8FF00]' : 'text-[#8E9499]'
                    }`}
                  >
                    {stat.dayInitial}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-[10px] text-[#8E9499] mt-3">
              <span>Hoje: {DAY_NAMES[todayIndex]}</span>
              <span className="text-[#B8FF00] font-semibold">Semana em andamento</span>
            </div>
          </div>
        </div>
      </div>

      {/* Intention & Perceived Capacity (Capítulo 6 - PRD) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Intention (8 cols) */}
        <div className="md:col-span-8 p-5 rounded-2xl bg-[#171A1D] border border-white/8 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8E9499] uppercase tracking-wider">
              Intenção da Semana
            </span>
            {!isEditingIntention ? (
              <button
                onClick={() => {
                  setTempIntention(weekIntention);
                  setIsEditingIntention(true);
                }}
                className="text-[11px] text-[#8E9499] hover:text-[#F2F1ED] flex items-center gap-1"
              >
                <Edit3 size={11} /> Editar
              </button>
            ) : (
              <button
                onClick={() => {
                  setWeekIntention(tempIntention);
                  setIsEditingIntention(false);
                }}
                className="text-[11px] text-[#B8FF00] font-semibold flex items-center gap-1"
              >
                <Check size={11} /> Salvar
              </button>
            )}
          </div>
          {!isEditingIntention ? (
            <p className="text-sm font-semibold text-[#F2F1ED] italic leading-relaxed">
              &ldquo;{weekIntention}&rdquo;
            </p>
          ) : (
            <textarea
              value={tempIntention}
              onChange={(e) => setTempIntention(e.target.value)}
              rows={2}
              className="w-full bg-[#111315] border border-white/15 rounded-xl p-2.5 text-xs text-[#F2F1ED] focus:outline-none focus:border-[#B8FF00] resize-none"
            />
          )}
        </div>

        {/* Perceived Capacity (4 cols) */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-[#171A1D] border border-white/8 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8E9499] uppercase tracking-wider">
              Capacidade Percebida
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-[#B8FF00] font-bold uppercase">
              {capacity}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {(['leve', 'normal', 'intensa'] as const).map((cap) => (
              <button
                key={cap}
                onClick={() => setCapacity(cap)}
                className={`py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  capacity === cap
                    ? 'bg-[#B8FF00] text-[#0D0F10] font-bold shadow-[0_0_12px_rgba(184,255,0,0.2)]'
                    : 'bg-[#111315] text-[#8E9499] hover:text-[#F2F1ED] border border-white/8'
                }`}
              >
                {cap}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-[#8E9499] leading-tight pt-0.5">
            {capacity === 'leve' && 'Semana de manutenção. Mantenha apenas o piso.'}
            {capacity === 'normal' && 'Ritmo sustentável e equilibrado nas 4 áreas.'}
            {capacity === 'intensa' && 'Pico de foco. Cuidado para não queimar largada.'}
          </p>
        </div>
      </div>

      {/* 4 Life Areas: Weekly Intentions */}
      <div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[#F2F1ED]">
              O que você escolheu avançar esta semana?
            </h2>
            <p className="text-xs text-[#8E9499] mt-0.5">
              Definir um foco claro para cada área da vida evita a dispersão de energia.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {areas.map(area => {
            const config = LIFE_AREAS[area];
            const isEditing = editingArea === area;
            const currentPriority = weeklyPlan.areaPriorities[area];

            return (
              <div
                key={area}
                className="trajetta-card p-5 flex flex-col justify-between space-y-4 border-l-4"
                style={{ borderLeftColor: config.color }}
              >
                <div className="flex items-center justify-between">
                  <AreaBadge area={area} size="sm" />
                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(area)}
                      className="text-xs text-[#8E9499] hover:text-[#F2F1ED] p-1 rounded hover:bg-white/5 flex items-center gap-1 transition-colors"
                    >
                      <Edit3 size={13} />
                      <span>Editar foco</span>
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      rows={3}
                      className="w-full bg-[#111315] border border-white/10 rounded-lg p-2.5 text-xs text-[#F2F1ED] focus:outline-none focus:border-[#B8FF00] resize-none"
                      placeholder={`Qual seu principal avanço para ${config.label}?`}
                    />
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingArea(null)}
                        className="text-xs"
                      >
                        Cancelar
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleSaveEdit(area)}
                        className="text-xs"
                      >
                        <Check size={13} /> Salvar Foco
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-[#F2F1ED] leading-snug">
                      {currentPriority || 'Nenhum foco definido para esta semana.'}
                    </p>
                    <span className="block text-[11px] text-[#8E9499] mt-2">
                      {config.description}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
