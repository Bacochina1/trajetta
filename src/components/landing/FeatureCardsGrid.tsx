'use client';

import React from 'react';
import { 
  Calendar, 
  Target, 
  ShieldCheck, 
  RefreshCw, 
  Copy, 
  Bookmark, 
  Sparkles, 
  Flame, 
  Check, 
  Compass, 
  Sliders, 
  RotateCcw, 
  Zap, 
  ArrowRight 
} from 'lucide-react';

export function FeatureCardsGrid() {
  return (
    <section className="relative z-20 max-w-[1440px] mx-auto px-4 xs:px-6 sm:px-10 lg:px-14 pb-20 sm:pb-32" data-purpose="feature-cards" id="ciclos">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* CARD 1: Ciclo da Semana */}
        <div className="flex flex-col group">
          {/* Visual Container Mockup */}
          <div className="relative w-full min-h-[280px] sm:min-h-[290px] sm:aspect-[4/3.5] rounded-xl overflow-hidden border border-white/10 bg-[#0c0e12] flex items-center justify-center p-3.5 xs:p-4 sm:p-6 shadow-2xl">
            {/* Atmospheric landscape background with mountains and mist */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-[#11161d] to-[#1c242e] opacity-80"></div>
            <svg className="absolute inset-0 w-full h-full opacity-35 object-cover pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 300">
              <path d="M0 160L80 110L170 170L260 90L340 140L400 100V300H0Z" fill="#040608"></path>
            </svg>

            {/* Automation Flow Nodes */}
            <div className="relative z-10 w-full max-w-[260px] flex flex-col items-center">
              {/* Node 1: Domingo Planejamento */}
              <div className="bg-[#181c22]/90 border border-white/10 text-[10.5px] xs:text-[11px] font-mono text-neutral-200 px-3 xs:px-3.5 py-1.5 rounded-md shadow-lg flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
                <span>Domingo: Planejamento Leve</span>
              </div>

              {/* Connector Line */}
              <div className="w-[1px] h-3.5 sm:h-4 bg-neutral-600/70"></div>

              {/* Node 2: 3 Prioridades Reais */}
              <div className="w-full bg-[#161a20]/90 border border-white/10 px-2.5 xs:px-3 py-1.5 xs:py-2 rounded-md flex items-center space-x-2 text-[10.5px] xs:text-[11px] font-mono text-neutral-300 shadow-lg">
                <Target className="w-3.5 h-3.5 text-[#B8FF00] flex-shrink-0" />
                <span className="truncate">3 Prioridades Reais da Semana</span>
              </div>

              {/* Connector Line */}
              <div className="w-[1px] h-3.5 sm:h-4 bg-neutral-600/70"></div>

              {/* Node 3: Piso Mínimo do Dia */}
              <div className="w-full bg-[#161a20]/90 border border-white/10 px-2.5 xs:px-3 py-1.5 xs:py-2 rounded-md flex items-center space-x-2 text-[10.5px] xs:text-[11px] font-mono text-neutral-300 shadow-lg">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300 flex-shrink-0" />
                <span className="truncate">Piso Mínimo para Dias Difíceis</span>
              </div>

              {/* Connector Line */}
              <div className="w-[1px] h-3.5 sm:h-4 bg-neutral-600/70"></div>

              {/* Node 4: Reflexão Sem Julgamento */}
              <div className="w-full bg-[#161a20]/90 border border-white/10 px-2.5 xs:px-3 py-1.5 xs:py-2 rounded-md flex items-center space-x-2 text-[10.5px] xs:text-[11px] font-mono text-neutral-300 shadow-lg">
                <RotateCcw className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
                <span className="truncate">Reflexão & Recalibração Silenciosa</span>
              </div>
            </div>
          </div>

          {/* Description Content */}
          <div className="mt-5 sm:mt-6">
            <h3 className="text-base font-medium font-mono text-white tracking-wide">Ciclo da Semana</h3>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Planejamento que sobrevive à vida real. Não zera streaks nem cobra perfeição. Se a semana pesar, o sistema recalcula sem culpa.
            </p>
          </div>
        </div>

        {/* CARD 2: Inteligência com Memória */}
        <div className="flex flex-col group">
          {/* Visual Container Mockup */}
          <div className="relative w-full min-h-[280px] sm:min-h-[290px] sm:aspect-[4/3.5] rounded-xl overflow-hidden border border-white/10 bg-[#0c0e12] flex items-center justify-center p-3.5 xs:p-4 sm:p-6 shadow-2xl">
            {/* Background mood mist */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-[#12161d] to-[#1a232f] opacity-75"></div>

            {/* Trajetta AI Chat Window Modal */}
            <div className="relative z-10 w-full max-w-[315px] bg-[#14181f]/95 border border-white/15 rounded-xl p-3.5 sm:p-4 shadow-2xl backdrop-blur-md">
              {/* Header bar with avatar and name */}
              <div className="flex items-center justify-between pb-2.5 border-b border-white/5">
                <div className="flex items-center space-x-2">
                  <span className="w-4 h-4 rounded-full bg-[#B8FF00] flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                  </span>
                  <span className="text-xs font-mono font-medium text-neutral-200">Trajetta AI</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-neutral-300">
                  Memória Ativa
                </span>
              </div>

              {/* Chat Content Body */}
              <div className="pt-2.5 pb-2.5 text-[10.5px] xs:text-[11px] leading-relaxed text-neutral-300 font-sans space-y-2">
                <p className="text-neutral-200 font-normal">
                  Identifiquei que sua meta de Carreira avançou 100%, mas o sono ficou abaixo de 6h em 4 dias.
                </p>
                <p className="text-neutral-400 text-[10px] xs:text-[10.5px] leading-relaxed">
                  Vamos calibrar o piso mínimo de descanso antes de acelerar os novos projetos? Consistência é ritmo sustentável.
                </p>
              </div>

              {/* Chat Actions Toolbar Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-neutral-400 text-[11px]">
                <div className="flex items-center space-x-2.5 sm:space-x-3">
                  <button className="hover:text-white transition-colors p-0.5" title="Regenerar">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button className="hover:text-white transition-colors p-0.5" title="Copiar">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button className="hover:text-white transition-colors p-0.5" title="Salvar">
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] font-mono text-[#B8FF00]">Ajustar Plano</span>
              </div>
            </div>
          </div>

          {/* Description Content */}
          <div className="mt-5 sm:mt-6">
            <h3 className="text-base font-medium font-mono text-white tracking-wide">Inteligência com Memória</h3>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
              Uma IA que conhece seu contexto e objetivos. Não cospe conselhos motivacionais genéricos; ela lê seus ciclos e aponta o próximo passo lúcido.
            </p>
          </div>
        </div>

        {/* CARD 3: Guia Silencioso */}
        <div className="flex flex-col group">
          {/* Visual Container Mockup */}
          <div className="relative w-full min-h-[280px] sm:min-h-[290px] sm:aspect-[4/3.5] rounded-xl overflow-hidden border border-white/10 bg-[#0c0e12] flex items-center justify-center p-3.5 xs:p-4 sm:p-6 shadow-2xl">
            {/* Background dramatic mist image backdrop */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-[#10141a] to-[#1c242c] opacity-80"></div>
            <svg className="absolute inset-0 w-full h-full opacity-35 object-cover pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 300">
              <path d="M0 130L90 180L210 110L290 170L400 90V300H0Z" fill="#040608"></path>
            </svg>

            {/* Interactive Action Chips Stack */}
            <div className="relative z-10 w-full max-w-[280px] space-y-2 xs:space-y-2.5">
              {/* Chip 1: Retomada sem culpa */}
              <div className="bg-[#151921]/95 border border-white/15 px-2.5 xs:px-3 py-2 rounded-xl flex items-center justify-between text-[10.5px] xs:text-[11px] shadow-lg backdrop-blur-sm">
                <div className="flex items-center space-x-1.5 xs:space-x-2 text-neutral-300 truncate mr-2">
                  <RotateCcw className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                  <span className="truncate">Retomada sem culpa após pausa</span>
                </div>
                <button className="bg-white hover:bg-neutral-100 text-black font-semibold text-[9.5px] xs:text-[10px] px-2 xs:px-2.5 py-1 rounded-md transition-colors flex-shrink-0">
                  Recalcular
                </button>
              </div>

              {/* Chip 2: Piso Mínimo */}
              <div className="bg-[#151921]/95 border border-white/15 px-2.5 xs:px-3 py-2 rounded-xl flex items-center justify-between text-[10.5px] xs:text-[11px] shadow-lg backdrop-blur-sm">
                <div className="flex items-center space-x-1.5 xs:space-x-2 text-neutral-300 truncate mr-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                  <span className="truncate">Ativar piso mínimo de treino</span>
                </div>
                <button className="bg-white hover:bg-neutral-100 text-black font-semibold text-[9.5px] xs:text-[10px] px-2 xs:px-2.5 py-1 rounded-md transition-colors flex-shrink-0">
                  Ativar
                </button>
              </div>

              {/* Chip 3: Registrar Vitória */}
              <div className="bg-[#151921]/95 border border-white/15 px-2.5 xs:px-3 py-2 rounded-xl flex items-center justify-between text-[10.5px] xs:text-[11px] shadow-lg backdrop-blur-sm">
                <div className="flex items-center space-x-1.5 xs:space-x-2 text-neutral-300 truncate mr-2">
                  <Zap className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                  <span className="truncate">Registrar vitória silenciosa</span>
                </div>
                <button className="bg-white hover:bg-neutral-100 text-black font-semibold text-[9.5px] xs:text-[10px] px-2 xs:px-2.5 py-1 rounded-md transition-colors flex-shrink-0">
                  Registrar
                </button>
              </div>
            </div>
          </div>

          {/* Description Content */}
          <div className="mt-6">
            <h3 className="text-base font-medium font-mono text-white tracking-wide">Guia Silencioso</h3>
            <p className="mt-2 text-sm text-neutral-400 font-light leading-relaxed">
              Sempre presente para manter você centrado. Sem notificações agressivas, sem contadores vermelhos. Apenas clareza no momento certo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
