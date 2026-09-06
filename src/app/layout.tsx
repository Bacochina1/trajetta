import type { Metadata } from 'next';
import { Manrope, DM_Sans } from 'next/font/google';
import './globals.css';
import { TrajettaProvider } from '@/context/TrajettaContext';

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

export const metadata: Metadata = {
  metadataBase: new URL('https://trajetta.app'),
  title: 'Trajetta — Seu Sistema Pessoal de Evolução',
  description: 'Planeje suas semanas, acompanhe metas, hábitos e áreas da sua vida e tenha uma IA que aprende com sua trajetória para ajudar você a continuar avançando.',
  keywords: ['sistema de evolução', 'planejamento semanal', 'weekly review', 'hábitos sem streaks punitivos', 'trajetta ai'],
  authors: [{ name: 'Trajetta' }],
  alternates: {
    canonical: 'https://trajetta.app',
  },
  openGraph: {
    title: 'Trajetta — Seu Sistema Pessoal de Evolução',
    description: 'Planeje suas semanas, acompanhe metas, hábitos e áreas da sua vida com consistência real e uma IA contextual.',
    url: 'https://trajetta.app',
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
  '@type': 'SoftwareApplication',
  name: 'Trajetta',
  headline: 'Sistema Pessoal de Evolução',
  applicationCategory: 'ProductivityApplication',
  operatingSystem: 'Web, iOS, Android',
  description: 'Planeje suas semanas, acompanhe metas e hábitos nas 4 áreas essenciais da vida com apoio de uma IA contextual que lembra da sua trajetória.',
  offers: {
    '@type': 'Offer',
    price: '29.90',
    priceCurrency: 'BRL',
    description: '14 dias de teste grátis',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${dmSans.variable} dark scroll-smooth`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#060709] text-[#F2F1ED] font-sans min-h-screen selection:bg-[#B8FF00] selection:text-[#060709]">
        <TrajettaProvider>
          {children}
        </TrajettaProvider>
      </body>
    </html>
  );
}