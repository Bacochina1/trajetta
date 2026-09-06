'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { Button } from '@/components/ui/Button';
import { Plus, History, Calendar, Award, Milestone, Sparkles, Clock } from 'lucide-react';
import { LIFE_AREAS } from '@/lib/constants';
import { LifeArea } from '@/types';

export function TimelineView() {
  const { timeline, addTimelineEvent } = useTrajetta();
  const [selectedYear, setSelectedYear] = useState<number | 'todos'>('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newArea, setNewArea] = useState<LifeArea>('corpo');

  const years = [2026, 2025, 2024];

  const filteredEvents = selectedYear === 'todos'
    ? timeline
    : timeline.filter(e => e.year === selectedYear);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTimelineEvent({
      title: newTitle.trim(),
      description: newDesc.trim(),
      lifeArea: newArea,
      type: 'achievement',
      tag: 'Marco Registrado',
    });
    setNewTitle('');
    setNewDesc('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#B8FF00] uppercase">
              Memória & Continuidade
            </span>
            <span className="w-8 h-px bg-[#B8FF00]/40 inline-block" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F2F1ED] mt-2">
            Linha do Tempo da <span className="text-[#B8FF00]">Vida.</span>
          </h1>
          <p className="text-sm text-[#8E9499] mt-1.5">
            Quem você era → O que você fez → Quem você está se tornando. O app que não esquece sua história.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          className="text-xs"
        >
          <Plus size={15} />
          <span>Registrar Marco</span>
        </Button>
      </div>

      {/* Year Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedYear('todos')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors tactile-btn ${
            selectedYear === 'todos'
              ? 'bg-[#B8FF00] text-[#0D0F10] font-bold shadow-[0_0_15px_rgba(184,255,0,0.15)]'
              : 'bg-[#171A1D] text-[#8E9499] hover:text-[#F2F1ED] border border-white/8'
          }`}
        >
          Todos os Anos
        </button>
        {years.map(y => (
          <button
            key={y}
            onClick={() => setSelectedYear(y)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors tactile-btn ${
              selectedYear === y
                ? 'bg-[#B8FF00] text-[#0D0F10] font-bold shadow-[0_0_15px_rgba(184,255,0,0.15)]'
                : 'bg-[#171A1D] text-[#8E9499] hover:text-[#F2F1ED] border border-white/8'
            }`}
          >
            {y}
          </button>
        ))}
      </div>

      {/* Longitudinal Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 border-l border-white/10 space-y-8 mt-6">
        {filteredEvents.map(event => {
          const areaConfig = event.lifeArea ? LIFE_AREAS[event.lifeArea] : null;

          return (
            <div key={event.id} className="relative group">
              {/* Timeline Node Point */}
              <div
                className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 border-[#0D0F10] transition-transform duration-200 group-hover:scale-125"
                style={{
                  backgroundColor: areaConfig ? areaConfig.color : '#B8FF00',
                  boxShadow: `0 0 10px ${areaConfig ? areaConfig.color : '#B8FF00'}40`,
                }}
              />

              {/* Event Card */}
              <div className="trajetta-card p-5 border border-white/8 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#B8FF00] tabular-numbers">
                      {event.month} {event.year}
                    </span>
                    <span className="text-white/20">·</span>
                    <span className="text-[11px] text-[#8E9499]">{event.date}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {event.lifeArea && <AreaBadge area={event.lifeArea} size="sm" />}
                    {event.tag && (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#8E9499] font-medium">
                        {event.tag}
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-base font-bold text-[#F2F1ED] leading-snug">
                  {event.title}
                </h3>

                <p className="text-xs text-[#8E9499] leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Novo Marco */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0F10]/80 backdrop-blur-sm">
          <div className="bg-[#171A1D] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="text-lg font-bold text-[#F2F1ED]">Registrar Marco na Linha do Tempo</h3>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-xs text-[#8E9499] mb-1">Título do Acontecimento</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ex: Primeira corrida de 10k, Novo cargo..."
                  required
                  className="w-full bg-[#111315] border border-white/10 rounded-lg p-2.5 text-xs text-[#F2F1ED] focus:outline-none focus:border-[#B8FF00]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#8E9499] mb-1">Descrição / Contexto</label>
                <textarea
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  rows={3}
                  placeholder="O que essa conquista representou na sua vida?"
                  className="w-full bg-[#111315] border border-white/10 rounded-lg p-2.5 text-xs text-[#F2F1ED] focus:outline-none focus:border-[#B8FF00] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs text-[#8E9499] mb-1">Área da Vida</label>
                <select
                  value={newArea}
                  onChange={e => setNewArea(e.target.value as LifeArea)}
                  className="w-full bg-[#111315] border border-white/10 rounded-lg p-2.5 text-xs text-[#F2F1ED] focus:outline-none focus:border-[#B8FF00]"
                >
                  <option value="corpo">Corpo</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="carreira">Carreira</option>
                  <option value="vida">Vida</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Gravar Marco
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
