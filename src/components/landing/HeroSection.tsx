'use client';

import React from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { trackMarketingEvent } from '@/lib/analytics';

export function HeroSection() {
  const track = (name: string) =>
    trackMarketingEvent('cta_clicked', { location: 'hero', cta_name: name });

  return (
    <section
      id="visao"
      className="relative w-full min-h-[100svh] flex flex-col overflow-hidden"
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        aria-hidden
      >
        {/* Deep dark base */}
        <div className="absolute inset-0 bg-[#060709]" />

        {/* Subtle top glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.07]"
          style={{
            background: 'radial-gradient(ellipse at center, #B8FF00 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        {/* Bottom fade to section below */}
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#060709] to-transparent" />
      </div>

      {/* Content — vertically centered */}
      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-6xl w-full mx-auto px-4 sm:px-8 pt-16 pb-12 sm:pt-20">

        {/* Status pill */}
        <div className="inline-flex items-center gap-2 self-start text-[11px] sm:text-xs font-mono tracking-wide text-neutral-400 bg-white/[0.05] backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/[0.08] mb-5 sm:mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-pulse flex-shrink-0" aria-hidden />
          <span>Acesso Antecipado · Lista VIP Aberta</span>
        </div>

        {/* Headline */}
        <h1 className="text-[28px] xs:text-[34px] sm:text-[46px] md:text-[58px] font-semibold leading-[1.1] tracking-[-0.03em] text-white max-w-2xl">
          Torne visível quem você{' '}
          <span className="text-neutral-400 font-normal">está se tornando.</span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 sm:mt-5 text-[14px] sm:text-[16px] md:text-[18px] text-neutral-400 leading-relaxed max-w-xl">
          O sistema pessoal que une direção de longo prazo,{' '}
          ciclos semanais sem punição e clareza para as áreas que realmente importam.
        </p>

        {/* CTAs */}
        <div className="mt-7 sm:mt-9 flex flex-col xs:flex-row gap-3 items-stretch xs:items-center">
          <a
            href="#waitlist"
            onClick={() => track('hero_primary')}
            className="inline-flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 active:scale-95 text-black text-[12px] sm:text-[13px] font-bold tracking-[0.08em] uppercase px-6 py-3.5 sm:py-4 rounded-full transition-all duration-150 shadow-2xl shadow-white/10"
          >
            <span>GARANTIR VAGA NA LISTA VIP</span>
            <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
          </a>

          <a
            href="#metodo"
            onClick={() => track('hero_secondary')}
            className="inline-flex items-center justify-center gap-2 text-neutral-300 hover:text-white border border-white/15 hover:border-white/30 text-[12px] sm:text-[13px] font-medium tracking-[0.06em] uppercase px-6 py-3.5 sm:py-4 rounded-full transition-all duration-150 active:scale-95"
          >
            <span>CONHECER O MÉTODO</span>
          </a>
        </div>

        {/* Pillars row */}
        <div className="mt-10 sm:mt-14 pt-5 sm:pt-7 border-t border-white/[0.07] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] sm:text-[12px] text-neutral-500">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2">
            <span className="text-neutral-600">Pilares:</span>
            {['Direção Pessoal', '4 Áreas da Vida', 'Ciclos Sem Punição', 'IA Contextual'].map((p) => (
              <span key={p} className="text-neutral-300 font-medium">{p}</span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]" aria-hidden />
            <span>Sem streaks punitivos</span>
          </div>
        </div>
      </div>
    </section>
  );
}
