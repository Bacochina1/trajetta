'use client';

import React, { useState } from 'react';
import { Activity, DollarSign, Briefcase, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

export function LifeAreasSection() {
  const [activeTab, setActiveTab] = useState<'corpo' | 'dinheiro' | 'carreira' | 'mente'>('corpo');

  const areasData = {
    corpo: {
      tag: 'Corpo & Vitalidade',
      color: '#58D6A7',
      title: 'Energia física sem o fardo da perfeição extrema.',
      desc: 'Construa consistência em treinos, sono reparador e alimentação sem a culpa de streaks quebrados. Quando a rotina apertar, ative o piso mínimo de 15 minutos e proteja seu hábito base.',
      metricLabel: 'Consistência Cumulativa',
      metricValue: '84% em 12 semanas',
      mockupTitle: 'Piso de Vitalidade Ativo',
      mockupRows: [
        { label: 'Treino de Força (3x na semana)', status: 'Cumprido', tag: 'Pilar' },
        { label: 'Sono Reparador (> 7h)', status: '4/5 noites', tag: 'Recuperação' },
        { label: 'Piso Mínimo em Dias de Pico', status: '15 min mobilidade', tag: 'Segurança' }
      ]
    },
    dinheiro: {
      tag: 'Dinheiro & Segurança',
      color: '#F08A76',
      title: 'Clareza financeira sem planilhas intermináveis.',
      desc: 'Conecte seus objetivos de poupança, investimento e crescimento de patrimônio à sua rotina real. Acompanhe a trajetória da sua reserva de emergência e dos seus aportes com visão de longo prazo.',
      metricLabel: 'Aporte Mensal Cumprido',
      metricValue: '6 meses ininterruptos',
      mockupTitle: 'Reserva & Aportes do Ciclo',
      mockupRows: [
        { label: 'Meta: Reserva de Emergência', status: 'R$ 42k / 50k', tag: '84%' },
        { label: 'Aporte Mensal Automático', status: 'Executado', tag: 'Em dia' },
        { label: 'Piso de Gastos Supérfluos', status: 'Na margem', tag: 'OK' }
      ]
    },
    carreira: {
      tag: 'Carreira & Construção',
      color: '#A98CF7',
      title: 'Avanço deliberado em projetos de alto impacto.',
      desc: 'Isole o ruído das reuniões e do trabalho reativo. No início de cada semana, eleja apenas 3 entregas que realmente movem o ponteiro da sua trajetória profissional e execute em blocos lúcidos.',
      metricLabel: 'Entregas Estratégicas',
      metricValue: '18 marcos concluídos',
      mockupTitle: 'Foco Trimestral em Execução',
      mockupRows: [
        { label: 'Lançamento do Projeto Principal', status: 'Etapa 3/4', tag: 'P1' },
        { label: 'Capacitação Técnica & Certificação', status: '2h/sem', tag: 'P2' },
        { label: 'Construção de Autoridade & Rede', status: 'Publicado', tag: 'P3' }
      ]
    },
    mente: {
      tag: 'Mente & Vida Pessoal',
      color: '#6FAEF7',
      title: 'Presença, silêncio e margem para o que importa.',
      desc: 'Sua vida não é apenas uma lista de tarefas. Garanta espaço inegociável para leitura, descanso mental e momentos reais com quem você ama, protegendo sua mente da sobrecarga digital.',
      metricLabel: 'Ritual Noturno',
      metricValue: '92% desconectado',
      mockupTitle: 'Margem & Clareza Mental',
      mockupRows: [
        { label: 'Desconexão de Telas às 22h', status: 'Protegido', tag: 'Silêncio' },
        { label: 'Tempo Intencional em Família', status: 'Sábados', tag: 'Presença' },
        { label: 'Leitura Profunda (20 páginas)', status: '4 livros/ano', tag: 'Mente' }
      ]
    }
  };

  const current = areasData[activeTab];

  return (
    <section className="max-w-[1440px] mx-auto px-4 xs:px-6 sm:px-10 lg:px-14 py-14 sm:py-24 border-t border-white/10" data-purpose="use-cases" id="areas">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3 tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
        <span>As 4 Áreas Essenciais</span>
      </div>

      {/* Section Heading */}
      <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-6 sm:mb-8 [text-wrap:balance]">
        Um sistema unificado, <span className="text-neutral-500">clareza para toda a sua vida.</span>
      </h2>

      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-2 sm:gap-3 pb-2 mb-6 sm:mb-10 text-xs font-mono overflow-x-auto scrollbar-none whitespace-nowrap -mx-4 px-4 sm:mx-0 sm:px-0">
        <button
          type="button"
          onClick={() => setActiveTab('corpo')}
          className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs font-mono font-medium transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
            activeTab === 'corpo'
              ? 'bg-white text-black font-bold shadow-lg shadow-white/10 scale-[1.02]'
              : 'text-neutral-400 hover:text-white bg-[#12161e] border border-white/10'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#58D6A7]" />
          <span>Corpo & Vitalidade</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('dinheiro')}
          className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs font-mono font-medium transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
            activeTab === 'dinheiro'
              ? 'bg-white text-black font-bold shadow-lg shadow-white/10 scale-[1.02]'
              : 'text-neutral-400 hover:text-white bg-[#12161e] border border-white/10'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-[#F08A76]" />
          <span>Dinheiro & Segurança</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('carreira')}
          className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs font-mono font-medium transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
            activeTab === 'carreira'
              ? 'bg-white text-black font-bold shadow-lg shadow-white/10 scale-[1.02]'
              : 'text-neutral-400 hover:text-white bg-[#12161e] border border-white/10'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-[#A98CF7]" />
          <span>Carreira & Construção</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('mente')}
          className={`px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full text-xs font-mono font-medium transition-all flex items-center gap-2 flex-shrink-0 cursor-pointer ${
            activeTab === 'mente'
              ? 'bg-white text-black font-bold shadow-lg shadow-white/10 scale-[1.02]'
              : 'text-neutral-400 hover:text-white bg-[#12161e] border border-white/10'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-[#6FAEF7]" />
          <span>Mente & Vida Pessoal</span>
        </button>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
        {/* Mobile-Only Editorial Header (shown ABOVE the mockup on mobile, hidden on lg desktop) */}
        <div className="lg:hidden">
          <span 
            className="text-xs font-mono uppercase tracking-wider block mb-1.5 font-semibold"
            style={{ color: current.color }}
          >
            {current.tag}
          </span>
          <h3 className="text-xl xs:text-2xl font-normal tracking-tight text-white mb-2 leading-snug [text-wrap:balance]">
            {current.title}
          </h3>
          <p className="text-xs xs:text-sm text-neutral-300/90 font-light leading-relaxed [text-wrap:pretty]">
            {current.desc}
          </p>
        </div>

        {/* Mockup Card (col-span-7 on desktop) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0c0e12] border border-white/10 relative overflow-hidden p-3 xs:p-4 sm:p-8 flex items-center justify-center shadow-2xl">
          {/* Atmospheric gradient backdrop */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-[#11161d] to-[#1c242e] opacity-85 pointer-events-none"></div>
          <svg className="absolute inset-0 w-full h-full opacity-25 sm:opacity-35 object-cover pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 300">
            <path d="M0 160L80 110L170 170L260 90L340 140L400 100V300H0Z" fill="#040608"></path>
            <path d="M-50 200L60 140L180 190L290 120L370 160L450 110V300H-50V200Z" fill="#020304" opacity="0.7"></path>
          </svg>

          {/* Modal Preview Card */}
          <div className="relative z-10 w-full max-w-[420px] bg-[#12161e]/95 border border-white/15 rounded-xl p-3.5 xs:p-5 shadow-2xl backdrop-blur-md">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2 min-w-0 mr-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: current.color }} />
                <span className="text-xs font-mono text-neutral-200 font-medium truncate">{current.mockupTitle}</span>
              </div>
              <span className="text-[10px] sm:text-[10.5px] font-mono text-[#B8FF00] bg-[#B8FF00]/10 border border-[#B8FF00]/25 px-2.5 py-0.5 rounded-full flex-shrink-0 font-medium">
                {current.metricValue}
              </span>
            </div>

            {/* Rows — Always crisp single-line flex row */}
            <div className="space-y-2 xs:space-y-2.5 mt-3.5">
              {current.mockupRows.map((row, idx) => (
                <div key={idx} className="bg-[#181d26] border border-white/10 rounded-lg px-3 py-2.5 flex items-center justify-between gap-2.5 hover:border-white/20 transition-colors">
                  <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                    <CheckCircle2 className="w-4 h-4 text-[#B8FF00] flex-shrink-0" />
                    <span className="text-[11.5px] sm:text-[12.5px] text-neutral-200 truncate">{row.label}</span>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <span className="text-[10px] sm:text-[10.5px] font-mono text-neutral-400">{row.status}</span>
                    <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-neutral-300 px-1.5 py-0.5 rounded">
                      {row.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-[10.5px] sm:text-[11px] font-mono text-neutral-400">
              <span className="truncate mr-2">{current.metricLabel}</span>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-pulse" />
                <span className="text-white font-medium">Cadência Saudável</span>
              </div>
            </div>
          </div>
        </div>

        {/* Editorial Explanation (Desktop: col-span-5 on right; Mobile: bullets and CTA below the mockup) */}
        <div className="lg:col-span-5 flex flex-col items-start">
          {/* Desktop-Only Title & Desc (hidden on mobile since it rendered above) */}
          <div className="hidden lg:block">
            <span 
              className="text-xs font-mono uppercase tracking-wider mb-2 block font-semibold"
              style={{ color: current.color }}
            >
              {current.tag}
            </span>
            <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-white mb-4 leading-snug [text-wrap:balance]">
              {current.title}
            </h3>
            <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed mb-6 [text-wrap:pretty]">
              {current.desc}
            </p>
          </div>

          {/* 3 Pillars / Bullets (Visible on both Mobile and Desktop) */}
          <div className="space-y-2.5 sm:space-y-3 mb-6 sm:mb-8 w-full font-mono text-[11px] xs:text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] flex-shrink-0"></span>
              <span>Visualização longitudinal de progresso</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] flex-shrink-0"></span>
              <span>Pisos mínimos para períodos de crise e cansaço</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] flex-shrink-0"></span>
              <span>Integração no mesmo review semanal sem silos</span>
            </div>
          </div>

          {/* CTA Button */}
          <a
            href="#waitlist"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-neutral-100 text-black text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-full transition-all active:scale-95 shadow-lg shadow-white/5 text-center"
          >
            <span>ENTRAR NA LISTA VIP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
