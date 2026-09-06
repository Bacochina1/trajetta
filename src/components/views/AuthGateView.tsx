'use client';

import React, { useState } from 'react';
import { TrajettaLogo } from '@/components/ui/TrajettaLogo';
import { Lock, Mail, User as UserIcon, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface AuthGateViewProps {
  onLoginSuccess: (userData: any) => void;
  initialMode?: 'login' | 'register';
}

export function AuthGateView({ onLoginSuccess, initialMode = 'login' }: AuthGateViewProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = mode === 'login' ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.ok && data.user) {
        setSuccess(mode === 'login' ? 'Autenticado com sucesso!' : 'Conta criada com sucesso!');
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 600);
      } else {
        setError(data.error || 'Credenciais inválidas. Tente novamente.');
      }
    } catch {
      setError('Erro de conexão com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060709] text-[#F2F1ED] flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#B8FF00]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pt-2">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs text-[#8E9499] hover:text-[#F2F1ED] transition-colors py-2"
        >
          <ArrowLeft size={14} />
          <span>Voltar para a página de vendas</span>
        </Link>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md mx-auto my-auto relative z-10">
        <div className="bg-[#0e1218]/90 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {/* Logo & Headline */}
          <div className="text-center pb-6 border-b border-white/8">
            <div className="flex justify-center mb-3">
              <TrajettaLogo size={36} showWordmark wordmarkClassName="text-2xl font-extrabold text-[#F2F1ED] tracking-tight ml-1" />
            </div>
            <p className="text-xs text-[#8E9499] mt-1">
              Planeje para sua vida real, não para sua versão perfeita.
            </p>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 p-1 bg-[#14181f] border border-white/10 rounded-xl my-6">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#8E9499] hover:text-[#F2F1ED]'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(null); }}
              className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-black shadow-md'
                  : 'text-[#8E9499] hover:text-[#F2F1ED]'
              }`}
            >
              Criar Conta
            </button>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3 rounded-lg bg-[#B8FF00]/10 border border-[#B8FF00]/30 text-[#B8FF00] text-xs flex items-center gap-2">
              <CheckCircle2 size={16} className="flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          <div className="mb-5">
            <a
              href="/api/auth/google"
              className="w-full h-11 bg-[#14181F] hover:bg-[#1C222C] text-[#F2F1ED] font-semibold text-xs rounded-xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.99]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
              <span>Continuar com o Google</span>
            </a>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/8" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-mono">
                <span className="bg-[#0e1218] px-2 text-[#8E9499]">ou continue com e-mail</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8E9499] mb-1.5">
                  Nome Completo
                </label>
                <div className="relative">
                  <UserIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9499]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full h-11 pl-10 pr-3.5 bg-[#14181f] border border-white/10 rounded-xl text-xs text-[#F2F1ED] placeholder-[#8E9499]/50 focus:outline-none focus:border-[#B8FF00] focus:ring-1 focus:ring-[#B8FF00] transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8E9499] mb-1.5">
                E-mail
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9499]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full h-11 pl-10 pr-3.5 bg-[#14181f] border border-white/10 rounded-xl text-xs text-[#F2F1ED] placeholder-[#8E9499]/50 focus:outline-none focus:border-[#B8FF00] focus:ring-1 focus:ring-[#B8FF00] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#8E9499] mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9499]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-3.5 bg-[#14181f] border border-white/10 rounded-xl text-xs text-[#F2F1ED] placeholder-[#8E9499]/50 focus:outline-none focus:border-[#B8FF00] focus:ring-1 focus:ring-[#B8FF00] transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 bg-[#B8FF00] hover:bg-[#a3e600] active:scale-[0.99] text-[#0D0F10] font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(184,255,0,0.2)] disabled:opacity-50"
            >
              <span>{loading ? 'Processando...' : mode === 'login' ? 'Entrar no Sistema' : 'Começar 14 Dias Grátis'}</span>
              <ArrowRight size={14} />
            </button>

            {mode === 'login' ? (
              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setEmail('bacochinamatheus@gmail.com');
                    setPassword('Trajetta2026!');
                    setError(null);
                  }}
                  className="text-[11px] text-[#8E9499] hover:text-[#B8FF00] transition-colors font-mono underline decoration-dotted"
                >
                  Preencher dados de Fundador (Matheus)
                </button>
              </div>
            ) : (
              <div className="pt-2 text-center text-[11px] text-[#8E9499] font-mono">
                ✓ 14 dias grátis sem necessidade de cartão de crédito
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[#8E9499]/60 pb-2">
        <span>© 2026 Trajetta. Privacidade rigorosa e controle total dos seus dados.</span>
      </div>
    </div>
  );
}
