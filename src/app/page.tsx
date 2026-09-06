'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrajettaLogo } from '@/components/ui/TrajettaLogo';
import { useTrajetta } from '@/context/TrajettaContext';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  ArrowRight,
  Brain,
  Activity,
  Landmark,
  Briefcase,
  HeartHandshake,
  Check,
  RotateCcw,
  Copy,
  Share2,
  Bookmark,
  MoreHorizontal,
  ChevronRight,
  Sparkles as SparklesIcon,
  ShieldCheck,
  Send,
  Sliders,
  CheckCheck,
  User,
  LogOut,
  Mail,
  Sparkles,
  X,
  Shield,
  ExternalLink
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, user, logout } = useTrajetta();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(1482);
  const [waitlistResult, setWaitlistResult] = useState<{
    position: number;
    name: string;
    email: string;
    emailHtml: string;
    alreadyRegistered: boolean;
  } | null>(null);
  const [showVipPassModal, setShowVipPassModal] = useState(false);
  const [showEmailPreviewModal, setShowEmailPreviewModal] = useState(false);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [activeUseCase, setActiveUseCase] = useState<number>(0);
  const [footerEmail, setFooterEmail] = useState('');
  const [footerSubmitted, setFooterSubmitted] = useState(false);

  useEffect(() => {
    fetch('/api/waitlist')
      .then((res) => res.json())
      .then((data) => {
        if (data?.ok && data.totalCount) {
          setWaitlistCount(data.totalCount);
        }
      })
      .catch(() => {});
  }, []);

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, source: 'mosa_sales_page_hero' }),
      });
      const data = await res.json();
      if (data?.ok) {
        setSubmitted(true);
        if (data.totalCount) setWaitlistCount(data.totalCount);
        setWaitlistResult({
          position: data.position || waitlistCount,
          name: data.name || name || 'Membro',
          email: data.email || email,
          emailHtml: data.emailHtml || '',
          alreadyRegistered: Boolean(data.alreadyRegistered),
        });
        setShowVipPassModal(true);
        try {
          confetti({
            particleCount: 85,
            spread: 75,
            origin: { y: 0.6 },
            colors: ['#B8FF00', '#58D6A7', '#FFFFFF', '#6FAEF7'],
          });
        } catch {
          // ignore
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!footerEmail) return;
    try {
      await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: footerEmail, source: 'footer_newsletter' }),
      });
      setFooterSubmitted(true);
    } catch {
      // ignore
    }
  };

  const useCases = [
    {
      title: 'Corpo & Saúde',
      area: 'corpo',
      headline: 'Sustente constância física e vitalidade sem viver no tudo-ou-nada.',
      description: 'Defina metas claras como construir uma rotina sustentável de treinos, regular o sono e fortalecer sua energia diária. Registre o ritmo real da sua rotina.',
      accent: '#58D6A7',
      mockupLabel: 'Meta Ativa: Rotina de Treinos 4x',
      mockupStatus: '65% concluído • 4 dias consistentes na semana',
      actionTitle: 'Treino de força e mobilidade',
    },
    {
      title: 'Dinheiro & Finanças',
      area: 'dinheiro',
      headline: 'Construa sua reserva e patrimônio com previsibilidade matemática.',
      description: 'Aporte de forma consistente, acompanhe marcos de liquidez e blinde sua estabilidade emocional contra decisões impulsivas.',
      accent: '#F08A76',
      mockupLabel: 'Meta Ativa: Reserva R$ 50.000',
      mockupStatus: '72% concluído • R$ 36.000 acumulados',
      actionTitle: 'Aporte programado da semana',
    },
    {
      title: 'Carreira & Negócios',
      area: 'carreira',
      headline: 'Avance estrategicamente sem sacrificar sua vida pessoal.',
      description: 'Mapeie promoções, entregas de alto impacto e expansão profissional enquanto mantém um teto saudável de capacidade semanal.',
      accent: '#A98CF7',
      mockupLabel: 'Meta Ativa: Transição para Head de Produto',
      mockupStatus: '60% concluído • Liderança estratégica',
      actionTitle: 'Alinhar roadmap do trimestre',
    },
    {
      title: 'Vida & Equilíbrio',
      area: 'vida',
      headline: 'Feche cada semana com clareza mental e paz de espírito.',
      description: 'Nossa revisão semanal guiada de 4 etapas ajuda você a calibrar vitórias, absorver aprendizados e planejar os próximos 7 dias.',
      accent: '#6FAEF7',
      mockupLabel: 'Revisão Semanal: Semana 14 de 52',
      mockupStatus: '85% de consistência • 0 atrito',
      actionTitle: 'Revisão Dominical guiada pela IA',
    },
  ];

  return (
    <div className="bg-[#060709] text-white min-h-screen selection:bg-[#B8FF00]/20 selection:text-[#B8FF00] overflow-x-hidden font-sans">
      <style>{`
        .portal-frame {
          box-shadow: 0 0 45px 10px rgba(184, 255, 0, 0.35), 0 0 100px 30px rgba(184, 255, 0, 0.18), inset 0 0 20px 4px rgba(184, 255, 0, 0.45);
        }
        .portal-reflection {
          box-shadow: 0 0 60px 20px rgba(184, 255, 0, 0.25);
          filter: blur(8px);
        }
        .hero-bottom-fade {
          background: linear-gradient(to bottom, transparent 65%, #060709 100%);
        }
      `}</style>

      {/* BEGIN: HeroSection */}
      <section className="relative w-full min-h-[1020px] flex flex-col justify-between overflow-hidden" data-purpose="hero-section">
        {/* Cinematic Backdrop with Luminous North Star Portal, Mountains, Water */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" data-purpose="cinematic-backdrop">
          {/* Dark atmospheric sky gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#172028] via-[#0e141a] to-[#060709]"></div>

          {/* Mountain silhouettes */}
          <svg className="absolute w-full h-[85%] bottom-0 opacity-40 mix-blend-multiply" fill="none" preserveAspectRatio="none" viewBox="0 0 1440 800">
            <path d="M0 450L210 260L460 380L720 220L980 340L1240 180L1440 320V800H0V450Z" fill="#080c10"></path>
            <path d="M-100 520L280 320L580 440L880 290L1180 410L1480 260V800H-100V520Z" fill="#040608" opacity="0.8"></path>
          </svg>

          {/* Soaring silhouettes */}
          <div className="absolute inset-0 z-10 pointer-events-none opacity-75">
            <svg className="absolute top-[12%] left-[17%] w-24 h-24 text-black opacity-80 drop-shadow-md transform -rotate-12" fill="currentColor" viewBox="0 0 100 100">
              <path d="M50 42 C40 20 20 12 0 18 C15 32 35 44 48 48 C38 62 20 72 5 78 C25 76 42 66 52 52 C62 66 79 76 99 78 C84 72 66 62 56 48 C69 44 89 32 104 18 C84 12 64 20 54 42 Z"></path>
            </svg>
            <svg className="absolute top-[9%] left-[38%] w-28 h-28 text-black opacity-80 drop-shadow-md transform rotate-6" fill="currentColor" viewBox="0 0 100 100">
              <path d="M48 44 C36 24 16 16 0 20 C16 32 34 44 46 48 C34 64 16 75 0 80 C22 78 38 68 50 54 C60 68 76 78 98 80 C82 75 64 64 52 48 C64 44 82 32 98 20 C82 16 62 24 50 44 Z"></path>
            </svg>
            <svg className="absolute top-[20%] left-[24%] w-24 h-24 text-black opacity-80 transform -rotate-45" fill="currentColor" viewBox="0 0 100 100">
              <path d="M50 42 C40 20 20 12 0 18 C15 32 35 44 48 48 C38 62 20 72 5 78 C25 76 42 66 52 52 C62 66 79 76 99 78 C84 72 66 62 56 48 C69 44 89 32 104 18 C84 12 64 20 54 42 Z"></path>
            </svg>
          </div>

          {/* Luminous North Star Portal Doorway */}
          <div className="absolute left-[48%] top-[240px] -translate-x-1/2 flex flex-col items-center pointer-events-none">
            {/* Portal structure themed in Trajetta Neon Lime */}
            <div className="w-[88px] h-[175px] border-[2.5px] border-[#B8FF00]/90 portal-frame bg-[#B8FF00]/10 backdrop-blur-[2px] relative z-20 rounded-[3px]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#B8FF00]/35 via-[#B8FF00]/15 to-transparent"></div>
            </div>
            {/* Water waterline divide */}
            <div className="w-[380px] h-[2px] bg-gradient-to-r from-transparent via-[#B8FF00]/50 to-transparent my-1 blur-[1px]"></div>
            {/* Water reflection */}
            <div className="w-[82px] h-[160px] bg-gradient-to-b from-[#B8FF00]/30 to-transparent portal-reflection opacity-65 transform scale-y-95"></div>
          </div>

          {/* Bottom fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060709] via-transparent to-transparent opacity-95"></div>
          <div className="absolute inset-0 hero-bottom-fade"></div>
        </div>

        {/* BEGIN: MainHeader */}
        <header className="relative z-50 max-w-[1440px] w-full mx-auto px-3.5 sm:px-10 lg:px-14 pt-4 sm:pt-8 flex items-center justify-between" data-purpose="site-header">
          {/* Brand Logo without black container */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 text-white tracking-wider group min-w-0">
            <TrajettaLogo size={28} showWordmark wordmarkClassName="font-extrabold text-base sm:text-lg tracking-tight text-white truncate" />
          </Link>

          {/* Navigation Pill & Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2.5 flex-shrink-0">
            <nav className="hidden md:flex items-center bg-[#14181f]/85 backdrop-blur-md rounded-full px-5 py-2 border border-white/10 text-[13px] font-medium text-neutral-300 space-x-6 shadow-xl">
              <a className="hover:text-white transition-colors duration-200" href="#overview">Visão Geral</a>
              <a className="hover:text-white transition-colors duration-200" href="#use-cases">4 Áreas</a>
              <a className="hover:text-white transition-colors duration-200" href="#how-it-works">Como Funciona</a>
              <a className="hover:text-white transition-colors duration-200" href="#pricing">Planos</a>
            </nav>

            {isAuthenticated ? (
              <div className="flex items-center space-x-1.5 sm:space-x-2.5">
                <Link
                  href="/app"
                  className="bg-[#B8FF00] hover:bg-[#a5e600] active:scale-95 text-[#0D0F10] text-[11px] sm:text-[12px] font-bold tracking-wide uppercase px-3 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-200 flex items-center space-x-1 sm:space-x-1.5 shadow-lg shadow-[#B8FF00]/20"
                >
                  <User size={13} className="text-[#0D0F10]" />
                  <span>Dashboard</span>
                  <ArrowRight size={13} className="mt-[-1px]" />
                </Link>

                <button
                  onClick={logout}
                  title="Sair da conta"
                  className="bg-[#14181f]/90 hover:bg-[#1a212b] hover:text-red-400 text-neutral-400 text-[11px] sm:text-[12px] font-semibold p-2 sm:p-2.5 rounded-full border border-white/10 transition-colors duration-200 flex items-center justify-center"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 sm:space-x-2">
                <a
                  href="#how-it-works"
                  className="bg-[#B8FF00] hover:bg-[#a5e600] active:scale-95 text-[#0D0F10] text-[11px] sm:text-[12px] font-bold tracking-wide uppercase px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all duration-200 flex items-center space-x-1 sm:space-x-1.5 shadow-lg shadow-[#B8FF00]/20"
                >
                  <span>Começar</span>
                  <ArrowRight size={13} className="mt-[-1px]" />
                </a>

                <Link
                  href="/app"
                  className="bg-[#14181f]/90 hover:bg-[#1a212b] text-white text-[11px] sm:text-[12px] font-semibold tracking-wider uppercase px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-white/10 transition-colors duration-200"
                >
                  LOGIN
                </Link>
              </div>
            )}
          </div>
        </header>
        {/* END: MainHeader */}

        {/* BEGIN: HeroContent */}
        <div className="relative z-30 max-w-[1440px] w-full mx-auto px-3.5 sm:px-10 lg:px-14 pt-20 sm:pt-32 pb-14 sm:pb-20 mt-auto" data-purpose="hero-content" id="overview">
          <div className="max-w-3xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 rounded-full bg-[#14181f] border border-white/10 text-[10px] sm:text-[11px] font-mono text-[#B8FF00] mb-5 sm:mb-6 max-w-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-pulse flex-shrink-0" />
              <span className="truncate">SISTEMA DE EVOLUÇÃO PARA A VIDA REAL</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[70px] leading-[1.08] font-normal tracking-[-0.03em] text-white">
              O Sistema Completo para<br />
              <span className="text-[#B8FF00] font-medium">Sua Evolução Pessoal.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 sm:mt-6 text-sm sm:text-lg text-neutral-300/85 font-normal max-w-xl leading-relaxed tracking-tight">
              Planeje para sua vida real, não para sua versão perfeita. Metas de longo prazo, hábitos com ritmo sustentável, revisão semanal guiada e IA com memória viva da sua trajetória.
            </p>

            {/* CTA Action Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/app"
                    className="inline-flex items-center justify-center bg-[#B8FF00] hover:bg-[#a5e600] active:scale-95 text-[#0D0F10] text-[11px] sm:text-[12px] font-bold tracking-[0.08em] uppercase px-6 sm:px-8 py-3.5 rounded-full transition-all duration-150 shadow-xl shadow-[#B8FF00]/25 w-full sm:w-auto"
                  >
                    <span>IR PARA MEU DASHBOARD</span>
                    <ArrowRight size={15} className="ml-2" />
                  </Link>

                  <span className="text-xs font-mono text-neutral-400 pl-1 flex items-center gap-2 justify-center sm:justify-start">
                    <span className="w-2 h-2 rounded-full bg-[#B8FF00] animate-pulse" />
                    <span>Conectado como <strong className="text-white">{user.name || 'Membro'}</strong></span>
                  </span>
                </>
              ) : (
                <>
                  <a
                    href="#how-it-works"
                    className="inline-flex items-center justify-center bg-[#B8FF00] hover:bg-[#a5e600] active:scale-95 text-[#0D0F10] text-[11px] sm:text-[12px] font-bold tracking-[0.08em] uppercase px-6 sm:px-7 py-3.5 rounded-full transition-all duration-150 shadow-xl shadow-[#B8FF00]/25 w-full sm:w-auto text-center"
                  >
                    <span>ENTRAR NA LISTA VIP</span>
                    <ArrowRight size={15} className="ml-2" />
                  </a>

                  <Link
                    href="/app"
                    className="inline-flex items-center justify-center bg-[#14181f]/80 hover:bg-[#1c232d] backdrop-blur-md text-white border border-white/20 text-[11px] sm:text-[12px] font-bold tracking-[0.08em] uppercase px-6 sm:px-7 py-3.5 rounded-full transition duration-150 w-full sm:w-auto text-center"
                  >
                    <span>ACESSAR PLATAFORMA</span>
                    <ChevronRight size={15} className="ml-1.5 text-neutral-400" />
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Social Proof / Methodology Row */}
          <div className="mt-16 sm:mt-24 pt-8 flex flex-col md:flex-row md:items-center justify-end text-xs text-neutral-400 gap-y-2 border-t border-white/5" data-purpose="social-proof">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-normal tracking-normal text-[13px]">
              <span className="text-neutral-500 font-normal mr-1">Metodologia baseada em</span>
              <span className="text-neutral-200 font-medium">James Clear (Hábitos Atômicos)</span>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-200 font-medium">Tiago Forte (Segundo Cérebro)</span>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-200 font-medium">Metodologia OKR</span>
              <span className="text-neutral-600">/</span>
              <span className="text-[#B8FF00] font-medium">Calm Power Design</span>
            </div>
          </div>
        </div>
        {/* END: HeroContent */}
      </section>
      {/* END: HeroSection */}

      {/* BEGIN: SectionHeader */}
      <section className="relative z-20 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 pt-20 pb-12" data-purpose="sub-section-header">
        <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-wide text-neutral-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
          <span>A Nova Forma de Evoluir</span>
        </div>
        <h2 className="text-3xl sm:text-5xl lg:text-[56px] font-normal tracking-tight leading-[1.1]">
          <span className="text-white">Sustente o ritmo da sua vida,</span>
          <br />
          <span className="text-[#555d68]">sem ansiedade e sem recaídas silenciosas.</span>
        </h2>
      </section>
      {/* END: SectionHeader */}

      {/* BEGIN: FeatureCardsGrid (Authentic App Mockups) */}
      <section className="relative z-20 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 pb-32" data-purpose="feature-cards">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CARD 1: Ritmo Sustentável (Habits & Routine Pipeline) */}
          <div className="flex flex-col group">
            <div className="relative w-full aspect-[4/3.5] rounded-xl overflow-hidden border border-white/10 bg-[#0c0e12] flex items-center justify-center p-6 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-[#11161d] to-[#1c242e] opacity-80"></div>
              <svg className="absolute inset-0 w-full h-full opacity-30 object-cover" preserveAspectRatio="none" viewBox="0 0 400 300">
                <path d="M0 160L80 110L170 170L260 90L340 140L400 100V300H0Z" fill="#040608"></path>
              </svg>

              {/* Real Habit Flow Nodes from Trajetta */}
              <div className="relative z-10 w-full max-w-[260px] flex flex-col items-center">
                <div className="bg-[#14181f]/95 border border-[#B8FF00]/30 text-[11px] font-mono text-[#B8FF00] px-3.5 py-1.5 rounded-lg shadow-lg flex items-center gap-1.5">
                  <Activity size={12} />
                  <span>06:30 • Rotina Matinal (Corpo)</span>
                </div>
                <div className="w-[1px] h-4 bg-white/20"></div>

                <div className="w-full bg-[#14181f]/95 border border-white/10 px-3 py-2 rounded-lg flex items-center justify-between text-[11px] font-mono text-neutral-200 shadow-lg">
                  <div className="flex items-center space-x-2 truncate">
                    <CheckCircle2 size={14} className="text-[#58D6A7] flex-shrink-0" />
                    <span className="truncate">Treino de Força & Mobilidade</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#58D6A7]/15 text-[#58D6A7]">Feito</span>
                </div>
                <div className="w-[1px] h-4 bg-white/20"></div>

                <div className="w-full bg-[#14181f]/95 border border-white/10 px-3 py-2 rounded-lg flex items-center justify-between text-[11px] font-mono text-neutral-300 shadow-lg">
                  <div className="flex items-center space-x-2 truncate">
                    <Brain size={14} className="text-[#B8FF00] flex-shrink-0" />
                    <span className="truncate">Consistência Semanal: 82%</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white">4/4 dias</span>
                </div>
                <div className="w-[1px] h-4 bg-white/20"></div>

                <div className="w-full bg-[#14181f]/95 border border-white/10 px-3 py-2 rounded-lg flex items-center space-x-2 text-[11px] font-mono text-neutral-400 shadow-lg">
                  <RotateCcw size={13} className="text-neutral-400 flex-shrink-0" />
                  <span className="truncate">Revisão Dominical programada</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-base font-medium font-mono text-white tracking-wide flex items-center gap-2">
                <span>Ritmo Sustentável</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#58D6A7]/15 text-[#58D6A7]">Zero Culpa</span>
              </h3>
              <p className="mt-2 text-sm text-neutral-400 font-light leading-relaxed">
                Automatize hábitos diários sem streaks artificiais que punem imprevistos reais. Se você deslizar um dia, o sistema recalibra o piso sem zerar seu progresso acumulado.
              </p>
            </div>
          </div>

          {/* CARD 2: IA com Memória Viva (Strategic AI Coach Mockup) */}
          <div className="flex flex-col group">
            <div className="relative w-full aspect-[4/3.5] rounded-xl overflow-hidden border border-white/10 bg-[#0c0e12] flex items-center justify-center p-5 sm:p-6 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-[#12161d] to-[#1a232f] opacity-75"></div>

              {/* Trajetta AI Coach Chat Dialog Modal */}
              <div className="relative z-10 w-full max-w-[320px] bg-[#14181f]/95 border border-white/15 rounded-xl p-4 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-2.5 border-b border-white/8">
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 rounded-full bg-[#B8FF00]/20 flex items-center justify-center text-[#B8FF00]">
                      <Brain size={12} />
                    </div>
                    <span className="text-xs font-mono font-medium text-white">Trajetta AI • Memória Ativa</span>
                  </div>
                  <span className="text-[9px] font-mono text-[#8E9499]">NVIDIA DeepSeek</span>
                </div>

                <div className="pt-3 pb-3 text-[11px] leading-relaxed space-y-2">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-neutral-300">
                    <span className="text-[9px] font-mono text-[#8E9499] block mb-0.5">Matheus:</span>
                    "Estou pensando em reduzir os treinos esse mês por causa do trabalho."
                  </div>
                  <div className="p-2 rounded-lg bg-[#B8FF00]/10 border border-[#B8FF00]/20 text-[#F2F1ED] text-[10.5px]">
                    <span className="text-[9px] font-mono text-[#B8FF00] block mb-0.5">Trajetta Coach:</span>
                    "Decisão madura, Matheus. Na sua rotina de saúde física, manter 2 treinos curtos preserva 85% da sua vitalidade sem quebrar seu foco na transição para Head de Produto."
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/8 text-neutral-400 text-xs">
                  <div className="flex items-center space-x-3">
                    <button className="hover:text-white" title="Regenerar"><RotateCcw size={12} /></button>
                    <button className="hover:text-white" title="Copiar"><Copy size={12} /></button>
                    <button className="hover:text-white" title="Salvar"><Bookmark size={12} /></button>
                  </div>
                  <span className="text-[9px] font-mono text-[#B8FF00]">Memória Ativa</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-base font-medium font-mono text-white tracking-wide flex items-center gap-2">
                <span>IA com Memória Viva</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B8FF00]/15 text-[#B8FF00]">Contextual</span>
              </h3>
              <p className="mt-2 text-sm text-neutral-400 font-light leading-relaxed">
                Um estrategista que lembra quem você é, de suas metas em corpo, dinheiro e carreira, e evolui junto com as fases reais da sua vida. Sem conselhos genéricos de internet.
              </p>
            </div>
          </div>

          {/* CARD 3: Visão Integrada (Metas & Life Areas Mockup) */}
          <div className="flex flex-col group">
            <div className="relative w-full aspect-[4/3.5] rounded-xl overflow-hidden border border-white/10 bg-[#0c0e12] flex items-center justify-center p-6 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[#08090b] via-[#10141a] to-[#1c242c] opacity-80"></div>
              <svg className="absolute inset-0 w-full h-full opacity-30 object-cover" preserveAspectRatio="none" viewBox="0 0 400 300">
                <path d="M0 130L90 180L210 110L290 170L400 90V300H0Z" fill="#040608"></path>
              </svg>

              {/* 3 Core Life Area Action Chips */}
              <div className="relative z-10 w-full max-w-[280px] space-y-2.5">
                {/* Chip 1: Corpo */}
                <div className="bg-[#14181f]/95 border border-white/15 px-3 py-2 rounded-xl flex items-center justify-between text-[11px] shadow-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2 text-neutral-200 truncate mr-2">
                    <Activity size={14} className="text-[#58D6A7] flex-shrink-0" />
                    <span className="truncate font-mono">Rotina de Treinos 4x</span>
                  </div>
                  <span className="bg-[#58D6A7]/20 text-[#58D6A7] font-semibold text-[10px] px-2.5 py-0.5 rounded-md flex-shrink-0">
                    48%
                  </span>
                </div>

                {/* Chip 2: Dinheiro */}
                <div className="bg-[#14181f]/95 border border-white/15 px-3 py-2 rounded-xl flex items-center justify-between text-[11px] shadow-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2 text-neutral-200 truncate mr-2">
                    <Landmark size={14} className="text-[#F08A76] flex-shrink-0" />
                    <span className="truncate font-mono">Reserva R$ 50.000</span>
                  </div>
                  <span className="bg-[#F08A76]/20 text-[#F08A76] font-semibold text-[10px] px-2.5 py-0.5 rounded-md flex-shrink-0">
                    72%
                  </span>
                </div>

                {/* Chip 3: Carreira */}
                <div className="bg-[#14181f]/95 border border-white/15 px-3 py-2 rounded-xl flex items-center justify-between text-[11px] shadow-lg backdrop-blur-sm">
                  <div className="flex items-center space-x-2 text-neutral-200 truncate mr-2">
                    <Briefcase size={14} className="text-[#A98CF7] flex-shrink-0" />
                    <span className="truncate font-mono">Head de Produto</span>
                  </div>
                  <span className="bg-[#A98CF7]/20 text-[#A98CF7] font-semibold text-[10px] px-2.5 py-0.5 rounded-md flex-shrink-0">
                    60%
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-base font-medium font-mono text-white tracking-wide flex items-center gap-2">
                <span>Visão Integrada</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#A98CF7]/15 text-[#A98CF7]">4 Dimensões</span>
              </h3>
              <p className="mt-2 text-sm text-neutral-400 font-light leading-relaxed">
                Suas metas distribuídas com clareza em Corpo, Dinheiro, Carreira e Vida. Elimine a fragmentação entre dezenas de ferramentas e veja todo o seu progresso em um único painel.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* END: FeatureCardsGrid */}

      {/* BEGIN: UseCasesSection (4 Life Areas) */}
      <section className="max-w-[1440px] mx-auto px-3.5 sm:px-10 lg:px-14 py-12 sm:py-16 border-t border-white/10" data-purpose="use-cases" id="use-cases">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
          <span>4 Áreas Fundamentais</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-6 sm:mb-8">
          Quatro dimensões da sua vida, <span className="text-neutral-500">em um só ecossistema.</span>
        </h2>

        {/* Tab Navigation List */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 border-b border-white/10 pb-3 mb-8 sm:mb-10 text-xs font-mono">
          {useCases.map((uc, i) => (
            <button
              key={uc.title}
              onClick={() => setActiveUseCase(i)}
              className={`pb-3 -mb-[13px] font-medium tracking-wide transition-all ${
                activeUseCase === i
                  ? 'text-[#B8FF00] border-b-2 border-[#B8FF00]'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {uc.title}
            </button>
          ))}
        </div>

        {/* Tab Body: Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Mockup Preview */}
          <div className="lg:col-span-7 rounded-2xl bg-[#090d12] border border-white/10 relative overflow-hidden min-h-[320px] sm:min-h-[380px] p-4 sm:p-6 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#030507] via-[#0d121a] to-[#151c27] opacity-80"></div>
            <div className="relative z-10 w-full max-w-md bg-[#14181f]/95 border border-white/15 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/8">
                <span className="text-xs font-mono font-medium text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: useCases[activeUseCase].accent }} />
                  <span>{useCases[activeUseCase].mockupLabel}</span>
                </span>
                <span className="text-[10px] font-mono text-neutral-400">Ativa</span>
              </div>
              <p className="text-xs text-neutral-300">
                {useCases[activeUseCase].mockupStatus}
              </p>
              <div className="p-3 sm:p-3.5 rounded-xl bg-black/40 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-2.5 text-xs text-neutral-200 truncate mr-2">
                  <CheckCircle2 size={16} className="text-[#B8FF00] flex-shrink-0" />
                  <span className="truncate">{useCases[activeUseCase].actionTitle}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white flex-shrink-0">Hoje</span>
              </div>
            </div>
          </div>

          {/* Right Side: Content Details */}
          <div className="lg:col-span-5 flex flex-col items-start pl-0 lg:pl-6">
            <span className="text-xs font-mono text-neutral-400 mb-2 sm:mb-3 tracking-wider">
              {useCases[activeUseCase].title}
            </span>
            <h3 className="text-xl sm:text-3xl font-medium leading-snug text-white mb-3 sm:mb-4">
              {useCases[activeUseCase].headline}
            </h3>
            <p className="text-sm text-neutral-400 font-light leading-relaxed mb-6">
              {useCases[activeUseCase].description}
            </p>
            <a
              href="#how-it-works"
              className="bg-[#B8FF00] text-[#0D0F10] font-bold text-xs font-mono px-6 py-3 rounded-full hover:bg-[#a5e600] transition-all uppercase tracking-wider w-full sm:w-auto text-center"
            >
              Começar Agora
            </a>
          </div>
        </div>
      </section>
      {/* END: UseCasesSection */}

      {/* BEGIN: HowItWorksSection */}
      <section className="max-w-[1440px] mx-auto px-3.5 sm:px-10 lg:px-14 py-12 sm:py-16 border-t border-white/10" data-purpose="how-it-works" id="how-it-works">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
          <span>Como Funciona</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-8 sm:mb-12">
          Um processo sóbrio em <span className="text-neutral-500">três passos para clareza absoluta.</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Side: Waitlist / VIP Form */}
          <div className="lg:col-span-7 rounded-2xl bg-[#090d12] border border-white/10 relative overflow-hidden min-h-[340px] sm:min-h-[380px] p-4 sm:p-6 flex items-end justify-center">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-[#0c1017] to-[#141a24] opacity-90"></div>
            <div className="relative z-10 w-full bg-[#0e1218]/95 border border-white/15 rounded-2xl p-4 sm:p-6 shadow-2xl mb-2">
              <div className="text-xs font-mono text-[#B8FF00] mb-2 tracking-wide flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]" />
                <span>Lista VIP de Acesso Antecipado ({waitlistCount} inscritos)</span>
              </div>
              <p className="text-xs text-neutral-300 mb-4">
                Garanta sua vaga como Membro Fundador com benefícios vitalícios de IA.
              </p>

              {submitted ? (
                <div className="p-4 sm:p-5 rounded-xl bg-[#090C10] border border-[#B8FF00]/40 text-xs space-y-4 shadow-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#B8FF00]/15 border border-[#B8FF00]/40 flex items-center justify-center text-[#B8FF00] flex-shrink-0 mt-0.5">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm block">
                        Vaga #{waitlistResult?.position || waitlistCount} Confirmada com Sucesso!
                      </span>
                      <span className="text-neutral-400 text-xs block mt-1 leading-relaxed">
                        {waitlistResult?.alreadyRegistered
                          ? 'Seu e-mail já estava registrado na Lista VIP prioritária.'
                          : 'Enviamos o e-mail oficial com seu Founder Pass e instruções de ativação.'}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => setShowVipPassModal(true)}
                      className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-lg bg-[#B8FF00] text-[#0D0F10] font-mono text-[11px] font-bold uppercase tracking-wider hover:bg-[#a5e600] transition-colors flex items-center gap-1.5 shadow-md shadow-[#B8FF00]/20"
                    >
                      <Shield size={13} />
                      <span>Ver Cartão VIP Founder</span>
                    </button>

                    {waitlistResult?.emailHtml && (
                      <button
                        type="button"
                        onClick={() => setShowEmailPreviewModal(true)}
                        className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-lg bg-[#14181f] text-neutral-200 border border-white/15 font-mono text-[11px] font-semibold hover:text-white hover:border-white/30 transition-colors flex items-center gap-1.5"
                      >
                        <Mail size={13} className="text-[#B8FF00]" />
                        <span>Visualizar E-mail Recebido</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleWaitlistSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    className="w-full h-10 px-3 bg-[#14181f] border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#B8FF00]"
                  />
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@exemplo.com"
                      className="flex-1 h-10 px-3 bg-[#14181f] border border-white/10 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#B8FF00]"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="h-10 px-5 bg-[#B8FF00] text-[#0D0F10] font-mono text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-[#a5e600] transition-all flex items-center justify-center gap-1.5 flex-shrink-0 w-full sm:w-auto"
                    >
                      <span>{loading ? '...' : 'Garantir Vaga'}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Right Side: 3 Steps Stepper */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8 pl-0 lg:pl-6">
            <div className="border-l-2 border-[#B8FF00] pl-5 relative">
              <div className="flex items-center gap-2 text-sm font-mono text-white font-medium mb-1.5">
                <span>1 — Defina suas Metas de Longo Prazo</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Selecione as áreas prioritárias (Corpo, Dinheiro, Carreira, Vida) e divida objetivos ambiciosos em marcos trimestrais executáveis.
              </p>
            </div>

            <div className="border-l-2 border-white/20 pl-5 relative">
              <div className="flex items-center gap-2 text-sm font-mono text-neutral-200 font-medium mb-1.5">
                <span>2 — Sustente Hábitos Diários sem Culpa</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Execute suas ações semanais no ritmo real da sua vida. Dias difíceis não apagam sua consistência acumulada.
              </p>
            </div>

            <div className="border-l-2 border-white/20 pl-5 relative">
              <div className="flex items-center gap-2 text-sm font-mono text-neutral-200 font-medium mb-1.5">
                <span>3 — Revise e Calibre com a IA</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                Aos domingos, faça a revisão semanal guiada com seu estrategista de IA, que lembra de toda a sua trajetória e orienta os próximos passos.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* END: HowItWorksSection */}

      {/* BEGIN: PricingSection */}
      <section className="max-w-[1440px] mx-auto px-3.5 sm:px-10 lg:px-14 py-12 sm:py-16 border-t border-white/10" data-purpose="pricing-plans" id="pricing">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3 tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
          <span>Planos & Investimento</span>
        </div>
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-6 sm:mb-8">
          Escolha o plano ideal <span className="text-neutral-500">para o seu horizonte.</span>
        </h2>

        {/* Toggle Switch */}
        <div className="flex items-center gap-3 text-xs font-mono mb-8 sm:mb-12">
          <span className={billingCycle === 'monthly' ? 'text-white font-medium' : 'text-neutral-400'}>Mensal</span>
          <div
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="w-11 h-6 bg-[#161a22] border border-white/20 rounded-full p-0.5 flex items-center cursor-pointer select-none"
          >
            <div
              className={`w-4 h-4 bg-[#B8FF00] rounded-full transition-transform ${
                billingCycle === 'yearly' ? 'translate-x-5' : 'translate-x-0'
              }`}
            ></div>
          </div>
          <span className={billingCycle === 'yearly' ? 'text-white font-medium' : 'text-neutral-400'}>Anual</span>
          <span className="bg-[#B8FF00]/15 text-[#B8FF00] border border-[#B8FF00]/30 font-mono text-[10px] px-2 py-0.5 rounded-full font-medium ml-1">
            20% OFF
          </span>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Starter */}
          <div className="rounded-2xl bg-[#090c10] border border-white/10 p-5 sm:p-7 flex flex-col justify-between hover:border-white/25 transition-all">
            <div>
              <h3 className="font-mono text-sm tracking-wider uppercase text-white font-medium mb-3">Gratuito</h3>
              <div className="text-3xl sm:text-4xl font-semibold text-white mb-3">
                R$ 0 <span className="text-xs font-normal text-neutral-500 font-mono">/mês</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed min-h-[36px] mb-6">
                Para quem quer começar a organizar metas e hábitos básicos sem custo.
              </p>
              <Link
                href="/app"
                className="w-full py-2.5 rounded-full border border-white/20 text-xs font-mono font-medium text-white hover:bg-white/10 transition-colors mb-8 flex items-center justify-center"
              >
                Começar Grátis
              </Link>
              <div className="relative flex items-center justify-center my-6">
                <div className="border-t border-white/10 w-full"></div>
                <span className="bg-[#090c10] px-3 text-[11px] font-mono text-neutral-500 uppercase tracking-widest absolute">Recursos</span>
              </div>
              <ul className="space-y-3.5 text-xs text-neutral-300 font-sans">
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#B8FF00]" />
                  <span>Até 3 Metas Ativas</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#B8FF00]" />
                  <span>Rastreador de Hábitos Essenciais</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#B8FF00]" />
                  <span>Revisão Semanal básica</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 2: Pro (Highlighted) */}
          <div className="rounded-2xl bg-[#0e131a] border border-[#B8FF00]/40 p-5 sm:p-7 flex flex-col justify-between relative shadow-[0_0_40px_rgba(184,255,0,0.15)] hover:border-[#B8FF00]/70 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-sm tracking-wider uppercase text-white font-medium">Pro</h3>
                <span className="bg-[#B8FF00]/15 text-[#B8FF00] border border-[#B8FF00]/30 font-mono text-[10px] px-2.5 py-0.5 rounded-full">Recomendado</span>
              </div>
              <div className="text-3xl sm:text-4xl font-semibold text-white mb-3">
                {billingCycle === 'yearly' ? 'R$ 23' : 'R$ 29'}{' '}
                <span className="text-xs font-normal text-neutral-500 font-mono">/mês</span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed min-h-[36px] mb-6">
                A experiência completa com IA que lembra da sua vida, contexto pessoal integrado e capacidade ilimitada.
              </p>
              <a
                href="#how-it-works"
                className="w-full py-2.5 rounded-full bg-[#B8FF00] text-[#0D0F10] text-xs font-mono font-bold hover:bg-[#a5e600] transition-colors mb-8 flex items-center justify-center uppercase tracking-wider shadow-lg shadow-[#B8FF00]/20"
              >
                Garantir Vaga Pro
              </a>
              <div className="relative flex items-center justify-center my-6">
                <div className="border-t border-white/10 w-full"></div>
                <span className="bg-[#0e131a] px-3 text-[11px] font-mono text-neutral-500 uppercase tracking-widest absolute">Recursos Pro</span>
              </div>
              <ul className="space-y-3.5 text-xs text-neutral-300 font-sans">
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#B8FF00]" />
                  <span>IA com Memória Viva & Contexto Pessoal</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#B8FF00]" />
                  <span>Metas & Hábitos Ilimitados</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#B8FF00]" />
                  <span>Revisão Semanal com reflexões profundas</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#B8FF00]" />
                  <span>Diagnóstico periódico Life Score</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#B8FF00]" />
                  <span>Exportação de Dados LGPD completa</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: Fundador / Lifetime */}
          <div className="rounded-2xl bg-[#090c10] border border-white/10 p-5 sm:p-7 flex flex-col justify-between hover:border-white/25 transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-mono text-sm tracking-wider uppercase text-white font-medium">Fundador</h3>
                <span className="bg-white/10 text-white font-mono text-[10px] px-2 py-0.5 rounded-full">Exclusivo</span>
              </div>
              <div className="text-3xl sm:text-4xl font-semibold text-white mb-3">
                Vitalício
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed min-h-[36px] mb-6">
                Acesso perpétuo para os primeiros 200 membros com canal direto de feedback.
              </p>
              <a
                href="#how-it-works"
                className="w-full py-2.5 rounded-full border border-white/20 text-xs font-mono font-medium text-white hover:bg-white/10 transition-colors mb-8 flex items-center justify-center"
              >
                Consultar Vaga
              </a>
              <div className="relative flex items-center justify-center my-6">
                <div className="border-t border-white/10 w-full"></div>
                <span className="bg-[#090c10] px-3 text-[11px] font-mono text-neutral-500 uppercase tracking-widest absolute">Vantagens</span>
              </div>
              <ul className="space-y-3.5 text-xs text-neutral-300 font-sans">
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#B8FF00]" />
                  <span>Acesso vitalício sem mensalidades</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#B8FF00]" />
                  <span>Selo oficial de Membro Fundador</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#B8FF00]" />
                  <span>Acesso prioritário a novos modelos de IA</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check size={14} className="text-[#B8FF00]" />
                  <span>Canal direto com o time de engenharia</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      {/* END: PricingSection */}

      {/* BEGIN: Footer */}
      <footer className="bg-[#040608] border-t border-white/10 px-3.5 sm:px-10 lg:px-14 pt-12 sm:pt-16 pb-12" data-purpose="page-footer" id="contact">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16">
            <div className="md:col-span-4 lg:col-span-5 flex flex-col items-start pr-0 md:pr-6">
              <div className="flex items-center gap-2.5 mb-4">
                <TrajettaLogo size={28} showWordmark wordmarkClassName="font-extrabold text-base tracking-tight text-white" />
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed mb-6 max-w-sm">
                Seu sistema integrado de evolução pessoal. Planeje para sua vida real, construa consistência sustentável e alcance suas metas.
              </p>
              <span className="font-mono text-[10px] text-neutral-500 uppercase tracking-widest mb-2.5">FIQUE POR DENTRO</span>

              {footerSubmitted ? (
                <div className="text-xs text-[#B8FF00] font-mono flex items-center gap-2">
                  <Check size={14} />
                  <span>Inscrito com sucesso nas atualizações!</span>
                </div>
              ) : (
                <form onSubmit={handleFooterSubmit} className="flex items-center bg-[#0d1015] border border-white/15 rounded-xl p-1 w-full max-w-sm focus-within:border-[#B8FF00] transition-colors">
                  <input
                    type="email"
                    required
                    value={footerEmail}
                    onChange={(e) => setFooterEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="bg-transparent border-0 text-xs font-mono text-white placeholder-neutral-500 focus:ring-0 w-full px-3 py-1.5 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-[#B8FF00] text-[#0D0F10] font-mono text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-[#a5e600] transition-colors uppercase"
                  >
                    OK
                  </button>
                </form>
              )}
            </div>

            <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono text-xs">
              <div>
                <h4 className="text-white font-semibold mb-4 tracking-wider uppercase">PRODUTO</h4>
                <ul className="space-y-2.5 text-neutral-400 font-sans text-xs">
                  <li><a className="hover:text-white transition-colors" href="#overview">Visão Geral</a></li>
                  <li><a className="hover:text-white transition-colors" href="#use-cases">4 Dimensões</a></li>
                  <li><a className="hover:text-white transition-colors" href="#how-it-works">Como Funciona</a></li>
                  <li><a className="hover:text-white transition-colors" href="#pricing">Preços</a></li>
                  <li><Link className="hover:text-white transition-colors" href="/app">Entrar no App</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4 tracking-wider uppercase">DIMENSÕES</h4>
                <ul className="space-y-2.5 text-neutral-400 font-sans text-xs">
                  <li><a className="hover:text-white transition-colors" href="#use-cases">Corpo & Treinos</a></li>
                  <li><a className="hover:text-white transition-colors" href="#use-cases">Dinheiro & Aportes</a></li>
                  <li><a className="hover:text-white transition-colors" href="#use-cases">Carreira & Projetos</a></li>
                  <li><a className="hover:text-white transition-colors" href="#use-cases">Vida & Revisões</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4 tracking-wider uppercase">CONFIANÇA</h4>
                <ul className="space-y-2.5 text-neutral-400 font-sans text-xs">
                  <li><span className="text-neutral-300">Sem Venda de Dados</span></li>
                  <li><span className="text-neutral-300">Exportação Completa LGPD</span></li>
                  <li><span className="text-neutral-300">Memória Sob Seu Controle</span></li>
                  <li><span className="text-neutral-300">Zero Brilhos / Anti-AI Cliché</span></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-4 tracking-wider uppercase">LEGAL</h4>
                <ul className="space-y-2.5 text-neutral-400 font-sans text-xs">
                  <li><a className="hover:text-white transition-colors" href="#">Privacidade</a></li>
                  <li><a className="hover:text-white transition-colors" href="#">Termos de Uso</a></li>
                  <li><a className="hover:text-white transition-colors" href="#">Segurança</a></li>
                  <li><a className="hover:text-white transition-colors" href="#">Cookies</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-neutral-500">
            <div className="flex items-center flex-wrap gap-4">
              <span>© 2026 Trajetta. Todos os direitos reservados.</span>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B8FF00] animate-pulse"></span>
                <span className="text-neutral-400">Todos os sistemas operacionais</span>
              </div>
            </div>

            <div className="text-neutral-400 text-xs font-mono">
              Construído com calma, precisão e disciplina.
            </div>
          </div>
        </div>
      </footer>
      {/* END: Footer */}

      {/* BEGIN: VIP Founder Pass Modal */}
      {showVipPassModal && waitlistResult && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#0C0F14] border border-white/15 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl overflow-hidden max-h-[92dvh] overflow-y-auto">
            {/* Background neon ambient glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#B8FF00]/10 rounded-full blur-[90px] pointer-events-none" />

            {/* Close button */}
            <button
              onClick={() => setShowVipPassModal(false)}
              className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X size={16} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-[#B8FF00]/15 border border-[#B8FF00]/40 flex items-center justify-center text-[#B8FF00]">
                <Shield size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#B8FF00] uppercase tracking-widest block font-bold">
                  PASSAPORTE CONFIRMADO
                </span>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Bem-vindo à Trajetta, {waitlistResult.name}
                </h3>
              </div>
            </div>

            {/* VIP Founder Pass Card */}
            <div className="rounded-2xl p-4 sm:p-6 bg-gradient-to-br from-[#141923] via-[#0E1218] to-[#0A0D12] border-2 border-[#B8FF00]/40 relative overflow-hidden shadow-2xl mb-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4 font-mono text-xs">
                <span className="text-neutral-400 tracking-wider">TRAJETTA FOUNDER PASS</span>
                <span className="text-[#B8FF00] font-bold px-2 py-0.5 rounded bg-[#B8FF00]/10 border border-[#B8FF00]/30">
                  VIP #{waitlistResult.position}
                </span>
              </div>

              <div className="py-2">
                <div className="text-2xl font-black text-white tracking-tight">
                  {waitlistResult.name}
                </div>
                <div className="text-xs font-mono text-neutral-400 mt-1">
                  {waitlistResult.email}
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-4 text-[11px] font-mono">
                <span className="text-[#58D6A7] flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#58D6A7] animate-pulse" />
                  STATUS: PRIORIDADE MÁXIMA
                </span>
                <span className="text-neutral-500">LOTE 2026</span>
              </div>
            </div>

            {/* Benefits Checklist */}
            <div className="space-y-2.5 mb-6 text-xs text-neutral-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-[#B8FF00] flex-shrink-0" />
                <span>Vaga garantida na primeira rodada de convites</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-[#B8FF00] flex-shrink-0" />
                <span>Condição de Membro Fundador perpétua</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 size={15} className="text-[#B8FF00] flex-shrink-0" />
                <span>E-mail oficial de confirmação emitido e despachado</span>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {waitlistResult.emailHtml && (
                <button
                  type="button"
                  onClick={() => {
                    setShowVipPassModal(false);
                    setShowEmailPreviewModal(true);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#14181f] hover:bg-[#1a212b] border border-white/15 text-white text-xs font-mono font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <Mail size={14} className="text-[#B8FF00]" />
                  <span>Ver E-mail Recebido</span>
                </button>
              )}

              <Link
                href="/app"
                className="w-full py-3 px-4 rounded-xl bg-[#B8FF00] hover:bg-[#a5e600] text-[#0D0F10] text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-[#B8FF00]/20"
              >
                <span>Acessar Plataforma</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* BEGIN: Email Preview Modal */}
      {showEmailPreviewModal && waitlistResult && waitlistResult.emailHtml && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#090C10] border border-white/20 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
            {/* Header of Email Viewer */}
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#0E1218] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#B8FF00]/15 border border-[#B8FF00]/30 flex items-center justify-center text-[#B8FF00]">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Você está na Lista VIP da Trajetta — Vaga #{waitlistResult.position} Confirmada</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#B8FF00]/15 text-[#B8FF00] text-[10px] font-mono font-bold">
                      ENVIADO
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono mt-0.5">
                    De: Trajetta &lt;suporte@trajetta.app&gt; • Para: {waitlistResult.email}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowEmailPreviewModal(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Email Iframe Viewport */}
            <div className="flex-1 overflow-auto p-2 sm:p-4 bg-[#050709] flex justify-center">
              <div className="w-full max-w-[650px] bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10">
                <iframe
                  title="E-mail de Confirmação Trajetta"
                  srcDoc={waitlistResult.emailHtml}
                  className="w-full h-[580px] border-0"
                />
              </div>
            </div>

            {/* Footer Bar */}
            <div className="p-3.5 border-t border-white/10 bg-[#0E1218] flex items-center justify-between text-xs font-mono text-neutral-400">
              <span className="flex items-center gap-2 text-[#58D6A7]">
                <span className="w-2 h-2 rounded-full bg-[#58D6A7]" />
                Template Dark Luxury Oficial • Visualização Fiel
              </span>

              <button
                onClick={() => setShowEmailPreviewModal(false)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-medium transition-colors"
              >
                Fechar Prévia
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
