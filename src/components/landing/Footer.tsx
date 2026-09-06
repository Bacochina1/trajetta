'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

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
    <footer className="bg-[#040608] border-t border-white/10 px-6 sm:px-10 lg:px-14 pt-16 pb-12" data-purpose="page-footer" id="contact">
      <div className="max-w-[1440px] mx-auto">
        {/* Top row: Newsletter + Links columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16">
          {/* Left Column: Branding and Subscription */}
          <div className="md:col-span-4 lg:col-span-5 flex flex-col items-start pr-0 md:pr-6">
            {/* Concentric circle logo */}
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-7 h-7 flex items-center justify-center text-white">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" strokeOpacity="0.3"></circle>
                  <circle cx="12" cy="12" r="6.5" strokeOpacity="0.65"></circle>
                  <circle cx="12" cy="12" r="3" strokeOpacity="1" fill="#B8FF00" fillOpacity="0.9"></circle>
                </svg>
              </span>
              <span className="font-mono text-sm tracking-[0.2em] font-semibold uppercase text-white">TRAJETTA</span>
            </div>

            <p className="text-xs text-neutral-400 leading-relaxed mb-6 max-w-sm">
              Seu sistema pessoal de evolução. Direção clara de longo prazo, ciclos semanais sem punição e acompanhamento lúcido.
            </p>

            <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-2.5">
              RECEBER AVISOS DO PRÓXIMO LOTE
            </span>

            {/* Subscribe Form */}
            {quickSubmitted ? (
              <div className="flex items-center gap-2 text-xs font-mono text-[#B8FF00] bg-[#B8FF00]/10 border border-[#B8FF00]/20 rounded-lg px-3 py-2 w-full max-w-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>E-mail cadastrado na Lista VIP!</span>
              </div>
            ) : (
              <form onSubmit={handleQuickSubmit} className="flex items-center bg-[#0d1015] border border-white/15 rounded-lg p-1 w-full max-w-sm focus-within:border-white/40 transition-colors">
                <input
                  type="email"
                  required
                  value={quickEmail}
                  onChange={(e) => setQuickEmail(e.target.value)}
                  placeholder="seu.email@exemplo.com"
                  className="bg-transparent border-0 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:ring-0 w-full px-3 py-1.5"
                />
                <button
                  type="submit"
                  className="bg-white text-black font-mono text-xs font-semibold px-4 py-1.5 rounded-md hover:bg-neutral-200 transition-colors uppercase flex-shrink-0 cursor-pointer"
                >
                  CADASTRAR
                </button>
              </form>
            )}
          </div>

          {/* Right 4 Columns: Navigation Links */}
          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono text-xs">
            {/* Column 1: PÁGINAS */}
            <div>
              <h4 className="text-white font-semibold mb-4 tracking-wider uppercase">PÁGINAS</h4>
              <ul className="space-y-2.5 text-neutral-400 font-sans text-xs">
                <li><a className="hover:text-white transition-colors" href="#visao">Visão</a></li>
                <li><a className="hover:text-white transition-colors" href="#ciclos">Ciclos</a></li>
                <li><a className="hover:text-white transition-colors" href="#areas">4 Áreas</a></li>
                <li><a className="hover:text-white transition-colors" href="#metodo">O Método</a></li>
                <li><a className="hover:text-white transition-colors" href="#waitlist">Lista VIP</a></li>
                <li><Link className="hover:text-white transition-colors" href="/login">Login</Link></li>
                <li><Link className="hover:text-white transition-colors" href="/register">Criar Conta</Link></li>
              </ul>
            </div>

            {/* Column 2: METODOLOGIA */}
            <div>
              <h4 className="text-white font-semibold mb-4 tracking-wider uppercase">METODOLOGIA</h4>
              <ul className="space-y-2.5 text-neutral-400 font-sans text-xs">
                <li><span className="text-neutral-400">Estrela-Guia</span></li>
                <li><span className="text-neutral-400">3 Prioridades da Semana</span></li>
                <li><span className="text-neutral-400">Piso Mínimo</span></li>
                <li><span className="text-neutral-400">Review de Domingo</span></li>
                <li><span className="text-neutral-400">Retomada Sem Culpa</span></li>
                <li><span className="text-neutral-400">Zero Streaks Punitivos</span></li>
              </ul>
            </div>

            {/* Column 3: SISTEMA */}
            <div>
              <h4 className="text-white font-semibold mb-4 tracking-wider uppercase">SISTEMA</h4>
              <ul className="space-y-2.5 text-neutral-400 font-sans text-xs">
                <li><span className="text-neutral-400">Trajetta AI</span></li>
                <li><span className="text-neutral-400">Google Gemini Flash</span></li>
                <li><span className="text-neutral-400">Memória Longitudinal</span></li>
                <li><span className="text-neutral-400">Mobile PWA</span></li>
                <li><span className="text-neutral-400">Status em Tempo Real</span></li>
              </ul>
            </div>

            {/* Column 4: LEGAL */}
            <div>
              <h4 className="text-white font-semibold mb-4 tracking-wider uppercase">LEGAL</h4>
              <ul className="space-y-2.5 text-neutral-400 font-sans text-xs">
                <li><a className="hover:text-white transition-colors" href="#waitlist">Termos de Uso</a></li>
                <li><a className="hover:text-white transition-colors" href="#waitlist">Privacidade</a></li>
                <li><a className="hover:text-white transition-colors" href="#waitlist">Soberania dos Dados</a></li>
                <li><a className="hover:text-white transition-colors" href="#contact">Suporte</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar: Copyright, Operational Status & Social links */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-500">
          <div className="flex items-center flex-wrap gap-4">
            <span>© 2026 Trajetta. Todos os direitos reservados.</span>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-neutral-400">Sistema operacional em nuvem</span>
            </div>
          </div>

          {/* Social media icon buttons */}
          <div className="flex items-center gap-2">
            <a
              aria-label="X"
              className="w-8 h-8 rounded-lg bg-[#0e1218] border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white hover:border-white/30 transition-all"
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-bold text-xs">𝕏</span>
            </a>
            <a
              aria-label="GitHub"
              className="w-8 h-8 rounded-lg bg-[#0e1218] border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white hover:border-white/30 transition-all"
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"></path>
              </svg>
            </a>
            <a
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-lg bg-[#0e1218] border border-white/10 flex items-center justify-center text-neutral-300 hover:text-white hover:border-white/30 transition-all"
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="font-bold text-xs">in</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
