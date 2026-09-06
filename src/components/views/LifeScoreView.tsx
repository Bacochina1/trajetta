'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { ShareCardModal } from '@/components/ui/ShareCardModal';
import { ShareCardData } from '@/lib/shareCardGenerator';
import { LIFE_AREAS } from '@/lib/constants';
import { LifeArea } from '@/types';
import { TrendingUp, TrendingDown, Minus, Info, Share2, Flame, Activity } from 'lucide-react';

export function LifeScoreView() {
  const { lifeScore, user } = useTrajetta();
  const [isShareOpen, setIsShareOpen] = useState(false);
  const areas: LifeArea[] = ['corpo', 'dinheiro', 'carreira', 'vida'];

  // Overall Score calculation
  const overallScore = Math.round(
    (lifeScore.corpo.score + lifeScore.dinheiro.score + lifeScore.carreira.score + lifeScore.vida.score) / 4
  );

  const overallStatus =
    overallScore >= 75
      ? 'Forte & Sustentável'
      : overallScore >= 60
      ? 'Ritmo Consistente'
      : 'Atenção Necessária';

  const shareData: ShareCardData = {
    userName: user?.name || 'Explorador',
    overallScore,
    scoreStatus: overallStatus,
    streakDays: 14,
    consistencyRate: 84,
    completedHabitsCount: 18,
    areas: {
      corpo: lifeScore.corpo.score,
      dinheiro: lifeScore.dinheiro.score,
      carreira: lifeScore.carreira.score,
      vida: lifeScore.vida.score,
    },
  };

  const getStatusBadge = (status: 'attention' | 'evolving' | 'strong') => {
    switch (status) {
      case 'strong':
        return <span className="text-xs font-semibold text-[#58D6A7] bg-[#58D6A7]/10 px-3 py-1 rounded-full border border-[#58D6A7]/20">Forte atualmente</span>;
      case 'evolving':
        return <span className="text-xs font-semibold text-[#B8FF00] bg-[#B8FF00]/10 px-3 py-1 rounded-full border border-[#B8FF00]/20">Em evolução</span>;
      case 'attention':
        return <span className="text-xs font-semibold text-[#F08A76] bg-[#F08A76]/10 px-3 py-1 rounded-full border border-[#F08A76]/20">Atenção necessária</span>;
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
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header with Share button */}
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
          <p className="text-sm text-[#8E9499] mt-1.5">
            Não é uma nota punitiva, é um mapa de clareza para calibrar onde sua energia deve ir.
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

      {/* Hero Overall Score Flex Card (Strava / Spotify Wrapped Style) */}
      <div className="relative overflow-hidden rounded-3xl bg-[#0E1218] border border-white/10 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#B8FF00]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8E9499] bg-white/5 px-2.5 py-1 rounded-md border border-white/8">
                Trajetta Overall
              </span>
              <span className="text-xs font-semibold text-[#58D6A7] bg-[#58D6A7]/10 px-2.5 py-0.5 rounded-full">
                • {overallStatus}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl sm:text-6xl font-black text-[#B8FF00] tracking-tight">
                {overallScore}
              </span>
              <span className="text-lg font-bold text-[#8E9499]">/ 100</span>
            </div>

            <p className="text-sm text-[#8E9499] max-w-xl leading-relaxed">
              Média ponderada da sua consistência nos pilares de <span className="text-[#58D6A7]">Corpo</span>, <span className="text-[#F08A76]">Dinheiro</span>, <span className="text-[#A98CF7]">Carreira</span> e <span className="text-[#6FAEF7]">Vida</span>.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-[#F2F1ED]">
              <span className="flex items-center gap-1.5 bg-[#171A1D] px-3 py-1.5 rounded-xl border border-white/6">
                <Flame size={14} className="text-[#F08A76]" />
                <span className="font-bold">14 dias</span> seguidos de streak
              </span>
              <span className="flex items-center gap-1.5 bg-[#171A1D] px-3 py-1.5 rounded-xl border border-white/6">
                <Activity size={14} className="text-[#B8FF00]" />
                <span className="font-bold">84%</span> de pace semanal
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
            <button
              onClick={() => setIsShareOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#171A1D] hover:bg-white/10 text-[#F2F1ED] border border-white/12 font-bold text-xs transition-all active:scale-95 shadow-md"
            >
              <Share2 size={16} className="text-[#B8FF00]" />
              <span>Gerar Card Instagram (9:16)</span>
            </button>
            <span className="text-[11px] text-center text-[#8E9499]">
              Instagram Stories & WhatsApp
            </span>
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

      {/* The 4 Area Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {areas.map(area => {
          const areaData = lifeScore[area];
          const config = LIFE_AREAS[area];

          return (
            <div
              key={area}
              className="trajetta-card p-6 border border-white/8 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <AreaBadge area={area} size="md" />
                  <div className="flex items-center gap-2">
                    {getTrendIcon(areaData.trend)}
                    {getStatusBadge(areaData.status)}
                  </div>
                </div>

                <div className="flex items-baseline justify-between pt-2">
                  <span className="text-3xl font-black text-[#F2F1ED] tabular-numbers">
                    {areaData.score}{' '}
                    <span className="text-xs font-normal text-[#8E9499]">/ 100</span>
                  </span>
                </div>

                <ProgressBar
                  value={areaData.score}
                  color={config.color}
                  height="h-2"
                />

                <p className="text-xs text-[#8E9499] leading-relaxed pt-1">
                  {areaData.insight}
                </p>
              </div>

              <div className="pt-3 border-t border-white/8 text-[11px] text-[#8E9499] flex justify-between items-center">
                <span>{config.description}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Share Card Modal */}
      <ShareCardModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        data={shareData}
      />
    </div>
  );
}
