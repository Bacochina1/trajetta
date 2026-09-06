'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { LIFE_AREAS } from '@/lib/constants';
import { LifeArea } from '@/types';
import { Check, ArrowRight, Compass, CheckCircle2 } from 'lucide-react';

export function OnboardingModal() {
  const { isOnboardingOpen, completeOnboarding, setIsOnboardingOpen, user } = useTrajetta();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [userName, setUserName] = useState(user.name || 'Matheus');
  const [selectedAreas, setSelectedAreas] = useState<LifeArea[]>(['corpo', 'dinheiro', 'carreira', 'vida']);
  const [urgentArea, setUrgentArea] = useState<LifeArea>('corpo');
  const [target12Months, setTarget12Months] = useState(
    'Correr minha primeira meia maratona e alcançar R$ 50.000 investidos.'
  );

  const toggleArea = (area: LifeArea) => {
    setSelectedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const handleFinishOnboarding = () => {
    completeOnboarding({
      name: userName,
      target12Months,
      primaryArea: urgentArea,
      firstGoalTitle: `Compromisso inicial em ${LIFE_AREAS[urgentArea].label}`,
    });
  };

  return (
    <Modal
      isOpen={isOnboardingOpen}
      onClose={() => setIsOnboardingOpen(false)}
      title="Bem-vindo à Trajetta"
      subtitle="Defina o ponto de partida da sua trajetória pessoal."
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black border border-white/15 flex items-center justify-center overflow-hidden shadow-[0_0_20px_rgba(184,255,0,0.2)]">
            <img src="/trajetta-logo.png" alt="Trajetta Logo" className="w-full h-full object-contain p-1" />
          </div>
          <div>
            <span className="text-sm font-extrabold text-[#F2F1ED] tracking-tight block">trajetta</span>
            <span className="text-[10px] text-[#8E9499] uppercase tracking-wider">Sistema Pessoal de Evolução</span>
          </div>
        </div>

        {/* Progress */}
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

        {/* Step 1: Identidade & Nome */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#B8FF00] uppercase tracking-widest">
                Passo 01 de 04
              </span>
              <h3 className="text-xl font-bold text-[#F2F1ED] mt-1">
                Como devemos te chamar?
              </h3>
              <p className="text-xs text-[#8E9499] mt-0.5">
                A Trajetta constrói uma história de vida personalizada para você.
              </p>
            </div>

            <input
              type="text"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              placeholder="Seu primeiro nome"
              className="w-full bg-[#111315] border border-white/10 rounded-xl p-3 text-sm text-[#F2F1ED] focus:outline-none focus:border-[#B8FF00]"
            />

            <div className="flex justify-end">
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(2)}
                disabled={!userName.trim()}
              >
                Continuar <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Áreas de foco */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#B8FF00] uppercase tracking-widest">
                Passo 02 de 04
              </span>
              <h3 className="text-xl font-bold text-[#F2F1ED] mt-1">
                O que você quer mudar na sua vida?
              </h3>
              <p className="text-xs text-[#8E9499] mt-0.5">
                Selecione as grandes dimensões onde você quer ver progresso palpável.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(['corpo', 'dinheiro', 'carreira', 'vida'] as LifeArea[]).map(area => {
                const config = LIFE_AREAS[area];
                const isSelected = selectedAreas.includes(area);
                return (
                  <div
                    key={area}
                    onClick={() => toggleArea(area)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all select-none tactile-btn ${
                      isSelected
                        ? 'bg-white/5 border-[#B8FF00]/40 text-[#F2F1ED]'
                        : 'bg-[#111315] border-white/5 text-[#8E9499]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <AreaBadge area={area} size="sm" />
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-[#B8FF00] text-[#0D0F10]' : 'border border-white/20'
                        }`}
                      >
                        {isSelected && <Check size={10} strokeWidth={3} />}
                      </div>
                    </div>
                    <p className="text-xs text-[#8E9499]">{config.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(3)}
                disabled={selectedAreas.length === 0}
              >
                Próximo Passo <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Área mais urgente & Visão 12 meses */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#B8FF00] uppercase tracking-widest">
                Passo 03 de 04
              </span>
              <h3 className="text-xl font-bold text-[#F2F1ED] mt-1">
                Qual área mais precisa da sua atenção hoje?
              </h3>
              <p className="text-xs text-[#8E9499] mt-0.5">
                Escolha a principal prioridade para o pontapé inicial.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {selectedAreas.map(area => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setUrgentArea(area)}
                  className={`p-3 rounded-xl border text-xs font-bold text-left transition-colors tactile-btn ${
                    urgentArea === area
                      ? 'bg-[#B8FF00] text-[#0D0F10] border-[#B8FF00]'
                      : 'bg-[#111315] text-[#8E9499] border-white/10 hover:text-[#F2F1ED]'
                  }`}
                >
                  {LIFE_AREAS[area].label}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-xs text-[#F2F1ED] font-semibold mb-1">
                Onde você gostaria de estar daqui a 12 meses?
              </label>
              <textarea
                value={target12Months}
                onChange={e => setTarget12Months(e.target.value)}
                rows={3}
                placeholder="Ex: Correr uma meia maratona, estar com R$ 50k investidos e com o corpo descansado..."
                className="w-full bg-[#111315] border border-white/10 rounded-xl p-3 text-xs text-[#F2F1ED] focus:outline-none focus:border-[#B8FF00] resize-none"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                Voltar
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(4)}
                disabled={!target12Months.trim()}
              >
                Gerar Meu Caminho <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: O Primeiro Momento Mágico */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-bold text-[#B8FF00] uppercase tracking-widest">
                Seu Caminho Inicial Trajetta
              </span>
              <h3 className="text-xl font-bold text-[#F2F1ED] mt-1">
                Entendemos o seu momento, {userName}.
              </h3>
              <p className="text-xs text-[#8E9499] mt-0.5">
                Desenhamos sua primeira semana sem sobrecarga. Quatro intenções simples para começar:
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#111315] border border-white/10 space-y-3">
              <div className="flex items-center gap-3">
                <AreaBadge area="corpo" size="sm" />
                <span className="text-xs text-[#F2F1ED] font-medium">3 treinos de 45 min esta semana</span>
              </div>
              <div className="flex items-center gap-3">
                <AreaBadge area="dinheiro" size="sm" />
                <span className="text-xs text-[#F2F1ED] font-medium">Guardar os primeiros R$ 350 para a reserva</span>
              </div>
              <div className="flex items-center gap-3">
                <AreaBadge area="carreira" size="sm" />
                <span className="text-xs text-[#F2F1ED] font-medium">90 min diários de trabalho profundo sem distrações</span>
              </div>
              <div className="flex items-center gap-3">
                <AreaBadge area="vida" size="sm" />
                <span className="text-xs text-[#F2F1ED] font-medium">Uma noite inteira sem telas com quem você ama</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#B8FF00]/10 border border-[#B8FF00]/25 text-xs text-[#F2F1ED]">
              <strong className="text-[#B8FF00] block mb-0.5">Métrica North Star:</strong>
              Concluir sua primeira semana colocará o marcador em 1 semana de evolução.
            </div>

            <div className="flex justify-end pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={handleFinishOnboarding}
                className="w-full text-sm font-bold bg-[#B8FF00] text-[#0D0F10] shadow-[0_0_30px_rgba(184,255,0,0.3)]"
              >
                <CheckCircle2 size={16} strokeWidth={2.5} /> Começar Minha Primeira Semana
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
