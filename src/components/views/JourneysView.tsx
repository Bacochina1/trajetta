'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LIFE_AREAS } from '@/lib/constants';
import { Compass, Check, AlertCircle, Plus, Footprints, ShieldAlert } from 'lucide-react';

export function JourneysView() {
  const { journeys, incrementJourneyDay, recordJourneySlip } = useTrajetta();

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#B8FF00] uppercase">
              Ciclos Fechados de Evolução
            </span>
            <span className="w-8 h-px bg-[#B8FF00]/40 inline-block" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F2F1ED] mt-2">
            Suas <span className="text-[#B8FF00]">Jornadas.</span>
          </h1>
          <p className="text-sm text-[#8E9499] mt-1.5">
            Desafios temporais de 21, 30 ou 90 dias com trajetória visível e recuperação humana.
          </p>
        </div>
      </div>

      {/* Philosophy Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#171A1D] to-[#121416] border border-white/8 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-[#B8FF00]/10 border border-[#B8FF00]/25 flex items-center justify-center text-[#B8FF00] flex-shrink-0 mt-0.5">
          <Footprints size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#F2F1ED]">Trajetória Contínua, Sem Zerar</h4>
          <p className="text-xs text-[#8E9499] mt-0.5 leading-relaxed">
            Se você falhar, não precisa voltar para o marco zero. Na Trajetta, um deslize não anula 17 dias de esforço acumulado. Você simplesmente ajusta e segue em frente.
          </p>
        </div>
      </div>

      {/* Journeys List */}
      <div className="space-y-6">
        {journeys.map(journey => {
          const areaConfig = LIFE_AREAS[journey.lifeArea];
          const percent = Math.round((journey.currentDay / journey.totalDays) * 100);

          return (
            <div
              key={journey.id}
              className="trajetta-card p-6 sm:p-7 border border-white/8 space-y-5 bg-[#171A1D]/90"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <AreaBadge area={journey.lifeArea} size="sm" />
                    <span className="text-xs text-[#8E9499]">
                      Desafio de {journey.totalDays} dias
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F2F1ED] mt-1">
                    {journey.title}
                  </h3>
                  <p className="text-xs text-[#8E9499]">{journey.description}</p>
                </div>

                <div className="text-right">
                  <div className="text-2xl font-black text-[#B8FF00] tabular-numbers">
                    Dia {journey.currentDay}{' '}
                    <span className="text-sm font-normal text-[#8E9499]">
                      / {journey.totalDays}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#8E9499]">{percent}% percorrido</span>
                </div>
              </div>

              {/* Graphical Trajectory Line */}
              <div className="space-y-2 pt-2">
                <ProgressBar
                  value={journey.currentDay}
                  max={journey.totalDays}
                  height="h-3"
                  color="#B8FF00"
                />

                {/* Nodes on path */}
                <div className="flex justify-between text-[10px] text-[#8E9499] pt-1">
                  <span>Dia 1 (Início)</span>
                  <span>Metade ({Math.round(journey.totalDays / 2)} dias)</span>
                  <span className="text-[#F2F1ED] font-bold">Dia {journey.totalDays} (Conquista)</span>
                </div>
              </div>

              {/* Compassionate Slip Status */}
              <div className="p-3.5 rounded-xl bg-[#111315] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#B8FF00] animate-pulse" />
                  <span className="text-[#F2F1ED]">
                    <strong>{journey.currentDay} dias construídos</strong>
                    {journey.slipDays > 0 ? (
                      <span className="text-[#8E9499]"> · {journey.slipDays} deslize registrado</span>
                    ) : (
                      <span className="text-[#B8FF00]"> · zero deslizes</span>
                    )}
                  </span>
                </div>

                <span className="text-[11px] text-[#8E9499] italic">
                  Continue sua jornada com leveza.
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2.5 pt-2 border-t border-white/8">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => incrementJourneyDay(journey.id)}
                  disabled={journey.currentDay >= journey.totalDays}
                  className="text-xs"
                >
                  <Check size={14} /> Registrar Dia Concluído
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => recordJourneySlip(journey.id)}
                  className="text-xs"
                >
                  <ShieldAlert size={14} className="text-[#F08A76]" /> Registrar Deslize Consciente
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
