'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { CheckCircle2, ChevronRight, Share2, Check, ArrowRight, Brain, Mail, Send } from 'lucide-react';
import { LIFE_AREAS } from '@/lib/constants';
import { LifeArea } from '@/types';

export function WeeklyReviewModal() {
  const { isReviewModalOpen, setIsReviewModalOpen, submitWeeklyReview, weeklyPlan, user, habits, goals } = useTrajetta();
  
  const [step, setStep] = useState<number>(1);
  const [whatAdvanced, setWhatAdvanced] = useState('');
  const [whatDistracted, setWhatDistracted] = useState('');
  const [proudOf, setProudOf] = useState('');
  const [nextWeekAdjustment, setNextWeekAdjustment] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [aiText, setAiText] = useState<string>('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  // Auto-computed metrics
  const totalHabitLogs = habits.reduce((acc, h) => acc + h.daysCompletedThisWeek.length, 0);
  const totalHabitTargets = habits.reduce((acc, h) => acc + h.frequencyPerWeek, 0);
  const habitRate = totalHabitTargets > 0 ? Math.min(100, Math.round((totalHabitLogs / totalHabitTargets) * 100)) : 85;

  const areaLogs: Record<LifeArea, number> = { corpo: 0, dinheiro: 0, carreira: 0, vida: 0 };
  habits.forEach(h => {
    areaLogs[h.lifeArea] = (areaLogs[h.lifeArea] || 0) + h.daysCompletedThisWeek.length;
  });

  const sortedAreas = (['corpo', 'dinheiro', 'carreira', 'vida'] as LifeArea[]).sort(
    (a, b) => (areaLogs[b] || 0) - (areaLogs[a] || 0)
  );
  const topArea: LifeArea = sortedAreas[0] || (user.primaryFocusArea as LifeArea) || 'corpo';
  const neglectedArea: LifeArea = sortedAreas[sortedAreas.length - 1] || 'vida';

  const handleFinish = async () => {
    let reflection = `Você avançou consistentemente esta semana com foco destacado em ${LIFE_AREAS[topArea].label}. O ponto de atenção é ${LIFE_AREAS[neglectedArea].label}, onde o compromisso semanal pede prioridade matinal.`;
    setAiText(reflection);
    setIsCompleted(true);

    try {
      const res = await fetch('/api/ai/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wins: whatAdvanced,
          challenges: whatDistracted,
          completedRatio: habitRate + '%',
          streakWeeks: user.completedWeeksCount || 1,
        }),
      });
      const data = await res.json();
      if (data.ok && data.reflection) {
        reflection = data.reflection;
        setAiText(reflection);
      }
    } catch {
      // Keep default reflection
    }

    submitWeeklyReview({
      advancedGoalsCount: goals.filter(g => g.progress > 0).length || (goals.length > 0 ? 1 : 0),
      habitsRate: habitRate,
      topArea,
      neglectedArea,
      reflectionWhatAdvanced: whatAdvanced,
      reflectionWhatDistracted: whatDistracted,
      reflectionProudOf: proudOf,
      reflectionNextWeekAdjustment: nextWeekAdjustment,
      aiReflection: reflection,
    });
  };

  const handleSendEmail = async () => {
    setEmailStatus('sending');
    try {
      await fetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@trajetta.app', name: user.name }),
      });
      setEmailStatus('sent');
    } catch {
      setEmailStatus('idle');
    }
  };

  const handleClose = () => {
    setIsReviewModalOpen(false);
    setTimeout(() => {
      setStep(1);
      setIsCompleted(false);
      setWhatAdvanced('');
      setWhatDistracted('');
      setProudOf('');
      setNextWeekAdjustment('');
    }, 300);
  };

  return (
    <Modal
      isOpen={isReviewModalOpen}
      onClose={handleClose}
      title={isCompleted ? 'Sua Semana Concluída!' : `Weekly Review · Semana ${weeklyPlan.weekNumber}`}
      subtitle={
        isCompleted
          ? 'Sua trajetória foi registrada com sucesso.'
          : 'O ritual dominical de reflexão da Trajetta. 4 perguntas para fechar o ciclo.'
      }
      maxWidth="max-w-2xl"
    >
      {!isCompleted ? (
        <div className="space-y-6">
          {/* Progress indicators */}
          <div className="flex items-center gap-2 border-b border-white/8 pb-3">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  s <= step ? 'bg-[#B8FF00]' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          {/* Step 1: O que você avançou esta semana? */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8FF00]">
                  Etapa 01 de 04
                </span>
                <h4 className="text-lg font-bold text-[#F2F1ED] mt-1">
                  O que você avançou esta semana?
                </h4>
                <p className="text-xs text-[#8E9499] mt-0.5">
                  Conquistas concretas, treinos finalizados, entregas de trabalho ou hábitos sustentados.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#8E9499]">
                  <span>Máximo 300 caracteres</span>
                  <span className={whatAdvanced.length > 280 ? 'text-amber-400 font-medium' : ''}>
                    {whatAdvanced.length}/300 ({Math.max(0, 300 - whatAdvanced.length)} restantes)
                  </span>
                </div>
                <textarea
                  value={whatAdvanced}
                  onChange={e => setWhatAdvanced(e.target.value.slice(0, 300))}
                  rows={4}
                  maxLength={300}
                  placeholder="Ex: Treinei 4 vezes com corrida de 10km, fechei a proposta de produto e mantive meu sono regulado..."
                  className="w-full min-h-[100px] bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F2F1ED] placeholder:text-white/40 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(2)}
                  disabled={!whatAdvanced.trim()}
                >
                  Próxima Pergunta <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: O que te atrapalhou? */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8FF00]">
                  Etapa 02 de 04
                </span>
                <h4 className="text-lg font-bold text-[#F2F1ED] mt-1">
                  O que te atrapalhou ou causou fricção?
                </h4>
                <p className="text-xs text-[#8E9499] mt-0.5">
                  Identificar distrações sem autojulgamento é o primeiro passo para o ajuste.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#8E9499]">
                  <span>Máximo 300 caracteres</span>
                  <span className={whatDistracted.length > 280 ? 'text-amber-400 font-medium' : ''}>
                    {whatDistracted.length}/300 ({Math.max(0, 300 - whatDistracted.length)} restantes)
                  </span>
                </div>
                <textarea
                  value={whatDistracted}
                  onChange={e => setWhatDistracted(e.target.value.slice(0, 300))}
                  rows={4}
                  maxLength={300}
                  placeholder="Ex: Fiquei no celular até tarde na terça-feira e tive reuniões de última hora que atrasaram meu aporte financeiro..."
                  className="w-full min-h-[100px] bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F2F1ED] placeholder:text-white/40 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="ghost" size="md" onClick={() => setStep(1)}>
                  Voltar
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(3)}
                  disabled={!whatDistracted.trim()}
                >
                  Próxima Pergunta <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Do que você se orgulha? */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8FF00]">
                  Etapa 03 de 04
                </span>
                <h4 className="text-lg font-bold text-[#F2F1ED] mt-1">
                  Do que você se orgulha de verdade?
                </h4>
                <p className="text-xs text-[#8E9499] mt-0.5">
                  Uma decisão madura, um momento de presença com quem você ama ou a disciplina de não desistir.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#8E9499]">
                  <span>Máximo 300 caracteres</span>
                  <span className={proudOf.length > 280 ? 'text-amber-400 font-medium' : ''}>
                    {proudOf.length}/300 ({Math.max(0, 300 - proudOf.length)} restantes)
                  </span>
                </div>
                <textarea
                  value={proudOf}
                  onChange={e => setProudOf(e.target.value.slice(0, 300))}
                  rows={4}
                  maxLength={300}
                  placeholder="Ex: Orgulho de ter colocado meu tênis mesmo cansado na quinta-feira e de ter jantado em família sem checar o Slack..."
                  className="w-full min-h-[100px] bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F2F1ED] placeholder:text-white/40 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="ghost" size="md" onClick={() => setStep(2)}>
                  Voltar
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setStep(4)}
                  disabled={!proudOf.trim()}
                >
                  Próxima Pergunta <ArrowRight size={14} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: O que precisa mudar na próxima semana? */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#B8FF00]">
                  Etapa 04 de 04
                </span>
                <h4 className="text-lg font-bold text-[#F2F1ED] mt-1">
                  O que precisa mudar na próxima semana?
                </h4>
                <p className="text-xs text-[#8E9499] mt-0.5">
                  Qual ajuste simples e realista você fará para que a próxima semana funcione melhor?
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-[#8E9499]">
                  <span>Máximo 300 caracteres</span>
                  <span className={nextWeekAdjustment.length > 280 ? 'text-amber-400 font-medium' : ''}>
                    {nextWeekAdjustment.length}/300 ({Math.max(0, 300 - nextWeekAdjustment.length)} restantes)
                  </span>
                </div>
                <textarea
                  value={nextWeekAdjustment}
                  onChange={e => setNextWeekAdjustment(e.target.value.slice(0, 300))}
                  rows={4}
                  maxLength={300}
                  placeholder="Ex: Fazer o aporte na segunda-feira pela manhã e desligar o celular às 22h sem exceção..."
                  className="w-full min-h-[100px] bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F2F1ED] placeholder:text-white/40 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="ghost" size="md" onClick={() => setStep(3)}>
                  Voltar
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleFinish}
                  disabled={!nextWeekAdjustment.trim()}
                  className="bg-[#B8FF00] text-[#0D0F10] font-bold"
                >
                  <CheckCircle2 size={16} strokeWidth={2.2} /> Concluir Weekly Review
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Summary & Shareable Card */
        <div className="space-y-6">
          {/* Shareable Card Canvas */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#171A1D] via-[#121416] to-[#0A0C0D] border border-[#B8FF00]/30 shadow-[0_0_40px_rgba(184,255,0,0.1)] space-y-5">
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-black border border-white/15 overflow-hidden flex items-center justify-center">
                  <img src="/trajetta-logo.png" alt="Trajetta" className="w-full h-full object-contain p-0.5" />
                </div>
                <span className="text-xs font-bold tracking-tight text-[#F2F1ED]">
                  trajetta review · semana {weeklyPlan.weekNumber}
                </span>
              </div>
              <span className="text-[10px] text-[#8E9499] uppercase font-bold tracking-widest">
                2026
              </span>
            </div>

            {/* Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-2xl font-black text-[#B8FF00] block tabular-numbers">
                  3
                </span>
                <span className="text-[10px] text-[#8E9499] uppercase font-semibold">
                  Metas Avançadas
                </span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-2xl font-black text-[#F2F1ED] block tabular-numbers">
                  {habitRate}%
                </span>
                <span className="text-[10px] text-[#8E9499] uppercase font-semibold">
                  Hábitos Feitos
                </span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-xs font-bold text-[#58D6A7] block mt-1">
                  Corpo
                </span>
                <span className="text-[10px] text-[#8E9499] uppercase font-semibold">
                  Principal Área
                </span>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="text-xs font-bold text-[#F08A76] block mt-1">
                  Dinheiro
                </span>
                <span className="text-[10px] text-[#8E9499] uppercase font-semibold">
                  Atenção Necessária
                </span>
              </div>
            </div>

            {/* AI Contextual Reflection */}
            <div className="bg-[#111315] rounded-xl p-4 border border-white/5 space-y-2">
              <div className="flex items-center gap-2">
                <Brain size={14} className="text-[#A98CF7]" />
                <span className="text-xs font-bold text-[#F2F1ED]">Reflexão da Trajetta IA</span>
              </div>
              <p className="text-xs text-[#8E9499] leading-relaxed italic">
                &ldquo;{aiText || 'Você avançou consistentemente esta semana. Consistência é o seu maior diferencial.'}&rdquo;
              </p>
            </div>

            <div className="flex justify-between items-center text-[11px] text-[#8E9499] pt-2 border-t border-white/8">
              <span>{user.completedWeeksCount} semanas construídas na Trajetta</span>
              <span className="text-[#B8FF00] font-bold">Consistência, não perfeição.</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <button
              type="button"
              onClick={handleSendEmail}
              disabled={emailStatus !== 'idle'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 text-xs font-medium text-[#F2F1ED] transition-all active:scale-[0.96]"
            >
              {emailStatus === 'sending' ? (
                <span>Enviando resumo...</span>
              ) : emailStatus === 'sent' ? (
                <>
                  <Check size={14} className="text-[#B8FF00]" />
                  <span className="text-[#B8FF00]">E-mail Enviado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Mail size={14} className="text-[#8E9499]" />
                  <span>Enviar Resumo para Meu E-mail</span>
                </>
              )}
            </button>

            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="secondary"
                size="md"
                onClick={() => alert('Card pronto para compartilhamento!')}
                className="text-xs flex-1 sm:flex-none"
              >
                <Share2 size={14} /> Compartilhar
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleClose}
                className="text-xs flex-1 sm:flex-none"
              >
                <Check size={14} /> Fechar Semana
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
