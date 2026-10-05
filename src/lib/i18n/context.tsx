'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, Dictionary } from './types';
import { pt } from './dictionaries/pt';
import { en } from './dictionaries/en';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  formatDate: (date: Date | string, options?: Intl.DateTimeFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatNumber: (value: number) => string;
}

const dictionaries: Record<Locale, Dictionary> = { pt, en };

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale || 'pt');

  useEffect(() => {
    // If an explicit initialLocale was provided (e.g. forcedLocale on /en or /), respect it directly!
    if (initialLocale) {
      setLocaleState(prev => (prev !== initialLocale ? initialLocale : prev));
      return;
    }

    // Check localStorage preference first
    const saved = localStorage.getItem('trajetta_locale') as Locale | null;
    if (saved && (saved === 'pt' || saved === 'en')) {
      setLocaleState(saved);
      return;
    }

    // Check browser language
    if (typeof navigator !== 'undefined') {
      const browserLang = navigator.language?.toLowerCase();
      if (browserLang && !browserLang.startsWith('pt')) {
        setLocaleState('en');
      }
    }
  }, [initialLocale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('trajetta_locale', newLocale);
      document.cookie = `trajetta_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}
  };

  const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions): string => {
    try {
      const d = typeof date === 'string' ? new Date(date) : date;
      const intlLocale = locale === 'pt' ? 'pt-BR' : 'en-US';
      return new Intl.DateTimeFormat(intlLocale, options || { dateStyle: 'medium' }).format(d);
    } catch {
      return String(date);
    }
  };

  const formatCurrency = (amount: number, currency = 'BRL'): string => {
    try {
      const intlLocale = locale === 'pt' ? 'pt-BR' : 'en-US';
      return new Intl.NumberFormat(intlLocale, {
        style: 'currency',
        currency,
      }).format(amount);
    } catch {
      return `${currency} ${amount}`;
    }
  };

  const formatNumber = (value: number): string => {
    try {
      const intlLocale = locale === 'pt' ? 'pt-BR' : 'en-US';
      return new Intl.NumberFormat(intlLocale).format(value);
    } catch {
      return String(value);
    }
  };

  const value: I18nContextType = {
    locale,
    setLocale,
    t: dictionaries[locale] || dictionaries.pt,
    formatDate,
    formatCurrency,
    formatNumber,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    // Graceful fallback outside provider
    return {
      locale: 'pt' as Locale,
      setLocale: () => {},
      t: pt,
      formatDate: (d: Date | string) => String(d),
      formatCurrency: (a: number) => `R$ ${a.toFixed(2)}`,
      formatNumber: (n: number) => String(n),
    };
  }
  return context;
}
