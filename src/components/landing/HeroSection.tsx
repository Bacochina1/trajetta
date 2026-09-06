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
      {/* 1. Cinematic Atmospheric Mountain Backdrop matching FeatureCards & LifeAreas */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" data-purpose="cinematic-backdrop">
        {/* Sky & mountain dark atmospheric gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c242e] via-[#11161d] to-[#060709]"></div>

        {/* Mountain silhouette shapes matching Feature Cards */}
        <svg className="absolute w-full h-[75%] sm:h-[85%] bottom-0 opacity-45 pointer-events-none" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 800">
          <path d="M0 450L210 260L460 380L720 220L980 340L1240 180L1440 320V800H0V450Z" fill="#0b1016"></path>
          <path d="M-100 520L280 320L580 440L880 290L1180 410L1480 260V800H-100V520Z" fill="#06090e" opacity="0.85"></path>
        </svg>

        {/* Luminous Golden Doorway / Portal Feature on the RIGHT */}
        <div className="absolute right-[8%] sm:right-[14%] lg:right-[18%] top-[130px] xs:top-[150px] sm:top-[190px] flex flex-col items-center pointer-events-none z-20">
          {/* Estrela-Guia & Trajectory light above the portal */}
          <div className="relative -mb-3 flex flex-col items-center">
            {/* 4-pointed radiant star */}
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-amber-200 animate-pulse drop-shadow-[0_0_12px_rgba(255,220,130,0.85)]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14 9L23 12L14 15L12 24L10 15L1 12L10 9L12 0Z" />
            </svg>
            {/* Subtle trajectory arching curves */}
            <svg className="w-32 sm:w-40 h-10 opacity-60 text-amber-200/50 -mt-2" viewBox="0 0 140 40" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M10 38C40 10 90 8 130 35" />
              <path d="M25 38C50 18 90 16 120 38" opacity="0.5" />
            </svg>
          </div>

          {/* Portal frame */}
          <div className="w-[76px] sm:w-[92px] h-[155px] sm:h-[185px] border-[2.5px] border-amber-200/90 portal-frame bg-amber-100/10 backdrop-blur-[2px] relative z-20 rounded-[2px] shadow-[0_0_40px_rgba(251,191,36,0.35)]">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-300/40 via-amber-100/20 to-transparent"></div>
            {/* Subtle neon lime accent stroke along the opening edge */}
            <div className="absolute inset-y-0 right-0 w-[2px] bg-[#B8FF00]/80 shadow-[0_0_8px_#B8FF00]"></div>
          </div>

          {/* Water waterline divide */}
          <div className="w-[260px] sm:w-[350px] h-[2px] bg-gradient-to-r from-transparent via-amber-200/60 to-transparent my-1 blur-[1px]"></div>

          {/* Portal water reflection */}
          <div className="w-[72px] sm:w-[86px] h-[145px] sm:h-[175px] bg-gradient-to-b from-amber-300/40 via-amber-200/15 to-transparent portal-reflection opacity-60 transform scale-y-95"></div>
        </div>

        {/* Soft atmospheric gradient fog to base black */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-transparent opacity-95"></div>
        <div className="absolute inset-0 hero-bottom-fade"></div>
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
