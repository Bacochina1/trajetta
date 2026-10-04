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
    'Aplicativo de metas, hábitos e rotina nas 4 áreas essenciais da vida com IA contextual. Evolução consistente sem streaks punitivos. Comece com 3 dias de degustação grátis no Trajetta.',
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
    'trajetta ai',
    'piso minimo de habitos',
  ],
  authors: [{ name: 'Trajetta Company', url: 'https://trajettacompany.com.br' }],
  creator: 'Trajetta',
  publisher: 'Trajetta Company',
  category: 'productivity',
  classification: 'Personal Productivity, Habit Tracker, Anti-Burnout Growth, AI Coaching',
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
      'Planeje para sua vida real nas 4 áreas essenciais. Hábitos com piso mínimo, weekly review e IA contextual sem streaks punitivos. Teste 3 dias grátis.',
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
      'Torne visível quem você está se tornando. Metas nas 4 áreas da vida, hábitos sem punição e IA contextual. Comece com 3 dias grátis.',
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
      legalName: 'Trajetta Company',
      url: 'https://trajettacompany.com.br',
      logo: 'https://trajettacompany.com.br/trajetta-logo-transparent.png',
      description:
        'Sistema pessoal de metas, consistência e hábitos sem punição com inteligência artificial contextual e capacidade semanal.',
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
      applicationSubCategory: 'Habit Tracker & Personal Operating System',
      operatingSystem: 'Web, iOS, Android (PWA), macOS, Windows',
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
        url: 'https://trajettacompany.com.br/#planos',
        description: 'Trajetta Pro Mensal — 3 dias de degustação gratuita, acesso completo sem limites',
      },
      featureList: [
        'Acesso irrestrito às 4 Áreas da Vida (Corpo, Dinheiro, Carreira e Vida Pessoal)',
        'Trajetta AI Contextual com Memória Longitudinal',
        'Hábitos com Piso Mínimo e Volume Acumulado',
        'Zero Streaks Punitivos',
        'Planejamento Semanal em 3 Prioridades com Capacity Planning',
        'Weekly Review de Domingo com Snapshot Imutável',
        'Linha do Tempo e Marcos Históricos de Longo Prazo',
      ],
    },
    {
      '@type': 'HowTo',
      '@id': 'https://trajettacompany.com.br/#howto',
      name: 'Como construir consistência real e alcançar metas com o Trajetta',
      description:
        'Metodologia prática em 3 passos para planejar ciclos semanais, proteger hábitos com piso mínimo e recalibrar sem culpa.',
      step: [
        {
          '@type': 'HowToStep',
          position: 1,
          name: '1. Definir sua Estrela-Guia de 12 Meses',
          text: 'Estabeleça a direção clara para o ano nas 4 áreas essenciais da vida: Corpo & Vitalidade, Dinheiro & Segurança, Carreira & Construção e Mente & Vida Pessoal.',
        },
        {
          '@type': 'HowToStep',
          position: 2,
          name: '2. Planejar em Ciclos Semanais com 3 Prioridades e Piso Mínimo',
          text: 'Toda segunda-feira, escolha no máximo 3 prioridades reais para a semana e defina o piso mínimo dos hábitos para períodos de sobrecarga ou cansaço.',
        },
        {
          '@type': 'HowToStep',
          position: 3,
          name: '3. Realizar a Revisão de Domingo com a Trajetta AI',
          text: 'Feche o ciclo com um debrief honesto e lúcido guiado por IA. Se a rotina pesou, o sistema recalcula sem zerar seus dias e sem culpa.',
        },
      ],
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://trajettacompany.com.br/#breadcrumbs',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Início',
          item: 'https://trajettacompany.com.br',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'O Método',
          item: 'https://trajettacompany.com.br/#metodo',
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: '4 Áreas da Vida',
          item: 'https://trajettacompany.com.br/#areas',
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: 'Planos & Teste Grátis',
          item: 'https://trajettacompany.com.br/#planos',
        },
        {
          '@type': 'ListItem',
          position: 5,
          name: 'Perguntas Frequentes',
          item: 'https://trajettacompany.com.br/#faq',
        },
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
            text: 'A liberação é instantânea e você começa com 3 dias de degustação gratuita (R$ 0,00 cobrado hoje). Você recebe suas credenciais no e-mail na mesma hora e tem acesso imediato a todas as 4 áreas da vida, metas, hábitos com piso mínimo e Trajetta AI sem limites. Além do teste grátis, você conta com garantia incondicional de 7 dias com reembolso total se não amar.',
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
        {
          '@type': 'Question',
          name: 'Como funciona a Trajetta AI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Trajetta AI utiliza tecnologia de ponta combinada com um motor de memória que aprende o seu histórico. Ela não cospe clichês motivacionais; ela lê seus ciclos e sugere ajustes objetivos no ritmo da sua rotina.',
          },
        },
        {
          '@type': 'Question',
          name: 'Meus dados e reflexões pessoais são privados?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sim, com soberania absoluta. Suas reflexões não são vendidas para anunciantes nem compartilhadas com terceiros. Você pode exportar todos os seus dados ou solicitar exclusão a qualquer momento.',
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
        <meta name="geo.region" content="BR-SP" />
        <meta name="geo.placename" content="São Paulo" />
        <link rel="alternate" type="text/plain" href="https://trajettacompany.com.br/llms.txt" title="LLM Context for AI Agents" />
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