'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import { trackMarketingEvent } from '@/lib/analytics';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCtaClick = (ctaName: string) => {
    trackMarketingEvent('hero_cta_clicked', { location: 'navbar', cta_name: ctaName });
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-200">
      {/* Container with backdrop blur */}
      <div className="bg-[#060709]/85 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-14 h-16 sm:h-20 flex items-center justify-between">
          {/* Official White SVG Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2.5 sm:gap-3 text-white group focus:outline-none flex-shrink-0"
            aria-label="Trajetta Home"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center flex-shrink-0">
              <img
                src="/trajetta-logo.svg"
                alt="Trajetta Logo"
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] transition-transform duration-200 group-hover:scale-105"
              />
            </div>
            <span className="font-bold text-[14px] sm:text-[15px] tracking-[0.16em] uppercase text-white select-none">
              TRAJETTA
            </span>
          </Link>

          {/* Center Nav Links Pill (Desktop only) */}
          <nav className="hidden md:flex items-center bg-[#151921]/80 backdrop-blur-md rounded-full px-6 py-2.5 border border-white/10 text-[13px] font-medium text-neutral-300 space-x-7 shadow-xl">
            <a className="hover:text-white transition-colors duration-150" href="#visao">Visão</a>
            <a className="hover:text-white transition-colors duration-150" href="#ciclos">Ciclos</a>
            <a className="hover:text-white transition-colors duration-150" href="#areas">4 Áreas</a>
            <a className="hover:text-white transition-colors duration-150" href="#metodo">O Método</a>
            <a className="hover:text-[#B8FF00] transition-colors duration-150" href="#waitlist">Lista VIP</a>
          </nav>

          {/* Right Action: Waitlist CTA & Mobile Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Waitlist Signup CTA Button */}
            <a
              href="#waitlist"
              onClick={() => handleCtaClick('navbar_waitlist')}
              className="bg-white hover:bg-neutral-100 active:scale-95 text-black text-[11px] sm:text-xs font-bold tracking-wider uppercase px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-150 flex items-center gap-1.5 shadow-md shadow-white/5 flex-shrink-0"
            >
              <span>LISTA VIP</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </a>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#151921] border border-white/10 text-neutral-300 hover:text-white focus:outline-none flex-shrink-0 active:scale-95 transition-transform"
              aria-label={mobileMenuOpen ? 'Fechar Menu' : 'Abrir Menu'}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown Modal */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-[#090c10]/98 border-b border-white/10 px-5 py-6 shadow-2xl backdrop-blur-2xl flex flex-col space-y-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <a
            href="#visao"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-1.5 border-b border-white/5 flex items-center justify-between"
          >
            <span>Visão de Longo Prazo</span>
            <span className="text-xs font-mono text-neutral-500">01</span>
          </a>
          <a
            href="#ciclos"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-1.5 border-b border-white/5 flex items-center justify-between"
          >
            <span>Ciclos Semanais</span>
            <span className="text-xs font-mono text-neutral-500">02</span>
          </a>
          <a
            href="#areas"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-1.5 border-b border-white/5 flex items-center justify-between"
          >
            <span>As 4 Áreas da Vida</span>
            <span className="text-xs font-mono text-neutral-500">03</span>
          </a>
          <a
            href="#metodo"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-1.5 border-b border-white/5 flex items-center justify-between"
          >
            <span>O Método Sem Punição</span>
            <span className="text-xs font-mono text-neutral-500">04</span>
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-1.5 flex items-center justify-between"
          >
            <span>Perguntas Frequentes</span>
            <span className="text-xs font-mono text-neutral-500">05</span>
          </a>

          <div className="pt-3">
            <a
              href="#waitlist"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-white hover:bg-neutral-100 text-black font-bold text-xs uppercase py-3.5 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-white/5 active:scale-95 transition-all"
            >
              <span>GARANTIR VAGA NA LISTA VIP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
