'use client';

import React from 'react';
import Link from 'next/link';
import { appendUtmToUrl, trackMarketingEvent } from '@/lib/analytics';
import { ArrowRight, Play, ShieldCheck, Check, Sparkles, TrendingUp, Calendar, Compass } from 'lucide-react';

export function HeroSection() {
  const handlePrimaryCta = () => {
    trackMarketingEvent('hero_cta_clicked', { location: 'hero', text: 'Começar 14 dias grátis' });
  };

  const handleSecondaryCta = () => {
    trackMarketingEvent('secondary_cta_clicked', { location: 'hero', text: 'Ver como funciona' });
  };

  return (
    <section className="relative pt-28 sm:pt-36 lg:pt-40 pb-20 sm:pb-28 overflow-hidden">
      {/* Subtle radial ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-b from-[#B8FF00]/[0.07] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-6 sm:space-y-7">
          {/* Badge */}
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 xs:gap-2 px-3 py-1.5 rounded-full bg-[#171B20] border border-white/10 text-[10px] xs:text-[11px] sm:text-xs font-medium text-[#8E9499] shadow-sm max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] shadow-[0_0_8px_#B8FF00] animate-pulse flex-shrink-0" />
            <span className="truncate">Construído com os primeiros usuários</span>
            <span className="text-white/20 hidden xs:inline">|</span>
            <span className="text-[#F2F1ED] font-semibold">14 dias grátis</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F2F1ED] leading-[1.15]">
            Torne visível quem você{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8FF00] via-[#D4FF5E] to-white">
              está se tornando.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-sm sm:text-lg lg:text-xl text-[#8E9499] leading-relaxed max-w-2xl mx-auto font-normal">
            Planeje suas semanas, acompanhe metas, hábitos e áreas da sua vida e tenha uma IA que aprende com sua trajetória para ajudar você a continuar avançando.
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
            <Link
              href={appendUtmToUrl('/register')}
              onClick={handlePrimaryCta}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 min-h-[48px] rounded-xl text-xs sm:text-sm font-bold bg-[#B8FF00] text-[#060709] hover:bg-[#c6ff24] shadow-[0_0_30px_rgba(184,255,0,0.3)] hover:shadow-[0_0_40px_rgba(184,255,0,0.4)] transition-all transform active:scale-95"
            >
              <span>Começar 14 dias grátis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#metodo"
              onClick={handleSecondaryCta}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 sm:py-4 min-h-[48px] rounded-xl text-xs sm:text-sm font-semibold bg-[#14181F] text-[#F2F1ED] border border-white/10 hover:border-white/20 hover:bg-[#1A1F27] transition-all"
            >
              <Play className="w-3.5 h-3.5 text-[#B8FF00]" fill="currentColor" />
              <span>Ver como funciona</span>
            </a>
          </div>

          {/* Micro trust indicators */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#8E9499]">
            <div className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#B8FF00]" />
              <span>Sem cartão de crédito para iniciar</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#B8FF00]" />
              <span>Zero streaks punitivos</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-[#B8FF00]" />
              <span>Dados 100% seus e exportáveis</span>
            </div>
          </div>
        </div>

        {/* Hero Visual Evidence: Authentic Dashboard Snapshot */}
        <div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
          <div className="relative rounded-2xl sm:rounded-3xl p-2 sm:p-3 bg-gradient-to-b from-white/10 via-white/[0.03] to-transparent border border-white/15 shadow-[0_20px_80px_rgba(0,0,0,0.8)]">
            {/* Top Bar Preview */}
            <div className="rounded-xl sm:rounded-2xl bg-[#0D0F10] border border-white/[0.08] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between bg-[#121518]/60">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/60" />
                  <span className="ml-2 text-xs font-mono text-[#8E9499] hidden sm:inline">trajetta.app · semana 37</span>
                </div>
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#B8FF00]/10 border border-[#B8FF00]/25 text-[11px] font-semibold text-[#B8FF00]">
                  <Compass className="w-3 h-3" />
                  <span>Trajetta AI · Motor Cognitivo v3</span>
                </div>
              </div>

              {/* Internal Mock Dashboard Content */}
              <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-gradient-to-br from-[#0D0F10] to-[#08090A]">
                {/* Left Column: Weekly Focus */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/8">
                    <div>
                      <span className="text-[11px] uppercase tracking-wider text-[#8E9499] font-bold">Semana 37</span>
                      <h2 className="text-base sm:text-lg font-extrabold text-[#F2F1ED]">Minhas Prioridades Reais</h2>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-[#1A1F27] text-[#B8FF00] font-mono font-semibold">
                      Ritmo Sustentável (4/5)
                    </span>
                  </div>

                  {/* Priority Cards */}
                  <div className="space-y-2.5">
                    <div className="p-3.5 rounded-xl bg-[#14181F] border border-white/8 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#B8FF00]/10 flex items-center justify-center text-[#B8FF00] font-bold text-xs">
                          C
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-[#F2F1ED]">Treinos de força (3x na semana)</div>
                          <div className="text-[11px] text-[#8E9499]">Corpo · Piso mínimo: 20 min</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#B8FF00]">3/3 ✓</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#14181F] border border-white/8 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xs">
                          D
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-[#F2F1ED]">Revisar orçamento mensal & aportes</div>
                          <div className="text-[11px] text-[#8E9499]">Dinheiro · Reserva de emergência</div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#8E9499]">Hoje</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#14181F] border border-white/8 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 font-bold text-xs">
                          P
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-semibold text-[#F2F1ED]">Finalizar proposta de transição de carreira</div>
                          <div className="text-[11px] text-[#8E9499]">Carreira · Meta Q3</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#B8FF00]">Concluído</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: AI Live Context & Insight */}
                <div className="lg:col-span-5 flex flex-col justify-between p-4 sm:p-5 rounded-xl bg-[#14181F] border border-[#B8FF00]/20 relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#B8FF00]" />
                      <span className="text-xs font-bold text-[#F2F1ED] tracking-tight">Trajetta AI · Memória Ativa</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#C9CDD1] leading-relaxed italic">
                      “Você sustentou o piso mínimo de treinos mesmo com a semana pesada no trabalho. Isso mantém sua constância viva sem sobrecarga mental.”
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/8 flex items-center justify-between text-[11px] text-[#8E9499]">
                    <span>Volume Acumulado: 42 semanas</span>
                    <span className="text-[#B8FF00] font-bold">Zero Streaks Punitivos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
