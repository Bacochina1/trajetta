'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { Button } from '@/components/ui/Button';
import {
  User,
  Shield,
  CreditCard,
  Bell,
  Download,
  Trash2,
  LogOut,
  Check,
  Zap,
  Globe,
  FileText,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

interface ProfileViewProps {
  onOpenPaywall: () => void;
}

export function ProfileView({ onOpenPaywall }: ProfileViewProps) {
  const {
    user,
    setUserProfile,
    goals,
    habits,
    journeys,
    weeklyPlan,
    weeklyReviews,
    timeline,
    lifeScore,
    resetToDemoData,
    setIsAuthModalOpen,
  } = useTrajetta();

  const [notifications, setNotifications] = useState({
    weeklyPlanning: true,
    dailyHabits: true,
    weeklyReview: true,
  });

  const [exportSuccess, setExportSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);

  // Export all user data as JSON (LGPD Compliance)
  const handleExportData = () => {
    const fullData = {
      exportDate: new Date().toISOString(),
      user,
      goals,
      habits,
      journeys,
      weeklyPlan,
      weeklyReviews,
      timeline,
      lifeScore,
    };

    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trajetta-dados-${user.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    resetToDemoData();
    setShowDeleteConfirm(false);
    setAccountDeleted(true);
    setTimeout(() => setAccountDeleted(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-white/8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#8E9499] uppercase">
              Configurações & Governança
            </span>
            <span className="w-8 h-px bg-[#B8FF00]/40 inline-block" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F2F1ED] mt-2">
            Você & <span className="text-[#B8FF00]">Preferências.</span>
          </h1>
          <p className="text-sm text-[#8E9499] mt-1.5">
            Gerencie sua identidade, privacidade, dados pessoais e plano de evolução.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsAuthModalOpen(true)}
          className="text-xs"
        >
          <Shield size={14} className="text-[#B8FF00]" />
          <span>Conta & Login</span>
        </Button>
      </div>

      {/* Profile Card */}
      <div className="trajetta-card p-6 border border-white/8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#1F2328] border border-white/10 flex items-center justify-center text-xl font-bold text-[#F2F1ED] overflow-hidden shadow-[0_0_20px_rgba(184,255,0,0.1)]">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.avatarText || user.name.charAt(0)
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#F2F1ED]">{user.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#B8FF00]/10 text-[#B8FF00] text-[10px] font-bold">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-[#8E9499] mt-0.5">
                {user.email || 'admin@trajetta.app'}
              </p>
              <div className="flex items-center gap-2 mt-2 text-[11px] text-[#8E9499]">
                <Globe size={12} />
                <span>Fuso Horário: {user.timezone || 'America/Sao_Paulo (GMT-3)'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-xs text-[#8E9499]">Área Prioritária</span>
            <AreaBadge area={user.primaryFocusArea} size="sm" />
          </div>
        </div>

        {/* 12 Months Vision */}
        <div className="p-4 rounded-xl bg-[#111315] border border-white/5 space-y-1">
          <span className="text-[10px] font-bold text-[#8E9499] uppercase tracking-wider">
            Onde você quer estar daqui a 12 meses
          </span>
          <p className="text-xs text-[#F2F1ED] italic leading-relaxed">
            &ldquo;{user.target12Months}&rdquo;
          </p>
        </div>
      </div>

      {/* Subscription & Paywall Card */}
      <div className="trajetta-card p-6 border border-white/8 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B8FF00]/10 border border-[#B8FF00]/20 flex items-center justify-center text-[#B8FF00]">
              <CreditCard size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F2F1ED]">Assinatura & Plano</h3>
              <p className="text-xs text-[#8E9499]">Modelo transparente, sem bloqueios no histórico.</p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenPaywall}
            className="text-xs bg-[#B8FF00] text-[#0D0F10] font-bold"
          >
            <Zap size={13} />
            <span>Gerenciar Plano</span>
          </Button>
        </div>

        <div className="p-4 rounded-xl bg-[#111315] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#F2F1ED]">
                {user.subscriptionPlan === 'pro_annual'
                  ? 'Trajetta Pro Anual (Ativo)'
                  : user.subscriptionPlan === 'founding'
                  ? 'Membro Fundador (Ativo)'
                  : 'Trial Pro (14 Dias Gratuitos)'}
              </span>
              <span className="w-2 h-2 rounded-full bg-[#B8FF00]" />
            </div>
            <p className="text-[11px] text-[#8E9499] mt-0.5">
              11 dias restantes no seu período de experiência gratuito.
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold text-[#B8FF00]">R$ 0,00</span>
            <span className="text-[10px] text-[#8E9499] block">próxima cobrança opcional</span>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="trajetta-card p-6 border border-white/8 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#F2F1ED]">
            <Bell size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F2F1ED]">Preferências de Notificação</h3>
            <p className="text-xs text-[#8E9499]">Avisos contextuais e silenciosos. Zero spam, zero culpa.</p>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          {/* Item 1 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111315] border border-white/5">
            <div>
              <div className="text-xs font-semibold text-[#F2F1ED]">Planejamento da Semana</div>
              <div className="text-[11px] text-[#8E9499]">Lembrete de intenção nas manhãs de segunda-feira</div>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, weeklyPlanning: !prev.weeklyPlanning }))}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                notifications.weeklyPlanning ? 'bg-[#B8FF00]' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#0D0F10] transition-transform ${
                  notifications.weeklyPlanning ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Item 2 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111315] border border-white/5">
            <div>
              <div className="text-xs font-semibold text-[#F2F1ED]">Hábitos & Foco do Dia</div>
              <div className="text-[11px] text-[#8E9499]">Apenas nos dias em que você programou ações</div>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, dailyHabits: !prev.dailyHabits }))}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                notifications.dailyHabits ? 'bg-[#B8FF00]' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#0D0F10] transition-transform ${
                  notifications.dailyHabits ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Item 3 */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#111315] border border-white/5">
            <div>
              <div className="text-xs font-semibold text-[#F2F1ED]">Weekly Review Dominical</div>
              <div className="text-[11px] text-[#8E9499]">Convite para o fechamento da semana ao domingo às 19h</div>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, weeklyReview: !prev.weeklyReview }))}
              className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                notifications.weeklyReview ? 'bg-[#B8FF00]' : 'bg-white/10'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#0D0F10] transition-transform ${
                  notifications.weeklyReview ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* LGPD & Data Sovereignty */}
      <div className="trajetta-card p-6 border border-white/8 space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[#F2F1ED]">
            <Download size={16} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#F2F1ED]">Soberania de Dados & LGPD</h3>
            <p className="text-xs text-[#8E9499]">Você é o cliente, não o produto. Seus dados pertencem a você.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          {/* Export JSON */}
          <Button
            variant="secondary"
            size="md"
            onClick={handleExportData}
            className="flex-1 text-xs justify-center"
          >
            <Download size={14} />
            <span>Exportar Histórico (JSON)</span>
          </Button>

          {/* Reset Demo Data */}
          <Button
            variant="secondary"
            size="md"
            onClick={resetToDemoData}
            className="text-xs justify-center"
          >
            <RotateCcw size={14} />
            <span>Restaurar Demonstração</span>
          </Button>
        </div>

        {exportSuccess && (
          <div className="p-3 rounded-lg bg-[#B8FF00]/10 border border-[#B8FF00]/30 text-[#B8FF00] text-xs font-semibold flex items-center gap-2">
            <Check size={14} />
            <span>Arquivo JSON gerado e baixado com sucesso!</span>
          </div>
        )}

        {accountDeleted && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold flex items-center gap-2">
            <Check size={14} />
            <span>Dados da conta reiniciados com sucesso.</span>
          </div>
        )}

        {/* Delete Account Dialog */}
        <div className="pt-4 border-t border-white/8 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-xs font-bold text-red-400">Exclusão de Conta</span>
            <p className="text-[11px] text-[#8E9499]">
              Remove permanentemente suas metas, hábitos, memórias e registros.
            </p>
          </div>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold border border-red-500/20 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={13} />
              <span>Excluir Conta</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-2.5 py-1 text-xs text-[#8E9499] hover:text-[#F2F1ED]"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold transition-colors"
              >
                Confirmar Exclusão
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Institutional Footer */}
      <div className="text-center space-y-1 text-[11px] text-[#8E9499]/60 pt-4">
        <div>Trajetta • Versão 1.0 (Setembro de 2026)</div>
        <div>
          <a href="#" className="hover:text-[#F2F1ED] transition-colors">Termos de Uso</a> •{' '}
          <a href="#" className="hover:text-[#F2F1ED] transition-colors">Política de Privacidade</a> •{' '}
          <a href="#" className="hover:text-[#F2F1ED] transition-colors">Diretrizes de IA</a>
        </div>
      </div>
    </div>
  );
}
