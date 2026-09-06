'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { LIFE_AREAS } from '@/lib/constants';
import { LifeArea } from '@/types';
import { Plus, Trash2, Check } from 'lucide-react';

export function NewGoalModal() {
  const { isNewGoalModalOpen, setIsNewGoalModalOpen, createGoal } = useTrajetta();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [lifeArea, setLifeArea] = useState<LifeArea>('corpo');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [whyItMatters, setWhyItMatters] = useState('');
  const [milestones, setMilestones] = useState<{ id: string; title: string; targetValue?: string; completed: boolean; order: number }[]>([
    { id: 'm-1', title: 'Primeiro avanço mensurável', targetValue: 'Marco 1', completed: false, order: 1 },
    { id: 'm-2', title: 'Segundo avanço de consolidação', targetValue: 'Marco 2', completed: false, order: 2 },
  ]);

  const addMilestone = () => {
    const nextOrder = milestones.length + 1;
    setMilestones(prev => [
      ...prev,
      { id: 'm-' + Date.now(), title: '', targetValue: `Marco ${nextOrder}`, completed: false, order: nextOrder },
    ]);
  };

  const removeMilestone = (index: number) => {
    setMilestones(prev => prev.filter((_, idx) => idx !== index));
  };

  const updateMilestoneTitle = (index: number, text: string) => {
    setMilestones(prev =>
      prev.map((m, idx) => (idx === index ? { ...m, title: text } : m))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createGoal({
      title: title.trim(),
      description: description.trim(),
      lifeArea,
      targetDate,
      whyItMatters: whyItMatters.trim() || 'Porque faz parte da trajetória que quero construir.',
      milestones: milestones.filter(m => m.title.trim().length > 0),
    });

    setIsNewGoalModalOpen(false);
    setTitle('');
    setDescription('');
    setWhyItMatters('');
  };

  return (
    <Modal
      isOpen={isNewGoalModalOpen}
      onClose={() => setIsNewGoalModalOpen(false)}
      title="Criar Nova Meta"
      subtitle="Divida uma ambição de longo prazo em marcos graduais."
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="goal-title" className="block text-xs font-semibold text-[#F2F1ED] mb-1.5">Título da Meta</label>
          <input
            id="goal-title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Ex: Atingir R$ 30k de faturamento, Treinar 16x no mês, Guardar R$ 5.000..."
            required
            className="w-full h-10 bg-[#111315] border border-white/10 rounded-xl px-4 text-sm text-[#F2F1ED] placeholder:text-white/40 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="goal-area" className="block text-xs font-semibold text-[#F2F1ED] mb-1.5">Área da Vida</label>
            <select
              id="goal-area"
              value={lifeArea}
              onChange={e => setLifeArea(e.target.value as LifeArea)}
              className="w-full h-10 bg-[#111315] border border-white/10 rounded-xl px-3 text-sm text-[#F2F1ED] focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors"
            >
              <option value="corpo">Corpo</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="carreira">Carreira</option>
              <option value="vida">Vida</option>
            </select>
          </div>

          <div>
            <label htmlFor="goal-date" className="block text-xs font-semibold text-[#F2F1ED] mb-1.5">Prazo Alvo</label>
            <input
              id="goal-date"
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="w-full h-10 bg-[#111315] border border-white/10 rounded-xl px-3 text-sm text-[#F2F1ED] focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="goal-why" className="block text-xs font-semibold text-[#F2F1ED] mb-1.5">
            Por que isso importa? (Motivo Existencial)
          </label>
          <textarea
            id="goal-why"
            value={whyItMatters}
            onChange={e => setWhyItMatters(e.target.value)}
            rows={3}
            placeholder="O que alcançar essa meta vai mudar na pessoa que você está se tornando?"
            className="w-full bg-[#111315] border border-white/10 rounded-xl p-3 text-sm text-[#F2F1ED] placeholder:text-white/40 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors resize-none"
          />
        </div>

        {/* Incremental Milestones Section */}
        <div className="pt-2 border-t border-white/8 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#F2F1ED]">Marcos Progressivos</span>
            <button
              type="button"
              onClick={addMilestone}
              className="text-xs text-[#B8FF00] font-semibold flex items-center gap-1 hover:underline"
            >
              <Plus size={13} /> Adicionar marco
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {milestones.map((m, index) => (
              <div key={m.id} className="flex items-center gap-2">
                <span className="text-xs text-[#8E9499] w-5 text-center">{index + 1}.</span>
                <input
                  type="text"
                  value={m.title}
                  onChange={e => updateMilestoneTitle(index, e.target.value)}
                  placeholder={`Ex: Etapa ${index + 1}...`}
                  className="flex-1 h-9 bg-[#111315] border border-white/10 rounded-lg px-3 text-xs sm:text-sm text-[#F2F1ED] placeholder:text-white/40 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors"
                />
                {milestones.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeMilestone(index)}
                    aria-label={`Remover marco ${index + 1}`}
                    className="p-2 text-[#8E9499] hover:text-red-400 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-lg"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Design for Developers: Both primary and secondary actions placed at the bottom-left */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/8">
          <Button variant="primary" size="md" type="submit">
            <Check size={16} /> Criar Meta
          </Button>
          <Button variant="ghost" size="md" type="button" onClick={() => setIsNewGoalModalOpen(false)}>
            Cancelar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
