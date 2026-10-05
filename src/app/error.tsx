'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log exception safely to client console
    console.error('Trajetta Global Error Boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#060709] text-[#F2F1ED] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#171A1D] border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.15)]">
          <ShieldAlert size={28} />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold">
            Instabilidade Temporária • Dados Protegidos
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F2F1ED]">
            Pausa Inesperada.
          </h1>
          <p className="text-xs sm:text-sm text-[#8E9499] leading-relaxed">
            Ocorreu uma oscilação na renderização desta tela. Sua trajetória, metas e hábitos continuam salvos com segurança.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#B8FF00] hover:bg-[#a6e600] text-[#060709] text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(184,255,0,0.25)] flex items-center justify-center gap-2 tactile-btn cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>Tentar Novamente</span>
          </button>
          <Link
            href="/app"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#171A1D] hover:bg-white/5 border border-white/10 text-[#F2F1ED] text-xs font-semibold transition-all flex items-center justify-center gap-2 tactile-btn"
          >
            <Home size={14} />
            <span>Ir para o App</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
