'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useTrajetta } from '@/context/TrajettaContext';
import { Lock, Mail, User as UserIcon, Shield, Check, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { userProfile, setUserProfile } = useTrajetta();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleQuickAdmin = async () => {
    setEmail('admin@trajetta.app');
    setPassword('TrajettaAdmin2026!');
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@trajetta.app', password: 'TrajettaAdmin2026!' }),
      });

      const data = await res.json();
      if (data.ok && data.user) {
        setUserProfile({
          name: data.user.name,
          title: 'Membro Fundador (Admin)',
          avatar: data.user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        });
        setSuccess('Logado com sucesso como Admin (Jim)!');
        setTimeout(() => {
          onClose();
          setSuccess(null);
        }, 800);
      } else {
        setError(data.error || 'Erro ao conectar conta admin.');
      }
    } catch {
      setError('Falha de conexão com o servidor de autenticação.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const endpoint = tab === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = tab === 'login' ? { email, password } : { name, email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.ok && data.user) {
        setUserProfile({
          name: data.user.name,
          title: data.user.role === 'ADMIN' ? 'Membro Fundador (Admin)' : 'Explorador',
          avatar: data.user.avatar,
        });
        setSuccess(tab === 'login' ? 'Autenticado com sucesso!' : 'Conta criada com sucesso!');
        setTimeout(() => {
          onClose();
          setSuccess(null);
        }, 800);
      } else {
        setError(data.error || 'Erro na autenticação.');
      }
    } catch {
      setError('Falha ao comunicar com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialMock = (provider: string) => {
    setError(null);
    setSuccess(`Iniciando autenticação com ${provider}...`);
    setTimeout(() => {
      setUserProfile({
        name: `Usuário ${provider}`,
        title: 'Membro Conectado',
      });
      setSuccess(`Conectado com sucesso via ${provider}!`);
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 700);
    }, 600);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sua Conta Trajetta">
      <div className="space-y-5">
        {/* Quick Admin Access Banner */}
        <div className="p-3.5 rounded-xl bg-[#1F2328] border border-[#B8FF00]/30 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B8FF00]/15 border border-[#B8FF00]/30 flex items-center justify-center text-[#B8FF00]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F2F1ED] block">Conta de Administrador (Jim)</span>
              <span className="text-[11px] text-[#8E9499]">admin@trajetta.app</span>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleQuickAdmin}
            disabled={loading}
            className="text-xs py-1 px-3"
          >
            Entrar como Admin
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex rounded-lg bg-[#111315] p-1 border border-white/8">
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              tab === 'login' ? 'bg-[#1F2328] text-[#F2F1ED] shadow-sm' : 'text-[#8E9499] hover:text-[#F2F1ED]'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(null); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              tab === 'register' ? 'bg-[#1F2328] text-[#F2F1ED] shadow-sm' : 'text-[#8E9499] hover:text-[#F2F1ED]'
            }`}
          >
            Criar Conta
          </button>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center gap-2 text-xs text-red-400">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="p-3 rounded-lg bg-[#B8FF00]/10 border border-[#B8FF00]/30 flex items-center gap-2 text-xs text-[#B8FF00]">
            <Check className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label htmlFor="auth-name" className="block text-xs font-semibold text-[#8E9499] uppercase tracking-wider mb-1.5">
                Seu Nome
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9499]" />
                <input
                  id="auth-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como devemos te chamar?"
                  className="w-full h-10 bg-[#111315] border border-white/10 rounded-xl pl-10 pr-4 text-sm text-[#F2F1ED] placeholder:text-white/40 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="auth-email" className="block text-xs font-semibold text-[#8E9499] uppercase tracking-wider mb-1.5">
              E-mail
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9499]" />
              <input
                id="auth-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full h-10 bg-[#111315] border border-white/10 rounded-xl pl-10 pr-4 text-sm text-[#F2F1ED] placeholder:text-white/40 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="auth-password" className="block text-xs font-semibold text-[#8E9499] uppercase tracking-wider mb-1.5">
              Senha
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E9499]" />
              <input
                id="auth-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full h-10 bg-[#111315] border border-white/10 rounded-xl pl-10 pr-4 text-sm text-[#F2F1ED] placeholder:text-white/40 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={loading}
            className="w-full font-bold mt-2"
          >
            {loading ? 'Processando...' : tab === 'login' ? 'Entrar no Sistema' : 'Iniciar Minha Trajetória'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-white/8 w-full" />
          <span className="bg-[#171A1D] px-3 text-[10px] text-[#8E9499] uppercase tracking-widest absolute">
            ou acesse com
          </span>
        </div>

        {/* Social Logins */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleSocialMock('Google')}
            className="flex items-center justify-center gap-2 min-h-[44px] py-2 px-4 rounded-xl bg-[#111315] border border-white/8 hover:border-white/20 text-sm font-medium text-[#F2F1ED] transition-all active:scale-[0.96]"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.4 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.1-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 12s.6 3.6 1.6 5.6l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.4-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialMock('GitHub')}
            className="flex items-center justify-center gap-2 min-h-[44px] py-2 px-4 rounded-xl bg-[#111315] border border-white/8 hover:border-white/20 text-sm font-medium text-[#F2F1ED] transition-all active:scale-[0.96]"
          >
            <svg className="w-4 h-4 fill-current text-[#F2F1ED]" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
