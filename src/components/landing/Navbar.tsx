'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight } from 'lucide-react';
import { trackMarketingEvent } from '@/lib/analytics';

export function Navbar() {
  const [open, setOpen] = useState(false);

  const track = (name: string) =>
    trackMarketingEvent('cta_clicked', { location: 'navbar', cta_name: name });

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="bg-[#060709]/90 backdrop-blur-xl border-b border-white/[0.07]">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between gap-4">

          {/* Logo lockup */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 group focus:outline-none"
            aria-label="Trajetta — início"
          >
            <img
              src="/trajetta-logo-transparent.png"
              alt="Trajetta"
              className="w-7 h-7 object-contain flex-shrink-0 transition-opacity duration-150 group-hover:opacity-80"
            />
            <span className="font-bold text-[13px] sm:text-[14px] tracking-[0.14em] uppercase text-white select-none">
              TRAJETTA
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-[13px] font-medium text-neutral-400">
            <a href="#visao" className="hover:text-white transition-colors">Visão</a>
            <a href="#ciclos" className="hover:text-white transition-colors">Ciclos</a>
            <a href="#areas" className="hover:text-white transition-colors">4 Áreas</a>
            <a href="#metodo" className="hover:text-white transition-colors">Método</a>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <a
              href="#waitlist"
              onClick={() => track('navbar_waitlist')}
              className="bg-white hover:bg-neutral-100 active:scale-95 text-black text-[11px] sm:text-[12px] font-bold tracking-[0.1em] uppercase px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-150 flex items-center gap-1.5"
            >
              <span>Lista VIP</span>
              <ArrowRight className="w-3 h-3" aria-hidden />
            </a>

            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-neutral-300 hover:text-white focus:outline-none active:scale-95 transition-all"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={open}
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden fixed inset-x-0 top-14 z-40 bg-[#07090c]/98 backdrop-blur-2xl border-b border-white/10"
          role="dialog"
          aria-label="Menu de navegação"
        >
          <nav className="flex flex-col px-5 pt-5 pb-6 gap-0">
            {[
              { href: '#visao',    label: 'Visão de Longo Prazo',   n: '01' },
              { href: '#ciclos',   label: 'Ciclos Semanais',        n: '02' },
              { href: '#areas',    label: 'As 4 Áreas da Vida',     n: '03' },
              { href: '#metodo',   label: 'O Método Sem Punição',   n: '04' },
              { href: '#faq',      label: 'Perguntas Frequentes',   n: '05' },
            ].map(({ href, label, n }) => (
              <a
                key={href}
                href={href}
                onClick={close}
                className="flex items-center justify-between py-3.5 border-b border-white/[0.06] text-sm font-medium text-neutral-300 hover:text-white transition-colors"
              >
                <span>{label}</span>
                <span className="text-[11px] font-mono text-neutral-600">{n}</span>
              </a>
            ))}

            <div className="pt-4">
              <a
                href="#waitlist"
                onClick={() => { track('mobile_nav_waitlist'); close(); }}
                className="flex items-center justify-center gap-2 w-full bg-white hover:bg-neutral-100 active:scale-95 text-black font-bold text-[12px] tracking-[0.1em] uppercase py-3.5 rounded-full transition-all shadow-lg"
              >
                <span>GARANTIR VAGA NA LISTA VIP</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
