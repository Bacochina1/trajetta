'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { MessageSquare, Sparkles, X } from 'lucide-react';

export function FloatingAiTrigger() {
  const { activeView, setActiveView } = useTrajetta();
  const [isHovered, setIsHovered] = useState(false);

  // If the user is already on the full AI Coach view
  const isAlreadyOnAi = activeView === 'ia';

  const handleClick = () => {
    setActiveView('ia');
  };

  return (
    <div className="fixed right-4 bottom-20 md:right-7 md:bottom-7 z-40 flex items-center gap-3">
      {/* Tooltip speech bubble on hover */}
      {isHovered && !isAlreadyOnAi && (
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#12161E] border border-[#B8FF00]/30 shadow-[0_10px_25px_rgba(0,0,0,0.5)] text-xs text-[#F2F1ED] animate-in fade-in slide-in-from-right-2 duration-200 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#B8FF00] shadow-[0_0_8px_#B8FF00]" />
          <span className="font-semibold">Falar com o Trajetta AI</span>
          <span className="text-[#8E9499] text-[11px] font-mono">1-clique</span>
        </div>
      )}

      {/* Floating Glass Sphere (Bola Flutuante) */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Abrir Trajetta AI Coach"
        className={`group relative flex items-center justify-center w-16 h-16 sm:w-18 sm:h-18 rounded-full transition-all duration-300 active:scale-95 ${
          isAlreadyOnAi
            ? 'ring-2 ring-[#B8FF00] ring-offset-2 ring-offset-[#060709] shadow-[0_0_25px_rgba(184,255,0,0.35)]'
            : 'hover:scale-105 shadow-[0_12px_35px_rgba(0,0,0,0.6),0_0_20px_rgba(184,255,0,0.2)]'
        }`}
      >
        {/* Ambient Glow Aura */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#B8FF00]/25 via-transparent to-[#58D6A7]/20 blur-md group-hover:blur-lg transition-all" />

        {/* Outer Glass Sphere Body */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-[#1E2530]/90 via-[#11141A]/95 to-[#080A0D] border-2 border-[#B8FF00]/40 backdrop-blur-xl overflow-hidden shadow-inner">
          {/* Glass specular highlight */}
          <div className="absolute top-1 left-2 right-2 h-5 rounded-full bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
        </div>

        {/* 3D Mascot Image Floating Inside */}
        <div className="relative z-10 w-13 h-13 sm:w-15 sm:h-15 flex items-center justify-center p-1 transition-transform duration-300 group-hover:-translate-y-1">
          <img
            src="/trajetta-ai-avatar.png"
            alt="Boneco Trajetta AI"
            className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Online Status Pill */}
        <div className="absolute -top-0.5 -right-0.5 z-20 flex items-center justify-center">
          <span className="relative flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8FF00] opacity-75" />
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#B8FF00] border-2 border-[#0D0F10] shadow-[0_0_8px_#B8FF00]" />
          </span>
        </div>
      </button>
    </div>
  );
}
