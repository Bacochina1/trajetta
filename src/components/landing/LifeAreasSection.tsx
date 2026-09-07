'use client';

import React, { useState } from 'react';
import { 
  Activity, 
  DollarSign, 
  Briefcase, 
  Heart, 
  CheckCircle2, 
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from 'keen-slider/react';

interface AreaInfo {
  id: 'corpo' | 'dinheiro' | 'carreira' | 'mente';
  tag: string;
  color: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  desc: string;
  metricLabel: string;
  metricValue: string;
  mockupTitle: string;
  mockupRows: Array<{ label: string; status: string; tag: string }>;
}

const AREAS: AreaInfo[] = [
  {
    id: 'corpo',
    tag: 'Corpo & Vitalidade',
    color: '#58D6A7',
    icon: Activity,
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
  {
    id: 'dinheiro',
    tag: 'Dinheiro & Segurança',
    color: '#F08A76',
    icon: DollarSign,
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
  {
    id: 'carreira',
    tag: 'Carreira & Construção',
    color: '#A98CF7',
    icon: Briefcase,
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
  {
    id: 'mente',
    tag: 'Mente & Vida Pessoal',
    color: '#6FAEF7',
    icon: Heart,
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
];

export function LifeAreasSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  // Keen Slider for mobile touch swiping (exact 1 card per view to fit screen perfectly)
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: 1,
      spacing: 12,
    },
    slideChanged(slider) {
      setActiveIdx(slider.track.details.rel);
    },
  });

  const goToSlide = (idx: number) => {
    setActiveIdx(idx);
    instanceRef.current?.moveToIdx(idx);
  };

  const current = AREAS[activeIdx] || AREAS[0];

  return (
    <section className="w-full max-w-[1440px] mx-auto px-4 xs:px-6 sm:px-10 lg:px-14 py-14 sm:py-24 border-t border-white/10 overflow-hidden box-border" data-purpose="use-cases" id="areas">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3 tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
        <span>As 4 Áreas Essenciais</span>
      </div>

      {/* Section Heading */}
      <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-6 sm:mb-8 [text-wrap:balance]">
        Um sistema unificado, <span className="text-neutral-500">clareza para toda a sua vida.</span>
      </h2>

      {/* ============================================================ */}
      {/* MOBILE EXPERIENCE (< lg): KEEN SLIDER (100% SCREEN WIDTH FIT) */}
      {/* ============================================================ */}
      <div className="block lg:hidden w-full max-w-full">
        {/* Quick Area Pill Selector */}
        <div className="flex items-center gap-1.5 pb-2 mb-4 text-xs font-mono overflow-x-auto scrollbar-none whitespace-nowrap w-full">
          {AREAS.map((area, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`px-3 py-1.5 rounded-full text-[11px] font-mono font-medium transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-neutral-400 bg-[#12161e] border border-white/10'
                }`}
              >
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: area.color }} />
                <span>{area.tag.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Keen Slider Carousel (Constrained strictly to container width) */}
        <div ref={sliderRef} className="keen-slider w-full max-w-full overflow-hidden rounded-2xl">
          {AREAS.map((area, sIdx) => {
            const Icon = area.icon;
            return (
              <div key={area.id} className="keen-slider__slide w-full min-w-0 max-w-full box-border">
                <div className="w-full max-w-full rounded-2xl bg-[#0c0e12] border border-white/15 p-4 xs:p-5 flex flex-col justify-between shadow-2xl relative overflow-hidden box-border">
                  {/* Subtle top accent gradient */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 pointer-events-none" 
                    style={{ backgroundColor: area.color }} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-[#11161d] to-[#1c242e] opacity-80 pointer-events-none" />

                  <div className="relative z-10 w-full min-w-0">
                    {/* Slide Area Header */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: area.color }} />
                        <span 
                          className="text-xs font-mono uppercase tracking-wider font-semibold truncate"
                          style={{ color: area.color }}
                        >
                          {area.tag}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#B8FF00] bg-[#B8FF00]/10 border border-[#B8FF00]/25 px-2 py-0.5 rounded-full flex-shrink-0 font-medium">
                        {area.metricValue}
                      </span>
                    </div>

                    {/* Slide Title & Short Description */}
                    <h3 className="text-base xs:text-lg font-normal tracking-tight text-white mb-1.5 leading-snug [text-wrap:balance]">
                      {area.title}
                    </h3>
                    <p className="text-xs text-neutral-300/80 font-light leading-relaxed mb-3.5 [text-wrap:pretty]">
                      {area.desc}
                    </p>

                    {/* Mockup Card */}
                    <div className="w-full min-w-0 bg-[#12161e]/95 border border-white/15 rounded-xl p-3 shadow-xl backdrop-blur-md box-border">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                        <span className="text-[11px] font-mono text-neutral-200 font-medium truncate mr-2">
                          {area.mockupTitle}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: area.color }} />
                      </div>

                      <div className="space-y-2 w-full min-w-0">
                        {area.mockupRows.map((row, rIdx) => (
                          <div 
                            key={rIdx} 
                            className="w-full min-w-0 bg-[#181d26] border border-white/10 rounded-lg px-2.5 py-2 flex items-center justify-between gap-2 box-border"
                          >
                            <div className="flex items-center space-x-1.5 min-w-0 flex-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#B8FF00] flex-shrink-0" />
                              <span className="text-[11px] text-neutral-200 truncate">{row.label}</span>
                            </div>
                            <div className="flex items-center space-x-1 flex-shrink-0">
                              <span className="text-[9.5px] font-mono text-neutral-400">{row.status}</span>
                              <span className="text-[8px] font-mono bg-white/5 border border-white/10 text-neutral-300 px-1 py-0.5 rounded">
                                {row.tag}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Mockup Footer */}
                      <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                        <span className="truncate mr-2">{area.metricLabel}</span>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-pulse" />
                          <span className="text-white font-medium text-[10px]">Cadência Saudável</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Swipe hint inside card footer */}
                  <div className="relative z-10 pt-3 flex items-center justify-between text-[10.5px] font-mono text-neutral-400">
                    <span className="text-[10px] text-neutral-500">← Deslize para navegar →</span>
                    <span className="text-white/60 font-semibold">{`0${sIdx + 1} / 04`}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel Controls: Dots & Chevrons */}
        <div className="flex items-center justify-between mt-3 px-1 w-full">
          <div className="flex items-center gap-1.5">
            {AREAS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`transition-all rounded-full cursor-pointer ${
                  activeIdx === idx 
                    ? 'w-6 h-2 bg-[#B8FF00]' 
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Ir para área ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => instanceRef.current?.prev()}
              className="p-2 rounded-full bg-[#12161e] border border-white/10 text-neutral-300 hover:text-white active:scale-95 transition-all cursor-pointer"
              aria-label="Área anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => instanceRef.current?.next()}
              className="p-2 rounded-full bg-[#12161e] border border-white/10 text-neutral-300 hover:text-white active:scale-95 transition-all cursor-pointer"
              aria-label="Próxima área"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Pillars & CTA */}
        <div className="mt-7 pt-6 border-t border-white/10 w-full">
          <div className="space-y-2.5 mb-6 font-mono text-[11px] xs:text-xs text-neutral-300">
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

          <a
            href="#waitlist"
            className="w-full inline-flex items-center justify-center space-x-2 bg-white hover:bg-neutral-100 text-black text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-full transition-all active:scale-95 shadow-lg shadow-white/5 text-center"
          >
            <span>ENTRAR NA LISTA VIP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP EXPERIENCE (lg:grid): CLASSIC SPLIT-GRID VIEW AS BEFORE */}
      {/* ============================================================ */}
      <div className="hidden lg:block">
        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-8 border-b border-white/10 pb-3 mb-10 text-xs font-mono">
          {AREAS.map((area, idx) => {
            const Icon = area.icon;
            const isActive = activeIdx === idx;
            return (
              <button
                key={area.id}
                type="button"
                onClick={() => goToSlide(idx)}
                className={`pb-3 -mb-[13px] font-medium tracking-wide transition-colors flex items-center gap-2 flex-shrink-0 cursor-pointer ${
                  isActive ? 'text-white border-b-2 border-white' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: area.color }} />
                <span>{area.tag}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Split Grid */}
        <div className="grid grid-cols-12 gap-12 items-center">
          {/* Left: Atmospheric Preview Card */}
          <div className="col-span-7 rounded-2xl bg-[#0c0e12] border border-white/10 relative overflow-hidden min-h-[420px] p-8 flex items-center justify-center shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-[#11161d] to-[#1c242e] opacity-85"></div>
            <svg className="absolute inset-0 w-full h-full opacity-35 object-cover pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 300">
              <path d="M0 160L80 110L170 170L260 90L340 140L400 100V300H0Z" fill="#040608"></path>
              <path d="M-50 200L60 140L180 190L290 120L370 160L450 110V300H-50V200Z" fill="#020304" opacity="0.7"></path>
            </svg>

            {/* Modal Preview Card */}
            <div className="relative z-10 w-full max-w-[420px] bg-[#12161e]/95 border border-white/15 rounded-xl p-5 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center space-x-2 min-w-0 mr-2">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: current.color }} />
                  <span className="text-xs font-mono text-neutral-200 font-medium truncate">{current.mockupTitle}</span>
                </div>
                <span className="text-[10.5px] font-mono text-[#B8FF00] bg-[#B8FF00]/10 border border-[#B8FF00]/25 px-2.5 py-0.5 rounded-full flex-shrink-0 font-medium">
                  {current.metricValue}
                </span>
              </div>

              <div className="space-y-2.5 mt-3.5">
                {current.mockupRows.map((row, idx) => (
                  <div key={idx} className="bg-[#181d26] border border-white/10 rounded-lg px-3 py-2.5 flex items-center justify-between gap-2.5 hover:border-white/20 transition-colors">
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                      <CheckCircle2 className="w-4 h-4 text-[#B8FF00] flex-shrink-0" />
                      <span className="text-[12px] text-neutral-200 truncate">{row.label}</span>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-[10px] font-mono text-neutral-400">{row.status}</span>
                      <span className="text-[9px] font-mono bg-white/5 border border-white/10 text-neutral-300 px-1.5 py-0.5 rounded">
                        {row.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3.5 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-neutral-400">
                <span className="truncate mr-2">{current.metricLabel}</span>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-pulse" />
                  <span className="text-white font-medium">Cadência Saudável</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Editorial Explanation */}
          <div className="col-span-5 flex flex-col items-start">
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

            <div className="space-y-3 mb-8 w-full font-mono text-xs text-neutral-300">
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

            <a
              href="#waitlist"
              className="inline-flex items-center justify-center space-x-2 bg-white hover:bg-neutral-100 text-black text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-full transition-all active:scale-95 shadow-lg shadow-white/5 text-center"
            >
              <span>ENTRAR NA LISTA VIP</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
