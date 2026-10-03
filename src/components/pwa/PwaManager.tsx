'use client';

import React, { useEffect, useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export function PwaManager() {
  const { t } = useI18n();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosModal, setShowIosModal] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
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
    }

    // 3. Listen for Android beforeinstallprompt
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

  if (isStandalone) return null;

  return (
    <>
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
              {t.pwa.installTitle}
            </h3>

            <div className="space-y-3 text-xs text-[#C9CDD1]">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/4 border border-white/6">
                <Share size={18} className="text-[#B8FF00] flex-shrink-0 mt-0.5" />
                <span>{t.pwa.iosStep1}</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-white/4 border border-white/6">
                <PlusSquare size={18} className="text-[#B8FF00] flex-shrink-0 mt-0.5" />
                <span>{t.pwa.iosStep2}</span>
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
