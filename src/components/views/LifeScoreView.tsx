'use client';

import React, { useState, useMemo } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ShareCardModal } from '@/components/ui/ShareCardModal';
import { AreaDetailsModal } from '@/components/ui/AreaDetailsModal';
import { ShareCardData } from '@/lib/shareCardGenerator';
import { LIFE_AREAS } from '@/lib/constants';
import { LifeArea } from '@/types';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Info,
  Share2,
  Activity,
  ShieldCheck,
  Feather,
  Layers,
  Compass,
  Zap,
  ChevronRight,
} from 'lucide-react';

interface RadarDataPoint {
  area: LifeArea;
  label: string;
  score: number;
  color: string;
}

export function LifeScoreView() {
  const { lifeScore, user, habits, goals } = useTrajetta();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState<LifeArea | null>(null);
  const [detailedArea, setDetailedArea] = useState<LifeArea | null>(null);

  const areas: LifeArea[] = ['corpo', 'dinheiro', 'carreira', 'vida'];

  // Dynamic calculations derived from real habits and goals
  const calculatedMetrics = useMemo(() => {
    // Habits cadence
    const totalHabitsCount = habits.length;
    let totalTargetHabitActions = 0;
    let totalCompletedThisWeek = 0;
    let totalAllTimeDone = 0;

    const areaMetrics: Record<
      LifeArea,
      {
        score: number;
        habitsCount: number;
        completedThisWeek: number;
        targetThisWeek: number;
        goalsCount: number;
        avgGoalProgress: number;
        status: 'attention' | 'evolving' | 'strong';
        trend: 'up' | 'stable' | 'down';
        calmInsight: string;
      }
    > = {
      corpo: { score: 70, habitsCount: 0, completedThisWeek: 0, targetThisWeek: 0, goalsCount: 0, avgGoalProgress: 0, status: 'evolving', trend: 'stable', calmInsight: '' },
      dinheiro: { score: 70, habitsCount: 0, completedThisWeek: 0, targetThisWeek: 0, goalsCount: 0, avgGoalProgress: 0, status: 'evolving', trend: 'stable', calmInsight: '' },
      carreira: { score: 70, habitsCount: 0, completedThisWeek: 0, targetThisWeek: 0, goalsCount: 0, avgGoalProgress: 0, status: 'evolving', trend: 'stable', calmInsight: '' },
      vida: { score: 70, habitsCount: 0, completedThisWeek: 0, targetThisWeek: 0, goalsCount: 0, avgGoalProgress: 0, status: 'evolving', trend: 'stable', calmInsight: '' },
    };

    areas.forEach((area) => {
      const areaHabits = habits.filter((h) => h.lifeArea === area);
      const areaGoals = goals.filter((g) => g.lifeArea === area);

      const areaTarget = areaHabits.reduce((acc, h) => acc + (h.frequencyPerWeek || 5), 0);
      const areaDone = areaHabits.reduce((acc, h) => acc + (h.daysCompletedThisWeek?.length || 0), 0);
      const areaAllTime = areaHabits.reduce((acc, h) => acc + (h.totalCompletedAllTime || 0), 0);

      totalTargetHabitActions += areaTarget;
      totalCompletedThisWeek += areaDone;
      totalAllTimeDone += areaAllTime;

      let avgGoalProg = 0;
      if (areaGoals.length > 0) {
        avgGoalProg = Math.round(areaGoals.reduce((acc, g) => acc + (g.progress || 0), 0) / areaGoals.length);
      }

      // Base score from saved state or default
      const baseFromSaved = lifeScore[area]?.score ?? 70;

      let dynamicScore = baseFromSaved;
      if (areaHabits.length > 0 || areaGoals.length > 0) {
        const habitRatio = areaTarget > 0 ? areaDone / areaTarget : 0.7;
        const goalRatio = areaGoals.length > 0 ? avgGoalProg / 100 : 0.7;
        // 60% habits cadence, 40% goals progress
        const computed = Math.round((habitRatio * 0.6 + goalRatio * 0.4) * 100);
        dynamicScore = Math.max(35, Math.min(98, Math.round(baseFromSaved * 0.35 + computed * 0.65)));
      }

      const status: 'attention' | 'evolving' | 'strong' =
        dynamicScore >= 75 ? 'strong' : dynamicScore >= 55 ? 'evolving' : 'attention';

      const trend: 'up' | 'stable' | 'down' =
        dynamicScore > baseFromSaved ? 'up' : dynamicScore < baseFromSaved ? 'down' : 'stable';

      const areaSpecificInsights: Record<LifeArea, Record<'strong' | 'evolving' | 'attention', string>> = {
        corpo: {
          strong: 'Vitalidade física e ritmo de sono consistentes. Mantenha a cadência sem sobrecarregar.',
          evolving: 'Construindo ritmo de treinos e descanso. Em dias cansativos, acione seu piso mínimo de 15 minutos.',
          attention: 'Energia física oscilando. Reduza a cobrança e garanta apenas água e 5 minutos de movimento.',
        },
        dinheiro: {
          strong: 'Reserva e aportes sob controle lúcido. Foco no horizonte de longo prazo sem ansiedade.',
          evolving: 'Controle de fluxo financeiro ativo. Mantenha os aportes semanais e freie gastos por impulso.',
          attention: 'Finanças pedem atenção serena. Abra o extrato hoje e anote 1 despesa supérflua para evitar.',
        },
        carreira: {
          strong: 'Avanço deliberado em projetos de alto impacto. Excelente proteção contra trabalho reativo.',
          evolving: 'Foco estratégico em construção. Garanta ao menos 1 bloco matinal de trabalho sem distrações.',
          attention: 'Trabalho disperso ou sobrecarregado. Feche as abas abertas e escolha a única entrega inegociável.',
        },
        vida: {
          strong: 'Espaço preservado para mente, família e descanso. Presença real longe do ruído digital.',
          evolving: 'Buscando equilíbrio e margem mental. Proteja o desligamento de telas antes de dormir.',
          attention: 'Sobrecarga mental acumulada. Reserve 15 minutos desconectado e mande mensagem para quem importa.',
        },
      };

      const calmInsight = areaSpecificInsights[area][status];

      areaMetrics[area] = {
        score: dynamicScore,
        habitsCount: areaHabits.length,
        completedThisWeek: areaDone,
        targetThisWeek: areaTarget,
        goalsCount: areaGoals.length,
        avgGoalProgress: avgGoalProg,
        status,
        trend,
        calmInsight,
      };
    });

    // Overall Score
    const overallScore = Math.round(
      (areaMetrics.corpo.score +
        areaMetrics.dinheiro.score +
        areaMetrics.carreira.score +
        areaMetrics.vida.score) /
        4
    );

    const weeklyPaceRate =
      totalTargetHabitActions > 0
        ? Math.min(100, Math.round((totalCompletedThisWeek / totalTargetHabitActions) * 100))
        : 82;

    const totalActiveDaysVolume = Math.max(14, totalAllTimeDone + 7);

    return {
      overallScore,
      weeklyPaceRate,
      totalActiveDaysVolume,
      totalHabitsCount,
      totalCompletedThisWeek,
      areaMetrics,
    };
  }, [habits, goals, lifeScore]);

  const { overallScore, weeklyPaceRate, totalActiveDaysVolume, totalCompletedThisWeek, areaMetrics } = calculatedMetrics;

  const overallStatus =
    overallScore >= 75
      ? 'Forte & Sustentável'
      : overallScore >= 58
      ? 'Ritmo Consistente'
      : 'Atenção Necessária';

  // Share card dataset
  const shareData: ShareCardData = {
    userName: user?.name || 'Explorador',
    overallScore,
    scoreStatus: overallStatus,
    streakDays: totalActiveDaysVolume,
    consistencyRate: weeklyPaceRate,
    completedHabitsCount: totalCompletedThisWeek,
    areas: {
      corpo: areaMetrics.corpo.score,
      dinheiro: areaMetrics.dinheiro.score,
      carreira: areaMetrics.carreira.score,
      vida: areaMetrics.vida.score,
    },
  };

  // Radar points geometry
  const radarPoints: RadarDataPoint[] = [
    { area: 'corpo', label: 'Corpo', score: areaMetrics.corpo.score, color: '#58D6A7' },
    { area: 'dinheiro', label: 'Dinheiro', score: areaMetrics.dinheiro.score, color: '#F08A76' },
    { area: 'carreira', label: 'Carreira', score: areaMetrics.carreira.score, color: '#A98CF7' },
    { area: 'vida', label: 'Vida', score: areaMetrics.vida.score, color: '#6FAEF7' },
  ];

  // Coordinates helper for 4-axis diamond/spider
  const cx = 150;
  const cy = 150;
  const radius = 105;

  const getCoordinates = (index: number, score: number) => {
    const ratio = Math.max(0.1, score / 100);
    const r = radius * ratio;
    switch (index) {
      case 0: // Corpo - Top
        return { x: cx, y: cy - r };
      case 1: // Dinheiro - Right
        return { x: cx + r, y: cy };
      case 2: // Carreira - Bottom
        return { x: cx, y: cy + r };
      case 3: // Vida - Left
        return { x: cx - r, y: cy };
      default:
        return { x: cx, y: cy };
    }
  };

  const polygonPath = radarPoints
    .map((p, idx) => {
      const { x, y } = getCoordinates(idx, p.score);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ') + ' Z';

  // Energy distribution percentages
  const totalAreaScores =
    areaMetrics.corpo.score +
    areaMetrics.dinheiro.score +
    areaMetrics.carreira.score +
    areaMetrics.vida.score;

  const distribution = {
    corpo: totalAreaScores > 0 ? Math.round((areaMetrics.corpo.score / totalAreaScores) * 100) : 25,
    dinheiro: totalAreaScores > 0 ? Math.round((areaMetrics.dinheiro.score / totalAreaScores) * 100) : 25,
    carreira: totalAreaScores > 0 ? Math.round((areaMetrics.carreira.score / totalAreaScores) * 100) : 25,
    vida: totalAreaScores > 0 ? Math.round((areaMetrics.vida.score / totalAreaScores) * 100) : 25,
  };

  const getStatusBadge = (status: 'attention' | 'evolving' | 'strong') => {
    switch (status) {
      case 'strong':
        return (
          <span className="text-[11px] font-semibold text-[#58D6A7] bg-[#58D6A7]/10 px-2.5 py-0.5 rounded-full border border-[#58D6A7]/25">
            Forte atualmente
          </span>
        );
      case 'evolving':
        return (
          <span className="text-[11px] font-semibold text-[#B8FF00] bg-[#B8FF00]/10 px-2.5 py-0.5 rounded-full border border-[#B8FF00]/25">
            Em evolução
          </span>
        );
      case 'attention':
        return (
          <span className="text-[11px] font-semibold text-[#F08A76] bg-[#F08A76]/10 px-2.5 py-0.5 rounded-full border border-[#F08A76]/25">
            Atenção necessária
          </span>
        );
    }
  };

  const getTrendIcon = (trend: 'up' | 'stable' | 'down') => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={14} className="text-[#58D6A7]" />;
      case 'down':
        return <TrendingDown size={14} className="text-[#F08A76]" />;
      case 'stable':
        return <Minus size={14} className="text-[#8E9499]" />;
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#8E9499] uppercase">
              Diagnóstico de Momento
            </span>
            <span className="w-8 h-px bg-[#B8FF00]/40 inline-block" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F2F1ED] mt-2">
            Life <span className="text-[#B8FF00]">Score.</span>
          </h1>
          <p className="text-sm text-[#8E9499] mt-1.5 max-w-2xl leading-relaxed">
            Não é uma nota punitiva ou métrica de vaidade. É um mapa de clareza em tempo real para calibrar onde sua energia deve fluir.
          </p>
        </div>

        {/* Share Button in Header */}
        <button
          onClick={() => setIsShareOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#B8FF00] hover:bg-[#a6e600] text-[#0D0F10] font-extrabold text-xs transition-all shadow-[0_0_16px_rgba(184,255,0,0.2)] active:scale-95 flex-shrink-0"
        >
          <Share2 size={15} />
          <span>Compartilhar Conquistas</span>
        </button>
      </div>

      {/* Main Visual Telemetry & Radar Overview Card */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0E1218] border border-white/10 p-5 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#B8FF00]/10 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Overall Score & Calm Consistency Metrics */}
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E9499] bg-white/5 px-2.5 py-1 rounded-md border border-white/8">
                  Trajetta Overall Score
                </span>
                <span className="text-xs font-semibold text-[#58D6A7] bg-[#58D6A7]/10 px-2.5 py-0.5 rounded-full border border-[#58D6A7]/20">
                  • {overallStatus}
                </span>
              </div>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-5xl sm:text-6xl font-black text-[#B8FF00] tracking-tight tabular-numbers">
                  {overallScore}
                </span>
                <span className="text-lg font-bold text-[#8E9499]">/ 100</span>
              </div>

              <p className="text-xs sm:text-sm text-[#8E9499] leading-relaxed">
                Média calibrada da sua consistência nos 4 pilares essenciais:{' '}
                <span className="text-[#58D6A7] font-medium">Corpo</span>,{' '}
                <span className="text-[#F08A76] font-medium">Dinheiro</span>,{' '}
                <span className="text-[#A98CF7] font-medium">Carreira</span> e{' '}
                <span className="text-[#6FAEF7] font-medium">Vida</span>.
              </p>
            </div>

            {/* Calm Power Principles Badges (Anti-Streak) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-[#14181F] p-3 rounded-2xl border border-white/6">
                <div className="flex items-center gap-1.5 text-[11px] text-[#8E9499] font-medium mb-1">
                  <Activity size={13} className="text-[#B8FF00]" />
                  <span>Pace Sustentável</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-[#F2F1ED]">{weeklyPaceRate}%</span>
                  <span className="text-[10px] text-[#8E9499]">da meta semanal</span>
                </div>
              </div>

              <div className="bg-[#14181F] p-3 rounded-2xl border border-white/6">
                <div className="flex items-center gap-1.5 text-[11px] text-[#8E9499] font-medium mb-1">
                  <ShieldCheck size={13} className="text-[#58D6A7]" />
                  <span>Consistência Ativa</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-[#F2F1ED]">{totalActiveDaysVolume}</span>
                  <span className="text-[10px] text-[#8E9499]">dias acumulados</span>
                </div>
              </div>
            </div>

            {/* Philosophy Notice */}
            <div className="flex items-center gap-2 text-[11px] text-[#8E9499] bg-[#14181F]/60 px-3 py-2 rounded-xl border border-white/5">
              <Feather size={13} className="text-[#B8FF00] flex-shrink-0" />
              <span>
                <strong>Sem punições:</strong> Se você pausar um dia, seu progresso não é zerado. Apenas retome no ritmo suave.
              </span>
            </div>
          </div>

          {/* Right: Modern SVG Radar / Spider Polar Area Chart */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center p-3 rounded-2xl bg-[#090D13]/70 border border-white/6 relative">
            <span className="absolute top-3 left-4 text-[10px] font-mono uppercase tracking-widest text-[#8E9499]">
              Equilíbrio Multidimensional
            </span>

            <div className="relative w-[300px] h-[300px] flex items-center justify-center select-none">
              <svg width="300" height="300" viewBox="0 0 300 300" className="overflow-visible">
                <defs>
                  {/* Glowing neon lime gradient for spider polygon */}
                  <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#B8FF00" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#58D6A7" stopOpacity="0.15" />
                  </linearGradient>

                  <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#B8FF00" floodOpacity="0.6" />
                  </filter>
                </defs>

                {/* Concentric Grid Diamonds (25%, 50%, 75%, 100%) */}
                {[0.25, 0.5, 0.75, 1.0].map((step, idx) => {
                  const r = radius * step;
                  const pts = `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`;
                  return (
                    <polygon
                      key={idx}
                      points={pts}
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.08)"
                      strokeWidth={idx === 3 ? '1.5' : '1'}
                      strokeDasharray={idx === 3 ? 'none' : '3 3'}
                    />
                  );
                })}

                {/* Axis lines */}
                <line x1={cx} y1={cy - radius} x2={cx} y2={cy + radius} stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
                <line x1={cx - radius} y1={cy} x2={cx + radius} y2={cy} stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />

                {/* The Player's Performance Polygon */}
                <path
                  d={polygonPath}
                  fill="url(#radarFill)"
                  stroke="#B8FF00"
                  strokeWidth="2.5"
                  filter="url(#neonGlow)"
                  className="transition-all duration-700 ease-out"
                />

                {/* Area Vertices / Points */}
                {radarPoints.map((p, idx) => {
                  const { x, y } = getCoordinates(idx, p.score);
                  return (
                    <g key={p.area} className="cursor-pointer" onClick={() => { setSelectedArea(p.area); setDetailedArea(p.area); }}>
                      {/* Pulse outer circle */}
                      <circle cx={x} cy={y} r="8" fill={p.color} fillOpacity="0.25" className="animate-pulse" />
                      {/* Core circle */}
                      <circle cx={x} cy={y} r="4.5" fill={p.color} stroke="#0E1218" strokeWidth="2" />
                    </g>
                  );
                })}

                {/* Labels outside axes */}
                {/* Top: Corpo */}
                <text x={cx} y={cy - radius - 16} textAnchor="middle" fill="#58D6A7" className="text-[11px] font-bold">
                  Corpo ({areaMetrics.corpo.score})
                </text>
                {/* Right: Dinheiro */}
                <text x={cx + radius + 12} y={cy + 4} textAnchor="start" fill="#F08A76" className="text-[11px] font-bold">
                  Dinheiro ({areaMetrics.dinheiro.score})
                </text>
                {/* Bottom: Carreira */}
                <text x={cx} y={cy + radius + 22} textAnchor="middle" fill="#A98CF7" className="text-[11px] font-bold">
                  Carreira ({areaMetrics.carreira.score})
                </text>
                {/* Left: Vida */}
                <text x={cx - radius - 12} y={cy + 4} textAnchor="end" fill="#6FAEF7" className="text-[11px] font-bold">
                  Vida ({areaMetrics.vida.score})
                </text>
              </svg>
            </div>

            <span className="text-[10px] text-[#8E9499] mt-2">
              Clique em qualquer pilar para focar nos detalhes abaixo
            </span>
          </div>
        </div>
      </div>

      {/* Proportional Energy Allocation Bar (Stacked Balance) */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0E1218] border border-white/8 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-[#B8FF00]" />
            <h3 className="text-sm font-bold text-[#F2F1ED]">Distribuição da Sua Energia</h3>
          </div>
          <span className="text-xs text-[#8E9499]">
            Proporção de esforço percebido entre as 4 áreas da vida
          </span>
        </div>

        {/* Stacked Bar */}
        <div className="w-full h-3.5 rounded-full overflow-hidden bg-white/5 flex gap-0.5 p-0.5 border border-white/10">
          <div
            style={{ width: `${distribution.corpo}%` }}
            className="h-full bg-[#58D6A7] rounded-l-full transition-all duration-500"
            title={`Corpo: ${distribution.corpo}%`}
          />
          <div
            style={{ width: `${distribution.dinheiro}%` }}
            className="h-full bg-[#F08A76] transition-all duration-500"
            title={`Dinheiro: ${distribution.dinheiro}%`}
          />
          <div
            style={{ width: `${distribution.carreira}%` }}
            className="h-full bg-[#A98CF7] transition-all duration-500"
            title={`Carreira: ${distribution.carreira}%`}
          />
          <div
            style={{ width: `${distribution.vida}%` }}
            className="h-full bg-[#6FAEF7] rounded-r-full transition-all duration-500"
            title={`Vida: ${distribution.vida}%`}
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#58D6A7]" />
            <span className="text-[#8E9499]">Corpo:</span>
            <span className="font-bold text-[#F2F1ED]">{distribution.corpo}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F08A76]" />
            <span className="text-[#8E9499]">Dinheiro:</span>
            <span className="font-bold text-[#F2F1ED]">{distribution.dinheiro}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A98CF7]" />
            <span className="text-[#8E9499]">Carreira:</span>
            <span className="font-bold text-[#F2F1ED]">{distribution.carreira}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#6FAEF7]" />
            <span className="text-[#8E9499]">Vida:</span>
            <span className="font-bold text-[#F2F1ED]">{distribution.vida}%</span>
          </div>
        </div>
      </div>

      {/* Principle Callout */}
      <div className="p-4 rounded-2xl bg-[#171A1D] border border-white/8 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-[#6FAEF7]/10 border border-[#6FAEF7]/25 flex items-center justify-center text-[#6FAEF7] flex-shrink-0 mt-0.5">
          <Info size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#F2F1ED]">Equilíbrio não é dar a mesma atenção para tudo</h4>
          <p className="text-xs text-[#8E9499] mt-0.5 leading-relaxed">
            Fases diferentes da vida pedem prioridades diferentes. O Life Score não exige 100 em tudo, mas avisa quando uma área está sendo negligenciada por tempo demais.
          </p>
        </div>
      </div>

      {/* The 4 Area Detailed Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {areas.map((area) => {
          const m = areaMetrics[area];
          const config = LIFE_AREAS[area];
          const isHighlighted = selectedArea === area;

          return (
            <div
              key={area}
              onClick={() => {
                setSelectedArea(area);
                setDetailedArea(area);
              }}
              className={`trajetta-card p-6 border space-y-4 flex flex-col justify-between transition-all duration-300 cursor-pointer ${
                isHighlighted
                  ? 'border-[#B8FF00]/50 ring-1 ring-[#B8FF00]/30 bg-[#12161D]'
                  : 'border-white/8 hover:border-white/15'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <AreaBadge area={area} size="md" />
                  <div className="flex items-center gap-2">
                    {getTrendIcon(m.trend)}
                    {getStatusBadge(m.status)}
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-2">
                  <span className="text-3xl font-black text-[#F2F1ED] tabular-numbers">
                    {m.score}{' '}
                    <span className="text-xs font-normal text-[#8E9499]">/ 100</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#8E9499]">
                    {m.habitsCount} hábitos · {m.goalsCount} metas
                  </span>
                </div>

                <ProgressBar value={m.score} color={config.color} height="h-2" />

                <p className="text-xs text-[#8E9499] leading-relaxed pt-1">
                  {m.calmInsight}
                </p>
              </div>

              <div className="pt-3 border-t border-white/8 text-[11px] text-[#8E9499] flex justify-between items-center gap-2">
                <span className="truncate">{config.description}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedArea(area);
                    setDetailedArea(area);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#B8FF00]/10 hover:bg-[#B8FF00] text-[#B8FF00] hover:text-[#0D0F10] font-bold text-xs transition-all flex items-center gap-1 active:scale-95 flex-shrink-0"
                  aria-label={`Ver detalhes de ${config.label}`}
                >
                  <span>Ver detalhes</span>
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Area Detailed Modal */}
      {detailedArea && (
        <AreaDetailsModal
          area={detailedArea}
          onClose={() => setDetailedArea(null)}
          score={areaMetrics[detailedArea].score}
          status={areaMetrics[detailedArea].status}
          trend={areaMetrics[detailedArea].trend}
          calmInsight={areaMetrics[detailedArea].calmInsight}
        />
      )}

      {/* Share Card Modal */}
      <ShareCardModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        data={shareData}
      />
    </div>
  );
}
