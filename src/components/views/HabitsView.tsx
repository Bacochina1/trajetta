'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { Button } from '@/components/ui/Button';
import { DAY_NAMES, DAY_INITIALS } from '@/lib/utils';
import { LIFE_AREAS } from '@/lib/constants';
import { LifeArea } from '@/types';
import { Flame, Plus, Check, ShieldCheck, Heart, Trash2, Repeat } from 'lucide-react';

export function HabitsView() {
  const { habits, toggleHabitToday, createHabit, deleteHabit } = useTrajetta();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newArea, setNewArea] = useState<LifeArea>('corpo');
  const [newFreq, setNewFreq] = useState(4);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);

  const todayIndex = new Date().getDay();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createHabit({
      title: newTitle.trim(),
      lifeArea: newArea,
      frequencyPerWeek: newFreq,
      targetDescription: `${newFreq}x por semana`,
    });
    setNewTitle('');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteHabit(id);
    setHabitToDelete(null);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#8E9499] uppercase">
              Rotina & Consistência
            </span>
            <span className="w-8 h-px bg-[#B8FF00]/40 inline-block" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F2F1ED] mt-2">
            Seus <span className="text-[#B8FF00]">Hábitos.</span>
          </h1>
          <p className="text-sm text-[#8E9499] mt-1.5">
            Consistência, não perfeição. Se você falhar um dia, sua trajetória não desaparece.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={15} />
          <span>Novo Hábito</span>
        </Button>
      </div>

      {/* Human Philosophy Banner */}
      <div className="p-4 rounded-2xl bg-[#171A1D] border border-white/8 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-[#B8FF00]/10 border border-[#B8FF00]/25 flex items-center justify-center text-[#B8FF00] flex-shrink-0 mt-0.5">
          <ShieldCheck size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#F2F1ED]">Princípio da Trajetta</h4>
          <p className="text-xs text-[#8E9499] mt-0.5 leading-relaxed">
            Eliminamos a punição por dias imperfeitos. O foco é acumular semanas em que você esteve presente no que importa, respeitando sua vida real.
          </p>
        </div>
      </div>

      {/* Habits Grid */}
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="trajetta-card p-10 text-center space-y-3 border border-white/8">
            <div className="w-12 h-12 rounded-2xl bg-[#B8FF00]/10 border border-[#B8FF00]/25 flex items-center justify-center mx-auto text-[#B8FF00]">
              <Repeat size={22} />
            </div>
            <h3 className="text-base font-bold text-[#F2F1ED]">Nenhum hábito cadastrado ainda</h3>
            <p className="text-xs text-[#8E9499] max-w-md mx-auto">
              Escolha 1 ou 2 hábitos simples para começar. A consistência diária constrói identidade de longo prazo.
            </p>
            <div className="pt-2">
              <Button variant="primary" size="sm" onClick={() => setIsModalOpen(true)}>
                <Plus size={14} /> Cadastrar Primeiro Hábito
              </Button>
            </div>
          </div>
        ) : (
          habits.map(habit => {
            const areaConfig = LIFE_AREAS[habit.lifeArea];
            const completedCount = habit.daysCompletedThisWeek.length;
            const isTargetMet = completedCount >= habit.frequencyPerWeek;

            return (
              <div
                key={habit.id}
                className="trajetta-card p-3.5 sm:p-5 border border-white/8 space-y-3.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <AreaBadge area={habit.lifeArea} size="sm" />
                      <span className="text-xs text-[#8E9499]">
                        Alvo: {habit.frequencyPerWeek}x na semana
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-[#F2F1ED] mt-1 break-words">
                      {habit.title}
                    </h3>
                  </div>

                  {/* Streak & Status & Delete */}
                  <div className="flex items-center justify-between sm:justify-end gap-2.5 flex-wrap pt-1 sm:pt-0 border-t border-white/5 sm:border-0">
                    <div className="text-left sm:text-right">
                      <span className="text-xs font-bold text-[#B8FF00] flex items-center gap-1">
                        <Flame size={13} /> {habit.streakWeeks} semanas
                      </span>
                      <span className="text-[11px] text-[#8E9499]">
                        {completedCount} de {habit.frequencyPerWeek} dias
                      </span>
                    </div>

                    {isTargetMet && (
                      <span className="px-2 py-0.5 rounded-lg bg-[#B8FF00]/10 border border-[#B8FF00]/30 text-[#B8FF00] text-[11px] font-bold flex items-center gap-1 flex-shrink-0">
                        <Check size={11} strokeWidth={2.5} /> Meta Batida
                      </span>
                    )}

                    {/* Excluir hábito button */}
                    {habitToDelete === habit.id ? (
                      <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/30 p-1 rounded-lg">
                        <button
                          onClick={() => handleDelete(habit.id)}
                          className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
                        >
                          Excluir
                        </button>
                        <button
                          onClick={() => setHabitToDelete(null)}
                          className="px-1.5 py-0.5 rounded text-[10px] text-[#8E9499] hover:text-[#F2F1ED]"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setHabitToDelete(habit.id)}
                        title="Excluir hábito"
                        className="p-1.5 rounded-lg text-[#8E9499] hover:text-red-400 hover:bg-white/5 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                {/* 7 Days Matrix */}
                <div className="pt-2 border-t border-white/8">
                  <div className="flex items-center justify-between gap-1 sm:gap-2">
                    {[0, 1, 2, 3, 4, 5, 6].map(day => {
                      const isDone = habit.daysCompletedThisWeek.includes(day);
                      const isToday = day === todayIndex;

                      return (
                        <button
                          key={day}
                          onClick={() => toggleHabitToday(habit.id)}
                          className={`flex-1 py-1.5 sm:py-2 min-h-[44px] rounded-xl flex flex-col items-center justify-center gap-0.5 sm:gap-1 transition-all tactile-btn select-none ${
                            isDone
                              ? 'bg-[#B8FF00] text-[#0D0F10] font-black shadow-[0_0_10px_rgba(184,255,0,0.2)]'
                              : isToday
                              ? 'bg-[#1F2328] border border-white/25 text-[#F2F1ED]'
                              : 'bg-[#111315] border border-white/5 text-[#8E9499] hover:border-white/20'
                          }`}
                        >
                          <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider">
                            {DAY_INITIALS[day]}
                          </span>
                          <div
                            className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                              isDone ? 'bg-[#0D0F10] text-[#B8FF00]' : 'bg-transparent'
                            }`}
                          >
                            {isDone && <Check size={9} strokeWidth={3} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Novo Hábito */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0F10]/80 backdrop-blur-sm">
          <div className="bg-[#171A1D] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-[#F2F1ED]">Criar Novo Hábito</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="habit-title" className="block text-xs font-semibold text-[#8E9499] uppercase tracking-wider mb-1.5">
                  Nome do Hábito
                </label>
                <input
                  id="habit-title"
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ex: Treino de força, Ler 20 min..."
                  required
                  className="w-full h-10 bg-[#111315] border border-white/10 rounded-xl px-4 text-sm text-[#F2F1ED] placeholder:text-white/40 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label htmlFor="habit-area" className="block text-xs font-semibold text-[#8E9499] uppercase tracking-wider mb-1.5">
                  Área da Vida
                </label>
                <select
                  id="habit-area"
                  value={newArea}
                  onChange={e => setNewArea(e.target.value as LifeArea)}
                  className="w-full h-10 bg-[#111315] border border-white/10 rounded-xl px-3 text-sm text-[#F2F1ED] focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors"
                >
                  <option value="corpo">Corpo</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="carreira">Carreira</option>
                  <option value="vida">Vida</option>
                </select>
              </div>

              <div>
                <label htmlFor="habit-freq" className="block text-xs font-semibold text-[#8E9499] uppercase tracking-wider mb-1.5">
                  Frequência Semanal ({newFreq}x por semana)
                </label>
                <input
                  id="habit-freq"
                  type="range"
                  min={1}
                  max={7}
                  value={newFreq}
                  onChange={e => setNewFreq(Number(e.target.value))}
                  className="w-full accent-[#B8FF00] cursor-pointer"
                />
              </div>

              {/* Design for Developers: Both primary and secondary actions placed at the bottom-left */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/8">
                <Button variant="primary" size="md" type="submit">
                  Criar Hábito
                </Button>
                <Button variant="ghost" size="md" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
