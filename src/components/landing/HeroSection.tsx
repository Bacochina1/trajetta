'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { trackMarketingEvent } from '@/lib/analytics';
import { useI18n } from '@/lib/i18n/context';

export function HeroSection() {
  const { t, locale } = useI18n();

  const handleCtaClick = (ctaName: string) => {
    trackMarketingEvent('hero_cta_clicked', { location: 'hero', cta_name: ctaName, locale });
  };

  return (
    <section
      className="relative w-full min-h-[90dvh] flex flex-col justify-between overflow-hidden"
      data-purpose="hero-section"
      id="visao"
    >
      {/* 1. Cinematic 4K Atmospheric Backdrop with Monumental Neon-Lime Portal */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" data-purpose="cinematic-backdrop">
        {/* Base dark canvas */}
        <div className="absolute inset-0 bg-[#060709]" />

        {/* 4K Rendered Monumental Portal & Trajectory Backdrop */}
        <img
          src="/trajetta-hero-bg-4k.jpg"
          alt="Trajetta — Aplicativo de Metas, Hábitos e Planejamento Semanal com IA"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover object-[78%_center] sm:object-center opacity-90 pointer-events-none"
        />

        {/* Left Dark Gradient Overlay for Maximum Text Contrast and Readability on Mobile and Desktop */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060709] via-[#060709]/85 sm:via-[#060709]/80 to-transparent w-full md:w-[65%]" />

        {/* Top and Bottom Fades to seamlessly blend */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#060709] via-[#060709]/80 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      </div>

      {/* 2. Hero Content Body — Symmetrical & Responsive across 320px to 4K */}
      <div
        className="relative z-30 max-w-[1440px] w-full mx-auto px-4 xs:px-6 sm:px-10 lg:px-14 pt-24 xs:pt-28 sm:pt-36 pb-8 sm:pb-16 mt-auto"
        data-purpose="hero-content"
      >
        <div className="max-w-3xl">
          {/* Pro Status Pill */}
          <div className="inline-flex items-center space-x-2 text-[10px] xs:text-[11px] sm:text-xs font-mono tracking-wide text-neutral-300 bg-[#1e2329]/85 backdrop-blur-md px-3 xs:px-4 py-1.5 rounded-full border border-white/10 mb-4 sm:mb-6 shadow-xl max-w-full">
            <span className="w-2 h-2 rounded-full bg-[#B8FF00] animate-pulse flex-shrink-0" />
            <span className="truncate">
              {locale === 'en' ? 'Active • Instant Access to Trajetta Pro' : 'Liberado • Acesso Imediato ao Trajetta Pro'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-[27px] xs:text-[32px] sm:text-5xl md:text-6xl lg:text-[72px] leading-[1.14] sm:leading-[1.06] font-normal tracking-[-0.03em] text-white [text-wrap:balance]">
            {t.hero.headlineStart}{' '}
            <span className="text-[#B8FF00] font-semibold">{t.hero.headlineHighlight}</span>
            {t.hero.headlineEnd}
          </h1>

          {/* Subtitle */}
          <p className="mt-3.5 sm:mt-6 text-[14px] xs:text-[15px] sm:text-lg text-neutral-300/90 font-normal max-w-xl leading-relaxed tracking-tight [text-wrap:pretty]">
            {t.hero.subheadline}
          </p>

          {/* CTA Action Buttons — Symmetrical on all screens */}
          <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full max-w-md sm:max-w-none">
            <a
              href="#planos"
              onClick={() => handleCtaClick('hero_primary_planos')}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-[#B8FF00] hover:bg-[#a6e600] active:scale-95 text-[#060709] text-[11.5px] sm:text-[12.5px] font-extrabold tracking-[0.08em] uppercase px-6 sm:px-7 py-3.5 sm:py-4 rounded-full transition-all duration-150 shadow-xl shadow-[0_0_20px_rgba(184,255,0,0.3)] text-center cursor-pointer"
            >
              <span>{t.hero.ctaPrimary}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2 flex-shrink-0" />
            </a>

            <a
              href="#metodo"
              onClick={() => handleCtaClick('hero_secondary_method')}
              className="w-full sm:w-auto inline-flex items-center justify-center bg-[#14181f]/85 hover:bg-[#1a212b] active:scale-95 backdrop-blur-md text-white border border-white/20 text-[11.5px] sm:text-[12.5px] font-bold tracking-[0.08em] uppercase px-6 sm:px-7 py-3.5 sm:py-4 rounded-full transition-all duration-150 text-center cursor-pointer"
            >
              <span>{t.hero.ctaSecondary}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2 text-neutral-400 flex-shrink-0" />
            </a>
          </div>
        </div>

        {/* Hero Pillars / Social Proof Row — Balanced wrap */}
        <div
          className="mt-8 sm:mt-16 pt-5 sm:pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between text-xs text-neutral-400 gap-y-3"
          data-purpose="social-proof"
        >
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 font-normal text-[11px] xs:text-[12px] sm:text-[13px]">
            <span className="text-neutral-500 font-normal mr-0.5">
              {locale === 'en' ? 'Core Pillars:' : 'Pilares:'}
            </span>
            <span className="text-neutral-200 font-medium">
              {locale === 'en' ? 'Personal Direction' : 'Direção Pessoal'}
            </span>
            <span className="text-neutral-600 hidden xs:inline">•</span>
            <span className="text-neutral-200 font-medium">
              {locale === 'en' ? '4 Life Areas' : '4 Áreas da Vida'}
            </span>
            <span className="text-neutral-600 hidden xs:inline">•</span>
            <span className="text-neutral-200 font-medium">
              {locale === 'en' ? 'Guilt-Free Cycles' : 'Ciclos Sem Punição'}
            </span>
            <span className="text-neutral-600 hidden xs:inline">•</span>
            <span className="text-neutral-200 font-medium">
              {locale === 'en' ? 'Contextual AI' : 'IA Contextual'}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-neutral-400 font-mono text-[10px] xs:text-[11px] sm:text-[11.5px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] flex-shrink-0" />
            <span>
              {locale === 'en' ? 'Zero punitive streaks • Built for real life' : 'Sem streaks punitivos • Foco na vida real'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
