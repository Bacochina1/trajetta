'use client';

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { Globe } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export function LanguageSwitcher({ className = '', variant = 'compact' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useI18n();
  const pathname = usePathname();

  // If on a public SEO landing route, provide real crawlable HTML links
  const isEnRoute = pathname?.startsWith('/en');
  const targetPtUrl = isEnRoute ? pathname.replace(/^\/en/, '') || '/' : pathname;
  const targetEnUrl = isEnRoute ? pathname : `/en${pathname === '/' ? '' : pathname}`;

  if (variant === 'full') {
    return (
      <div className={`flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 ${className}`}>
        <button
          type="button"
          onClick={() => setLocale('pt')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            locale === 'pt'
              ? 'bg-[#B8FF00] text-[#060709] shadow-sm'
              : 'text-[#8E9499] hover:text-[#F2F1ED]'
          }`}
          aria-label="Mudar para Português"
        >
          <span>🇧🇷 Português</span>
        </button>
        <button
          type="button"
          onClick={() => setLocale('en')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            locale === 'en'
              ? 'bg-[#B8FF00] text-[#060709] shadow-sm'
              : 'text-[#8E9499] hover:text-[#F2F1ED]'
          }`}
          aria-label="Switch to English"
        >
          <span>🇺🇸 English</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1 p-1 rounded-lg bg-[#14181F] border border-white/10 ${className}`}>
      <Globe size={13} className="text-[#8E9499] ml-1.5 mr-0.5" />
      <Link
        href={targetPtUrl}
        onClick={() => setLocale('pt')}
        lang="pt-BR"
        className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all ${
          locale === 'pt'
            ? 'bg-[#B8FF00] text-[#060709]'
            : 'text-[#8E9499] hover:text-[#F2F1ED]'
        }`}
        aria-label="Versão em Português"
      >
        PT
      </Link>
      <Link
        href={targetEnUrl}
        onClick={() => setLocale('en')}
        lang="en"
        className={`px-2 py-1 rounded text-[11px] font-mono font-bold transition-all ${
          locale === 'en'
            ? 'bg-[#B8FF00] text-[#060709]'
            : 'text-[#8E9499] hover:text-[#F2F1ED]'
        }`}
        aria-label="English version"
      >
        EN
      </Link>
    </div>
  );
}
