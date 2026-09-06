'use client';

import React from 'react';
import { Compass, Calendar, ShieldCheck, ArrowRight, Sparkles, Send } from 'lucide-react';

export function HowItWorksSection() {
  return (
    <section className="max-w-[1440px] mx-auto px-4 xs:px-6 sm:px-10 lg:px-14 py-16 sm:py-24 border-t border-white/10" data-purpose="how-it-works" id="metodo">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3 tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
        <span>Como Funciona</span>
      </div>

      {/* Section Heading */}
      <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-10">
        Uma direção para começar, <span className="text-neutral-500">três passos para a clareza.</span>
      </h2>

      {/* Split layout: Input Preview Left, Step Process Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Prompt Bar inside Dark atmospheric scenery */}
        <div className="lg:col-span-7 rounded-2xl bg-[#090d12] border border-white/10 relative overflow-hidden min-h-[280px] sm:min-h-[420px] p-3 xs:p-4 sm:p-6 flex items-end justify-center shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-[#0c1017] to-[#141a24] opacity-90"></div>

          {/* Floating prompt input box matching reference */}
          <div className="relative z-10 w-full bg-[#0d1015]/95 border border-white/15 rounded-xl p-3.5 xs:p-4 sm:p-5 shadow-2xl mb-1 sm:mb-2 backdrop-blur-md">
            <div className="text-[11px] xs:text-xs font-mono text-neutral-400 mb-3.5 sm:mb-6 tracking-wide">
              Qual é a direção do seu próximo ciclo de 90 dias?
            </div>

            {/* Simulated Chip Options */}
            <div className="flex flex-wrap gap-1.5 xs:gap-2 mb-3.5 sm:mb-5">
              <span className="text-[10px] xs:text-[11px] font-mono bg-white/5 hover:bg-white/10 text-neutral-300 px-2.5 xs:px-3 py-1 rounded-full border border-white/10 cursor-pointer transition-colors">
                Transição de Carreira
              </span>
              <span className="text-[10px] xs:text-[11px] font-mono bg-white/5 hover:bg-white/10 text-neutral-300 px-2.5 xs:px-3 py-1 rounded-full border border-white/10 cursor-pointer transition-colors">
                Reserva de Emergência
              </span>
              <span className="text-[10px] xs:text-[11px] font-mono bg-white/5 hover:bg-white/10 text-neutral-300 px-2.5 xs:px-3 py-1 rounded-full border border-white/10 cursor-pointer transition-colors">
                Físico Consistente
              </span>
            </div>

            {/* Bottom Input Action Bar */}
            <div className="flex items-center justify-between gap-3 pt-2.5 sm:pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="text-[10.5px] xs:text-xs font-mono text-neutral-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
                  Trajetta AI Ativa
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10.5px] xs:text-[11px] font-mono text-neutral-400 hidden sm:inline">Pressione Enter</span>
                <button
                  type="button"
                  aria-label="Definir Direção"
                  className="bg-white hover:bg-neutral-200 text-black p-1.5 sm:p-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Step Process List */}
        <div className="lg:col-span-5 flex flex-col space-y-6 sm:space-y-8">
          {/* Step 1 */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#181d26] border border-white/15 text-white font-mono text-[11px] sm:text-xs flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-medium text-white font-sans tracking-tight mb-1">
                Definir sua Estrela-Guia
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Saia do modo sobrevivência. Estabeleça para onde você quer ir nos próximos 12 meses nas 4 áreas essenciais da sua vida.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#181d26] border border-white/15 text-white font-mono text-[11px] sm:text-xs flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-medium text-white font-sans tracking-tight mb-1">
                Planejar em Ciclos Semanais
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Escolha apenas 3 prioridades reais para a semana e defina o piso mínimo para os dias difíceis. Menos volume, mais profundidade.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#181d26] border border-white/15 text-white font-mono text-[11px] sm:text-xs flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-medium text-white font-sans tracking-tight mb-1">
                Acompanhar sem Punição
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                Domingo é o momento de fechar o ciclo com a Trajetta AI. Se a rotina pesou, o sistema recalibra com serenidade e sem culpa.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="#waitlist"
              className="inline-flex items-center space-x-2 text-xs font-mono font-medium text-[#B8FF00] hover:text-white transition-colors"
            >
              <span>Quero entrar no próximo lote de convites</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
