'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { LIFE_AREAS } from '@/lib/constants';
import { Compass, Check, Plus, Footprints, ShieldAlert, Sparkles, RotateCcw } from 'lucide-react';

const STARTER_JOURNEYS = [
  {
    title: '21 Dias Sem Telas na Cama',
    description: 'Deixar o celular na sala ou longe do alcance após as 22h30 para um descanso fisiológico profundo.',
    lifeArea: 'vida' as const,
    totalDays: 21,
  },
  {
    title: '30 Dias de Movimento Consciente',
    description: 'Prática de ao menos 20 a 30 minutos de caminhada, treino ou alongamento todo santo dia.',
    lifeArea: 'corpo' as const,
    totalDays: 30,
  },
  {
    title: '30 Dias de Deep Work Sem Distrações',
    description: 'Garantir ao menos 1 bloco de 90 minutos de trabalho focado matinal sem abas ou redes sociais.',
    lifeArea: 'carreira' as const,
    totalDays: 30,
  },
  {
    title: '90 Dias Sem Compras por Impulso',
    description: 'Aplicar a regra dos 3 dias de reflexão antes de qualquer compra supérflua acima de R$ 150.',
    lifeArea: 'dinheiro' as const,
    totalDays: 90,
  },
];

export function JourneysView() {
  const { journeys, incrementJourneyDay, undoJourneyDay, recordJourneySlip, createJourney } = useTrajetta();
  const [showCatalog, setShowCatalog] = useState(false);

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

        {journeys.length > 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowCatalog(!showCatalog)}
            className="text-xs flex items-center gap-1.5"
          >
            <Plus size={14} />
            <span>{showCatalog ? 'Ocultar Catálogo' : 'Nova Jornada'}</span>
          </Button>
        )}
      </div>

      {/* Philosophy Callout */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#171A1D] to-[#121416] border border-white/8 flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-[#B8FF00]/10 border border-[#B8FF00]/25 flex items-center justify-center text-[#B8FF00] flex-shrink-0 mt-0.5">
          <Footprints size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-[#F2F1ED]">Trajetória Contínua, Sem Zerar</h4>
          <p className="text-xs text-[#8E9499] mt-0.5 leading-relaxed">
            Se você falhar, não precisa voltar para o marco zero. Na Trajetta, um deslize não anula dias de esforço acumulado. Você simplesmente ajusta e segue em frente.
          </p>
        </div>
      </div>

      {/* Journeys List */}
      <div className="space-y-6">
        {journeys.length === 0 ? (
          <div className="trajetta-card p-8 sm:p-10 text-center space-y-4 border border-white/8">
            <div className="w-12 h-12 rounded-2xl bg-[#B8FF00]/10 border border-[#B8FF00]/25 flex items-center justify-center mx-auto text-[#B8FF00]">
              <Compass size={22} />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#F2F1ED]">Nenhuma jornada em andamento</h3>
              <p className="text-xs text-[#8E9499] max-w-md mx-auto">
                Escolha um desafio abaixo para iniciar seu primeiro ciclo de consistência deliberada.
              </p>
            </div>
          </div>
        ) : (
          journeys.map(journey => {
            const percent = Math.min(100, Math.round((journey.currentDay / journey.totalDays) * 100));
            const todayStr = new Date().toISOString().split('T')[0];
            const isCompletedToday = journey.lastCompletedDate === todayStr || (journey.completedDates || []).includes(todayStr);
            const isFinished = journey.status === 'completed' || journey.currentDay >= journey.totalDays;
            const isSlipToday = journey.lastSlipDate === todayStr;

            return (
              <div
                key={journey.id}
                className="trajetta-card p-4 sm:p-7 border border-white/8 space-y-4 sm:space-y-5 bg-[#171A1D]/90"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <AreaBadge area={journey.lifeArea} size="sm" />
                      <span className="text-xs text-[#8E9499]">
                        Desafio de {journey.totalDays} dias
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#F2F1ED] mt-1 break-words">
                      {journey.title}
                    </h3>
                    <p className="text-xs text-[#8E9499]">{journey.description}</p>
                  </div>

                  <div className="text-left sm:text-right flex items-baseline sm:flex-col justify-between sm:justify-start gap-2 border-t border-white/5 sm:border-0 pt-2 sm:pt-0">
                    <div className="text-xl sm:text-2xl font-black text-[#B8FF00] tabular-numbers">
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
                    <span>Início (Dia 1)</span>
                    <span className="hidden xs:inline">Metade ({Math.round(journey.totalDays / 2)}d)</span>
                    <span className="text-[#F2F1ED] font-bold">Dia {journey.totalDays} (Fim)</span>
                  </div>
                </div>

                {/* Compassionate Slip Status */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#111315] border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isFinished ? 'bg-[#B8FF00]' : 'bg-[#B8FF00] animate-pulse'}`} />
                    <span className="text-[#F2F1ED]">
                      <strong>{journey.currentDay} dias construídos</strong>
                      {journey.slipDays > 0 ? (
                        <span className="text-[#8E9499]"> · {journey.slipDays} {journey.slipDays === 1 ? 'deslize registrado' : 'deslizes registrados'}</span>
                      ) : (
                        <span className="text-[#B8FF00]"> · zero deslizes</span>
                      )}
                    </span>
                  </div>

                  {isFinished ? (
                    <span className="text-[10px] sm:text-[11px] text-[#B8FF00] font-bold">
                      🏆 Ciclo 100% finalizado com sucesso!
                    </span>
                  ) : isCompletedToday ? (
                    <span className="text-[10px] sm:text-[11px] text-[#B8FF00] font-medium">
                      ✓ Check-in de hoje feito · Próximo dia amanhã
                    </span>
                  ) : (
                    <span className="text-[10px] sm:text-[11px] text-[#8E9499] italic">
                      Continue sua jornada com leveza e constância.
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2.5 pt-2 border-t border-white/8">
                  {isFinished ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled
                      className="w-full sm:w-auto min-h-[40px] flex items-center justify-center gap-1.5 text-xs bg-[#B8FF00]/10 border border-[#B8FF00]/30 text-[#B8FF00] font-medium cursor-default"
                    >
                      🏆 Desafio Concluído ({journey.totalDays}/{journey.totalDays})
                    </Button>
                  ) : isCompletedToday ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        variant="secondary"
                        size="sm"
                        disabled
                        className="flex-1 sm:flex-none min-h-[40px] flex items-center justify-center gap-1.5 text-xs bg-white/5 border border-white/10 text-[#F2F1ED]/70 cursor-default"
                      >
                        <Check size={14} className="text-[#B8FF00]" /> Concluído por hoje
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => undoJourneyDay(journey.id)}
                        className="min-h-[40px] text-xs text-[#8E9499] hover:text-[#F08A76] hover:bg-white/5 px-3 flex items-center gap-1.5"
                        title="Desfazer check-in de hoje"
                      >
                        <RotateCcw size={13} /> Desfazer
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => incrementJourneyDay(journey.id)}
                      className="w-full sm:w-auto min-h-[40px] flex items-center justify-center gap-1.5 text-xs"
                    >
                      <Check size={14} /> Registrar Dia Concluído
                    </Button>
                  )}

                  {!isFinished && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => recordJourneySlip(journey.id)}
                      className={`w-full sm:w-auto min-h-[40px] flex items-center justify-center gap-1.5 text-xs ${
                        isSlipToday ? 'border-[#F08A76]/40 bg-[#F08A76]/10 text-[#F08A76]' : ''
                      }`}
                      title={isSlipToday ? 'Clique para desfazer o deslize registrado hoje' : 'Registrar deslize consciente'}
                    >
                      {isSlipToday ? (
                        <>
                          <RotateCcw size={13} className="text-[#F08A76]" /> Deslize Registrado Hoje (Desfazer)
                        </>
                      ) : (
                        <>
                          <ShieldAlert size={14} className="text-[#F08A76]" /> Registrar Deslize Consciente
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Starter Journeys Catalog */}
      {(journeys.length === 0 || showCatalog) && (
        <div className="space-y-4 pt-4 border-t border-white/8">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#B8FF00]" />
            <h3 className="text-sm font-bold text-[#F2F1ED] uppercase tracking-wider">
              Catálogo de Jornadas Prontas
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {STARTER_JOURNEYS.map((starter) => {
              const alreadyActive = journeys.some((j) => j.title === starter.title);
              return (
                <div
                  key={starter.title}
                  className="trajetta-card p-5 border border-white/8 space-y-3 bg-[#171A1D] flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <AreaBadge area={starter.lifeArea} size="sm" />
                      <span className="text-[11px] font-mono text-[#8E9499]">
                        {starter.totalDays} dias
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[#F2F1ED]">{starter.title}</h4>
                    <p className="text-xs text-[#8E9499] leading-relaxed">
                      {starter.description}
                    </p>
                  </div>
                  <Button
                    variant={alreadyActive ? 'ghost' : 'primary'}
                    size="sm"
                    onClick={() => {
                      if (!alreadyActive) {
                        createJourney(starter);
                        setShowCatalog(false);
                      }
                    }}
                    disabled={alreadyActive}
                    className="w-full text-xs mt-2"
                  >
                    {alreadyActive ? (
                      <span className="text-[#8E9499]">Jornada já ativa</span>
                    ) : (
                      <>
                        <Plus size={13} /> Iniciar Esta Jornada
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
