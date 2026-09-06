'use client';

import React from 'react';
import Link from 'next/link';
import { TrajettaLogo } from '@/components/ui/TrajettaLogo';
import { ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="py-14 bg-[#080A0C] border-t border-white/[0.06] text-xs text-[#8E9499]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Link href="/" className="inline-block">
              <TrajettaLogo size={24} showWordmark wordmarkClassName="font-extrabold text-base tracking-tight text-[#F2F1ED]" />
            </Link>
            <p className="text-xs text-[#8E9499] max-w-sm">
              Sistema pessoal de evolução. Planeje para sua vida real, não para sua versão perfeita.
            </p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs">
            <a href="#metodo" className="hover:text-[#F2F1ED] transition-colors">O Método</a>
            <a href="#ciclo" className="hover:text-[#F2F1ED] transition-colors">O Ciclo</a>
            <a href="#timeline" className="hover:text-[#F2F1ED] transition-colors">Timeline</a>
            <a href="#ia" className="hover:text-[#F2F1ED] transition-colors">Trajetta AI</a>
            <a href="#planos" className="hover:text-[#F2F1ED] transition-colors">Planos</a>
            <a href="#faq" className="hover:text-[#F2F1ED] transition-colors">FAQ</a>
            <Link href="/login" className="hover:text-[#B8FF00] transition-colors">Entrar</Link>
          </div>
        </div>

        <div className="pt-8 border-t border-white/6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © 2026 Trajetta. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span>Privacidade & Soberania</span>
            <span>•</span>
            <span>Segurança dos Dados</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-[#B8FF00]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-pulse" />
              Sistemas Operacionais
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
