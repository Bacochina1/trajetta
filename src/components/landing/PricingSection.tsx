'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { appendUtmToUrl, trackMarketingEvent } from '@/lib/analytics';
import { Check, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export function PricingSection() {
  const { locale } = useI18n();
  const isEn = locale === 'en';
  const [loadingPlan, setLoadingPlan] = useState(false);

  const handleStartCheckout = async () => {
    trackMarketingEvent('plan_selected', { plan: 'monthly', billing: 'monthly', locale });
    trackMarketingEvent('trial_started', { plan: 'monthly', locale });

    try {
      setLoadingPlan(true);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'monthly' }),
      });
      const data = await res.json();
      if (data.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      window.location.href = appendUtmToUrl('/register');
    } catch (e) {
      console.warn('Checkout redirection fallback:', e);
      window.location.href = appendUtmToUrl('/register');
    } finally {
      setLoadingPlan(false);
    }
  };

  const proFeaturesPt = [
    'Acesso irrestrito às 4 Áreas da Vida (Corpo, Dinheiro, Carreira e Vida Pessoal)',
    'Trajetta AI ilimitada com memória viva e contexto longitudinal dos seus ciclos',
    'Planejamento semanal inteligente com capacity planning (máx. 3 prioridades)',
    'Hábitos com Piso Mínimo e Volume Acumulado (zero streaks punitivos)',
    'Weekly Review guiado de domingo com snapshot imutável de aprendizados',
    'Timeline histórica com marcos, memórias e conquistas permanentes',
    'Cancelamento instantâneo em 1 clique direto no seu painel ou na Stripe',
    'Exportação de dados total em JSON e CSV a qualquer momento',
  ];

  const proFeaturesEn = [
    'Unrestricted access to 4 Life Areas (Body, Money, Career, and Personal Life)',
    'Unlimited Trajetta AI with living memory and longitudinal cycle context',
    'Smart weekly planning with capacity management (max 3 priorities)',
    'Habits with Minimum Floor & Cumulative Volume (zero punitive streaks)',
    'Guided Sunday Review with immutable debrief snapshots',
    'Historical timeline with milestones, reflections, and permanent wins',
    'Instant 1-click cancellation directly in your dashboard or Stripe',
    'Full personal data export in JSON and CSV anytime',
  ];

  const proFeatures = isEn ? proFeaturesEn : proFeaturesPt;

  return (
    <section id="planos" className="py-20 sm:py-32 bg-[#060709] relative overflow-hidden">
      {/* Background Calm Power Atmosphere: 4K Rendered Architectural Canvas with Lime Glow */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <img
          src="/trajetta-pricing-bg.jpg"
          alt={isEn ? "Trajetta Pro Atmosphere" : "Atmosfera Trajetta Pro"}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover opacity-35 pointer-events-none mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-[#060709]/80 to-[#060709]/90" />
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[850px] h-[500px] bg-[#B8FF00]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#14181F] border border-[#B8FF00]/30 shadow-[0_0_15px_rgba(184,255,0,0.1)]">
            <span className="w-2 h-2 rounded-full bg-[#B8FF00] animate-pulse" />
            <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-[#B8FF00]">
              {isEn ? 'Investment in Your Trajectory' : 'Investimento na Sua Trajetória'}
            </span>
          </div>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-semibold text-[#F2F1ED] tracking-tight [text-wrap:balance]">
            {isEn ? 'Invest in your evolution with ' : 'Invista na sua evolução com o '}
            <span className="text-[#B8FF00]">Trajetta Pro</span>.
          </h2>

          <p className="text-sm sm:text-base text-[#8E9499] leading-relaxed max-w-xl mx-auto font-normal [text-wrap:pretty]">
            {isEn
              ? 'Unrestricted access to all tools. Plan your week, test Trajetta AI, and experience true mental clarity. Cancel with 1 click anytime.'
              : 'Acesso irrestrito a todas as ferramentas. Planeje sua semana, teste a Trajetta AI e viva a clareza mental do seu sistema de vida. Cancele com 1 clique a qualquer momento.'}
          </p>
        </div>

        {/* Centerpiece Luxury Monthly Pricing Card */}
        <div className="max-w-xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#0F131A] via-[#0A0D12] to-[#07090C] border border-[#B8FF00]/40 p-6 sm:p-10 shadow-[0_0_50px_rgba(184,255,0,0.12)] flex flex-col justify-between space-y-8 backdrop-blur-xl">
            {/* Top Monumental Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#B8FF00] text-[#060709] text-[11px] font-semibold tracking-tight uppercase shadow-[0_0_15px_rgba(184,255,0,0.3)] whitespace-nowrap flex items-center gap-1.5">
              <Zap size={13} className="fill-[#060709] text-[#060709]" />
              <span>{isEn ? 'Immediate Access • Full Unlocked' : 'Liberação Imediata • Acesso Completo'}</span>
            </div>

            {/* Plan Header & Pricing */}
            <div className="space-y-5 pt-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#B8FF00]/15 border border-[#B8FF00]/30 flex items-center justify-center text-[#B8FF00]">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-[#F2F1ED] tracking-tight">
                      {isEn ? 'Trajetta Pro Monthly' : 'Trajetta Pro Mensal'}
                    </h3>
                    <p className="text-xs text-[#8E9499] font-normal">
                      {isEn ? 'Total month-to-month flexibility. No commitments or lock-ins.' : 'Total flexibilidade mês a mês. Sem fidelidade ou amarras.'}
                    </p>
                  </div>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-[#B8FF00]/15 border border-[#B8FF00]/30 text-[#B8FF00] font-mono font-medium">
                  {isEn ? 'Full Access' : 'Acesso Completo'}
                </span>
              </div>

              {/* Price Display */}
              <div className="p-4 rounded-2xl bg-[#12161E]/90 border border-white/8 flex items-baseline justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-sm font-semibold text-[#8E9499]">R$</span>
                    <span className="text-4xl sm:text-5xl font-semibold text-[#F2F1ED] tracking-tight">29,90</span>
                    <span className="text-xs font-mono text-[#8E9499]">{isEn ? '/mo' : '/mês'}</span>
                  </div>
                  <p className="text-[11px] text-[#B8FF00] font-medium mt-1">
                    {isEn ? '✓ Immediate access unlocked right after confirmation' : '✓ Acesso imediato liberado logo após confirmação'}
                  </p>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest block">
                    {isEn ? 'Guarantee' : 'Garantia'}
                  </span>
                  <span className="text-xs text-neutral-200 font-normal">
                    {isEn ? '1-click cancel' : 'Cancelamento em 1 clique'}
                  </span>
                </div>
              </div>
            </div>

            {/* Feature Checklist */}
            <div className="space-y-3 pt-2 border-t border-white/8">
              <span className="text-[10.5px] font-mono uppercase tracking-wider text-neutral-400 block mb-3 font-medium">
                {isEn ? 'Everything included in your plan:' : 'Tudo o que está incluído no seu plano:'}
              </span>
              <ul className="space-y-3">
                {proFeatures.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-[13px] text-[#E0E2E5] leading-relaxed font-normal">
                    <div className="w-4 h-4 rounded-full bg-[#B8FF00]/15 border border-[#B8FF00]/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5 text-[#B8FF00]" />
                    </div>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA Conversion Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                disabled={loadingPlan}
                onClick={handleStartCheckout}
                className="w-full inline-flex items-center justify-center gap-2 py-4 sm:py-4.5 rounded-xl text-sm font-semibold bg-[#B8FF00] text-[#060709] hover:bg-[#c6ff24] shadow-[0_0_25px_rgba(184,255,0,0.25)] transition-all transform active:scale-95 disabled:opacity-50 cursor-pointer uppercase tracking-wider"
              >
                {loadingPlan ? (
                  <span className="flex items-center gap-2 text-[#060709]">
                    <span className="w-4 h-4 rounded-full border-2 border-[#060709] border-t-transparent animate-spin" />
                    {isEn ? 'Opening secure Stripe checkout...' : 'Abrindo checkout seguro da Stripe...'}
                  </span>
                ) : (
                  <>
                    <span>{isEn ? 'Get Trajetta Pro Now' : 'Assinar Trajetta Pro Agora'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <Link
                  href={appendUtmToUrl('/register')}
                  className="text-xs text-[#8E9499] hover:text-[#B8FF00] transition-colors underline underline-offset-4 font-normal"
                >
                  {isEn
                    ? 'Prefer to sign up without a card first? Create quick account'
                    : 'Ou prefere se cadastrar sem cartão primeiro? Criar conta rápida'}
                </Link>
              </div>

              {/* Trust Badges Row */}
              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] font-mono text-neutral-400 pt-3 border-t border-white/5 font-normal">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={14} className="text-[#B8FF00]" />
                  {isEn ? 'Secure Stripe Checkout' : 'Pagamento Seguro via Stripe'}
                </span>
                <span>•</span>
                <span>{isEn ? '7-day guarantee' : 'Garantia de 7 dias CDC'}</span>
                <span>•</span>
                <span>{isEn ? 'Zero lock-in' : 'Zero fidelidade'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
