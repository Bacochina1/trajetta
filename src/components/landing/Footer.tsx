'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Shield } from 'lucide-react';

export function Footer() {
  const [quickEmail, setQuickEmail] = useState('');
  const [quickSubmitted, setQuickSubmitted] = useState(false);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickEmail || !quickEmail.includes('@')) return;
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: quickEmail, name: 'Lead Rodapé' }),
      });
      setQuickSubmitted(true);
    } catch {}
  };

  return (
    <footer className="bg-[#040608] border-t border-white/10 px-4 xs:px-6 sm:px-10 lg:px-14 pt-12 sm:pt-16 pb-10 sm:pb-12" data-purpose="page-footer" id="contact">
      <div className="max-w-[1440px] mx-auto">
        {/* Top row: Newsletter + Links columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pb-12 sm:pb-16">
          {/* Left Column: Branding and Subscription */}
          <div className="md:col-span-4 lg:col-span-5 flex flex-col items-start pr-0 md:pr-6">
            {/* Official White Logo */}
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                <img
                  src="/trajetta-logo-transparent.png"
                  alt="Trajetta Logo"
                  className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.25)]"
                />
              </div>
              <span className="font-bold text-sm tracking-[0.18em] uppercase text-white">TRAJETTA</span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed mb-5 sm:mb-6 max-w-sm">
              Seu sistema pessoal de evolução. Direção clara de longo prazo, ciclos semanais sem punição e acompanhamento lúcido.
            </p>

            <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-2">
              RECEBER AVISOS DO PRÓXIMO LOTE
            </span>

            {/* Subscribe Form */}
            {quickSubmitted ? (
              <div className="flex items-center gap-2 text-xs font-mono text-[#B8FF00] bg-[#B8FF00]/10 border border-[#B8FF00]/20 rounded-lg px-3 py-2 w-full max-w-sm">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>E-mail cadastrado na Lista VIP!</span>
              </div>
            ) : (
              <form onSubmit={handleQuickSubmit} className="flex items-center bg-[#0d1015] border border-white/15 rounded-lg p-1 w-full max-w-sm focus-within:border-white/40 transition-colors">
                <input
                  type="email"
                  required
                  placeholder="Seu melhor e-mail..."
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  className="bg-transparent border-none text-xs text-white placeholder-neutral-500 px-3 py-2 focus:outline-none flex-1 min-w-0"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-neutral-200 text-black text-[10px] font-bold tracking-wider uppercase px-3 py-2 rounded transition-colors flex-shrink-0"
                >
                  CADASTRAR
                </button>
              </form>
            )}
          </div>

          {/* Right Columns: Links */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Column 1: Navegação */}
            <div>
              <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest block mb-3 sm:mb-4">
                NAVEGAÇÃO
              </span>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li><a className="hover:text-white transition-colors" href="#visao">Visão de Longo Prazo</a></li>
                <li><a className="hover:text-white transition-colors" href="#ciclos">Ciclos Semanais</a></li>
                <li><a className="hover:text-white transition-colors" href="#areas">4 Áreas da Vida</a></li>
                <li><a className="hover:text-white transition-colors" href="#metodo">O Método</a></li>
                <li><a className="hover:text-[#B8FF00] transition-colors" href="#waitlist">Lista VIP</a></li>
                <li><a className="hover:text-white transition-colors" href="#faq">Perguntas Frequentes</a></li>
              </ul>
            </div>

            {/* Column 2: Metodologia */}
            <div>
              <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest block mb-3 sm:mb-4">
                METODOLOGIA
              </span>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li><span className="text-neutral-300">Estrela-Guia</span></li>
                <li><span className="text-neutral-300">3 Prioridades</span></li>
                <li><span className="text-neutral-300">Piso Mínimo</span></li>
                <li><span className="text-neutral-300">Review de Domingo</span></li>
                <li><span className="text-neutral-300">Retomada Sem Culpa</span></li>
                <li><span className="text-neutral-300">Zero Streaks</span></li>
              </ul>
            </div>

            {/* Column 3: Sistema & Admin */}
            <div className="col-span-2 sm:col-span-1">
              <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest block mb-3 sm:mb-4">
                SISTEMA & CRM
              </span>
              <ul className="space-y-2 text-xs text-neutral-400">
                <li><span className="text-neutral-300">Trajetta Engine</span></li>
                <li><span className="text-neutral-300">Motor de IA Contextual</span></li>
                <li><span className="text-neutral-300">Memória Longitudinal</span></li>
                <li><span className="text-neutral-300">Mobile PWA</span></li>
                <li className="pt-2">
                  <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-[#B8FF00] font-mono text-[11px] transition-colors"
                  >
                    <Shield className="w-3 h-3 text-[#B8FF00]" />
                    <span>Acesso Admin CRM</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom row: Copyright & Instagram */}
        <div className="pt-6 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-3 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#B8FF00]"></span>
            <span>Trajetta © {new Date().getFullYear()} — Todos os direitos reservados.</span>
          </div>

          {/* Social Icons — Strictly Instagram @trajetta_ */}
          <div className="flex items-center space-x-3 text-neutral-400">
            <a
              href="https://www.instagram.com/trajetta_/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3.5 py-1.5 rounded-full border border-white/10 text-xs"
              aria-label="Instagram Oficial Trajetta"
            >
              <svg className="w-3.5 h-3.5 fill-pink-400" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@trajetta_</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
