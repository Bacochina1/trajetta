'use client';

import React from 'react';
import { ArrowRight, Send } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export function HowItWorksSection() {
  const { locale } = useI18n();
  const isEn = locale === 'en';

  const directionsPt = [
    'Transição de Carreira',
    'Reserva de Emergência',
    'Físico Consistente',
    'Evolução Profissional',
  ];

  const directionsEn = [
    'Career Transition',
    'Emergency Cushion',
    'Consistent Fitness',
    'Craft & Mastery',
  ];

  const directions = isEn ? directionsEn : directionsPt;
  const [selectedDirection, setSelectedDirection] = React.useState(directions[0]);

  React.useEffect(() => {
    setSelectedDirection(directions[0]);
  }, [isEn]);

  return (
    <section className="max-w-[1440px] mx-auto px-4 xs:px-6 sm:px-10 lg:px-14 py-16 sm:py-24 border-t border-white/10" data-purpose="how-it-works" id="metodo">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3 tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
        <span>{isEn ? 'How It Works' : 'Como Funciona'}</span>
      </div>

      {/* Section Heading */}
      <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-8 sm:mb-10 [text-wrap:balance]">
        {isEn ? 'One direction to start, ' : 'Uma direção para começar, '}
        <span className="text-neutral-500">
          {isEn ? 'three steps to clarity.' : 'três passos para a clareza.'}
        </span>
      </h2>

      {/* Split layout: Input Preview Left, Step Process Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Real App Mockup with Floating Prompt Card */}
        <div className="lg:col-span-7 rounded-2xl bg-[#090d12] border border-white/10 relative overflow-hidden min-h-[340px] sm:min-h-[480px] p-3 xs:p-4 sm:p-6 flex items-end justify-center shadow-2xl group">
          {/* Real App Screens Mockup Background */}
          <img
            src="/trajetta-real-app-mockup.jpg"
            alt={isEn ? "Authentic Trajetta Pro application screens with Life Score and Trajetta AI" : "Telas reais do aplicativo Trajetta Pro com Life Score e Trajetta AI"}
            className="absolute inset-0 w-full h-full object-cover object-[center_20%] sm:object-center opacity-85 group-hover:scale-[1.02] transition-transform duration-700 pointer-events-none"
          />

          {/* Directional scrim gradient for optimal text readability and contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-[#060709]/75 to-transparent pointer-events-none" />

          {/* Top Pill: Indicador de Telas Reais */}
          <div className="absolute top-4 left-4 z-10 hidden xs:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#060709]/80 backdrop-blur-md border border-white/10 text-[10px] font-mono text-neutral-300">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-pulse" />
            <span>{isEn ? 'Authentic Trajetta Pro Interface' : 'Interface Real do Trajetta Pro'}</span>
          </div>

          {/* Floating prompt input box matching reference */}
          <div className="relative z-10 w-full bg-[#0d1015]/95 border border-white/15 rounded-xl p-3.5 xs:p-4 sm:p-5 shadow-2xl mb-1 sm:mb-2 backdrop-blur-md">
            <div className="text-[11px] xs:text-xs font-mono text-neutral-400 mb-3 sm:mb-4 tracking-wide flex items-center justify-between">
              <span>{isEn ? 'What is the direction of your next 90-day cycle?' : 'Qual é a direção do seu próximo ciclo de 90 dias?'}</span>
              <span className="text-[10px] font-mono text-[#B8FF00] bg-[#B8FF00]/10 px-2 py-0.5 rounded">
                {isEn ? 'Cycle Q1' : 'Ciclo Q1'}
              </span>
            </div>

            {/* Simulated Chip Options */}
            <div className="flex flex-wrap gap-1.5 xs:gap-2 mb-3.5 sm:mb-5">
              {directions.map((dir) => {
                const isSelected = selectedDirection === dir;
                return (
                  <button
                    key={dir}
                    type="button"
                    onClick={() => setSelectedDirection(dir)}
                    className={`text-[10px] xs:text-[11px] font-mono px-2.5 xs:px-3 py-1 rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#B8FF00]/15 text-[#B8FF00] border-[#B8FF00]/60 shadow-[0_0_10px_rgba(184,255,0,0.15)]'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-300 border-white/10'
                    }`}
                  >
                    {dir}
                  </button>
                );
              })}
            </div>

            {/* Bottom Input Action Bar */}
            <div className="flex items-center justify-between gap-3 pt-2.5 sm:pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 text-neutral-400">
                <span className="text-[10.5px] xs:text-xs font-mono text-neutral-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-pulse"></span>
                  <span>{isEn ? `Trajetta AI: Calibrating ${selectedDirection}...` : `Trajetta AI: Calibrando ${selectedDirection}...`}</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10.5px] xs:text-[11px] font-mono text-neutral-400 hidden sm:inline">
                  {isEn ? 'Press Enter' : 'Pressione Enter'}
                </span>
                <a
                  href="#planos"
                  aria-label={isEn ? "Set Direction and Start Trial" : "Definir Direção e Testar 3 Dias"}
                  className="bg-[#B8FF00] hover:bg-[#a6e600] text-[#060709] p-1.5 sm:p-2 rounded-lg transition-all flex items-center justify-center active:scale-95 shadow-[0_0_12px_rgba(184,255,0,0.3)]"
                >
                  <Send className="w-3.5 h-3.5" />
                </a>
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
                {isEn ? 'Define Your North Star' : 'Definir sua Estrela-Guia'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                {isEn
                  ? 'Break out of survival mode. Establish where you want to be over the next 12 months across the 4 essential areas of your life.'
                  : 'Saia do modo sobrevivência. Estabeleça para onde você quer ir nos próximos 12 meses nas 4 áreas essenciais da sua vida.'}
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
                {isEn ? 'Plan in Weekly Cycles' : 'Planejar em Ciclos Semanais'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                {isEn
                  ? 'Commit to only 3 real priorities for the week and define the minimum floor for demanding days. Less volume, deeper execution.'
                  : 'Escolha apenas 3 prioridades reais para a semana e defina o piso mínimo para os dias difíceis. Menos volume, mais profundidade.'}
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
                {isEn ? 'Track Without Guilt' : 'Acompanhar sem Punição'}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                {isEn
                  ? 'Sunday is your moment to close the cycle with Trajetta AI. If routine was heavy, the system recalibrates calmly and without guilt.'
                  : 'Domingo é o momento de fechar o ciclo com a Trajetta AI. Se a rotina pesou, o sistema recalibra com serenidade e sem culpa.'}
              </p>
            </div>
          </div>

          <div className="pt-3">
            <a
              href="#planos"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#B8FF00] hover:bg-[#a6e600] text-[#060709] text-xs font-extrabold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(184,255,0,0.25)] active:scale-95"
            >
              <span>{isEn ? 'Get Started with Trajetta Pro' : 'Começar no Trajetta Pro'}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
