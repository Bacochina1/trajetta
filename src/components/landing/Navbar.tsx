'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import { trackMarketingEvent } from '@/lib/analytics';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { useI18n } from '@/lib/i18n/context';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { locale } = useI18n();
  const isEn = locale === 'en';

  const handleCtaClick = (ctaName: string) => {
    trackMarketingEvent('hero_cta_clicked', { location: 'navbar', cta_name: ctaName, locale });
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full transition-all duration-200 pointer-events-auto">
      <div className="w-full bg-transparent">
        <div className="max-w-[1440px] mx-auto px-4 xs:px-6 sm:px-10 lg:px-14 h-16 sm:h-20 flex items-center justify-between">
          {/* Official White Trajetta Logo */}
          <Link
            href={isEn ? '/en' : '/'}
            className="flex items-center space-x-2.5 sm:space-x-3 text-white tracking-wider group focus:outline-none flex-shrink-0"
            aria-label={isEn ? 'Trajetta Home' : 'Trajetta Início'}
          >
            <span className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-white group-hover:scale-105 transition-transform flex-shrink-0">
              <img
                src="/trajetta-logo-transparent.png"
                alt="Trajetta — Aplicativo de Metas e Hábitos"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]"
              />
            </span>
            <span className="font-bold text-[14px] sm:text-[15px] tracking-[0.18em] text-white select-none">
              TRAJETTA
            </span>
          </Link>

          {/* Center Nav Links Pill (Desktop) */}
          <nav className="hidden md:flex items-center bg-[#1e2329]/80 backdrop-blur-md rounded-full px-6 py-2.5 border border-white/10 text-[13px] font-medium text-neutral-300 space-x-7 shadow-2xl">
            <a className="hover:text-white transition-colors duration-200" href="#visao">
              {isEn ? 'Vision' : 'Visão'}
            </a>
            <a className="hover:text-white transition-colors duration-200" href="#ciclos">
              {isEn ? 'Cycles' : 'Ciclos'}
            </a>
            <a className="hover:text-white transition-colors duration-200" href="#areas">
              {isEn ? '4 Areas' : '4 Áreas'}
            </a>
            <a className="hover:text-white transition-colors duration-200" href="#metodo">
              {isEn ? 'The Method' : 'O Método'}
            </a>
            <a className="hover:text-[#B8FF00] font-semibold transition-colors duration-200" href="#planos">
              {isEn ? 'Plans & Pricing' : 'Planos & Assinatura'}
            </a>
            <a className="hover:text-white transition-colors duration-200" href="#faq">
              {isEn ? 'FAQ' : 'Dúvidas Frequentes'}
            </a>
          </nav>

          {/* Right Action: CTA, Language & Mobile Hamburger */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            <LanguageSwitcher />

            {/* Pro CTA Button */}
            <a
              href="#planos"
              onClick={() => handleCtaClick('navbar_pro')}
              className="bg-[#B8FF00] hover:bg-[#a5e600] active:scale-95 text-[#060709] text-[11px] sm:text-[12px] font-extrabold tracking-wider uppercase px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-200 flex items-center space-x-1.5 shadow-[0_0_15px_rgba(184,255,0,0.25)] flex-shrink-0"
            >
              <span>{isEn ? 'GET PRO' : 'ASSINAR PRO'}</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#1e2329] border border-white/10 text-neutral-300 hover:text-white focus:outline-none active:scale-95 transition-transform"
              aria-label={mobileMenuOpen ? (isEn ? 'Close Menu' : 'Fechar Menu') : (isEn ? 'Open Menu' : 'Abrir Menu')}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Modal */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-[#090c10]/98 border-b border-white/15 px-4 xs:px-5 py-5 shadow-2xl backdrop-blur-2xl flex flex-col space-y-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain">
          <a
            href="#visao"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-2 border-b border-white/5 flex items-center justify-between transition-colors"
          >
            <span>{isEn ? 'Long-Term Vision' : 'Visão de Longo Prazo'}</span>
            <span className="text-xs font-mono text-neutral-500">01</span>
          </a>
          <a
            href="#ciclos"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-2 border-b border-white/5 flex items-center justify-between transition-colors"
          >
            <span>{isEn ? 'Weekly Cycles' : 'Ciclos Semanais'}</span>
            <span className="text-xs font-mono text-neutral-500">02</span>
          </a>
          <a
            href="#areas"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-2 border-b border-white/5 flex items-center justify-between transition-colors"
          >
            <span>{isEn ? 'The 4 Life Areas' : 'As 4 Áreas da Vida'}</span>
            <span className="text-xs font-mono text-neutral-500">03</span>
          </a>
          <a
            href="#metodo"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-2 border-b border-white/5 flex items-center justify-between transition-colors"
          >
            <span>{isEn ? 'The Non-Punitive Method' : 'O Método Sem Punição'}</span>
            <span className="text-xs font-mono text-neutral-500">04</span>
          </a>
          <a
            href="#planos"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-semibold text-[#B8FF00] hover:text-white py-2 border-b border-white/5 flex items-center justify-between transition-colors"
          >
            <span>{isEn ? 'Plans & Pricing' : 'Planos & Assinatura'}</span>
            <span className="text-xs font-mono text-[#B8FF00]">05</span>
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-2 flex items-center justify-between transition-colors"
          >
            <span>{isEn ? 'Frequently Asked Questions' : 'Perguntas Frequentes'}</span>
            <span className="text-xs font-mono text-neutral-500">06</span>
          </a>

          <div className="pt-2 pb-2">
            <a
              href="#planos"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#B8FF00] hover:bg-[#a6e600] text-[#060709] font-extrabold text-xs uppercase py-3.5 rounded-full flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(184,255,0,0.3)] active:scale-95 transition-all"
            >
              <span>{isEn ? 'GET PRO NOW' : 'ASSINAR PRO AGORA'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
