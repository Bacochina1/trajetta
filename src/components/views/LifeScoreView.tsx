'use client';

import React from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LIFE_AREAS } from '@/lib/constants';
import { LifeArea } from '@/types';
import { Layers, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

export function LifeScoreView() {
  const { lifeScore } = useTrajetta();
  const areas: LifeArea[] = ['corpo', 'dinheiro', 'carreira', 'vida'];

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
          <p className="text-sm text-[#8E9499] mt-1.5">
            Não é uma nota punitiva, é um mapa de clareza para calibrar onde sua energia deve ir.
          </p>
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
    </div>
  );
}
