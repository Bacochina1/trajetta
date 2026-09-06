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
  title: 'Trajetta — Sistema Pessoal de Evolução',
  description: 'Planeje para sua vida real, não para sua versão perfeita. O aplicativo que transforma metas e hábitos em evidência visível de evolução ao longo do tempo.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
      { url: '/trajetta-logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
      { url: '/trajetta-logo.png' },
    ],
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${dmSans.variable} dark`}>
      <body className="bg-[#0D0F10] text-[#F2F1ED] font-sans min-h-screen selection:bg-[#B8FF00] selection:text-[#0D0F10]">
        <TrajettaProvider>
          {children}
        </TrajettaProvider>
      </body>
    </html>
  );
}