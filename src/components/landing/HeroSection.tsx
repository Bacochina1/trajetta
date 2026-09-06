'use client';

import React from 'react';
import { ArrowRight, Sparkles, Shield, Compass, CheckCircle2 } from 'lucide-react';
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
      <div className="absolute inset-0 pointer-events-none select-none" data-purpose="cinematic-backdrop">
        {/* Real 4K Background Image */}
        <img
          src="/trajetta-hero-bg-4k.jpg"
          alt="Trajetta Universo de Evolução"
          className="w-full h-full object-cover object-right-bottom sm:object-center"
        />

        {/* Soft atmospheric gradients for contrast and readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#060709]/95 via-[#060709]/60 to-transparent sm:via-[#060709]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-[#060709]/60" />
        <div className="absolute inset-0 hero-bottom-fade" />
      </div>

      {/* 2. Hero Content Body — Proportioned for 90dvh */}
      <div
        className="relative z-30 max-w-[1440px] w-full mx-auto px-6 sm:px-10 lg:px-14 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 mt-auto"
        data-purpose="hero-content"
      >
        <div className="max-w-3xl">
          {/* Waitlist Status Pill */}
          <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-wide text-neutral-300 bg-[#1e2329]/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 mb-6 shadow-xl">
            <span className="w-2 h-2 rounded-full bg-[#B8FF00] animate-pulse" />
            <span>Acesso Antecipado • Lista VIP Liberada</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[72px] leading-[1.06] font-normal tracking-[-0.03em] text-white">
            Torne visível quem você<br />
            está se tornando.
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-neutral-300/90 font-normal max-w-xl leading-relaxed tracking-tight">
            O sistema pessoal que une direção de longo prazo, ciclos semanais sem punição e clareza silenciosa para as áreas que realmente importam da sua vida.
          </p>

          {/* CTA Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <a
              href="#waitlist"
              onClick={() => handleCtaClick('hero_primary_waitlist')}
              className="inline-flex items-center justify-center bg-white hover:bg-neutral-200 text-neutral-900 text-[12px] font-bold tracking-[0.08em] uppercase px-7 py-4 rounded-full transition-all duration-150 shadow-xl shadow-white/10 active:scale-95 text-center cursor-pointer"
            >
              <span>GARANTIR VAGA NA LISTA VIP</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2 flex-shrink-0" />
            </a>

            <a
              href="#metodo"
              onClick={() => handleCtaClick('hero_secondary_method')}
              className="inline-flex items-center justify-center bg-[#14181f]/80 hover:bg-[#1a212b] backdrop-blur-md text-white border border-white/20 text-[12px] font-bold tracking-[0.08em] uppercase px-7 py-4 rounded-full transition-all duration-150 active:scale-95 text-center cursor-pointer"
            >
              <span>CONHECER O MÉTODO</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2 text-neutral-400 flex-shrink-0" />
            </a>
          </div>
        </div>

        {/* Hero Pillars / Social Proof Row */}
        <div
          className="mt-14 sm:mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between text-xs text-neutral-400 gap-y-4"
          data-purpose="social-proof"
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-normal tracking-normal text-[12.5px] sm:text-[13px]">
            <span className="text-neutral-500 font-normal mr-1">Pilares do Sistema:</span>
            <span className="text-neutral-200 font-medium">Direção Pessoal</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-200 font-medium">4 Áreas da Vida</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-200 font-medium">Ciclos Sem Punição</span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-200 font-medium">IA com Memória Contextual</span>
          </div>

          <div className="flex items-center space-x-2 text-neutral-400 font-mono text-[11.5px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]" />
            <span>Sem streaks punitivos • 100% focado na vida real</span>
          </div>
        </div>
      </div>
    </section>
  );
}
