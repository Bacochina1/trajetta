import type { Metadata, Viewport } from 'next';
import { Manrope, DM_Sans } from 'next/font/google';
import './globals.css';
import { TrajettaProvider } from '@/context/TrajettaContext';
import { I18nProvider } from '@/lib/i18n/context';
import { PwaManager } from '@/components/pwa/PwaManager';

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#060709',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://trajettacompany.com.br'),
  title: {
    default: 'Trajetta — Seu Sistema Pessoal de Evolução',
    template: '%s | Trajetta',
  },
  description:
    'Planeje suas semanas, acompanhe metas e hábitos nas 4 áreas essenciais da vida com apoio de uma IA contextual que lembra da sua trajetória. Sem correntes frágeis, sem streaks punitivos.',
  keywords: [
    'aplicativo de metas',
    'rastreador de hábitos',
    'planejamento semanal',
    'sistema de evolução pessoal',
    'produtividade calma',
    'hábitos sem streaks punitivos',
    'weekly review',
    'habit tracker app',
    'goal tracking app',
    'calm productivity',
  ],
  authors: [{ name: 'Trajetta Company', url: 'https://trajettacompany.com.br' }],
  creator: 'Trajetta',
  publisher: 'Trajetta Company',
  manifest: '/manifest.webmanifest',
  alternates: {
    canonical: 'https://trajettacompany.com.br',
    languages: {
      'pt-BR': 'https://trajettacompany.com.br',
      en: 'https://trajettacompany.com.br/en',
      'x-default': 'https://trajettacompany.com.br',
    },
  },
  openGraph: {
    title: 'Trajetta — Seu Sistema Pessoal de Evolução',
    description:
      'Torne visível quem você está se tornando. Planeje para sua vida real, com consistência sustentável e IA contextual.',
    url: 'https://trajettacompany.com.br',
    siteName: 'Trajetta',
    images: [
      {
        url: '/trajetta-mockup-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Trajetta — Sistema Pessoal de Evolução',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trajetta — Seu Sistema Pessoal de Evolução',
    description: 'Torne visível quem você está se tornando. Planeje para sua vida real, não para sua versão perfeita.',
    images: ['/trajetta-mockup-hero.jpg'],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Trajetta',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
      { url: '/icon-512.png', sizes: '512x512' },
    ],
    shortcut: '/favicon.ico',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      name: 'Trajetta Company',
      url: 'https://trajettacompany.com.br',
      logo: 'https://trajettacompany.com.br/trajetta-logo-transparent.png',
      sameAs: ['https://www.instagram.com/trajetta_/'],
    },
    {
      '@type': 'WebSite',
      name: 'Trajetta',
      url: 'https://trajettacompany.com.br',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://trajettacompany.com.br/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      name: 'Trajetta',
      headline: 'Sistema Pessoal de Evolução & Hábitos',
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Web, iOS, Android',
      description:
        'Planeje suas semanas, acompanhe metas e hábitos nas 4 áreas essenciais da vida com apoio de uma IA contextual que lembra da sua trajetória.',
      offers: {
        '@type': 'Offer',
        price: '29.90',
        priceCurrency: 'BRL',
        description: '3 dias de degustação gratuita',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${dmSans.variable} dark scroll-smooth`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#060709] text-[#F2F1ED] font-sans min-h-screen selection:bg-[#B8FF00] selection:text-[#060709]">
        <I18nProvider>
          <TrajettaProvider>
            <PwaManager />
            {children}
          </TrajettaProvider>
        </I18nProvider>
      </body>
    </html>
  );
}