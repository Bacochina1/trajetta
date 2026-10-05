import React from 'react';
import Link from 'next/link';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#060709] text-[#F2F1ED] flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="max-w-md w-full space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-[#171A1D] border border-white/10 flex items-center justify-center mx-auto text-[#B8FF00] shadow-[0_0_30px_rgba(184,255,0,0.15)]">
          <Compass size={28} />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B8FF00] font-semibold">
            Erro 404 • Rota Não Encontrada
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F2F1ED]">
            Destino Fora do Mapa.
          </h1>
          <p className="text-xs sm:text-sm text-[#8E9499] leading-relaxed">
            A página que você tentou acessar não existe ou mudou de endereço. Sua trajetória continua intacta.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            href="/app"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#B8FF00] hover:bg-[#a6e600] text-[#060709] text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(184,255,0,0.25)] flex items-center justify-center gap-2 tactile-btn"
          >
            <span>Ir para o App</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#171A1D] hover:bg-white/5 border border-white/10 text-[#F2F1ED] text-xs font-semibold transition-all flex items-center justify-center gap-2 tactile-btn"
          >
            <ArrowLeft size={14} />
            <span>Página Inicial</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
