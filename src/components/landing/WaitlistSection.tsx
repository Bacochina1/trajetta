'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  Users,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { trackMarketingEvent } from '@/lib/analytics';
import { useI18n } from '@/lib/i18n/context';

export function WaitlistSection() {
  const { locale } = useI18n();
  const isEn = locale === 'en';
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [activeUsersCount, setActiveUsersCount] = useState<number>(1480);

  useEffect(() => {
    fetch('/api/waitlist')
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.totalCount) {
          setActiveUsersCount(data.totalCount);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage(isEn ? 'Please enter your name.' : 'Por favor, informe seu nome.');
      return;
    }

    if (!email || !email.includes('@')) {
      setErrorMessage(isEn ? 'Please enter a valid email address.' : 'Por favor, informe um e-mail válido.');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage(isEn ? 'Password must be at least 6 characters.' : 'A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      trackMarketingEvent('trial_register_attempt', { email, name, locale });

      // 1. Criar a conta oficial do usuário
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.ok) {
        // Registrar lead com telefone no CRM em paralelo
        fetch('/api/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name, phone }),
        }).catch(() => {});

        trackMarketingEvent('trial_register_success', { email, locale });
        setSuccessMessage(
          isEn 
            ? 'Account activated successfully! Unlocking your system access...'
            : 'Conta ativada com sucesso! Liberando seu acesso ao sistema...'
        );

        setTimeout(() => {
          window.location.href = '/app';
        }, 1000);
      } else {
        if (data.error && data.error.includes('já está cadastrado')) {
          setErrorMessage(
            isEn 
              ? 'This email is already registered. Redirecting to login...'
              : 'Este e-mail já possui cadastro. Redirecionando para login...'
          );
          setTimeout(() => {
            window.location.href = `/login?email=${encodeURIComponent(email)}`;
          }, 1500);
        } else {
          setErrorMessage(
            data.error || (isEn ? 'Error initializing account. Please try again.' : 'Erro ao inicializar seu teste gratuito. Tente novamente.')
          );
        }
      }
    } catch {
      setErrorMessage(
        isEn
          ? 'Network connection error. Check your internet and try again.'
          : 'Erro de conexão com o servidor. Verifique sua internet e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 xs:px-6 sm:px-10 lg:px-14 py-16 sm:py-28 border-t border-white/10" data-purpose="trial-activation" id="waitlist">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3 tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-pulse"></span>
        <span className="text-[#B8FF00] font-semibold">
          {isEn ? '3-Day Free Trial • Instant Access' : '3 Dias de Teste Grátis • Acesso Imediato sem Burocracia'}
        </span>
      </div>

      {/* Section Heading */}
      <div className="max-w-3xl mb-12">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-3 sm:mb-4 [text-wrap:balance]">
          {isEn ? 'Get started immediately ' : 'Comece agora mesmo '}
          <span className="text-[#B8FF00]">{isEn ? 'with 3 days free' : 'sem burocracia'}</span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
          {isEn
            ? 'Set up immediate access in 10 seconds to explore Trajetta AI with 3 days free trial, align your goals across 4 areas, and plan your week with serene mental clarity.'
            : 'Crie seu acesso imediato em 10 segundos com 3 dias de degustação gratuita para explorar a Trajetta AI, alinhar suas metas nas 4 áreas e planejar sua semana com clareza mental e serenidade.'}
        </p>
      </div>

      {/* Central Activation Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#090c10] border border-white/15 p-3.5 xs:p-5 sm:p-10 lg:p-12 overflow-hidden shadow-2xl mb-10 sm:mb-14">
        {/* Subtle background glow */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#B8FF00]/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Form */}
          <div className="lg:col-span-7">
            {successMessage ? (
              <div className="bg-[#12161e] border border-[#B8FF00]/30 rounded-2xl p-6 sm:p-10 space-y-4 text-left shadow-[0_0_30px_rgba(184,255,0,0.15)]">
                <div className="w-12 h-12 rounded-full bg-[#B8FF00]/20 border border-[#B8FF00]/40 flex items-center justify-center text-[#B8FF00]">
                  <CheckCircle2 className="w-7 h-7 animate-pulse" />
                </div>

                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#B8FF00] font-bold">
                    {isEn ? 'Access Unlocked' : 'Acesso Liberado'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                    {successMessage}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
                    {isEn ? 'You will be redirected to your dashboard in a moment.' : 'Você será redirecionado para o seu painel em instantes.'}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#B8FF00] h-full w-full animate-[progress_1s_ease-in-out]" />
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                <div className="flex items-center gap-2 text-[11px] xs:text-xs font-mono text-neutral-300 mb-1 sm:mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#B8FF00]"></span>
                  <span>
                    {isEn
                      ? `Over ${activeUsersCount.toLocaleString('en-US')} active trajectories`
                      : `Mais de ${activeUsersCount.toLocaleString('pt-BR')} trajetórias ativas`}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-3.5">
                  <div>
                    <label className="block text-[11px] xs:text-xs font-mono text-neutral-400 mb-1">
                      {isEn ? 'Full Name' : 'Seu Nome Completo'} <span className="text-[#B8FF00]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={isEn ? "e.g. Alex Morgan" : "Ex.: Lucas Moreira"}
                      className="w-full bg-[#12161f] border border-white/15 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#B8FF00]/60 transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] xs:text-xs font-mono text-neutral-400 mb-1">
                      {isEn ? 'Phone / WhatsApp (Optional)' : 'WhatsApp com DDD (Opcional)'}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={isEn ? "+1 (555) 000-0000" : "(11) 98765-4321"}
                      className="w-full bg-[#12161f] border border-white/15 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#B8FF00]/60 transition-colors font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] xs:text-xs font-mono text-neutral-400 mb-1">
                    {isEn ? 'Your Best Email' : 'Seu Melhor E-mail'} <span className="text-[#B8FF00]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isEn ? "you@example.com" : "seu.email@exemplo.com"}
                    className="w-full bg-[#12161f] border border-white/15 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#B8FF00]/60 transition-colors font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] xs:text-xs font-mono text-neutral-400 mb-1">
                    {isEn ? 'Password' : 'Defina sua Senha de Acesso'}{' '}
                    <span className="text-[#B8FF00]">{isEn ? '* (Min 6 characters)' : '* (Mínimo 6 caracteres)'}</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#12161f] border border-white/15 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 pr-10 text-base sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#B8FF00]/60 transition-colors font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                      aria-label={showPassword ? (isEn ? 'Hide password' : 'Ocultar senha') : (isEn ? 'Show password' : 'Exibir senha')}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-[#B8FF00] hover:bg-[#a6e600] disabled:opacity-50 text-[#060709] text-xs sm:text-sm font-extrabold tracking-wider uppercase px-6 sm:px-8 py-4 rounded-xl transition-all active:scale-95 shadow-[0_0_25px_rgba(184,255,0,0.3)] cursor-pointer mt-2 text-center"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-[#060709] border-t-transparent animate-spin" />
                      {isEn ? 'CREATING YOUR ACCOUNT...' : 'CRIANDO SUA CONTA...'}
                    </span>
                  ) : (
                    <>
                      <span>{isEn ? 'START 3 DAYS FREE • CREATE ACCOUNT' : 'CRIAR MINHA CONTA AGORA • 3 DIAS GRÁTIS'}</span>
                      <ArrowRight className="w-4 h-4 flex-shrink-0" />
                    </>
                  )}
                </button>

                <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-400 pt-1 gap-2">
                  <span>{isEn ? '✓ 3 days free • Secure & instant signup' : '✓ 3 dias grátis para testar • Cadastro seguro e instantâneo'}</span>
                  <span>
                    {isEn ? 'Already have an account? ' : 'Já tem conta? '}
                    <Link href="/login" className="text-[#B8FF00] hover:underline font-semibold">
                      {isEn ? 'Log in' : 'Fazer Login'}
                    </Link>
                  </span>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Pro Perks Guarantee Box */}
          <div className="lg:col-span-5 bg-[#0f131a] border border-white/10 rounded-2xl p-4 xs:p-5 sm:p-7 space-y-4">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-white/10">
              <span className="font-mono text-xs text-neutral-300 uppercase tracking-wider font-semibold">
                {isEn ? 'System Features' : 'Recursos do Sistema'}
              </span>
              <span className="text-[10px] font-mono text-[#B8FF00] bg-[#B8FF00]/15 px-2 py-0.5 rounded font-bold">
                {isEn ? '3 Days Free Included' : '3 Dias Grátis Inclusos'}
              </span>
            </div>

            <div className="space-y-3 font-sans text-xs text-neutral-300 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B8FF00] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>{isEn ? 'Full Access to 4 Areas:' : 'Acesso total às 4 Áreas:'}</strong>{' '}
                  {isEn
                    ? 'Body, Money, Career, and Inner Life without barriers.'
                    : 'Corpo, Dinheiro, Carreira e Vida Pessoal sem bloqueios.'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B8FF00] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>{isEn ? 'Unlimited Trajetta AI:' : 'Trajetta AI ilimitada:'}</strong>{' '}
                  {isEn
                    ? 'Clarity coach with longitudinal contextual memory.'
                    : 'Assistente de clareza com memória longitudinal de contexto.'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B8FF00] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>{isEn ? 'Zero streaks or guilt:' : 'Sem correntes nem punição:'}</strong>{' '}
                  {isEn
                    ? 'Minimum floor framework engineered for real life.'
                    : 'Metodologia de piso mínimo para vida real.'}
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B8FF00] flex-shrink-0 mt-0.5" />
                <span>
                  <strong>{isEn ? 'Instant cancellation:' : 'Cancelamento instantâneo:'}</strong>{' '}
                  {isEn ? 'Zero bureaucracy or surprise charges.' : 'Zero burocracia ou cobranças surpresa.'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 text-center">
              <a
                href="#planos"
                className="inline-flex items-center gap-1.5 text-xs text-[#B8FF00] hover:underline font-semibold"
              >
                <span>
                  {isEn
                    ? 'Prefer direct card checkout with legal guarantee? View Plans'
                    : 'Prefere checkout direto no cartão com garantia legal? Ver Planos'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Value Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="rounded-2xl bg-[#090c10] border border-white/10 p-5 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div>
            <span className="text-xs font-mono text-[#B8FF00] uppercase tracking-wider font-semibold">
              {isEn ? 'Pillar 01' : 'Garantia 01'}
            </span>
            <h3 className="text-base sm:text-lg font-medium text-white mt-1.5 sm:mt-2 mb-2 sm:mb-3">
              {isEn ? 'Consistency in Practice' : 'Consistência na Prática'}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              {isEn
                ? 'Use it in your real routine Monday through Sunday. Feel the quiet relief of an organized mind focused on life as it truly is.'
                : 'Use na sua rotina real de segunda a domingo. Sinta o alívio de uma mente organizada e sem sobrecarga com foco na vida como ela é.'}
            </p>
          </div>
          <div className="pt-4 sm:pt-6 mt-3 sm:mt-4 border-t border-white/5 text-[11px] sm:text-xs font-mono text-neutral-500">
            {isEn ? 'Unrestricted access to all tools' : 'Acesso irrestrito a todos os recursos'}
          </div>
        </div>

        <div className="rounded-2xl bg-[#090c10] border border-white/10 p-5 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div>
            <span className="text-xs font-mono text-[#B8FF00] uppercase tracking-wider font-semibold">
              {isEn ? 'Pillar 02' : 'Garantia 02'}
            </span>
            <h3 className="text-base sm:text-lg font-medium text-white mt-1.5 sm:mt-2 mb-2 sm:mb-3">
              {isEn ? 'North Star Onboarding' : 'Onboarding da Estrela-Guia'}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              {isEn
                ? 'Assisted walkthrough to structure your 12-month trajectory across the 4 core areas and calibrate your baseline safety floors.'
                : 'Roteiro assistido para estruturar seus objetivos de 12 meses nas 4 áreas essenciais e calibrar seus pisos mínimos de segurança.'}
            </p>
          </div>
          <div className="pt-4 sm:pt-6 mt-3 sm:mt-4 border-t border-white/5 text-[11px] sm:text-xs font-mono text-neutral-500">
            {isEn ? 'Step-by-step in your first minutes' : 'Passo a passo nos primeiros minutos'}
          </div>
        </div>

        <div className="rounded-2xl bg-[#090c10] border border-white/10 p-5 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div>
            <span className="text-xs font-mono text-[#B8FF00] uppercase tracking-wider font-semibold">
              {isEn ? 'Pillar 03' : 'Garantia 03'}
            </span>
            <h3 className="text-base sm:text-lg font-medium text-white mt-1.5 sm:mt-2 mb-2 sm:mb-3">
              {isEn ? 'Expanded AI Memory' : 'IA com Memória Expandida'}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              {isEn
                ? 'Exclusive access to our longitudinal AI engine that links weekly reviews and understands your personal capacity over time.'
                : 'Acesso exclusivo ao motor de IA que conecta seus reviews semanais e entende seu ritmo e capacidade ao longo do tempo.'}
            </p>
          </div>
          <div className="pt-4 sm:pt-6 mt-3 sm:mt-4 border-t border-white/5 text-[11px] sm:text-xs font-mono text-neutral-500">
            {isEn ? 'Contextual intelligence without formulas' : 'Inteligência contextual sem fórmulas prontas'}
          </div>
        </div>
      </div>
    </section>
  );
}
