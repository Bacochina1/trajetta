'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowRight, User, Sparkles } from 'lucide-react';
import { trackMarketingEvent } from '@/lib/analytics';

interface NavbarProps {
  isAuthenticated?: boolean;
  user?: { name?: string; email?: string } | null;
}

export function Navbar({ isAuthenticated, user }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCtaClick = (ctaName: string) => {
    trackMarketingEvent('hero_cta_clicked', { location: 'navbar', cta_name: ctaName });
  };

  return (
    <header className="sticky top-0 z-50 max-w-[1440px] w-full mx-auto px-4 sm:px-10 lg:px-14 pt-4 sm:pt-6 flex items-center justify-between pointer-events-auto">
      {/* Brand Logo with Concentric Trajetta Emblem */}
      <Link href="/" className="flex items-center space-x-3 text-white tracking-wider group focus:outline-none">
        <span className="w-7 h-7 flex items-center justify-center text-white group-hover:scale-105 transition-transform">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeOpacity="0.3"></circle>
            <circle cx="12" cy="12" r="6.5" strokeOpacity="0.65"></circle>
            <circle cx="12" cy="12" r="3" strokeOpacity="1" fill="#B8FF00" fillOpacity="0.9"></circle>
          </svg>
        </span>
        <span className="font-bold text-[15px] tracking-[0.18em] text-white">TRAJETTA</span>
      </Link>

      {/* Navigation & Action Buttons */}
      <div className="flex items-center space-x-2.5 sm:space-x-3">
        {/* Center Nav Links Pill (Desktop) */}
        <nav className="hidden md:flex items-center bg-[#1e2329]/80 backdrop-blur-md rounded-full px-6 py-2.5 border border-white/10 text-[13px] font-medium text-neutral-300 space-x-7 shadow-2xl">
          <a className="hover:text-white transition-colors duration-200" href="#visao">Visão</a>
          <a className="hover:text-white transition-colors duration-200" href="#ciclos">Ciclos</a>
          <a className="hover:text-white transition-colors duration-200" href="#areas">4 Áreas</a>
          <a className="hover:text-white transition-colors duration-200" href="#metodo">O Método</a>
          <a className="hover:text-[#B8FF00] transition-colors duration-200" href="#waitlist">Lista VIP</a>
        </nav>

        {/* Waitlist Signup CTA Button */}
        <a
          href="#waitlist"
          onClick={() => handleCtaClick('navbar_waitlist')}
          className="bg-white hover:bg-neutral-100 text-black text-[11px] sm:text-[12px] font-bold tracking-wider uppercase px-4 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-200 flex items-center space-x-1.5 shadow-lg shadow-white/5 active:scale-95"
        >
          <span>LISTA VIP</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </a>

        {/* Login or Dashboard Button */}
        {isAuthenticated ? (
          <Link
            href="/app"
            className="bg-[#1e2329]/90 hover:bg-[#2a3038] text-white text-[11px] sm:text-[12px] font-semibold tracking-wider uppercase px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-white/10 transition-colors duration-200 flex items-center space-x-1.5"
          >
            <User className="w-3.5 h-3.5 text-[#B8FF00]" />
            <span className="hidden sm:inline truncate max-w-[90px]">{user?.name?.split(' ')[0] || 'Painel'}</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="bg-[#1e2329]/90 hover:bg-[#2a3038] text-white text-[11px] sm:text-[12px] font-semibold tracking-wider uppercase px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full border border-white/10 transition-colors duration-200"
          >
            LOGIN
          </Link>
        )}

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-full bg-[#1e2329]/90 border border-white/10 text-neutral-300 hover:text-white"
          aria-label="Abrir Menu"
        >
          {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-4 right-4 bg-[#0d1015]/95 border border-white/15 rounded-2xl p-5 shadow-2xl backdrop-blur-xl flex flex-col space-y-4 md:hidden z-50">
          <a
            href="#visao"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-1"
          >
            Visão
          </a>
          <a
            href="#ciclos"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-1"
          >
            Ciclos
          </a>
          <a
            href="#areas"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-1"
          >
            4 Áreas da Vida
          </a>
          <a
            href="#metodo"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-1"
          >
            O Método
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="text-sm font-medium text-neutral-300 hover:text-white py-1"
          >
            Perguntas Frequentes
          </a>
          <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
            <a
              href="#waitlist"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-white text-black font-bold text-xs uppercase py-3 rounded-full"
            >
              Entrar na Lista VIP
            </a>
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center bg-[#1e2329] text-white font-medium text-xs uppercase py-2.5 rounded-full border border-white/10"
            >
              Entrar na Conta
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
