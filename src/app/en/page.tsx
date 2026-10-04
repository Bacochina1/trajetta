import type { Metadata } from 'next';
import { LandingPageContent } from '@/components/landing/LandingPageContent';

export const metadata: Metadata = {
  title: 'Trajetta — Your Personal Growth & Habit System',
  description:
    'Plan your weeks, track sustainable habits and achieve goals across 4 life areas with a longitudinal AI coach that remembers your journey. Zero punitive streaks.',
  keywords: [
    'habit tracker app',
    'goal tracking app',
    'weekly planner app',
    'personal growth system',
    'calm productivity',
    'forgiving habit streaks',
    'weekly review framework',
    'routine planner',
    'non punitive habit tracker',
    'anti burnout productivity',
  ],
  category: 'productivity',
  classification: 'Personal Productivity, Habit Tracker, Anti-Burnout Growth, AI Coaching',
  alternates: {
    canonical: 'https://trajettacompany.com.br/en',
    languages: {
      en: 'https://trajettacompany.com.br/en',
      'pt-BR': 'https://trajettacompany.com.br',
      'x-default': 'https://trajettacompany.com.br',
    },
  },
  openGraph: {
    title: 'Trajetta — Your Personal Growth & Habit System',
    description:
      'Make visible who you are becoming. Plan for your real life, not your perfect version. Non-punitive habit & goal tracking.',
    url: 'https://trajettacompany.com.br/en',
    siteName: 'Trajetta',
    images: [
      {
        url: '/trajetta-real-app-mockup.jpg',
        width: 1200,
        height: 675,
        alt: 'Trajetta Pro — Habits, Life Score & Weekly Planning Dashboard',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trajetta — Your Personal Growth & Habit System',
    description:
      'The personal system for goals, habits, and weekly reflection built for real life — without fragile daily streaks.',
    images: ['/trajetta-real-app-mockup.jpg'],
  },
};

const jsonLdEn = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://trajettacompany.com.br/#organization',
      name: 'Trajetta Company',
      legalName: 'Trajetta Company',
      url: 'https://trajettacompany.com.br/en',
      logo: 'https://trajettacompany.com.br/trajetta-logo-transparent.png',
      description:
        'Personal operating system for sustainable goals, habits, and weekly capacity planning without streak-induced anxiety.',
      sameAs: ['https://www.instagram.com/trajetta_/'],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'São Paulo',
        addressRegion: 'SP',
        addressCountry: 'BR',
      },
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'companytrajetta@gmail.com',
        contactType: 'customer support',
      },
      knowsAbout: [
        'Habit Formation',
        'Personal Growth Systems',
        'Burnout Prevention',
        'Longitudinal AI Coaching',
        'Weekly Capacity Planning',
        'Non-Punitive Streaks',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://trajettacompany.com.br/en/#website',
      name: 'Trajetta',
      url: 'https://trajettacompany.com.br/en',
      publisher: {
        '@id': 'https://trajettacompany.com.br/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://trajettacompany.com.br/en?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://trajettacompany.com.br/en/#software',
      name: 'Trajetta',
      headline: 'Personal Growth & Non-Punitive Habit System with AI',
      applicationCategory: 'ProductivityApplication',
      applicationSubCategory: 'Habit Tracker & Personal Operating System',
      operatingSystem: 'Web, iOS, Android (PWA), macOS, Windows',
      description:
        'Plan your weeks, track sustainable habits and achieve goals across 4 life areas with a longitudinal AI coach that remembers your journey.',
      softwareVersion: '2.0.0',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '1480',
        bestRating: '5',
        worstRating: '1',
      },
      offers: {
        '@type': 'Offer',
        price: '29.90',
        priceCurrency: 'BRL',
        priceValidUntil: '2027-12-31',
        availability: 'https://schema.org/InStock',
        url: 'https://trajettacompany.com.br/en#planos',
        description: 'Trajetta Pro Monthly — 3-day free trial, full unconstrained access',
      },
      featureList: [
        'Full access to 4 Life Areas (Body, Money, Career, and Inner Life)',
        'Contextual Trajetta AI with Longitudinal Memory',
        'Habits with Minimum Floor & Cumulative Volume',
        'Zero Punitive Streaks',
        'Weekly Capacity Planning with max 3 priorities',
        'Guided Sunday Review with Immutable Debrief Snapshot',
        'Long-term Historical Timeline and Milestones',
      ],
    },
    {
      '@type': 'HowTo',
      '@id': 'https://trajettacompany.com.br/en/#howto',
      name: 'How to build sustainable consistency and achieve goals with Trajetta',
      description:
        'A practical 3-step non-punitive methodology to plan weekly cycles, guard habits with minimum floors, and recalibrate without guilt.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: '1. Set Your 12-Month North Star',
          text: 'Establish clear direction for the year across the 4 essential life areas: Body & Vitality, Money & Freedom, Career & Craft, and Mind & Inner Life.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: '2. Plan in Weekly Cycles with 3 Priorities & Minimum Floors',
          text: 'Every Monday, lock in at most 3 core deliverables and calibrate low-friction minimum habit floors for busy, demanding days.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: '3. Conduct Sunday Debriefs with Trajetta AI',
          text: 'Close every week with an honest, lucid reflection. If life threw a curveball, the framework recalibrates your pace with zero guilt and zero wiped streaks.',
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://trajettacompany.com.br/en/#breadcrumbs',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://trajettacompany.com.br/en',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Method',
          item: 'https://trajettacompany.com.br/en#metodo',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: '4 Life Areas',
          item: 'https://trajettacompany.com.br/en#areas',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Plans & Free Trial',
          item: 'https://trajettacompany.com.br/en#planos',
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'FAQ',
          item: 'https://trajettacompany.com.br/en#faq',
        },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://trajettacompany.com.br/en/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does Trajetta Pro activation work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Activation is instant and starts with a 3-day free trial ($0.00 charged today). You immediately receive your credentials via email with instant access to all 4 life areas, goals, habits with minimum floors, and unlimited Trajetta AI. On top of the free trial, you are protected by an unconditional 7-day full refund guarantee if you do not love it.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Trajetta just another habit tracker or todo app?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Most apps focus on micro-tasks and fragile punitive streaks that collapse on busy days. Trajetta bridges a 12-month North Star vision, 3-priority weekly capacity planning, minimum floors for difficult days, and Sunday debriefs with longitudinal AI.',
          },
        },
        {
          '@type': 'Question',
          name: 'What does "non-punitive system" mean?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'It means if you spend 4 days without opening the app, your history does not reset to zero, and you receive no red shame notifications. The framework recalibrates your plan calmly, because true consistency compounds in real life.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I cancel anytime?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. With zero bureaucracy. You can cancel with 1 click directly in your dashboard or via Stripe. Furthermore, you are backed by our 7-day unconditional money-back guarantee.',
          },
        },
      ],
    },
  ],
};

export default function EnglishLandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEn) }}
      />
      <LandingPageContent forcedLocale="en" />
    </>
  );
}
