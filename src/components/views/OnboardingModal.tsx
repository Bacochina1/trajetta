'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { TrajettaLogo } from '@/components/ui/TrajettaLogo';
import { LIFE_AREAS } from '@/lib/constants';
import { LifeArea } from '@/types';
import { Check, ArrowRight, ArrowLeft, CheckCircle2, Plus, X, Sparkles } from 'lucide-react';

interface HabitChoice {
  title: string;
  lifeArea: LifeArea;
  frequencyPerWeek: number;
}

const PRESET_HABITS: HabitChoice[] = [
  { title: 'Treino de Musculação / Academia', lifeArea: 'corpo', frequencyPerWeek: 4 },
  { title: 'Caminhada ou Atividade Física', lifeArea: 'corpo', frequencyPerWeek: 3 },
  { title: 'Beber 2 Litros de Água', lifeArea: 'corpo', frequencyPerWeek: 7 },
  { title: 'Dormir 7h a 8h por Noite', lifeArea: 'corpo', frequencyPerWeek: 7 },
  { title: 'Aporte / Economia Semanal', lifeArea: 'dinheiro', frequencyPerWeek: 1 },
  { title: 'Revisar Gastos e Orçamento', lifeArea: 'dinheiro', frequencyPerWeek: 1 },
  { title: 'Trabalho Focado / Deep Work (90 min)', lifeArea: 'carreira', frequencyPerWeek: 5 },
  { title: 'Estudo ou Leitura (20 min)', lifeArea: 'carreira', frequencyPerWeek: 4 },
  { title: 'Tempo de Qualidade em Família / Lazer', lifeArea: 'vida', frequencyPerWeek: 2 },
  { title: 'Livre de Telas antes de Dormir', lifeArea: 'vida', frequencyPerWeek: 5 },
];

export function OnboardingModal() {
  const { isOnboardingOpen, completeOnboarding, setIsOnboardingOpen, user } = useTrajetta();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [userName, setUserName] = useState(user.name || '');
  const [selectedAreas, setSelectedAreas] = useState<LifeArea[]>(['corpo', 'dinheiro', 'carreira', 'vida']);
  const [selectedHabits, setSelectedHabits] = useState<HabitChoice[]>([
    { title: 'Beber 2 Litros de Água', lifeArea: 'corpo', frequencyPerWeek: 7 },
    { title: 'Trabalho Focado / Deep Work (90 min)', lifeArea: 'carreira', frequencyPerWeek: 5 },
    { title: 'Dormir 7h a 8h por Noite', lifeArea: 'corpo', frequencyPerWeek: 7 },
  ]);
  const [customHabitTitle, setCustomHabitTitle] = useState('');
  const [customHabitArea, setCustomHabitArea] = useState<LifeArea>('corpo');
  const [customHabitFreq, setCustomHabitFreq] = useState(4);

  const [target12Months, setTarget12Months] = useState(user.target12Months || '');
  const [firstGoalTitle, setFirstGoalTitle] = useState('');
  const [firstGoalArea, setFirstGoalArea] = useState<LifeArea>('corpo');
  const [firstGoalTargetDate, setFirstGoalTargetDate] = useState('2026-12-31');

  const toggleArea = (area: LifeArea) => {
    setSelectedAreas(prev =>
      prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
    );
  };

  const isHabitSelected = (h: HabitChoice) => {
    return selectedHabits.some(item => item.title.toLowerCase() === h.title.toLowerCase());
  };

  const toggleHabit = (h: HabitChoice) => {
    if (isHabitSelected(h)) {
      setSelectedHabits(prev => prev.filter(item => item.title.toLowerCase() !== h.title.toLowerCase()));
    } else {
      setSelectedHabits(prev => [...prev, h]);
    }
  };

  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customHabitTitle.trim()) return;
    const newHabit: HabitChoice = {
      title: customHabitTitle.trim(),
      lifeArea: customHabitArea,
      frequencyPerWeek: customHabitFreq,
    };
    setSelectedHabits(prev => [...prev, newHabit]);
    setCustomHabitTitle('');
  };

  const handleFinishOnboarding = () => {
    completeOnboarding({
      name: userName.trim() || 'Explorador',
      target12Months: target12Months.trim(),
      primaryArea: selectedAreas[0] || 'corpo',
      selectedHabits,
      firstGoalTitle: firstGoalTitle.trim(),
      firstGoalArea,
      firstGoalTargetDate,
    });
  };

  return (
    <Modal
      isOpen={isOnboardingOpen}
      onClose={() => {
        // Se usuário já tem onboarding feito, pode fechar. Senão, mantém para concluir.
        if (user.isOnboarded) setIsOnboardingOpen(false);
      }}
      title="Configurar Sua Trajetória"
      subtitle="Defina seu ponto de partida real, sem metas genéricas ou sobrecarga."
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Brand Lockup */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TrajettaLogo size={32} />
            <div>
              <span className="text-sm font-extrabold text-[#F2F1ED] tracking-tight block">trajetta</span>
              <span className="text-[10px] text-[#8E9499] uppercase tracking-wider">Sistema Pessoal de Evolução</span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#B8FF00] bg-[#B8FF00]/10 border border-[#B8FF00]/25 px-2.5 py-1 rounded-full">
            Etapa {step} de 5
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-1.5 border-b border-white/8 pb-4">
          {[1, 2, 3, 4, 5].map(s => (
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
                Passo 01 · Identidade
              </span>
              <h3 className="text-xl font-bold text-[#F2F1ED] mt-1">
                Como devemos te chamar?
              </h3>
              <p className="text-xs text-[#8E9499] mt-0.5">
                A Trajetta adapta todas as sugestões e o acompanhamento diretamente ao seu nome e contexto.
              </p>
            </div>

            <div>
              <label htmlFor="onboarding-name" className="block text-xs font-semibold text-[#8E9499] uppercase tracking-wider mb-1.5">
                Seu Primeiro Nome
              </label>
              <input
                id="onboarding-name"
                type="text"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                placeholder="Ex: Carlos, Ana, Lucas, Mariana..."
                autoFocus
                className="w-full h-11 bg-[#111315] border border-white/10 rounded-xl px-4 text-sm text-[#F2F1ED] placeholder:text-white/30 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors"
              />
            </div>

            <div className="flex justify-end pt-2">
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

        {/* Step 2: Áreas de Foco */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#B8FF00] uppercase tracking-widest">
                Passo 02 · Dimensões
              </span>
              <h3 className="text-xl font-bold text-[#F2F1ED] mt-1">
                Quais áreas você quer transformar?
              </h3>
              <p className="text-xs text-[#8E9499] mt-0.5">
                Selecione as grandes dimensões que você quer acompanhar na sua evolução.
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

            <div className="flex justify-between pt-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(1)}>
                <ArrowLeft size={14} /> Voltar
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

        {/* Step 3: Hábitos Reais */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#B8FF00] uppercase tracking-widest">
                Passo 03 · Hábitos Reais
              </span>
              <h3 className="text-xl font-bold text-[#F2F1ED] mt-1">
                O que você realmente quer manter na rotina?
              </h3>
              <p className="text-xs text-[#8E9499] mt-0.5">
                Escolha apenas o que faz sentido para sua vida hoje. Nada de hábitos irreais ou punições.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {PRESET_HABITS.map(h => {
                const selected = isHabitSelected(h);
                return (
                  <div
                    key={h.title}
                    onClick={() => toggleHabit(h)}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all tactile-btn select-none ${
                      selected
                        ? 'bg-[#B8FF00]/10 border-[#B8FF00]/40 text-[#F2F1ED]'
                        : 'bg-[#111315] border-white/8 text-[#8E9499] hover:text-[#F2F1ED]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${
                          selected ? 'bg-[#B8FF00] text-[#0D0F10]' : 'border border-white/20'
                        }`}
                      >
                        {selected && <Check size={10} strokeWidth={3} />}
                      </div>
                      <span className="text-xs font-semibold truncate">{h.title}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[11px] text-[#8E9499] font-mono">{h.frequencyPerWeek}x/sem</span>
                      <AreaBadge area={h.lifeArea} size="sm" showIcon={false} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Custom Habit */}
            <div className="pt-2 border-t border-white/8">
              <span className="block text-[11px] font-semibold text-[#8E9499] uppercase tracking-wider mb-2">
                Ou crie um hábito próprio:
              </span>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={customHabitTitle}
                  onChange={e => setCustomHabitTitle(e.target.value)}
                  placeholder="Ex: Meditar 10 min, Ler 15 páginas..."
                  className="flex-1 h-9 bg-[#111315] border border-white/10 rounded-lg px-3 text-xs text-[#F2F1ED] placeholder:text-white/30 focus:border-[#B8FF00] focus:outline-none"
                />
                <div className="flex gap-2">
                  <select
                    value={customHabitArea}
                    onChange={e => setCustomHabitArea(e.target.value as LifeArea)}
                    className="h-9 bg-[#111315] border border-white/10 rounded-lg px-2 text-xs text-[#F2F1ED] focus:outline-none"
                  >
                    <option value="corpo">Corpo</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="carreira">Carreira</option>
                    <option value="vida">Vida</option>
                  </select>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddCustomHabit}
                    disabled={!customHabitTitle.trim()}
                  >
                    <Plus size={13} /> Adicionar
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(2)}>
                <ArrowLeft size={14} /> Voltar
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(4)}
                disabled={selectedHabits.length === 0}
              >
                Próximo Passo ({selectedHabits.length} selecionados) <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Alvo de 12 Meses */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#B8FF00] uppercase tracking-widest">
                Passo 04 · Visão de 12 Meses
              </span>
              <h3 className="text-xl font-bold text-[#F2F1ED] mt-1">
                Onde você quer estar daqui a 1 ano?
              </h3>
              <p className="text-xs text-[#8E9499] mt-0.5">
                Descreva com suas palavras o que representaria um ano vitorioso para você.
              </p>
            </div>

            <div>
              <label htmlFor="onboarding-target" className="block text-xs font-semibold text-[#8E9499] uppercase tracking-wider mb-1.5">
                Seu Compromisso Pessoal de 12 Meses
              </label>
              <textarea
                id="onboarding-target"
                value={target12Months}
                onChange={e => setTarget12Months(e.target.value)}
                rows={4}
                placeholder="Ex: Aumentar o faturamento do meu negócio, manter constância de treinos 4x na semana sem lesão, e ter momentos de lazer sem telas com quem eu amo..."
                className="w-full bg-[#111315] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F2F1ED] placeholder:text-white/30 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
                <ArrowLeft size={14} /> Voltar
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={() => setStep(5)}
                disabled={!target12Months.trim()}
              >
                Definir Primeira Meta <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Primeira Meta Real & Conclusão */}
        {step === 5 && (
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-bold text-[#B8FF00] uppercase tracking-widest">
                Passo 05 · Primeira Meta
              </span>
              <h3 className="text-xl font-bold text-[#F2F1ED] mt-1">
                Qual sua primeira grande meta, {userName}?
              </h3>
              <p className="text-xs text-[#8E9499] mt-0.5">
                Um objetivo mensurável e claro para concentrar seu foco neste ciclo.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label htmlFor="onboarding-first-goal" className="block text-xs font-semibold text-[#8E9499] uppercase tracking-wider mb-1">
                  Título da Meta
                </label>
                <input
                  id="onboarding-first-goal"
                  type="text"
                  value={firstGoalTitle}
                  onChange={e => setFirstGoalTitle(e.target.value)}
                  placeholder="Ex: Bater R$ 30k de faturamento, Treinar 16x no mês, Guardar R$ 5.000..."
                  className="w-full h-10 bg-[#111315] border border-white/10 rounded-xl px-4 text-sm text-[#F2F1ED] placeholder:text-white/30 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="onboarding-goal-area" className="block text-xs font-semibold text-[#8E9499] uppercase tracking-wider mb-1">
                    Área
                  </label>
                  <select
                    id="onboarding-goal-area"
                    value={firstGoalArea}
                    onChange={e => setFirstGoalArea(e.target.value as LifeArea)}
                    className="w-full h-10 bg-[#111315] border border-white/10 rounded-xl px-3 text-xs text-[#F2F1ED] focus:outline-none"
                  >
                    <option value="corpo">Corpo & Saúde</option>
                    <option value="dinheiro">Dinheiro & Finanças</option>
                    <option value="carreira">Carreira & Negócios</option>
                    <option value="vida">Vida & Equilíbrio</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="onboarding-goal-date" className="block text-xs font-semibold text-[#8E9499] uppercase tracking-wider mb-1">
                    Data Alvo
                  </label>
                  <input
                    id="onboarding-goal-date"
                    type="date"
                    value={firstGoalTargetDate}
                    onChange={e => setFirstGoalTargetDate(e.target.value)}
                    className="w-full h-10 bg-[#111315] border border-white/10 rounded-xl px-3 text-xs text-[#F2F1ED] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Ready summary */}
            <div className="p-4 rounded-xl bg-[#111315] border border-white/10 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#B8FF00] font-bold">
                <CheckCircle2 size={15} />
                <span>Configuração Pronta:</span>
              </div>
              <p className="text-[#8E9499] leading-relaxed">
                Você terá <strong className="text-[#F2F1ED]">{selectedHabits.length} hábitos monitorados</strong> e iniciará sua semana 1 com foco e clareza.
              </p>
            </div>

            <div className="flex justify-between pt-2">
              <Button variant="ghost" size="sm" onClick={() => setStep(4)}>
                <ArrowLeft size={14} /> Voltar
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={handleFinishOnboarding}
                disabled={!firstGoalTitle.trim()}
                className="bg-[#B8FF00] text-[#0D0F10] font-bold shadow-[0_0_25px_rgba(184,255,0,0.3)]"
              >
                <CheckCircle2 size={16} strokeWidth={2.5} /> Iniciar Minha Trajetória
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
