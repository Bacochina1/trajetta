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
  ],
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
        url: '/trajetta-mockup-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Trajetta — Personal Growth System',
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
    images: ['/trajetta-mockup-hero.jpg'],
  },
};

export default function EnglishLandingPage() {
  return <LandingPageContent forcedLocale="en" />;
}
