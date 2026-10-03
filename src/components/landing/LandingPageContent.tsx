'use client';

import React, { useEffect } from 'react';
import { captureUtmParams, initScrollDepthTracking, trackMarketingEvent } from '@/lib/analytics';
import { I18nProvider, useI18n } from '@/lib/i18n/context';
import { Locale } from '@/lib/i18n/types';

import { Navbar } from '@/components/landing/Navbar';
import { HeroSection } from '@/components/landing/HeroSection';
import { SubHeaderSection } from '@/components/landing/SubHeaderSection';
import { FeatureCardsGrid } from '@/components/landing/FeatureCardsGrid';
import { LifeAreasSection } from '@/components/landing/LifeAreasSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { PricingSection } from '@/components/landing/PricingSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { Footer } from '@/components/landing/Footer';
import { PwaManager } from '@/components/pwa/PwaManager';

interface LandingPageContentProps {
  forcedLocale?: Locale;
}

function InnerLandingContent() {
  const { locale, t } = useI18n();

  useEffect(() => {
    captureUtmParams();

    trackMarketingEvent('page_view', {
      title: t.metadata.title,
      locale,
      referrer: document.referrer || 'direct',
      mode: 'waitlist_only',
    });

    const cleanupScroll = initScrollDepthTracking();
    return () => {
      if (cleanupScroll) cleanupScroll();
    };
  }, [locale, t]);

  return (
    <div className="min-h-screen bg-[#060709] text-[#ffffff] selection:bg-[#B8FF00] selection:text-[#060709] font-sans antialiased overflow-x-hidden">
      {/* PWA Manager */}
      <PwaManager />

      {/* 1. Floating Capsule Navbar with Language Switcher */}
      <Navbar />

      {/* Main Content Sections */}
      <main id="main-content" className="relative z-10 flex flex-col">
        {/* 2. Hero Section */}
        <HeroSection />

        {/* 3. Sub-Section Transition Header */}
        <SubHeaderSection />

        {/* 4. Feature Cards Grid */}
        <FeatureCardsGrid />

        {/* 5. As 4 Áreas da Vida */}
        <LifeAreasSection />

        {/* 6. Como Funciona */}
        <HowItWorksSection />

        {/* 7. Card de Venda com 3 Dias de Degustação Gratuita (Checkout Stripe Seguro) */}
        <PricingSection />

        {/* 8. Perguntas Frequentes */}
        <FaqSection />
      </main>

      {/* 9. Minimalist Dark Footer */}
      <Footer />
    </div>
  );
}

export function LandingPageContent({ forcedLocale }: LandingPageContentProps) {
  if (forcedLocale) {
    return (
      <I18nProvider initialLocale={forcedLocale}>
        <InnerLandingContent />
      </I18nProvider>
    );
  }

  return <InnerLandingContent />;
}
