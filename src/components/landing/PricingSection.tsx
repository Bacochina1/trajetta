'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { appendUtmToUrl, trackMarketingEvent } from '@/lib/analytics';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const handlePlanClick = (planName: string) => {
    trackMarketingEvent('plan_selected', { plan: planName, billing: billingCycle });
    trackMarketingEvent('trial_started', { plan: planName });
  };

  const proFeatures = [
    'Acesso irrestrito às 4 Áreas da Vida (Corpo, Dinheiro, Carreira, Vida)',
    'Planejamento semanal inteligente com capacity planning',
    'Hábitos com Piso Mínimo e Volume Acumulado (zero streaks punitivos)',
    'Weekly Review com snapshot imutável de aprendizados',
    'Timeline histórica com marcos, memórias e conquistas',
    'Trajetta AI ilimitada com memória viva de contexto',
    'Exportação de dados total em JSON e CSV a qualquer momento',
  ];

  return (
    <section id="planos" className="py-20 sm:py-28 bg-[#060709] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8FF00]">
            Investimento na Sua Trajetória
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F1ED] tracking-tight">
            Comece agora com 14 dias grátis.
          </h2>
          <p className="text-sm sm:text-base text-[#8E9499] leading-relaxed">
            Experimente a experiência completa sem fricção. Cancele quando quiser diretamente no painel.
          </p>

          {/* Billing Switcher */}
          <div className="inline-flex items-center p-1.5 rounded-xl bg-[#14181F] border border-white/8 mt-4 max-w-full">
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                billingCycle === 'monthly'
                  ? 'bg-[#B8FF00] text-[#060709]'
                  : 'text-[#8E9499] hover:text-[#F2F1ED]'
              }`}
            >
              Mensal
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`px-3.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 min-h-[36px] ${
                billingCycle === 'annual'
                  ? 'bg-[#B8FF00] text-[#060709]'
                  : 'text-[#8E9499] hover:text-[#F2F1ED]'
              }`}
            >
              <span>Anual</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-[#060709] text-[#B8FF00]">
                -33%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto items-stretch">
          {/* Plan: Trajetta Pro Mensal */}
          <div className="p-5 sm:p-8 rounded-3xl bg-[#0D0F10] border border-white/8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-bold text-[#F2F1ED]">Trajetta Pro Mensal</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#171B20] text-[#8E9499] font-mono">
                  Flexibilidade
                </span>
              </div>
              <p className="text-xs text-[#8E9499] leading-relaxed">
                Ideal para quem deseja testar mês a mês com total flexibilidade de cancelamento.
              </p>
              <div className="pt-2 flex items-baseline gap-1">
                <span className="text-xs text-[#8E9499]">R$</span>
                <span className="text-3xl sm:text-4xl font-extrabold text-[#F2F1ED]">29,90</span>
                <span className="text-xs text-[#8E9499]">/mês</span>
              </div>
              <div className="text-[11px] text-[#B8FF00] font-semibold">
                ✓ 14 dias de teste gratuito inclusos
              </div>
            </div>

            <ul className="space-y-3 pt-4 border-t border-white/8 flex-1">
              {proFeatures.slice(0, 5).map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#C9CDD1]">
                  <Check className="w-3.5 h-3.5 text-[#B8FF00] flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <Link
              href={appendUtmToUrl('/register')}
              onClick={() => handlePlanClick('Pro Mensal')}
              className="w-full inline-flex items-center justify-center gap-2 min-h-[44px] py-3.5 rounded-xl text-xs font-bold bg-[#171B20] text-[#F2F1ED] border border-white/10 hover:border-[#B8FF00]/40 hover:bg-[#1E232A] transition-all"
            >
              <span>Começar 14 dias grátis</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Plan: Trajetta Pro Anual (Highlighted as requested) */}
          <div className="p-5 sm:p-8 rounded-3xl bg-[#0D0F10] border-2 border-[#B8FF00]/60 relative flex flex-col justify-between space-y-6 shadow-[0_0_50px_rgba(184,255,0,0.12)]">
            {/* Top Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-[#B8FF00] text-[#060709] text-[11px] font-extrabold tracking-tight uppercase shadow-md whitespace-nowrap">
              Melhor Custo-Benefício
            </div>

            <div className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#F2F1ED]">Trajetta Pro Anual</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#B8FF00]/15 text-[#B8FF00] font-mono font-bold">
                  Economia de 33%
                </span>
              </div>
              <p className="text-xs text-[#8E9499] leading-relaxed">
                Um ano inteiro de evolução contínua pelo equivalente a menos de R$ 0,66 por dia.
              </p>
              <div className="pt-2 flex items-baseline gap-1">
                <span className="text-xs text-[#8E9499]">R$</span>
                <span className="text-4xl font-extrabold text-[#F2F1ED]">19,99</span>
                <span className="text-xs text-[#8E9499]">/mês equivalente</span>
              </div>
              <div className="text-[11px] text-[#8E9499]">
                Cobrado anualmente: <strong className="text-[#F2F1ED]">R$ 239,90/ano</strong> após os 14 dias de teste grátis.
              </div>
            </div>

            <ul className="space-y-3 pt-4 border-t border-white/8 flex-1">
              {proFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#F2F1ED]">
                  <Check className="w-3.5 h-3.5 text-[#B8FF00] flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <Link
              href={appendUtmToUrl('/register')}
              onClick={() => handlePlanClick('Pro Anual')}
              className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-bold bg-[#B8FF00] text-[#060709] hover:bg-[#c6ff24] shadow-[0_0_25px_rgba(184,255,0,0.35)] transition-all transform active:scale-95"
            >
              <span>Começar 14 dias grátis</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Temporary Founding Members Section */}
        <div className="mt-14 max-w-4xl mx-auto p-6 sm:p-7 rounded-2xl bg-[#0D0F10] border border-white/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B8FF00] animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#B8FF00]">
                Programa de Fundadores
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold text-[#F2F1ED]">
              Faça parte dos primeiros usuários da Trajetta.
            </h4>
            <p className="text-xs text-[#8E9499]">
              Garante prioridade nos novos recursos, canal direto com os fundadores e suporte VIP vitalício.
            </p>
          </div>
          <Link
            href={appendUtmToUrl('/register')}
            onClick={() => handlePlanClick('Founding Member')}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#171B20] text-[#F2F1ED] border border-white/15 hover:border-[#B8FF00]/40 transition-all"
          >
            Entrar como Fundador
          </Link>
        </div>
      </div>
    </section>
  );
}
