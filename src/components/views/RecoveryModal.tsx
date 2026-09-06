'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useTrajetta } from '@/context/TrajettaContext';
import { Compass, Sparkles, Feather, RotateCcw, ArrowRight, ShieldCheck } from 'lucide-react';

export function RecoveryModal() {
  const { isRecoveryModalOpen, setIsRecoveryModalOpen, habits, goals, updateWeeklyPriority } = useTrajetta();

  if (!isRecoveryModalOpen) return null;

  const handleStartLight = () => {
    // Keep only the 2 most essential habits/goals and simplify weekly priorities
    updateWeeklyPriority('corpo', '1 movimento simples por dia');
    updateWeeklyPriority('vida', 'Descanso e retomada sem pressão');
    setIsRecoveryModalOpen(false);
  };

  const handleResume = () => {
    setIsRecoveryModalOpen(false);
  };

  const handleReorganize = () => {
    setIsRecoveryModalOpen(false);
  };

  return (
    <Modal
      isOpen={isRecoveryModalOpen}
      onClose={() => setIsRecoveryModalOpen(false)}
      title="Bem-vindo de volta à sua trajetória"
      subtitle="A vida real acontece. Sem cobranças, sem streaks quebrados, sem culpa."
      maxWidth="max-w-lg"
    >
      <div className="space-y-6">
        {/* Philosophy Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#171A1D] to-[#121416] border border-[#B8FF00]/30 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#B8FF00]/15 border border-[#B8FF00]/30 flex items-center justify-center text-[#B8FF00] flex-shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#F2F1ED]">
              Sua evolução acumulada permanece intacta
            </h4>
            <p className="text-xs text-[#8E9499] leading-relaxed">
              Ficar alguns dias ou semanas fora não anula o caminho construído. A Trajetta não é um fiscal de tarefas: é um sistema para a sua vida real.
            </p>
          </div>
        </div>

        {/* 3 Action Options */}
        <div className="space-y-3">
          <div
            onClick={handleStartLight}
            className="p-4 rounded-xl bg-[#171A1D] hover:bg-[#1F2328] border border-white/8 hover:border-[#B8FF00]/50 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#58D6A7]/15 text-[#58D6A7] flex items-center justify-center">
                  <Feather size={16} />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#F2F1ED] group-hover:text-[#B8FF00] transition-colors">
                    Começar Leve (Recomendado)
                  </h5>
                  <p className="text-xs text-[#8E9499] mt-0.5">
                    Focar em apenas 1 ou 2 ações essenciais esta semana sem sobrecarga.
                  </p>
                </div>
              </div>
              <ArrowRight size={16} className="text-[#8E9499] group-hover:text-[#B8FF00] group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          <div
            onClick={handleResume}
            className="p-4 rounded-xl bg-[#171A1D] hover:bg-[#1F2328] border border-white/8 hover:border-white/20 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#6FAEF7]/15 text-[#6FAEF7] flex items-center justify-center">
                  <RotateCcw size={16} />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#F2F1ED] group-hover:text-white transition-colors">
                    Retomar Meu Plano Atual
                  </h5>
                  <p className="text-xs text-[#8E9499] mt-0.5">
                    Continuar de onde você parou com as metas e hábitos já definidos.
                  </p>
                </div>
              </div>
              <ArrowRight size={16} className="text-[#8E9499] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </div>

          <div
            onClick={handleReorganize}
            className="p-4 rounded-xl bg-[#171A1D] hover:bg-[#1F2328] border border-white/8 hover:border-white/20 cursor-pointer transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#A98CF7]/15 text-[#A98CF7] flex items-center justify-center">
                  <Compass size={16} />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[#F2F1ED] group-hover:text-white transition-colors">
                    Reorganizar Tudo
                  </h5>
                  <p className="text-xs text-[#8E9499] mt-0.5">
                    Sua fase de vida mudou? Redefina suas prioridades com calma.
                  </p>
                </div>
              </div>
              <ArrowRight size={16} className="text-[#8E9499] group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
