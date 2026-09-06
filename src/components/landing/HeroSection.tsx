'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { trackMarketingEvent } from '@/lib/analytics';

export function HeroSection() {
  const handleCtaClick = (ctaName: string) => {
    trackMarketingEvent('hero_cta_clicked', { location: 'hero', cta_name: ctaName });
  };

  return (
    <section
      className="relative w-full min-h-[90dvh] flex flex-col justify-between overflow-hidden"
      data-purpose="hero-section"
      id="visao"
    >
      {/* 1. Cinematic 4K Calm Power Backdrop with Modern Architectural Doorway & Estrela-Guia Trajectories */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" data-purpose="cinematic-backdrop">
        {/* Real 4K Background Image */}
        <img
          src="/trajetta-hero-bg-4k.jpg"
          alt="Trajetta Universo de Evolução"
          className="w-full h-full object-cover object-[75%_center] sm:object-center"
        />

        {/* Soft atmospheric gradients for contrast, symmetry and readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060709]/95 via-[#060709]/75 to-[#060709]/30 sm:via-[#060709]/55 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-[#060709]/70" />
        <div className="absolute inset-0 hero-bottom-fade" />
      </div>

      {/* 2. Hero Content Body — Symmetrical & Responsive across 320px to 4K */}
      <div
        className="relative z-30 max-w-[1440px] w-full mx-auto px-4 xs:px-6 sm:px-10 lg:px-14 pt-24 xs:pt-28 sm:pt-36 pb-10 sm:pb-16 mt-auto"
        data-purpose="hero-content"
      >
        <div className="max-w-3xl">
          {/* Waitlist Status Pill */}
          <div className="inline-flex items-center space-x-2 text-[11px] sm:text-xs font-mono tracking-wide text-neutral-300 bg-[#1e2329]/85 backdrop-blur-md px-3.5 sm:px-4 py-1.5 rounded-full border border-white/10 mb-5 sm:mb-6 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-[#B8FF00] animate-pulse flex-shrink-0" />
            <span className="truncate">Acesso Antecipado • Lista VIP Liberada</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-[30px] xs:text-[38px] sm:text-5xl md:text-6xl lg:text-[72px] leading-[1.08] sm:leading-[1.06] font-normal tracking-[-0.03em] text-white">
            Torne visível quem você<br className="hidden xs:inline" />{' '}
            está se tornando.
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 text-[14px] xs:text-[15px] sm:text-lg text-neutral-300/90 font-normal max-w-xl leading-relaxed tracking-tight">
            O sistema pessoal que une direção de longo prazo, ciclos semanais sem punição e clareza silenciosa para as áreas que realmente importam da sua vida.
          </p>

          {/* CTA Action Buttons — Symmetrical on all screens */}
          <div className="mt-6 sm:mt-8 flex flex-col xs:flex-row items-stretch xs:items-center gap-3 w-full max-w-md xs:max-w-none">
            <a
              href="#waitlist"
              onClick={() => handleCtaClick('hero_primary_waitlist')}
              className="w-full xs:w-auto inline-flex items-center justify-center bg-white hover:bg-neutral-200 active:scale-95 text-neutral-900 text-[11.5px] sm:text-[12.5px] font-bold tracking-[0.08em] uppercase px-5 sm:px-7 py-3.5 sm:py-4 rounded-full transition-all duration-150 shadow-xl shadow-white/10 text-center cursor-pointer"
            >
              <span>GARANTIR VAGA NA LISTA VIP</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2 flex-shrink-0" />
            </a>

            <a
              href="#metodo"
              onClick={() => handleCtaClick('hero_secondary_method')}
              className="w-full xs:w-auto inline-flex items-center justify-center bg-[#14181f]/85 hover:bg-[#1a212b] active:scale-95 backdrop-blur-md text-white border border-white/20 text-[11.5px] sm:text-[12.5px] font-bold tracking-[0.08em] uppercase px-5 sm:px-7 py-3.5 sm:py-4 rounded-full transition-all duration-150 text-center cursor-pointer"
            >
              <span>CONHECER O MÉTODO</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2 text-neutral-400 flex-shrink-0" />
            </a>
          </div>
        </div>

        {/* Hero Pillars / Social Proof Row — Balanced wrap */}
        <div
          className="mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between text-xs text-neutral-400 gap-y-3.5"
          data-purpose="social-proof"
        >
          <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1.5 font-normal text-[11px] xs:text-[12px] sm:text-[13px]">
            <span className="text-neutral-500 font-normal mr-0.5">Pilares do Sistema:</span>
            <span className="text-neutral-200 font-medium">Direção Pessoal</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-200 font-medium">4 Áreas da Vida</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-200 font-medium">Ciclos Sem Punição</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-200 font-medium">IA Contextual</span>
          </div>

          <div className="flex items-center space-x-2 text-neutral-400 font-mono text-[10.5px] xs:text-[11.5px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] flex-shrink-0" />
            <span>Sem streaks punitivos • Foco na vida real</span>
          </div>
        </div>
      </div>
    </section>
  );
}
