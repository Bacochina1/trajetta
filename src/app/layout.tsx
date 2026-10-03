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
    default: 'Trajetta — Aplicativo de Metas, Hábitos e Planejamento Semanal',
    template: '%s | Trajetta',
  },
  description:
    'Aplicativo de metas, hábitos e rotina nas 4 áreas essenciais da vida com IA contextual. Evolução consistente sem streaks punitivos. Comece agora no Trajetta.',
  keywords: [
    'aplicativo de metas',
    'rastreador de habitos',
    'planejador semanal app',
    'sistema de metas e habitos',
    'app de produtividade',
    'organizador de rotina',
    'gestao de tempo e metas',
    'habitos sem streaks punitivos',
    'weekly review com ia',
    'planejamento 4 areas da vida',
    'habit tracker app',
    'goal tracking software',
    'calm productivity system',
    'trajetta',
  ],
  authors: [{ name: 'Trajetta Company', url: 'https://trajettacompany.com.br' }],
  creator: 'Trajetta',
  publisher: 'Trajetta Company',
  manifest: '/manifest.webmanifest',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://trajettacompany.com.br',
    languages: {
      'pt-BR': 'https://trajettacompany.com.br',
      en: 'https://trajettacompany.com.br/en',
      'x-default': 'https://trajettacompany.com.br',
    },
  },
  openGraph: {
    title: 'Trajetta — Aplicativo de Metas, Hábitos e Planejamento Semanal',
    description:
      'Planeje para sua vida real nas 4 áreas essenciais. Hábitos com piso mínimo, weekly review e IA contextual sem streaks punitivos.',
    url: 'https://trajettacompany.com.br',
    siteName: 'Trajetta',
    images: [
      {
        url: '/trajetta-real-app-mockup.jpg',
        width: 1200,
        height: 675,
        alt: 'Trajetta Pro — Dashboard de Hábitos, Life Score e Planejamento Semanal',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trajetta — Aplicativo de Metas, Hábitos e Planejamento Semanal',
    description:
      'Torne visível quem você está se tornando. Metas nas 4 áreas da vida, hábitos sem punição e IA contextual.',
    images: ['/trajetta-real-app-mockup.jpg'],
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
      '@id': 'https://trajettacompany.com.br/#organization',
      name: 'Trajetta Company',
      url: 'https://trajettacompany.com.br',
      logo: 'https://trajettacompany.com.br/trajetta-logo-transparent.png',
      sameAs: ['https://www.instagram.com/trajetta_/'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://trajettacompany.com.br/#website',
      name: 'Trajetta',
      url: 'https://trajettacompany.com.br',
      publisher: {
        '@id': 'https://trajettacompany.com.br/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://trajettacompany.com.br/?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://trajettacompany.com.br/#software',
      name: 'Trajetta',
      headline: 'Aplicativo de Metas, Hábitos e Planejamento Semanal com IA',
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'Web, iOS, Android (PWA)',
      description:
        'Aplicativo de metas, hábitos e rotina nas 4 áreas essenciais da vida com IA contextual. Evolução consistente sem streaks punitivos.',
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
        description: 'Trajetta Pro Mensal — Acesso completo e irrestrito',
      },
      featureList: [
        'Acesso irrestrito às 4 Áreas da Vida (Corpo, Dinheiro, Carreira e Vida)',
        'Trajetta AI Contextual com Memória Longitudinal',
        'Hábitos com Piso Mínimo e Volume Acumulado',
        'Zero Streaks Punitivos',
        'Planejamento Semanal em 3 Prioridades com Capacity Planning',
        'Weekly Review de Domingo com Snapshot Imutável',
        'Linha do Tempo e Marcos Históricos de Longo Prazo',
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://trajettacompany.com.br/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Como funciona a ativação do Trajetta Pro?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A liberação é instantânea após a confirmação do pagamento via Stripe. Você recebe acesso imediato a todas as funcionalidades e conta com garantia legal incondicional de 7 dias com reembolso total pelo CDC.',
          },
        },
        {
          '@type': 'Question',
          name: 'A Trajetta é mais um aplicativo de hábitos ou listas?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Não. A maioria dos apps foca em micro-tarefas e streaks punitivos. A Trajetta conecta visão de 12 meses, planejamento semanal em 3 prioridades, pisos mínimos para dias difíceis e revisões de domingo com IA contextual.',
          },
        },
        {
          '@type': 'Question',
          name: 'O que significa sistema sem punição?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Significa que se você passar 4 dias sem abrir o app, seu histórico não zera e você não recebe alertas vermelhos de culpa. O sistema recalibra o plano da semana sem drama, porque consistência real se constrói na vida como ela é.',
          },
        },
        {
          '@type': 'Question',
          name: 'Posso cancelar a qualquer momento?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sim. Sem letras miúdas ou burocracia. O cancelamento pode ser feito em 1 clique diretamente pelo painel do seu perfil ou pela Stripe. Além disso, você conta com a garantia legal de 7 dias com reembolso integral.',
          },
        },
      ],
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