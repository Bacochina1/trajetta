'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/crm/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || 'Credenciais inválidas');
        setLoading(false);
        return;
      }

      router.push('/admin/crm');
    } catch (err) {
      setError('Erro de conexão com o servidor');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060709] text-white flex flex-col justify-center items-center px-4 selection:bg-[#B8FF00] selection:text-black">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-[#B8FF00]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md bg-[#0D1015] border border-white/10 rounded-2xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        {/* Brand Lockup */}
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="flex items-center gap-3 mb-4 group">
            <img
              src="/trajetta-logo-transparent.png"
              alt="Trajetta"
              className="w-9 h-9 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="font-bold text-lg tracking-[0.16em] uppercase text-white">TRAJETTA</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#B8FF00] mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>PAINEL ADMINISTRATIVO & CRM</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Acesso Restrito</h1>
          <p className="text-xs text-neutral-400 mt-1">Gerencie os leads, envie e-mails e acompanhe o lançamento</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2.5 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
              E-mail de Administrador
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[#14181F] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#B8FF00]/60 transition-colors"
                placeholder="admin@trajetta.app"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider mb-2">
              Senha Mestre
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#14181F] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#B8FF00]/60 transition-colors"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-white hover:bg-neutral-100 active:scale-98 text-black font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? 'Verificando...' : 'Entrar no CRM'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-neutral-500 flex items-center justify-between">
          <Link href="/" className="hover:text-white transition-colors">
            ← Voltar para a Landing Page
          </Link>
          <span className="font-mono text-[11px] text-neutral-600">v2.6 Secure</span>
        </div>
      </div>
    </div>
  );
}
