'use client';

import React, { useState } from 'react';
import { Activity, DollarSign, Briefcase, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

export function LifeAreasSection() {
  const [activeTab, setActiveTab] = useState<'corpo' | 'dinheiro' | 'carreira' | 'mente'>('corpo');

  const areasData = {
    corpo: {
      tag: 'Corpo & Vitalidade',
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
      title: 'Clareza financeira sem planilhas intermináveis.',
      desc: 'Conecte seus objetivos de poupança, investimento e crescimento de patrimônio à sua rotina real. Acompanhe a trajetória da sua reserva de emergência e dos seus aportes com visão de longo prazo.',
      metricLabel: 'Aporte Mensal Cumprido',
      metricValue: '6 meses ininterruptos',
      mockupTitle: 'Reserva & Aportes do Ciclo',
      mockupRows: [
        { label: 'Meta: Reserva de Emergência', status: 'R$ 42.000 / 50.000', tag: '84%' },
        { label: 'Aporte Mensal Automático', status: 'Executado dia 05', tag: 'Em dia' },
        { label: 'Piso de Gastos Supérfluos', status: 'Dentro da margem', tag: 'Controlado' }
      ]
    },
    carreira: {
      tag: 'Carreira & Construção',
      title: 'Avanço deliberado em projetos de alto impacto.',
      desc: 'Isole o ruído das reuniões e do trabalho reativo. No início de cada semana, eleja apenas 3 entregas que realmente movem o ponteiro da sua trajetória profissional e execute em blocos lúcidos.',
      metricLabel: 'Entregas Estratégicas',
      metricValue: '18 marcos concluídos',
      mockupTitle: 'Foco Trimestral em Execução',
      mockupRows: [
        { label: 'Lançamento do Projeto Principal', status: 'Etapa 3 de 4', tag: 'Prioridade 1' },
        { label: 'Capacitação Técnica & Certificação', status: '2h de estudo/sem', tag: 'Prioridade 2' },
        { label: 'Construção de Autoridade & Rede', status: 'Artigo publicado', tag: 'Prioridade 3' }
      ]
    },
    mente: {
      tag: 'Mente & Vida Pessoal',
      title: 'Presença, silêncio e margem para o que importa.',
      desc: 'Sua vida não é apenas uma lista de tarefas. Garanta espaço inegociável para leitura, descanso mental e momentos reais com quem você ama, protegendo sua mente da sobrecarga digital.',
      metricLabel: 'Ritual Noturno',
      metricValue: '92% noites desconectado',
      mockupTitle: 'Margem & Clareza Mental',
      mockupRows: [
        { label: 'Desconexão de Telas às 22h', status: 'Hábito protegido', tag: 'Silêncio' },
        { label: 'Tempo Intencional em Família', status: 'Sábados livres', tag: 'Presença' },
        { label: 'Leitura Profunda (20 páginas)', status: '4 livros no ano', tag: 'Crescimento' }
      ]
    }
  };

  const current = areasData[activeTab];

  return (
    <section className="max-w-[1440px] mx-auto px-4 xs:px-6 sm:px-10 lg:px-14 py-16 sm:py-24 border-t border-white/10" data-purpose="use-cases" id="areas">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3 tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
        <span>As 4 Áreas Essenciais</span>
      </div>

      {/* Section Heading */}
      <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-8">
        Um sistema unificado, <span className="text-neutral-500">clareza para toda a sua vida.</span>
      </h2>

      {/* Tab Navigation List */}
      <div className="flex items-center gap-4 sm:gap-8 border-b border-white/10 pb-3 mb-10 text-xs font-mono overflow-x-auto no-scrollbar whitespace-nowrap">
        <button
          onClick={() => setActiveTab('corpo')}
          className={`pb-3 -mb-[13px] font-medium tracking-wide transition-colors flex items-center gap-2 ${
            activeTab === 'corpo' ? 'text-white border-b-2 border-white' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-[#58D6A7]" />
          <span>Corpo & Vitalidade</span>
        </button>

        <button
          onClick={() => setActiveTab('dinheiro')}
          className={`pb-3 -mb-[13px] font-medium tracking-wide transition-colors flex items-center gap-2 ${
            activeTab === 'dinheiro' ? 'text-white border-b-2 border-white' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-[#F08A76]" />
          <span>Dinheiro & Segurança</span>
        </button>

        <button
          onClick={() => setActiveTab('carreira')}
          className={`pb-3 -mb-[13px] font-medium tracking-wide transition-colors flex items-center gap-2 ${
            activeTab === 'carreira' ? 'text-white border-b-2 border-white' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 text-[#A98CF7]" />
          <span>Carreira & Construção</span>
        </button>

        <button
          onClick={() => setActiveTab('mente')}
          className={`pb-3 -mb-[13px] font-medium tracking-wide transition-colors flex items-center gap-2 ${
            activeTab === 'mente' ? 'text-white border-b-2 border-white' : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-[#6FAEF7]" />
          <span>Mente & Vida Pessoal</span>
        </button>
      </div>

      {/* Tab Body: Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Side: Atmospheric Preview with embedded dynamic modal */}
        <div className="lg:col-span-7 rounded-2xl bg-[#0c0e12] border border-white/10 relative overflow-hidden min-h-[340px] sm:min-h-[420px] p-4 sm:p-8 flex items-center justify-center shadow-2xl">
          {/* Atmospheric landscape background matching Feature Cards */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-[#11161d] to-[#1c242e] opacity-85"></div>
          <svg className="absolute inset-0 w-full h-full opacity-35 object-cover pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 300">
            <path d="M0 160L80 110L170 170L260 90L340 140L400 100V300H0Z" fill="#040608"></path>
            <path d="M-50 200L60 140L180 190L290 120L370 160L450 110V300H-50V200Z" fill="#020304" opacity="0.7"></path>
          </svg>

          {/* Modal Preview Card */}
          <div className="relative z-10 w-full max-w-[380px] bg-[#12161e]/95 border border-white/15 rounded-xl p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono text-neutral-300 font-medium">{current.mockupTitle}</span>
              <span className="text-[10px] font-mono text-[#B8FF00] bg-[#B8FF00]/10 px-2 py-0.5 rounded-full">
                {current.metricValue}
              </span>
            </div>

            <div className="space-y-2.5 mt-4">
              {current.mockupRows.map((row, idx) => (
                <div key={idx} className="bg-[#181d26] border border-white/10 rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#B8FF00]" />
                    <span className="text-xs text-neutral-200">{row.label}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-neutral-400">{row.status}</span>
                    <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-neutral-300 px-1.5 py-0.5 rounded">
                      {row.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-400">
              <span>{current.metricLabel}</span>
              <span className="text-white font-medium">Cadência Saudável</span>
            </div>
          </div>
        </div>

        {/* Right Side: Editorial Explanation */}
        <div className="lg:col-span-5 flex flex-col items-start">
          <span className="text-xs font-mono text-[#B8FF00] uppercase tracking-wider mb-2">
            {current.tag}
          </span>
          <h3 className="text-2xl sm:text-3xl font-normal tracking-tight text-white mb-4 leading-snug">
            {current.title}
          </h3>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed mb-6">
            {current.desc}
          </p>

          <div className="space-y-3 mb-8 w-full font-mono text-xs text-neutral-300">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
              <span>Visualização longitudinal de progresso</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
              <span>Pisos mínimos para períodos de crise e cansaço</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
              <span>Integração no mesmo review semanal sem silos</span>
            </div>
          </div>

          <a
            href="#waitlist"
            className="inline-flex items-center space-x-2 bg-white hover:bg-neutral-100 text-black text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-full transition-all active:scale-95 shadow-lg shadow-white/5"
          >
            <span>ENTRAR NA LISTA VIP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
