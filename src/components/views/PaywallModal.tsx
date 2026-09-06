'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useTrajetta } from '@/context/TrajettaContext';
import { Check, ShieldCheck, Sparkles, Zap, ArrowRight, RotateCcw } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaywallModal({ isOpen, onClose }: PaywallModalProps) {
  const { user, setUserProfile } = useTrajetta();
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly' | 'founding'>('annual');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubscribe = () => {
    setLoading(true);
    setTimeout(() => {
      setUserProfile({
        subscriptionPlan: selectedPlan === 'annual' ? 'pro_annual' : selectedPlan === 'founding' ? 'founding' : 'pro_monthly',
        trialDaysRemaining: 365,
      });
      setLoading(false);
      setSuccessMessage('Assinatura ativada com sucesso!');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1000);
    }, 800);
  };

  const handleRestore = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Compras restauradas com sucesso!');
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 1000);
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Trajetta Pro"
      subtitle="Evolua no seu ritmo real com a infraestrutura completa de trajetória pessoal."
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        {/* Value Proposition Header */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-[#171A1D] via-[#121416] to-[#0A0C0D] border border-[#B8FF00]/30 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#B8FF00]/15 border border-[#B8FF00]/30 flex items-center justify-center text-[#B8FF00] flex-shrink-0">
            <Zap size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[#F2F1ED]">
              Trial de 14 dias completo ativo
            </h4>
            <p className="text-xs text-[#8E9499] leading-relaxed">
              Você tem acesso irrestrito para planejar semanas, registrar hábitos, conduzir weekly reviews com IA e acumular sua linha do tempo. Sem surpresas ou cobranças automáticas involuntárias.
            </p>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Plan: Monthly */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 relative ${
              selectedPlan === 'monthly'
                ? 'bg-[#1F2328] border-[#B8FF00] shadow-[0_0_15px_rgba(184,255,0,0.15)]'
                : 'bg-[#171A1D] border-white/8 hover:border-white/15'
            }`}
          >
            <div className="text-[11px] font-bold text-[#8E9499] uppercase tracking-wider">
              Pro Mensal
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-xl font-black text-[#F2F1ED]">R$ 29,90</span>
              <span className="text-xs text-[#8E9499]">/mês</span>
            </div>
            <p className="text-[11px] text-[#8E9499] mt-2 leading-tight">
              Flexibilidade total. Cancele quando quiser.
            </p>
          </div>

          {/* Plan: Annual (Recommended) */}
          <div
            onClick={() => setSelectedPlan('annual')}
            className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 relative ${
              selectedPlan === 'annual'
                ? 'bg-[#1F2328] border-[#B8FF00] shadow-[0_0_20px_rgba(184,255,0,0.2)]'
                : 'bg-[#171A1D] border-white/8 hover:border-white/15'
            }`}
          >
            <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-[#B8FF00] text-[#0D0F10] text-[9px] font-black uppercase tracking-wider">
              Economize 33%
            </div>
            <div className="text-[11px] font-bold text-[#B8FF00] uppercase tracking-wider">
              Pro Anual
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-xl font-black text-[#F2F1ED]">R$ 239,90</span>
              <span className="text-xs text-[#8E9499]">/ano</span>
            </div>
            <p className="text-[11px] text-[#8E9499] mt-2 leading-tight">
              Apenas R$ 19,99/mês. 52 semanas garantidas.
            </p>
          </div>

          {/* Plan: Founding Member */}
          <div
            onClick={() => setSelectedPlan('founding')}
            className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 relative ${
              selectedPlan === 'founding'
                ? 'bg-[#1F2328] border-[#B8FF00] shadow-[0_0_15px_rgba(184,255,0,0.15)]'
                : 'bg-[#171A1D] border-white/8 hover:border-white/15'
            }`}
          >
            <div className="text-[11px] font-bold text-[#C9A45A] uppercase tracking-wider">
              Membro Fundador
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-xl font-black text-[#F2F1ED]">R$ 149,00</span>
              <span className="text-xs text-[#8E9499]">/1º ano</span>
            </div>
            <p className="text-[11px] text-[#8E9499] mt-2 leading-tight">
              Condição histórica para os primeiros exploradores.
            </p>
          </div>
        </div>

        {/* Benefits Checklist */}
        <div className="space-y-2.5 p-4 rounded-xl bg-[#111315] border border-white/5 text-xs text-[#F2F1ED]">
          <div className="font-bold text-[#8E9499] uppercase tracking-wider text-[10px] mb-1">
            Tudo o que está incluído no Trajetta Pro:
          </div>
          <div className="flex items-center gap-2">
            <Check size={14} className="text-[#B8FF00] flex-shrink-0" />
            <span>Ciclo semanal contínuo (52 semanas/ano) sem bloqueios</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={14} className="text-[#B8FF00] flex-shrink-0" />
            <span>IA Trajetta ilimitada: reflexão dominical personalizada e sem julgamentos</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={14} className="text-[#B8FF00] flex-shrink-0" />
            <span>Linha do Tempo perpétua: seus marcos de vida nunca expiram</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={14} className="text-[#B8FF00] flex-shrink-0" />
            <span>Jornadas e desafios temporais (21, 30 e 90 dias com recuperação humana)</span>
          </div>
          <div className="flex items-center gap-2">
            <Check size={14} className="text-[#B8FF00] flex-shrink-0" />
            <span>Exportação integral de dados e conformidade com LGPD</span>
          </div>
        </div>

        {/* Feedback Message */}
        {successMessage && (
          <div className="p-3 rounded-lg bg-[#B8FF00]/10 border border-[#B8FF00]/30 text-[#B8FF00] text-xs font-semibold flex items-center justify-center gap-2">
            <Check size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-white/8">
          <button
            type="button"
            onClick={handleRestore}
            disabled={loading}
            className="text-xs text-[#8E9499] hover:text-[#F2F1ED] transition-colors flex items-center gap-1.5"
          >
            <RotateCcw size={12} />
            <span>Restaurar Compras</span>
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Talvez Depois
            </Button>
            <Button
              variant="primary"
              size="md"
              disabled={loading}
              onClick={handleSubscribe}
              className="bg-[#B8FF00] text-[#0D0F10] font-bold text-xs"
            >
              {loading ? 'Processando...' : 'Confirmar Plano'}
              <ArrowRight size={14} />
            </Button>
          </div>
        </div>

        {/* Privacy and Terms Footnote */}
        <div className="text-[10px] text-center text-[#8E9499]/60 leading-tight">
          Assinatura com renovação automática. Cancele facilmente a qualquer momento nas configurações do seu perfil. Seus dados continuam seus mesmo após o término.
        </div>
      </div>
    </Modal>
  );
}
