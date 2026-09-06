'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  ArrowRight,
  Brain,
  Compass,
  Activity,
  Landmark,
  Briefcase,
  HeartHandshake,
  ShieldCheck,
  Flame,
  Check,
  AlertCircle,
  Clock,
  Layers,
  ChevronRight,
} from 'lucide-react';

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(1482);
  const [userPosition, setUserPosition] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    if (!email || !email.includes('@')) {
      setError('Por favor, digite um e-mail válido.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });

      const data = await res.json();
      if (data.ok) {
        setSubmitted(true);
        setAlreadyRegistered(Boolean(data.alreadyRegistered));
        setUserPosition(data.position || waitlistCount + 1);
        if (data.totalCount) setWaitlistCount(data.totalCount);
      } else {
        setError(data.error || 'Erro ao registrar. Tente novamente.');
      }
    } catch {
      setError('Falha de conexão. Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0F10] text-[#F2F1ED] selection:bg-[#B8FF00] selection:text-[#0D0F10] overflow-x-hidden font-sans">
      {/* ------------------------------------------------------------- */}
      {/* 1. TOPBAR NAVEGAÇÃO                                           */}
      {/* ------------------------------------------------------------- */}
      <header className="sticky top-0 z-50 bg-[#0D0F10]/85 backdrop-blur-md border-b border-white/8 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(184,255,0,0.15)]">
            <img src="/trajetta-logo.png" alt="Trajetta Logo" className="w-full h-full object-contain p-0.5" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold tracking-tight text-base text-[#F2F1ED] leading-none">trajetta</span>
            <span className="text-[10px] text-[#8E9499] tracking-wider uppercase mt-1">Evolução Pessoal</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs text-[#8E9499]">
          <a href="#problema" className="hover:text-[#F2F1ED] transition-colors">O Problema</a>
          <a href="#pilares" className="hover:text-[#F2F1ED] transition-colors">Os 4 Pilares</a>
          <a href="#ritual" className="hover:text-[#F2F1ED] transition-colors">O Ritual Dominical</a>
          <a href="#mockups" className="hover:text-[#F2F1ED] transition-colors">O App em 4K</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/app"
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#171A1D] hover:bg-[#1F2328] border border-white/10 hover:border-white/20 text-[#F2F1ED] transition-all active:scale-[0.96]"
          >
            <span>Acessar App</span>
            <ArrowRight size={13} className="text-[#B8FF00]" />
          </Link>
        </div>
      </header>

      {/* ------------------------------------------------------------- */}
      {/* 2. HERO SECTION COM FORMULÁRIO DE LISTA DE ESPERA             */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-8 max-w-6xl mx-auto">
        {/* Glow ambient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#B8FF00]/6 blur-[140px] pointer-events-none rounded-full" />

        <div className="text-center max-w-3xl mx-auto space-y-6 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-medium text-[#8E9499]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-pulse" />
            <span>LISTA VIP EXCLUSIVA • ACESSO ANTECIPADO 2026</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#F2F1ED] leading-[1.08]">
            Planeje para sua <span className="text-[#B8FF00]">vida real</span>,<br className="hidden sm:inline" />
            não para sua versão perfeita.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#8E9499] leading-relaxed max-w-2xl mx-auto font-normal">
            A maioria dos aplicativos de hábitos te cobra perfeição e te faz sentir culpa no primeiro dia em que você falha. 
            A <strong className="text-[#F2F1ED]">Trajetta</strong> foi desenhada para adultos ambiciosos: metas progressivas, 
            consistência humana e um ritual dominical de reflexão com IA.
          </p>

          {/* Formulário de Lista de Espera */}
          <div className="pt-4 max-w-md mx-auto">
            {!submitted ? (
              <form onSubmit={handleWaitlistSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu melhor e-mail corporativo ou pessoal"
                    className="flex-1 bg-[#171A1D] border border-white/12 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F2F1ED] placeholder-[#8E9499]/60 focus:outline-none focus:border-[#B8FF00] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-3 rounded-xl bg-[#B8FF00] hover:bg-[#C6FF19] text-[#0D0F10] font-bold text-xs sm:text-sm transition-all active:scale-[0.96] shadow-[0_0_25px_rgba(184,255,0,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Reservando...' : 'Entrar na Lista VIP'}
                    <ArrowRight size={14} strokeWidth={2.5} />
                  </button>
                </div>

                {error && (
                  <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 flex items-center justify-center gap-1.5">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex items-center justify-center gap-3 pt-1 text-[11px] text-[#8E9499]">
                  <span className="flex items-center gap-1">
                    <Check size={12} className="text-[#B8FF00]" /> Acesso Gratuito no Lançamento
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#F2F1ED] font-semibold">
                    <Flame size={12} className="text-[#B8FF00]" /> {waitlistCount.toLocaleString('pt-BR')} pessoas na fila
                  </span>
                </div>
              </form>
            ) : (
              <div className="p-6 rounded-2xl bg-[#171A1D] border border-[#B8FF00]/40 text-center space-y-3 shadow-[0_0_30px_rgba(184,255,0,0.15)]">
                <div className="w-12 h-12 rounded-full bg-[#B8FF00]/15 border border-[#B8FF00]/40 flex items-center justify-center mx-auto text-[#B8FF00]">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#F2F1ED]">
                  {alreadyRegistered ? 'Você já está na Lista VIP!' : 'Vaga Reservada com Sucesso!'}
                </h3>
                <p className="text-xs text-[#8E9499]">
                  Sua posição na fila de acesso é <strong className="text-[#B8FF00]">#{userPosition}</strong>. 
                  Enviamos uma confirmação detalhada para seu e-mail.
                </p>
                <div className="pt-2">
                  <Link
                    href="/app"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#B8FF00] text-[#0D0F10] font-bold text-xs"
                  >
                    <span>Testar Sistema Agora (Acesso Demonstração)</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* 3. HERO MOCKUP 4K EM DESTAQUE (TITANIUM SMARTPHONE)           */}
        {/* ------------------------------------------------------------- */}
        <div id="mockups" className="mt-14 sm:mt-20 relative">
          <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-b from-[#171A1D] to-[#111315] p-2 sm:p-4 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#B8FF00]/10 blur-[120px] pointer-events-none rounded-full" />
            <img
              src="/trajetta-mockup-hero.jpg"
              alt="Trajetta Mobile Mockup 4K"
              className="w-full h-auto rounded-xl sm:rounded-2xl object-cover"
            />

            {/* Floating Highlights overlaying the mockup */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 sm:pt-6">
              <div className="p-3.5 rounded-xl bg-[#111315]/80 border border-white/8 backdrop-blur-md">
                <span className="text-[10px] font-bold tracking-wider text-[#B8FF00] uppercase block">North Star Metric</span>
                <p className="text-xs font-semibold text-[#F2F1ED] mt-1">14 Semanas Concluídas de 52</p>
                <p className="text-[11px] text-[#8E9499] mt-0.5">Visão cumulativa do ano, sem a frustração de streaks diários frágeis.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111315]/80 border border-white/8 backdrop-blur-md">
                <span className="text-[10px] font-bold tracking-wider text-[#58D6A7] uppercase block">Compassionate Slip</span>
                <p className="text-xs font-semibold text-[#F2F1ED] mt-1">17 dias construídos · 1 deslize</p>
                <p className="text-[11px] text-[#8E9499] mt-0.5">Um deslize isolado não apaga 17 dias de disciplina. Sua trajetória continua viva.</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#111315]/80 border border-white/8 backdrop-blur-md">
                <span className="text-[10px] font-bold tracking-wider text-[#A98CF7] uppercase block">Reflexão com IA</span>
                <p className="text-xs font-semibold text-[#F2F1ED] mt-1">Nemotron & DeepSeek</p>
                <p className="text-[11px] text-[#8E9499] mt-0.5">Conselhos adultos e realistas aos domingos, sem clichês e com zero sparkles.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. SEÇÃO DO PROBLEMA (O CONTRASTE COM APPS COMUNS)            */}
      {/* ------------------------------------------------------------- */}
      <section id="problema" className="py-16 sm:py-24 border-t border-white/8 bg-[#111315]/50 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#F08A76]">O Contraste</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F1ED]">
              Por que você desiste dos outros aplicativos de hábitos?
            </h2>
            <p className="text-xs sm:text-sm text-[#8E9499]">
              A maioria das ferramentas foi criada para estudantes ou usa gamificação infantil que quebra ao menor sinal de estresse do mundo real.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* O Jeito Tradicional */}
            <div className="p-6 rounded-2xl bg-[#171A1D] border border-red-500/20 space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                <span>✕</span>
                <span>O Ciclo Tóxico dos Apps Comuns</span>
              </div>
              <ul className="space-y-3 text-xs text-[#8E9499] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Streak Zera por Qualquer Coisa:</strong> Você fez 20 dias de treino, viajou a trabalho 1 dia e o app diz que você perdeu tudo. O resultado é abandono total.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Sobrecarga de Tarefas:</strong> Telas cheias de listas que mais parecem uma planilha de cobrança do que uma ferramenta de clareza mental.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-400 font-bold">•</span>
                  <span><strong>Gamificação Infantil:</strong> Corujas e medalhinhas de desenho animado que não conversam com os desafios de um adulto em ascensão profissional.</span>
                </li>
              </ul>
            </div>

            {/* O Jeito Trajetta */}
            <div className="p-6 rounded-2xl bg-[#171A1D] border border-[#B8FF00]/30 space-y-4 shadow-[0_0_30px_rgba(184,255,0,0.05)]">
              <div className="flex items-center gap-2 text-[#B8FF00] font-bold text-sm">
                <Check size={16} strokeWidth={2.5} />
                <span>O Sistema Trajetta (Calm Power)</span>
              </div>
              <ul className="space-y-3 text-xs text-[#F2F1ED] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8FF00] font-bold">•</span>
                  <span><strong>Recuperação Empática:</strong> A Trajetta registra &quot;17 dias construídos, 1 deslize&quot;. Sua identidade continua de pé; o foco é voltar na manhã seguinte.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8FF00] font-bold">•</span>
                  <span><strong>Apenas Seu Próximo Movimento:</strong> A tela de Hoje corta o ruído e te mostra exatamente a ação essencial do momento.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[#B8FF00] font-bold">•</span>
                  <span><strong>Memória Longitudinal:</strong> Daqui a 2 anos, a Trajetta te mostrará exatamente a linha do tempo e os marcos que te trouxeram até aqui.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. OS 4 PILARES DA VIDA ADULTA                              */}
      {/* ------------------------------------------------------------- */}
      <section id="pilares" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8FF00]">Equilíbrio Estratégico</span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F1ED]">
            Quatro áreas. Nenhum sacrifício cego.
          </h2>
          <p className="text-xs sm:text-sm text-[#8E9499]">
            Construir carreira destruindo o corpo ou enriquecer sem tempo para a família não é evolução. A Trajetta equilibra seu foco.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Corpo */}
          <div className="p-5 rounded-2xl bg-[#171A1D] border border-white/8 space-y-3 hover:border-[#58D6A7]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#58D6A7]/15 border border-[#58D6A7]/30 flex items-center justify-center text-[#58D6A7]">
              <Activity size={20} />
            </div>
            <h3 className="text-base font-bold text-[#F2F1ED]">Corpo</h3>
            <p className="text-xs text-[#8E9499] leading-relaxed">
              Energia física, corrida, treino de força e sono. Sem saúde biológica, nenhuma meta de longo prazo se sustenta.
            </p>
            <span className="text-[11px] font-semibold text-[#58D6A7] block pt-2">Ex: Meia Maratona de 21 km</span>
          </div>

          {/* Dinheiro */}
          <div className="p-5 rounded-2xl bg-[#171A1D] border border-white/8 space-y-3 hover:border-[#F08A76]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#F08A76]/15 border border-[#F08A76]/30 flex items-center justify-center text-[#F08A76]">
              <Landmark size={20} />
            </div>
            <h3 className="text-base font-bold text-[#F2F1ED]">Dinheiro</h3>
            <p className="text-xs text-[#8E9499] leading-relaxed">
              Aporte semanal pontual, reserva de tranquilidade e expansão de patrimônio com disciplina recorrente.
            </p>
            <span className="text-[11px] font-semibold text-[#F08A76] block pt-2">Ex: R$ 50k em reserva líquida</span>
          </div>

          {/* Carreira */}
          <div className="p-5 rounded-2xl bg-[#171A1D] border border-white/8 space-y-3 hover:border-[#A98CF7]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#A98CF7]/15 border border-[#A98CF7]/30 flex items-center justify-center text-[#A98CF7]">
              <Briefcase size={20} />
            </div>
            <h3 className="text-base font-bold text-[#F2F1ED]">Carreira</h3>
            <p className="text-xs text-[#8E9499] leading-relaxed">
              Blocos inegociáveis de trabalho profundo sem notificações para entregar impacto de alto nível e transição de cargo.
            </p>
            <span className="text-[11px] font-semibold text-[#A98CF7] block pt-2">Ex: Head de Produto / Diretoria</span>
          </div>

          {/* Vida */}
          <div className="p-5 rounded-2xl bg-[#171A1D] border border-white/8 space-y-3 hover:border-[#6FAEF7]/40 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#6FAEF7]/15 border border-[#6FAEF7]/30 flex items-center justify-center text-[#6FAEF7]">
              <HeartHandshake size={20} />
            </div>
            <h3 className="text-base font-bold text-[#F2F1ED]">Vida</h3>
            <p className="text-xs text-[#8E9499] leading-relaxed">
              Presença familiar diária, leitura noturna, silêncio mental e o cultivo daquilo que realmente importa.
            </p>
            <span className="text-[11px] font-semibold text-[#6FAEF7] block pt-2">Ex: Desconexão de telas às 19h30</span>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. O RITUAL DOMINICAL (WEEKLY REVIEW COM MOCKUP 4K)          */}
      {/* ------------------------------------------------------------- */}
      <section id="ritual" className="py-16 sm:py-24 border-t border-white/8 bg-[#111315]/60 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8FF00]">O Fechamento Semanal</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F2F1ED] leading-tight">
              O ritual de 15 minutos que muda seu ano todo.
            </h2>
            <p className="text-sm text-[#8E9499] leading-relaxed">
              Todo domingo à noite, a Trajetta te conduz por 4 perguntas estratégicas para encerrar o ciclo, registrar as vitórias e permitir que a IA analise seus padrões sem complicação.
            </p>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#171A1D] border border-white/8 flex items-start gap-3">
                <span className="text-xs font-bold text-[#B8FF00] bg-[#B8FF00]/10 px-2 py-0.5 rounded-md mt-0.5">1</span>
                <div>
                  <h4 className="text-xs font-bold text-[#F2F1ED]">O que avançou?</h4>
                  <p className="text-[11px] text-[#8E9499]">Reconheça as vitórias discretas antes de passar para a próxima cobrança.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#171A1D] border border-white/8 flex items-start gap-3">
                <span className="text-xs font-bold text-[#B8FF00] bg-[#B8FF00]/10 px-2 py-0.5 rounded-md mt-0.5">2</span>
                <div>
                  <h4 className="text-xs font-bold text-[#F2F1ED]">O que me distraiu?</h4>
                  <p className="text-[11px] text-[#8E9499]">Identifique os pontos de atrito sem autocrítica destrutiva.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#171A1D] border border-white/8 flex items-start gap-3">
                <span className="text-xs font-bold text-[#B8FF00] bg-[#B8FF00]/10 px-2 py-0.5 rounded-md mt-0.5">3</span>
                <div>
                  <h4 className="text-xs font-bold text-[#F2F1ED]">Qual o micro-ajuste para a próxima semana?</h4>
                  <p className="text-[11px] text-[#8E9499]">Defina a prioridade de cada uma das 4 áreas para a nova semana.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl sm:rounded-3xl border border-white/10 bg-[#171A1D] p-2 sm:p-3 shadow-2xl overflow-hidden relative group">
              <img
                src="/trajetta-mockup-feature.jpg"
                alt="Trajetta Weekly Review Mockup 4K"
                className="w-full h-auto rounded-xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. CTA FINAL DE LISTA DE ESPERA                              */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 px-4 sm:px-8 max-w-4xl mx-auto text-center space-y-8">
        <div className="w-12 h-12 rounded-2xl bg-[#B8FF00]/15 border border-[#B8FF00]/30 flex items-center justify-center mx-auto text-[#B8FF00]">
          <Compass size={24} />
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#F2F1ED]">
            Sua trajetória não começa amanhã.<br />
            Ela começa no seu próximo movimento.
          </h2>
          <p className="text-sm text-[#8E9499] max-w-xl mx-auto">
            Garanta seu lugar prioritário na Lista VIP da Trajetta. As primeiras vagas terão acesso vitalício antecipado aos novos modelos de IA.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          {!submitted ? (
            <form onSubmit={handleWaitlistSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail principal"
                  className="flex-1 bg-[#171A1D] border border-white/12 rounded-xl px-4 py-3 text-xs sm:text-sm text-[#F2F1ED] placeholder-[#8E9499]/60 focus:outline-none focus:border-[#B8FF00]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-xl bg-[#B8FF00] hover:bg-[#C6FF19] text-[#0D0F10] font-bold text-xs sm:text-sm transition-all active:scale-[0.96] shadow-[0_0_25px_rgba(184,255,0,0.25)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Reservar Vaga</span>
                  <ArrowRight size={14} strokeWidth={2.5} />
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-[#171A1D] border border-[#B8FF00]/40 text-xs text-[#B8FF00]">
              ✓ Vaga reservada na posição #{userPosition}.
            </div>
          )}
        </div>

        <div className="pt-2">
          <Link
            href="/app"
            className="text-xs text-[#8E9499] hover:text-[#B8FF00] underline underline-offset-4 transition-colors"
          >
            Prefere experimentar o sistema imediatamente? Clique aqui para acessar o App Demo →
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. FOOTER                                                     */}
      {/* ------------------------------------------------------------- */}
      <footer className="border-t border-white/8 py-10 px-4 sm:px-8 bg-[#0D0F10] text-xs text-[#8E9499]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#F2F1ED]">trajetta</span>
            <span>•</span>
            <span>Sistema Pessoal de Evolução</span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/app" className="hover:text-[#F2F1ED] transition-colors">Acessar App</Link>
            <a href="#problema" className="hover:text-[#F2F1ED] transition-colors">Manifesto</a>
            <a href="#pilares" className="hover:text-[#F2F1ED] transition-colors">Pilares</a>
          </div>

          <div className="text-[11px] text-[#8E9499]/60">
            © 2026 Trajetta. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
