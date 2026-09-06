'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { TrajettaLogo } from '@/components/ui/TrajettaLogo';
import { appendUtmToUrl, trackMarketingEvent } from '@/lib/analytics';
import { Menu, X, ArrowRight, User } from 'lucide-react';

interface NavbarProps {
  isAuthenticated?: boolean;
  user?: { name?: string; email?: string } | null;
}

export function Navbar({ isAuthenticated, user }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCtaClick = (ctaName: string) => {
    trackMarketingEvent('hero_cta_clicked', { location: 'navbar', cta_name: ctaName });
  };

  const navLinks = [
    { label: 'O Método', href: '#metodo' },
    { label: 'O Ciclo', href: '#ciclo' },
    { label: 'Timeline', href: '#timeline' },
    { label: 'Trajetta AI', href: '#ia' },
    { label: 'Planos', href: '#planos' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#060709]/80 backdrop-blur-xl border-b border-white/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <TrajettaLogo size={28} showWordmark wordmarkClassName="font-extrabold text-lg tracking-tight text-[#F2F1ED] group-hover:text-white transition-colors" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Navegação Principal">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs lg:text-sm font-medium text-[#8E9499] hover:text-[#F2F1ED] transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B8FF00] rounded-md px-1 py-0.5"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          {isAuthenticated ? (
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#171B20] text-[#F2F1ED] border border-white/10 hover:border-[#B8FF00]/40 hover:bg-[#1E232A] transition-all"
            >
              <User className="w-3.5 h-3.5 text-[#B8FF00]" />
              <span className="truncate max-w-[120px]">{user?.name || 'Meu Painel'}</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-medium text-[#8E9499] hover:text-[#F2F1ED] transition-colors px-3 py-2"
              >
                Entrar
              </Link>
              <Link
                href={appendUtmToUrl('/register')}
                onClick={() => handleCtaClick('Começar 14 dias grátis')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#B8FF00] text-[#060709] hover:bg-[#c6ff24] hover:shadow-[0_0_20px_rgba(184,255,0,0.3)] transition-all transform active:scale-95"
              >
                <span>Começar 14 dias grátis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          type="button"
          aria-expanded={mobileMenuOpen}
          aria-label="Abrir menu de navegação"
          className="sm:hidden min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg bg-[#14181F] text-[#8E9499] hover:text-white border border-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8FF00] active:scale-95 transition-transform"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#0D0F10] border-b border-white/10 px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-medium text-[#8E9499] hover:text-[#B8FF00] min-h-[42px] flex items-center px-3 rounded-lg hover:bg-white/[0.03] transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="pt-3 border-t border-white/8 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center min-h-[44px] flex items-center justify-center text-xs font-semibold text-[#8E9499] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Já tenho conta (Entrar)
            </Link>
            <Link
              href={appendUtmToUrl('/register')}
              onClick={() => {
                setMobileMenuOpen(false);
                handleCtaClick('Começar 14 dias grátis - mobile');
              }}
              className="w-full inline-flex items-center justify-center gap-2 min-h-[48px] py-3 rounded-xl text-xs font-bold bg-[#B8FF00] text-[#060709] shadow-[0_0_20px_rgba(184,255,0,0.25)] active:scale-95 transition-transform"
            >
              <span>Começar 14 dias grátis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
