'use client';

import React, { useState } from 'react';
import { Calendar, CheckCircle2, RotateCcw, Sparkles, Sliders, Check } from 'lucide-react';
import { trackMarketingEvent } from '@/lib/analytics';

export function ProductCycleSection() {
  const [activeTab, setActiveTab] = useState<'hoje' | 'semana' | 'habitos' | 'review'>('semana');

  const handleTabChange = (tab: 'hoje' | 'semana' | 'habitos' | 'review') => {
    setActiveTab(tab);
    trackMarketingEvent('section_viewed', { section: 'ciclo_produto', tab });
  };

  return (
    <section id="ciclo" className="py-20 sm:py-28 bg-[#080A0C] border-b border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8FF00]">
            O Ciclo do Produto
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F1ED] tracking-tight">
            Uma semana por vez.
          </h2>
          <p className="text-sm sm:text-base text-[#8E9499] leading-relaxed">
            Esqueça ferramentas isoladas e checklists intermináveis. A Trajetta estrutura seu ritmo em quatro pilares interligados.
          </p>
        </div>

        {/* Tab Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 max-w-2xl mx-auto">
          <button
            type="button"
            onClick={() => handleTabChange('semana')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'semana'
                ? 'bg-[#B8FF00] text-[#060709] shadow-[0_0_20px_rgba(184,255,0,0.3)]'
                : 'bg-[#14181F] text-[#8E9499] hover:text-[#F2F1ED] border border-white/8'
            }`}
          >
            Minha Semana
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('hoje')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'hoje'
                ? 'bg-[#B8FF00] text-[#060709] shadow-[0_0_20px_rgba(184,255,0,0.3)]'
                : 'bg-[#14181F] text-[#8E9499] hover:text-[#F2F1ED] border border-white/8'
            }`}
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('habitos')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'habitos'
                ? 'bg-[#B8FF00] text-[#060709] shadow-[0_0_20px_rgba(184,255,0,0.3)]'
                : 'bg-[#14181F] text-[#8E9499] hover:text-[#F2F1ED] border border-white/8'
            }`}
          >
            Hábitos & Consistência
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('review')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'review'
                ? 'bg-[#B8FF00] text-[#060709] shadow-[0_0_20px_rgba(184,255,0,0.3)]'
                : 'bg-[#14181F] text-[#8E9499] hover:text-[#F2F1ED] border border-white/8'
            }`}
          >
            Weekly Review
          </button>
        </div>

        {/* Tab Display Panel */}
        <div className="max-w-4xl mx-auto rounded-2xl bg-[#0D0F10] border border-white/10 p-6 sm:p-10 shadow-2xl">
          {activeTab === 'semana' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/8 pb-4">
                <span className="text-xs uppercase font-mono tracking-wider text-[#B8FF00] font-bold">Planejamento Semanal</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#F2F1ED] mt-1">
                  “Pare de tentar mudar sua vida inteira em uma segunda-feira.”
                </h3>
                <p className="text-sm text-[#8E9499] mt-2">
                  Escolha poucas prioridades para a semana e acompanhe o que realmente está avançando com capacidade calculada.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#14181F] border border-white/8">
                  <div className="text-xs text-[#8E9499]">Capacidade Semanal</div>
                  <div className="text-lg font-bold text-[#F2F1ED] mt-1">16h Estimadas</div>
                  <div className="text-[11px] text-[#B8FF00] mt-1">✓ Ritmo sustentável e realista</div>
                </div>
                <div className="p-4 rounded-xl bg-[#14181F] border border-white/8">
                  <div className="text-xs text-[#8E9499]">Foco Principal</div>
                  <div className="text-lg font-bold text-[#F2F1ED] mt-1">Corpo & Carreira</div>
                  <div className="text-[11px] text-[#8E9499] mt-1">Atenção intencional balanceada</div>
                </div>
                <div className="p-4 rounded-xl bg-[#14181F] border border-white/8">
                  <div className="text-xs text-[#8E9499]">Ajuste Dinâmico</div>
                  <div className="text-lg font-bold text-[#F2F1ED] mt-1">Modo Retomada</div>
                  <div className="text-[11px] text-[#8E9499] mt-1">Replaneje sem peso ou culpa</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hoje' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/8 pb-4">
                <span className="text-xs uppercase font-mono tracking-wider text-[#B8FF00] font-bold">Visão de Hoje</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#F2F1ED] mt-1">
                  “Apenas o que está sob seu controle nas próximas horas.”
                </h3>
                <p className="text-sm text-[#8E9499] mt-2">
                  Acorde com clareza. Você não precisa olhar para um backlog de 50 tarefas para saber o que importa hoje.
                </p>
              </div>
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#14181F] border border-white/8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-md border-2 border-[#B8FF00] flex items-center justify-center bg-[#B8FF00]/10">
                      <Check className="w-3.5 h-3.5 text-[#B8FF00]" />
                    </span>
                    <span className="text-sm font-semibold text-[#F2F1ED]">Treino A (Piso: 20 min)</span>
                  </div>
                  <span className="text-xs text-[#B8FF00] font-mono">Concluído</span>
                </div>
                <div className="p-4 rounded-xl bg-[#14181F] border border-white/8 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-md border-2 border-white/30" />
                    <span className="text-sm font-semibold text-[#F2F1ED]">30 minutos de estudo para certificação</span>
                  </div>
                  <span className="text-xs text-[#8E9499]">Carreira</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'habitos' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/8 pb-4">
                <span className="text-xs uppercase font-mono tracking-wider text-[#B8FF00] font-bold">Consistência Real</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#F2F1ED] mt-1">
                  “Construa consistência sem sentir que um dia ruim apagou todo o seu progresso.”
                </h3>
                <p className="text-sm text-[#8E9499] mt-2">
                  O conceito de Piso Mínimo e Volume Acumulado garante que seu progresso continue contando para sempre.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-[#14181F] border border-white/8 space-y-2">
                  <div className="text-sm font-bold text-[#F2F1ED]">Piso Mínimo Flexível</div>
                  <p className="text-xs text-[#8E9499] leading-relaxed">
                    Não consegue ler 30 páginas hoje? Ler 1 página mantém o hábito vivo no cérebro e impede a quebra de identidade.
                  </p>
                </div>
                <div className="p-5 rounded-xl bg-[#14181F] border border-white/8 space-y-2">
                  <div className="text-sm font-bold text-[#F2F1ED]">Histórico Permanente</div>
                  <p className="text-xs text-[#8E9499] leading-relaxed">
                    Sem streaks punitivos. Se você treinou 40 dias no ano e faltou na quarta-feira, você continua com 40 treinos acumulados.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'review' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-white/8 pb-4">
                <span className="text-xs uppercase font-mono tracking-wider text-[#B8FF00] font-bold">Weekly Review</span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#F2F1ED] mt-1">
                  “Entenda o que sua semana realmente te ensinou.”
                </h3>
                <p className="text-sm text-[#8E9499] mt-2">
                  5 minutos no domingo geram um snapshot imutável de aprendizados e preparam a semana seguinte com zero atrito.
                </p>
              </div>
              <div className="p-5 rounded-xl bg-[#14181F] border border-[#B8FF00]/25 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono text-[#8E9499]">
                  <span>Snapshot Semana 37</span>
                  <span className="text-[#B8FF00] font-bold">Imutável</span>
                </div>
                <p className="text-sm text-[#F2F1ED] italic leading-relaxed">
                  “Aprendizado da semana: reuniões no final da tarde sabotam o treino de quinta. Solução acordada com a Trajetta AI: mover o treino para antes do almoço.”
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
