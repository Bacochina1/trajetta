'use client';

import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { trackMarketingEvent } from '@/lib/analytics';

export function HeroSection() {
  const handleCtaClick = (ctaName: string) => {
    trackMarketingEvent('hero_cta_clicked', { location: 'hero', cta_name: ctaName });
  };

  return (
    <section 
      className="relative w-full min-h-[640px] xs:min-h-[700px] sm:min-h-[820px] lg:min-h-[960px] flex flex-col justify-between overflow-hidden" 
      data-purpose="hero-section" 
      id="visao"
    >
      {/* 1. Cinematic Backdrop */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" data-purpose="cinematic-backdrop">
        {/* Sky & mountain dark atmospheric gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#202b35] via-[#131920] to-[#060709]"></div>

        {/* Mountain silhouette shapes */}
        <svg 
          className="absolute w-full h-[70%] sm:h-[85%] bottom-0 opacity-40 mix-blend-multiply" 
          fill="none" 
          preserveAspectRatio="none" 
          viewBox="0 0 1440 800"
        >
          <path d="M0 450L210 260L460 380L720 220L980 340L1240 180L1440 320V800H0V450Z" fill="#0b1016"></path>
          <path d="M-100 520L280 320L580 440L880 290L1180 410L1480 260V800H-100V520Z" fill="#06090e" opacity="0.8"></path>
        </svg>

        {/* Flying bird silhouettes in sky */}
        <div className="absolute inset-0 z-10 opacity-70">
          <svg className="absolute top-[8%] left-[10%] sm:left-[17%] w-16 sm:w-24 h-16 sm:h-24 text-black opacity-90 drop-shadow-md transform -rotate-12" fill="currentColor" viewBox="0 0 100 100">
            <path d="M50 42 C40 20 20 12 0 18 C15 32 35 44 48 48 C38 62 20 72 5 78 C25 76 42 66 52 52 C62 66 79 76 99 78 C84 72 66 62 56 48 C69 44 89 32 104 18 C84 12 64 20 54 42 Z"></path>
          </svg>
          <svg className="absolute top-[5%] left-[30%] sm:left-[36%] w-18 sm:w-28 h-18 sm:h-28 text-black opacity-90 drop-shadow-md transform rotate-6" fill="currentColor" viewBox="0 0 100 100">
            <path d="M48 44 C36 24 16 16 0 20 C16 32 34 44 46 48 C34 64 16 75 0 80 C22 78 38 68 50 54 C60 68 76 78 98 80 C82 75 64 64 52 48 C64 44 82 32 98 20 C82 16 62 24 50 44 Z"></path>
          </svg>
          <svg className="absolute top-[12%] right-[15%] sm:right-[25%] w-16 sm:w-22 h-16 sm:h-22 text-black opacity-85 transform rotate-12" fill="currentColor" viewBox="0 0 100 100">
            <path d="M48 44 C36 24 16 16 0 20 C16 32 34 44 46 48 C34 64 16 75 0 80 C22 78 38 68 50 54 C60 68 76 78 98 80 C82 75 64 64 52 48 C64 44 82 32 98 20 C82 16 62 24 50 44 Z"></path>
          </svg>
        </div>

        {/* Luminous Golden Doorway / Portal Feature */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[70px] xs:top-[85px] sm:top-[110px] lg:top-[140px] flex flex-col items-center pointer-events-none z-15">
          {/* Portal frame structure */}
          <div className="w-[58px] xs:w-[68px] sm:w-[84px] lg:w-[92px] h-[115px] xs:h-[135px] sm:h-[165px] lg:h-[180px] border-2 sm:border-[3px] border-amber-200/95 portal-frame bg-amber-100/10 backdrop-blur-[2px] relative z-20 rounded-[2px]">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-300/45 via-amber-100/25 to-transparent"></div>
          </div>
          {/* Waterline divide */}
          <div className="w-[220px] xs:w-[260px] sm:w-[340px] lg:w-[400px] h-[2px] bg-gradient-to-r from-transparent via-amber-200/60 to-transparent my-1 blur-[1px]"></div>
          {/* Portal water reflection */}
          <div className="w-[54px] xs:w-[62px] sm:w-[76px] lg:w-[84px] h-[100px] xs:h-[120px] sm:h-[145px] lg:h-[160px] bg-gradient-to-b from-amber-300/40 to-transparent portal-reflection opacity-65 transform scale-y-95"></div>
        </div>

        {/* Soft atmospheric gradient fog to base black */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-transparent opacity-95"></div>
        <div className="absolute inset-0 hero-bottom-fade"></div>
      </div>

      {/* 2. Hero Content Body */}
      <div className="relative z-30 max-w-[1440px] w-full mx-auto px-4 xs:px-6 sm:px-10 lg:px-14 pt-32 xs:pt-36 sm:pt-44 pb-12 sm:pb-16 mt-auto" data-purpose="hero-content">
        <div className="max-w-3xl">
          {/* Waitlist Status Pill */}
          <div className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono tracking-wide text-neutral-300 bg-[#151921]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 mb-5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#B8FF00] animate-pulse"></span>
            <span>Acesso Antecipado • Lista VIP Aberta</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-[32px] xs:text-[38px] sm:text-5xl md:text-6xl lg:text-[72px] leading-[1.08] sm:leading-[1.06] font-normal tracking-[-0.03em] text-white">
            Torne visível quem você<br className="hidden xs:inline" />
            {' '}está se tornando.
          </h1>

          {/* Subtitle */}
          <p className="mt-4 sm:mt-6 text-sm xs:text-base sm:text-lg text-neutral-300/85 font-normal max-w-xl leading-relaxed tracking-tight">
            O sistema pessoal que une direção de longo prazo, ciclos semanais sem punição e clareza silenciosa para as áreas que realmente importam da sua vida.
          </p>

          {/* CTA Action Buttons */}
          <div className="mt-6 sm:mt-8 flex flex-col xs:flex-row items-stretch xs:items-center gap-3 max-w-md xs:max-w-none">
            <a
              href="#waitlist"
              onClick={() => handleCtaClick('hero_primary_waitlist')}
              className="inline-flex items-center justify-center bg-white hover:bg-neutral-100 text-black text-xs sm:text-[13px] font-bold tracking-[0.08em] uppercase px-6 py-3.5 sm:py-4 rounded-full transition-all duration-150 shadow-xl shadow-white/10 active:scale-95 text-center"
            >
              <span>GARANTIR VAGA NA LISTA VIP</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2 flex-shrink-0" />
            </a>

            <a
              href="#metodo"
              onClick={() => handleCtaClick('hero_secondary_method')}
              className="inline-flex items-center justify-center bg-[#151921]/80 hover:bg-[#1f2530] backdrop-blur-md text-white border border-white/20 text-xs sm:text-[13px] font-bold tracking-[0.08em] uppercase px-6 py-3.5 sm:py-4 rounded-full transition-all duration-150 active:scale-95 text-center"
            >
              <span>CONHECER O MÉTODO</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2 text-neutral-400 flex-shrink-0" />
            </a>
          </div>
        </div>

        {/* Hero Pillars / Social Proof Row */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between text-xs text-neutral-400 gap-y-3.5" data-purpose="social-proof">
          <div className="flex flex-wrap items-center gap-x-2.5 sm:gap-x-3 gap-y-1.5 text-[11.5px] sm:text-[13px]">
            <span className="text-neutral-500 font-normal">Pilares do Sistema:</span>
            <span className="text-neutral-200 font-medium">Direção Pessoal</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-200 font-medium">4 Áreas da Vida</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-200 font-medium">Ciclos Sem Punição</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-200 font-medium">IA Contextual</span>
          </div>

          <div className="flex items-center gap-2 text-neutral-400 font-mono text-[11px] sm:text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] flex-shrink-0"></span>
            <span>Sem streaks punitivos • Foco na vida real</span>
          </div>
        </div>
      </div>
    </section>
  );
}
