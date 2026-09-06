'use client';

import React, { useEffect } from 'react';
import { captureUtmParams, initScrollDepthTracking, trackMarketingEvent } from '@/lib/analytics';

// MOSA AI Layout Sections (Waitlist-Only Conversion)
import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { SubHeaderSection } from '@/components/landing/SubHeaderSection';
import { FeatureCardsGrid } from '@/components/landing/FeatureCardsGrid';
import { LifeAreasSection } from '@/components/landing/LifeAreasSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { WaitlistSection } from '@/components/landing/WaitlistSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { Footer } from '@/components/landing/Footer';

export default function LandingPage() {
  useEffect(() => {
    // 1. Capture and persist UTM parameters across marketing funnel
    captureUtmParams();

    // 2. Track initial landing view
    trackMarketingEvent('page_view', {
      title: 'Trajetta — Seu Sistema Pessoal de Evolução',
      referrer: document.referrer || 'direct',
      mode: 'waitlist_only',
    });

    // 3. Initialize scroll depth tracking (25%, 50%, 75%, 100%)
    const cleanupScroll = initScrollDepthTracking();
    return () => {
      if (cleanupScroll) cleanupScroll();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#060709] text-[#ffffff] selection:bg-[#B8FF00] selection:text-[#060709] font-sans antialiased overflow-x-hidden">
      {/* 1. Floating Capsule Navbar */}
      <Navbar />

      {/* Main Content Sections */}
      <main id="main-content" className="relative z-10 flex flex-col">
        {/* 2. Hero Section: Cinematic mountains, luminous golden portal, flying silhouettes, headline, and waitlist CTAs */}
        <HeroSection />

        {/* 3. Sub-Section Transition Header: Introducing Message & Large Lead Typography */}
        <SubHeaderSection />

        {/* 4. Feature Cards Grid: 3 Atmospheric Cards (Ciclo Semanal, IA com Memória, Guia Silencioso) */}
        <FeatureCardsGrid />

        {/* 5. As 4 Áreas da Vida (Use Cases): Corpo, Dinheiro, Carreira, Mente com Abas Interativas */}
        <LifeAreasSection />

        {/* 6. Como Funciona: Mockup de Prompt Reflexivo e Stepper de 3 Passos */}
        <HowItWorksSection />

        {/* 7. Lista VIP / Acesso Antecipado: Formulário com Integração ManyChat + Resend e Vagas de Fundador (Sem checkout/preço!) */}
        <WaitlistSection />

        {/* 8. Perguntas Frequentes: Respostas diretas sobre a metodologia e o lote de convites */}
        <FaqSection />
      </main>

      {/* 9. Minimalist Dark Footer: Newsletter, 4 Colunas, Status do Sistema e Redes */}
      <Footer />
    </div>
  );
}
