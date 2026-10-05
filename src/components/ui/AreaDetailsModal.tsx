'use client';

import React, { useEffect } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { AreaBadge } from './AreaBadge';
import { ProgressBar } from './ProgressBar';
import { LIFE_AREAS } from '@/lib/constants';
import { LifeArea } from '@/types';
import {
  X,
  Target,
  Repeat,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  Calendar,
  Zap,
} from 'lucide-react';

interface AreaDetailsModalProps {
  area: LifeArea | null;
  onClose: () => void;
  score: number;
  status: 'attention' | 'evolving' | 'strong';
  trend: 'up' | 'stable' | 'down';
  calmInsight: string;
}

const MICROPASSO_BY_AREA: Record<LifeArea, { title: string; action: string; duration: string }> = {
  corpo: {
    title: 'Recuperação Somática de 5 Minutos',
    action: 'Beba 1 copo grande de água gelada e faça 5 minutos de caminhada rápida ou 10 respirações diafragmáticas profundas.',
    duration: '5 min',
  },
  dinheiro: {
    title: 'Clareza Financeira Imediata',
    action: 'Abra seu app de banco, confira o saldo real das contas e anote uma despesa desnecessária que pode ser evitada hoje.',
    duration: '3 min',
  },
  carreira: {
    title: 'Foco no Inegociável',
    action: 'Feche 5 abas abertas no navegador e anote a única entrega profissional que destrava todo o resto do seu dia.',
    duration: '4 min',
  },
  vida: {
    title: 'Descompressão e Conexão Humana',
    action: 'Envie uma mensagem sincera para um amigo de confiança ou faça uma pausa de 10 minutos longe de qualquer tela digital.',
    duration: '5 min',
  },
};

export function AreaDetailsModal({
  area,
  onClose,
  score,
  status,
  trend,
  calmInsight,
}: AreaDetailsModalProps) {
  const { habits, goals, setActiveView, toggleHabitToday, setIsNewGoalModalOpen } = useTrajetta();

  // Handle ESC key and scroll locking
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (area) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [area, onClose]);

  if (!area) return null;

  const config = LIFE_AREAS[area];
  const areaHabits = habits.filter((h) => h.lifeArea === area);
  const areaGoals = goals.filter((g) => g.lifeArea === area);
  const micropasso = MICROPASSO_BY_AREA[area];
  const todayIndex = new Date().getDay();

  const getStatusBadge = () => {
    switch (status) {
      case 'strong':
        return (
          <span className="text-xs font-semibold text-[#58D6A7] bg-[#58D6A7]/10 px-2.5 py-0.5 rounded-full border border-[#58D6A7]/25">
            Forte atualmente
          </span>
        );
      case 'evolving':
        return (
          <span className="text-xs font-semibold text-[#B8FF00] bg-[#B8FF00]/10 px-2.5 py-0.5 rounded-full border border-[#B8FF00]/25">
            Em evolução contínua
          </span>
        );
      case 'attention':
        return (
          <span className="text-xs font-semibold text-[#F08A76] bg-[#F08A76]/10 px-2.5 py-0.5 rounded-full border border-[#F08A76]/25">
            Atenção e cuidado
          </span>
        );
    }
  };

  const getTrendBadge = () => {
    switch (trend) {
      case 'up':
        return (
          <span className="flex items-center gap-1 text-xs text-[#58D6A7] font-semibold">
            <TrendingUp size={14} /> Ritmo em alta
          </span>
        );
      case 'down':
        return (
          <span className="flex items-center gap-1 text-xs text-[#F08A76] font-semibold">
            <TrendingDown size={14} /> Oscilação natural
          </span>
        );
      case 'stable':
        return (
          <span className="flex items-center gap-1 text-xs text-[#8E9499] font-semibold">
            <Minus size={14} /> Ritmo estável
          </span>
        );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="area-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#060709]/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col bg-[#0E1218] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#12161E]">
          <div className="flex items-center gap-3">
            <AreaBadge area={area} size="lg" />
            <div>
              <h2 id="area-modal-title" className="text-base sm:text-lg font-extrabold text-[#F2F1ED] flex items-center gap-2">
                Diagnóstico de {config.label}
              </h2>
              <p className="text-xs text-[#8E9499] line-clamp-1">{config.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8E9499] hover:text-[#F2F1ED] hover:bg-white/5 transition-colors"
            aria-label="Fechar detalhes da área"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Top Score Banner */}
          <div className="p-5 rounded-2xl bg-[#14181F] border border-white/8 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#B8FF00] tracking-tight tabular-numbers">
                  {score}
                </span>
                <span className="text-sm font-bold text-[#8E9499]">/ 100</span>
              </div>
              <div className="flex items-center gap-3">
                {getTrendBadge()}
                {getStatusBadge()}
              </div>
            </div>

            <ProgressBar value={score} color={config.color} height="h-2.5" />

            <p className="text-xs sm:text-sm text-[#8E9499] leading-relaxed pt-1">
              {calmInsight}
            </p>
          </div>

          {/* 5-Min Micropass Card (Anti-Punishment Trajetta Philosophy) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#171A1D] to-[#12151A] border border-[#B8FF00]/25 relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#B8FF00]/10 border border-[#B8FF00]/30 flex items-center justify-center text-[#B8FF00] flex-shrink-0">
                <Zap size={18} />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-[#F2F1ED] flex items-center gap-1.5">
                    <span>{micropasso.title}</span>
                    <span className="text-[10px] font-mono font-semibold text-[#B8FF00] bg-[#B8FF00]/10 px-2 py-0.5 rounded-full">
                      {micropasso.duration}
                    </span>
                  </h3>
                </div>
                <p className="text-xs text-[#8E9499] leading-relaxed">
                  {micropasso.action}
                </p>
              </div>
            </div>
          </div>

          {/* Connected Habits Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Repeat size={15} className="text-[#B8FF00]" />
                <h3 className="text-sm font-bold text-[#F2F1ED]">
                  Hábitos em {config.label} ({areaHabits.length})
                </h3>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setActiveView('habitos');
                }}
                className="text-xs text-[#B8FF00] hover:underline font-semibold flex items-center gap-1"
              >
                Gerenciar hábitos <ChevronRight size={13} />
              </button>
            </div>

            {areaHabits.length === 0 ? (
              <div className="p-4 rounded-xl bg-white/3 border border-white/6 text-center space-y-2">
                <p className="text-xs text-[#8E9499]">
                  Nenhum hábito cadastrado nesta área ainda.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    setActiveView('habitos');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#B8FF00]/10 text-[#B8FF00] text-xs font-bold hover:bg-[#B8FF00]/20 transition-colors"
                >
                  + Cadastrar Hábito em {config.label}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {areaHabits.map((habit) => {
                  const doneThisWeek = habit.daysCompletedThisWeek?.length || 0;
                  const target = habit.frequencyPerWeek || 5;
                  const isDoneToday = (habit.daysCompletedThisWeek || []).includes(todayIndex);

                  return (
                    <div
                      key={habit.id}
                      className="p-3.5 rounded-xl bg-[#14181F] border border-white/6 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-xs sm:text-sm font-semibold text-[#F2F1ED] block truncate">
                          {habit.title}
                        </span>
                        <span className="text-[11px] text-[#8E9499]">
                          {habit.targetDescription || `${target}x por semana`} • {doneThisWeek}/{target} dias concluídos
                        </span>
                      </div>
                      <button
                        onClick={() => toggleHabitToday(habit.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 flex-shrink-0 ${
                          isDoneToday
                            ? 'bg-[#58D6A7]/15 text-[#58D6A7] border border-[#58D6A7]/30'
                            : 'bg-white/5 hover:bg-white/10 text-[#8E9499] hover:text-[#F2F1ED] border border-white/10'
                        }`}
                      >
                        <CheckCircle2 size={13} />
                        <span>{isDoneToday ? 'Feito hoje' : 'Concluir hoje'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Connected Goals Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target size={15} className="text-[#B8FF00]" />
                <h3 className="text-sm font-bold text-[#F2F1ED]">
                  Metas em {config.label} ({areaGoals.length})
                </h3>
              </div>
              <button
                onClick={() => {
                  onClose();
                  setActiveView('metas');
                }}
                className="text-xs text-[#B8FF00] hover:underline font-semibold flex items-center gap-1"
              >
                Ver metas <ChevronRight size={13} />
              </button>
            </div>

            {areaGoals.length === 0 ? (
              <div className="p-4 rounded-xl bg-white/3 border border-white/6 text-center space-y-2">
                <p className="text-xs text-[#8E9499]">
                  Nenhuma meta cadastrada nesta área ainda.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    setIsNewGoalModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#B8FF00]/10 text-[#B8FF00] text-xs font-bold hover:bg-[#B8FF00]/20 transition-colors"
                >
                  + Criar Meta em {config.label}
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {areaGoals.map((goal) => {
                  const completedMilestones = (goal.milestones || []).filter((m) => m.completed).length;
                  const totalMilestones = (goal.milestones || []).length;

                  return (
                    <div
                      key={goal.id}
                      className="p-3.5 rounded-xl bg-[#14181F] border border-white/6 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs sm:text-sm font-semibold text-[#F2F1ED] truncate">
                          {goal.title}
                        </span>
                        <span className="text-xs font-bold text-[#B8FF00] tabular-numbers flex-shrink-0">
                          {goal.progress}%
                        </span>
                      </div>
                      <ProgressBar value={goal.progress} color={config.color} height="h-1.5" />
                      <div className="flex items-center justify-between text-[10px] text-[#8E9499]">
                        <span>{completedMilestones} de {totalMilestones} marcos superados</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={11} /> {goal.targetDate}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-white/8 bg-[#12161E] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                setActiveView('habitos');
              }}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#F2F1ED] transition-colors"
            >
              Ir para Hábitos
            </button>
            <button
              onClick={() => {
                onClose();
                setActiveView('metas');
              }}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#F2F1ED] transition-colors"
            >
              Ir para Metas
            </button>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#B8FF00] hover:bg-[#a6e600] text-[#0D0F10] text-xs font-extrabold transition-all"
          >
            Concluir
          </button>
        </div>
      </div>
    </div>
  );
}
