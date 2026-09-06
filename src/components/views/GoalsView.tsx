'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { CheckCircle } from '@/components/ui/CheckCircle';
import { LifeArea } from '@/types';
import { LIFE_AREAS } from '@/lib/constants';
import { Plus, Target, Check, Calendar, Flag, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

export function GoalsView() {
  const { goals, toggleGoalMilestone, deleteGoal, setIsNewGoalModalOpen } = useTrajetta();
  const [selectedArea, setSelectedArea] = useState<LifeArea | 'todas'>('todas');
  const [expandedGoals, setExpandedGoals] = useState<Record<string, boolean>>({});
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedGoals(prev => ({ ...prev, [id]: prev[id] === false ? true : false }));
  };

  const filteredGoals = selectedArea === 'todas'
    ? goals
    : goals.filter(g => g.lifeArea === selectedArea);

  const areas: (LifeArea | 'todas')[] = ['todas', 'corpo', 'dinheiro', 'carreira', 'vida'];

  const handleDelete = (id: string) => {
    deleteGoal(id);
    setGoalToDelete(null);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#8E9499] uppercase">
              Direção de Longo Prazo
            </span>
            <span className="w-8 h-px bg-[#B8FF00]/40 inline-block" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F2F1ED] mt-2">
            Suas <span className="text-[#B8FF00]">Metas.</span>
          </h1>
          <p className="text-sm text-[#8E9499] mt-1.5">
            Metas quebradas em marcos realistas. Cada conquista é uma evidência de transformação.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsNewGoalModalOpen(true)}
          className="text-xs"
        >
          <Plus size={15} />
          <span>Criar Nova Meta</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {areas.map(area => {
          const isSelected = selectedArea === area;
          const label = area === 'todas' ? 'Todas as Áreas' : LIFE_AREAS[area].label;
          return (
            <button
              key={area}
              onClick={() => setSelectedArea(area)}
              className={`px-4 py-1.5 min-h-[36px] rounded-full text-sm font-semibold whitespace-nowrap transition-colors tactile-btn ${
                isSelected
                  ? 'bg-[#B8FF00] text-[#0D0F10] font-bold shadow-[0_0_15px_rgba(184,255,0,0.15)]'
                  : 'bg-[#171A1D] text-[#8E9499] hover:text-[#F2F1ED] border border-white/8'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Goals Cards List */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <div className="trajetta-card p-10 text-center space-y-3 border border-white/8">
            <div className="w-12 h-12 rounded-2xl bg-[#B8FF00]/10 border border-[#B8FF00]/25 flex items-center justify-center mx-auto text-[#B8FF00]">
              <Target size={22} />
            </div>
            <h3 className="text-base font-bold text-[#F2F1ED]">Nenhuma meta cadastrada {selectedArea !== 'todas' ? `em ${LIFE_AREAS[selectedArea].label}` : ''}</h3>
            <p className="text-xs text-[#8E9499] max-w-md mx-auto">
              Defina um objetivo concreto que você quer alcançar. A Trajetta te ajuda a quebrar essa meta em marcos graduais.
            </p>
            <div className="pt-2">
              <Button variant="primary" size="sm" onClick={() => setIsNewGoalModalOpen(true)}>
                <Plus size={14} /> Criar Primeira Meta
              </Button>
            </div>
          </div>
        ) : (
          filteredGoals.map(goal => {
            const areaConfig = LIFE_AREAS[goal.lifeArea];
            const isExpanded = expandedGoals[goal.id] !== false;
            const completedMilestones = goal.milestones.filter(m => m.completed).length;

            return (
              <div
                key={goal.id}
                className="trajetta-card p-6 border border-white/8 space-y-4"
              >
                {/* Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <AreaBadge area={goal.lifeArea} size="sm" />
                      <span className="text-[11px] text-[#8E9499] flex items-center gap-1">
                        <Calendar size={12} /> Prazo: {goal.targetDate}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#F2F1ED] mt-1">
                      {goal.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-lg font-black text-[#B8FF00] tabular-numbers">
                        {goal.progress}%
                      </span>
                      <span className="block text-[10px] text-[#8E9499]">
                        {completedMilestones}/{goal.milestones.length} marcos
                      </span>
                    </div>

                    {/* Excluir meta button */}
                    {goalToDelete === goal.id ? (
                      <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 p-1 rounded-lg">
                        <button
                          onClick={() => handleDelete(goal.id)}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          Confirmar
                        </button>
                        <button
                          onClick={() => setGoalToDelete(null)}
                          className="px-1.5 py-0.5 rounded text-[10px] text-[#8E9499] hover:text-[#F2F1ED]"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setGoalToDelete(goal.id)}
                        title="Excluir meta"
                        className="p-1.5 rounded-lg text-[#8E9499] hover:text-red-400 hover:bg-white/5 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                    <button
                      onClick={() => toggleExpand(goal.id)}
                      aria-label={isExpanded ? 'Recolher marcos' : 'Expandir marcos'}
                      className="p-1.5 rounded-lg text-[#8E9499] hover:text-[#F2F1ED] hover:bg-white/5"
                    >
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                <ProgressBar
                  value={goal.progress}
                  color={areaConfig.color}
                  height="h-2"
                />

                {/* Why it Matters (Emotional Moat) */}
                {goal.whyItMatters && (
                  <div className="bg-[#111315] rounded-xl p-3 border border-white/5 text-xs text-[#8E9499] flex items-start gap-2.5">
                    <span className="text-[#B8FF00] font-bold text-xs mt-0.5">Motivo:</span>
                    <span className="italic leading-relaxed text-[#F2F1ED]/90">
                      &ldquo;{goal.whyItMatters}&rdquo;
                    </span>
                  </div>
                )}

                {/* Incremental Milestones (Collapsible) */}
                {isExpanded && goal.milestones && goal.milestones.length > 0 && (
                  <div className="pt-2 border-t border-white/8 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#F2F1ED] uppercase tracking-wider flex items-center gap-1.5">
                        <Flag size={13} className="text-[#B8FF00]" /> Marcos Progressivos
                      </span>
                      <span className="text-[11px] text-[#8E9499]">
                        Clique para marcar marcos atingidos
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {goal.milestones.map(m => (
                        <div
                          key={m.id}
                          onClick={() => toggleGoalMilestone(goal.id, m.id)}
                          className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all select-none tactile-btn ${
                            m.completed
                              ? 'bg-[#B8FF00]/5 border-[#B8FF00]/30 text-[#F2F1ED]'
                              : 'bg-[#111315] border-white/5 text-[#8E9499] hover:border-white/15'
                          }`}
                        >
                          <CheckCircle
                            checked={m.completed}
                            onClick={() => toggleGoalMilestone(goal.id, m.id)}
                            color={areaConfig.color}
                          />
                          <div className="flex-1 min-w-0">
                            <span
                              className={`text-xs font-medium block ${
                                m.completed ? 'line-through text-[#8E9499]' : 'text-[#F2F1ED]'
                              }`}
                            >
                              {m.title}
                            </span>
                            {m.targetValue && (
                              <span className="text-[10px] font-bold text-[#B8FF00] mt-0.5 block">
                                Alvo: {m.targetValue}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
