'use client';

import React, { useState, useEffect } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { Move, MessageSquare } from 'lucide-react';
import { FloatingAiPopup } from './FloatingAiPopup';

type CornerPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

export function FloatingAiTrigger() {
  const { activeView, isAiPopupOpen, setIsAiPopupOpen } = useTrajetta();
  const [isHovered, setIsHovered] = useState(false);
  const [corner, setCorner] = useState<CornerPosition>('bottom-right');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('trajetta_mascot_corner') as CornerPosition;
      if (saved && ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(saved)) {
        setCorner(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  const cycleCorner = (e: React.MouseEvent) => {
    e.stopPropagation();
    const order: CornerPosition[] = ['bottom-right', 'bottom-left', 'top-left', 'top-right'];
    const nextIdx = (order.indexOf(corner) + 1) % order.length;
    const nextCorner = order[nextIdx];
    setCorner(nextCorner);
    try {
      localStorage.setItem('trajetta_mascot_corner', nextCorner);
    } catch {
      // ignore
    }
  };

  const isAlreadyOnAi = activeView === 'ia';

  const positionClasses: Record<CornerPosition, string> = {
    'bottom-right': 'right-3 bottom-[72px] sm:right-4 sm:bottom-20 md:right-7 md:bottom-7 flex-row-reverse',
    'bottom-left': 'left-3 bottom-[72px] sm:left-4 sm:bottom-20 md:left-[270px] md:bottom-7 flex-row',
    'top-right': 'right-3 top-16 sm:right-4 sm:top-20 md:right-7 md:top-20 flex-row-reverse',
    'top-left': 'left-3 top-16 sm:left-4 sm:top-20 md:left-[270px] md:top-20 flex-row',
  };

  return (
    <>
      {/* Floating Mascot Trigger */}
      <div
        className={`fixed z-40 flex items-center gap-2 transition-all duration-300 ${positionClasses[corner]}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Mascot silhouette without dark bounding circle */}
        <div className="relative group flex items-center justify-center">
          {/* Corner change button on hover */}
          {isHovered && (
            <button
              onClick={cycleCorner}
              title="Mudar mascote de canto da tela"
              aria-label="Mudar posição do mascote"
              className="absolute -top-3 -left-3 z-30 w-7 h-7 rounded-full bg-[#111315] hover:bg-[#1A1E24] border border-white/20 text-[#8E9499] hover:text-[#B8FF00] flex items-center justify-center shadow-lg transition-all animate-in fade-in zoom-in-75 duration-150 tactile-btn"
            >
              <Move size={12} />
            </button>
          )}

          {/* Mascot trigger button - opens floating popup */}
          <button
            onClick={() => setIsAiPopupOpen(!isAiPopupOpen)}
            aria-label="Abrir Trajetta AI Coach"
            className={`relative p-0.5 sm:p-1 transition-all duration-300 active:scale-95 group focus:outline-none ${
              isAiPopupOpen ? 'scale-105' : 'hover:scale-110 hover:-translate-y-1'
            }`}
          >
            {/* Subtle neon ambient backlight */}
            <div
              className={`absolute inset-0 rounded-full blur-xl transition-all pointer-events-none ${
                isAiPopupOpen ? 'bg-[#B8FF00]/35 scale-125' : 'bg-[#B8FF00]/15 group-hover:bg-[#B8FF00]/30'
              }`}
            />

            {/* Transparent 3D Mascot Image */}
            <div className="relative w-14 h-14 sm:w-20 sm:h-20 flex items-center justify-center">
              <img
                src="/trajetta-ai-avatar.png"
                alt="Mascote Trajetta AI"
                className={`w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)] drop-shadow-[0_0_12px_rgba(184,255,0,0.3)] transition-transform duration-300 ${
                  isAiPopupOpen ? 'scale-105 rotate-2' : ''
                }`}
              />
            </div>

            {/* Online active status beacon */}
            <div className="absolute top-1 right-1 z-20 flex items-center justify-center">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8FF00] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#B8FF00] border-2 border-[#0D0F10] shadow-[0_0_8px_#B8FF00]" />
              </span>
            </div>
          </button>
        </div>

        {/* Tooltip on hover */}
        {isHovered && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#111315]/95 border border-[#B8FF00]/30 shadow-[0_8px_20px_rgba(0,0,0,0.6)] text-xs text-[#F2F1ED] animate-in fade-in duration-150 pointer-events-none whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] shadow-[0_0_6px_#B8FF00]" />
            <span className="font-semibold">Trajetta AI</span>
            <span className="text-[10px] text-[#8E9499] font-mono">
              {isAiPopupOpen ? 'Fechar' : 'Abrir Popup'}
            </span>
          </div>
        )}
      </div>

      {/* Floating AI Popup Window / Drawer */}
      <FloatingAiPopup
        corner={corner}
        isOpen={isAiPopupOpen}
        onClose={() => setIsAiPopupOpen(false)}
      />
    </>
  );
}
