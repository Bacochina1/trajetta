'use client';

import React, { useEffect } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { captureUtmParams, initScrollDepthTracking, trackMarketingEvent } from '@/lib/analytics';

// Modular Landing Sections
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { PainSection } from '@/components/landing/PainSection';
import { MethodSection } from '@/components/landing/MethodSection';
import { ProductCycleSection } from '@/components/landing/ProductCycleSection';
import { TimelineSection } from '@/components/landing/TimelineSection';
import { TrajettaAiSection } from '@/components/landing/TrajettaAiSection';
import { NonPunitiveSection } from '@/components/landing/NonPunitiveSection';
import { LifeAreasSection } from '@/components/landing/LifeAreasSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { AudienceSection } from '@/components/landing/AudienceSection';
import { SocialProofSection } from '@/components/landing/SocialProofSection';
import { PrivacySection } from '@/components/landing/PrivacySection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { FinalCtaSection } from '@/components/landing/FinalCtaSection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  const { isAuthenticated, user } = useTrajetta();

  useEffect(() => {
    // 1. Capture and persist UTM parameters across funnel
    captureUtmParams();

    // 2. Track initial landing view
    trackMarketingEvent('page_view', {
      title: 'Trajetta — Seu Sistema Pessoal de Evolução',
      referrer: document.referrer || 'direct',
    });

    // 3. Initialize scroll depth tracking (25%, 50%, 75%, 100%)
    const cleanupScroll = initScrollDepthTracking();
    return () => {
      if (cleanupScroll) cleanupScroll();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#060709] text-[#F2F1ED] selection:bg-[#B8FF00] selection:text-[#060709] font-sans">
      {/* 1. Sticky Navigation */}
      <Navbar isAuthenticated={isAuthenticated} user={user} />

      {/* Main Content Sections in Canonical Flow */}
      <main id="main-content">
        {/* 2. Hero: Headline, Subheadline, CTA, Evidence */}
        <HeroSection />

        {/* 3. Pain / Identification: Viver no automático, esquecer metas, recomeçar */}
        <PainSection />

        {/* 4. O Método Trajetta: Direção -> Semana -> Ação -> Reflexão -> Ajuste -> Evolução */}
        <MethodSection />

        {/* 5. O Ciclo do Produto: Uma semana por vez (Hoje, Semana, Hábitos, Review) */}
        <ProductCycleSection />

        {/* 6. Timeline em Destaque: Outro app mostra sua lista; Trajetta mostra o caminho */}
        <TimelineSection />

        {/* 7. Trajetta AI: Memória ativa de contexto & Diálogo exemplar com botões */}
        <TrajettaAiSection />

        {/* 8. Filosofia de Não-Punição: Você não precisa voltar para o zero */}
        <NonPunitiveSection />

        {/* 9. As 4 Áreas Essenciais: Corpo, Dinheiro, Carreira, Vida */}
        <LifeAreasSection />

        {/* 10. Como Funciona em 3 Passos Simples */}
        <HowItWorksSection />

        {/* 11. Para Quem É / Para Quem Não É */}
        <AudienceSection />

        {/* 12. Prova de Confiança: Primeiros Usuários */}
        <SocialProofSection />

        {/* 13. Soberania e Privacidade dos Dados: Sua trajetória continua sendo sua */}
        <PrivacySection />

        {/* 14. Precificação: 14 dias grátis, Pro Mensal R$ 29,90, Pro Anual R$ 239,90 e Fundadores */}
        <PricingSection />

        {/* 15. FAQ com Objeções Reais */}
        <FaqSection />

        {/* 16. CTA Final: Seu futuro não precisa começar de novo toda segunda-feira */}
        <FinalCtaSection />
      </main>

      {/* 17. Rodapé */}
      <Footer />
    </div>
  );
}
