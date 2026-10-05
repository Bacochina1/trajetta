'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useTrajetta } from '@/context/TrajettaContext';
import { Lock, Mail, User as UserIcon, Check, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { userProfile, setUserProfile, login } = useTrajetta();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
        login(data.user);
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sua Conta Trajetta">
      <div className="space-y-5">
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
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
              tab === 'register' ? 'bg-[#1F2328] text-[#F2F1ED] shadow-sm' : 'text-[#8E9499] hover:text-[#F2F1ED]'
            }`}
          >
            <span>Criar Conta</span>
            <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
              tab === 'register' ? 'bg-[#B8FF00]/20 text-[#B8FF00]' : 'bg-[#B8FF00]/10 text-[#B8FF00]'
            }`}>
              3D Grátis
            </span>
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
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full h-10 bg-[#111315] border border-white/10 rounded-xl pl-10 pr-10 text-sm text-[#F2F1ED] placeholder:text-white/40 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E9499] hover:text-[#F2F1ED] p-1 transition-colors"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={loading}
            className="w-full font-bold mt-2"
          >
            {loading ? 'Processando...' : tab === 'login' ? 'Entrar no Sistema' : 'Começar 3 Dias Grátis'}
          </Button>
        </form>
      </div>
    </Modal>
  );
}
