'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Download, Share, PlusSquare, X, Smartphone, Sparkles } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export function PwaManager() {
  const pathname = usePathname();
  const isAppRoute = pathname?.startsWith('/app') || pathname?.startsWith('/dashboard');

  const { t } = useI18n();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);
  const [showMobileInstallBanner, setShowMobileInstallBanner] = useState(false);

  useEffect(() => {
    if (!isAppRoute) return;
    // 1. Register Service Worker with instant update check
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((reg) => {
          reg.update().catch(() => {});
        }).catch((err) => {
          console.warn('SW registration skipped:', err);
        });
      });
    }

    // 2. Check if already running as standalone PWA
    if (typeof window !== 'undefined') {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true;
      setIsStandalone(isStandaloneMode);

      // Check for iOS
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
      setIsIos(isIosDevice);

      // 3. First-time mobile visitor prompt check
      const isMobile =
        window.innerWidth < 768 ||
        /iphone|ipad|ipod|android|mobile/.test(userAgent);

      const alreadyPrompted = localStorage.getItem('trajetta_pwa_first_visit_prompted');

      if (!isStandaloneMode && isMobile && !alreadyPrompted) {
        // Show after 2.5 seconds of browsing so visitor sees the page first
        const timer = setTimeout(() => {
          setShowMobileInstallBanner(true);
        }, 2500);

        return () => clearTimeout(timer);
      }
    }

    // 4. Listen for Android beforeinstallprompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Custom event to trigger install from Profile or settings
    const handleCustomTrigger = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then(() => {
          setDeferredPrompt(null);
        });
      } else if (isIos) {
        setShowIosModal(true);
      }
    };

    window.addEventListener('trajetta-install-prompt', handleCustomTrigger);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('trajetta-install-prompt', handleCustomTrigger);
    };
  }, [deferredPrompt, isIos]);

  const handleInstallClick = () => {
    setShowMobileInstallBanner(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('trajetta_pwa_first_visit_prompted', 'installed');
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    } else if (isIos) {
      setShowIosModal(true);
    } else {
      // Fallback for browsers that require manual add
      setShowIosModal(true);
    }
  };

  const handleDismissBanner = () => {
    setShowMobileInstallBanner(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('trajetta_pwa_first_visit_prompted', 'dismissed');
    }
  };

  if (isStandalone || !isAppRoute) return null;

  return (
    <>
      {/* First-time Mobile Install Popup / Drawer */}
      {showMobileInstallBanner && (
        <div className="fixed bottom-4 inset-x-3 sm:inset-x-auto sm:right-4 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#0D1015]/95 border-2 border-[#B8FF00]/40 rounded-2xl p-4 sm:p-5 shadow-[0_0_40px_rgba(0,0,0,0.9),0_0_20px_rgba(184,255,0,0.15)] backdrop-blur-xl relative">
            {/* Close button */}
            <button
              onClick={handleDismissBanner}
              className="absolute top-3 right-3 text-[#8E9499] hover:text-[#F2F1ED] p-1 rounded-lg transition-colors"
              aria-label="Fechar"
            >
              <X size={16} />
            </button>

            <div className="flex items-start gap-3.5">
              {/* App Icon */}
              <div className="w-12 h-12 rounded-xl bg-[#14181F] border border-[#B8FF00]/40 p-2 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(184,255,0,0.2)]">
                <img
                  src="/icon-192.png"
                  alt="Trajetta Icon"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Text Info */}
              <div className="space-y-1 pr-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B8FF00]">
                    App Oficial
                  </span>
                </div>
                <h4 className="text-sm font-bold text-[#F2F1ED] tracking-tight">
                  Instalar o Trajetta no seu Celular?
                </h4>
                <p className="text-xs text-[#8E9499] leading-relaxed">
                  Acesse com 1 toque na sua tela de início, em modo tela cheia e sem abrir navegador.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5 mt-4 pt-3 border-t border-white/8">
              <button
                type="button"
                onClick={handleInstallClick}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#B8FF00] hover:bg-[#a6e600] active:scale-95 text-[#060709] font-extrabold text-xs tracking-wider uppercase flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(184,255,0,0.3)] transition-all cursor-pointer"
              >
                <Download size={14} />
                <span>Instalar Agora</span>
              </button>

              <button
                type="button"
                onClick={handleDismissBanner}
                className="py-2.5 px-3.5 rounded-xl bg-[#14181F] hover:bg-[#1E232B] text-[#8E9499] hover:text-[#F2F1ED] font-semibold text-xs transition-colors cursor-pointer"
              >
                Agora não
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS Instructions Modal */}
      {showIosModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111315] border border-white/10 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-fade-in relative">
            <button
              onClick={() => setShowIosModal(false)}
              className="absolute top-4 right-4 text-[#8E9499] hover:text-[#F2F1ED]"
            >
              <X size={18} />
            </button>

            <div className="w-12 h-12 rounded-xl bg-[#B8FF00]/10 border border-[#B8FF00]/20 flex items-center justify-center text-[#B8FF00] mb-2">
              <Download size={22} />
            </div>

            <h3 className="text-base font-bold text-[#F2F1ED]">
              {t.pwa.installTitle || 'Como instalar no iPhone'}
            </h3>

            <div className="space-y-3 text-xs text-[#C9CDD1]">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/4 border border-white/6">
                <Share size={18} className="text-[#B8FF00] flex-shrink-0 mt-0.5" />
                <span>1. Toque no botão de <strong>Compartilhar</strong> (ícone com quadrado e seta) na barra do Safari.</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/4 border border-white/6">
                <PlusSquare size={18} className="text-[#B8FF00] flex-shrink-0 mt-0.5" />
                <span>2. Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIosModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#B8FF00] text-[#060709] font-bold text-xs hover:bg-[#c6ff24] transition-all"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function triggerPwaInstall() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('trajetta-install-prompt'));
  }
}
