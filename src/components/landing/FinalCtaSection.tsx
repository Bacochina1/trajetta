'use client';

import React from 'react';
import Link from 'next/link';
import { appendUtmToUrl, trackMarketingEvent } from '@/lib/analytics';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export function FinalCtaSection() {
  const handleCta = () => {
    trackMarketingEvent('hero_cta_clicked', { location: 'final_cta', text: 'Começar 14 dias grátis' });
  };

  return (
    <section className="py-24 sm:py-32 bg-[#060709] relative overflow-hidden text-center">
      {/* Subtle radial ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#B8FF00]/[0.08] to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6 sm:space-y-8">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F2F1ED] tracking-tight leading-tight">
          Seu futuro não precisa começar de novo toda segunda-feira.
        </h2>

        <p className="text-base sm:text-lg text-[#8E9499] max-w-xl mx-auto leading-relaxed">
          Comece sua primeira semana na Trajetta e torne visível a vida que você está construindo.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={appendUtmToUrl('/register')}
            onClick={handleCta}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold bg-[#B8FF00] text-[#060709] hover:bg-[#c6ff24] shadow-[0_0_35px_rgba(184,255,0,0.35)] transition-all transform active:scale-95"
          >
            <span>Começar 14 dias grátis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#8E9499]">
          <span>14 dias de teste completo</span>
          <span>•</span>
          <span>Sem cartão no início</span>
          <span>•</span>
          <span>Cancele quando quiser</span>
        </div>
      </div>
    </section>
  );
}
