'use client';

import React, { useState, useEffect } from 'react';
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
  Brain,
  Plus,
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
    resetToZero,
    setIsOnboardingOpen,
    setIsAuthModalOpen,
    logout,
  } = useTrajetta();

  const [notifications, setNotifications] = useState({
    weeklyPlanning: true,
    dailyHabits: true,
    weeklyReview: true,
  });

  const [exportSuccess, setExportSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);

  // Memory Engine State
  const [memories, setMemories] = useState<Array<{ id: string; memoryType: string; content: string; importance: number; confidence: number; source?: string }>>([]);
  const [livingSummary, setLivingSummary] = useState<string>('');
  const [memoryLoading, setMemoryLoading] = useState(false);
  const [newMemoryType, setNewMemoryType] = useState('preference');
  const [newMemoryContent, setNewMemoryContent] = useState('');
  const [addingMemory, setAddingMemory] = useState(false);

  useEffect(() => {
    fetch('/api/memory')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setMemories(data.memories || []);
          if (data.livingSummary?.summary) {
            setLivingSummary(data.livingSummary.summary);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryContent.trim()) return;
    setAddingMemory(true);
    try {
      const res = await fetch('/api/memory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memoryType: newMemoryType, content: newMemoryContent, importance: 0.7, confidence: 0.9, source: 'user_settings' }),
      });
      const data = await res.json();
      if (data.ok && data.memory) {
        setMemories(prev => [data.memory, ...prev]);
        setNewMemoryContent('');
      }
    } catch {
      // error
    } finally {
      setAddingMemory(false);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await fetch(`/api/memory/${id}`, { method: 'DELETE' });
      setMemories(prev => prev.filter(m => m.id !== id));
    } catch {
      // error
    }
  };

  const handlePurgeMemories = async () => {
    if (!confirm('Deseja realmente apagar todas as memórias da IA?')) return;
    try {
      await fetch('/api/memory/all', { method: 'DELETE' });
      setMemories([]);
    } catch {
      // error
    }
  };

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
      <div className="trajetta-card p-4 sm:p-6 border border-white/8 space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1F2328] border border-white/10 flex items-center justify-center text-lg sm:text-xl font-bold text-[#F2F1ED] overflow-hidden shadow-[0_0_20px_rgba(184,255,0,0.1)] flex-shrink-0">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.avatarText || user.name.charAt(0)
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-[#F2F1ED] truncate">{user.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#B8FF00]/10 text-[#B8FF00] text-[10px] font-bold">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-[#8E9499] mt-0.5 truncate">
                {user.email || (user.role === 'ADMIN' ? 'admin@trajetta.app' : 'membro@trajetta.app')}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5 text-[10px] sm:text-[11px] text-[#8E9499]">
                <Globe size={12} className="flex-shrink-0" />
                <span className="truncate">Fuso: {user.timezone || 'America/Sao_Paulo (GMT-3)'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1 pt-1 sm:pt-0 border-t border-white/5 sm:border-0 w-full sm:w-auto">
            <span className="text-[11px] sm:text-xs text-[#8E9499]">Área Prioritária</span>
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
          {/* Export Full Data (LGPD) */}
          <Button
            variant="secondary"
            size="md"
            onClick={handleExportData}
            className="flex-1 justify-center"
          >
            <Download size={15} />
            <span>Exportar Histórico (JSON)</span>
          </Button>

          {/* Reset Demo Data */}
          <Button
            variant="secondary"
            size="md"
            onClick={resetToDemoData}
            className="justify-center"
          >
            <RotateCcw size={15} />
            <span>Restaurar Demonstração</span>
          </Button>
        </div>

        {exportSuccess && (
          <div className="p-3 rounded-lg bg-[#B8FF00]/10 border border-[#B8FF00]/30 text-[#B8FF00] text-sm font-semibold flex items-center gap-2">
            <Check size={16} />
            <span>Arquivo JSON gerado e baixado com sucesso!</span>
          </div>
        )}

        {accountDeleted && (
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-semibold flex items-center gap-2">
            <Check size={16} />
            <span>Dados da conta reiniciados com sucesso.</span>
          </div>
        )}

        {/* Delete Account Dialog */}
        <div className="pt-4 border-t border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-sm font-bold text-red-400">Exclusão de Conta</span>
            <p className="text-xs text-[#8E9499]">
              Remove permanentemente suas metas, hábitos, memórias e registros.
            </p>
          </div>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 min-h-[40px] rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold border border-red-500/20 transition-colors flex items-center justify-center gap-2 select-none tactile-btn"
            >
              <Trash2 size={15} />
              <span>Excluir Conta</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-2 text-sm text-[#8E9499] hover:text-[#F2F1ED] min-h-[40px]"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 min-h-[40px] rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors select-none tactile-btn"
              >
                Confirmar Exclusão
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Memory Engine Section (RAG & Personal Memory) */}
      <div className="trajetta-card p-6 border border-white/8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B8FF00]/10 border border-[#B8FF00]/20 flex items-center justify-center text-[#B8FF00]">
              <Brain size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#F2F1ED] flex items-center gap-2">
                <span>Memória da IA & Contexto Pessoal</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#B8FF00]/10 text-[#B8FF00] border border-[#B8FF00]/20">
                  {memories.length} fatos
                </span>
              </h2>
              <p className="text-xs text-[#8E9499]">
                O que a inteligência da Trajetta aprendeu sobre sua rotina, padrões e preferências.
              </p>
            </div>
          </div>

          {memories.length > 0 && (
            <button
              onClick={handlePurgeMemories}
              className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-lg border border-red-500/20 hover:bg-red-500/10"
            >
              <Trash2 size={13} />
              <span>Limpar Todas</span>
            </button>
          )}
        </div>

        {/* Living Summary */}
        {livingSummary && (
          <div className="p-4 rounded-xl bg-[#14181f] border border-white/8 space-y-1.5">
            <span className="text-[10px] font-mono text-[#8E9499] uppercase tracking-wider">
              Nível 1 • Resumo Vivo da sua Fase Atual
            </span>
            <p className="text-xs text-[#F2F1ED] leading-relaxed">
              "{livingSummary}"
            </p>
          </div>
        )}

        {/* Memories List */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-mono text-[#8E9499] uppercase tracking-wider">
            Nível 3 • Memórias Semânticas & Padrões Verificados
          </span>

          {memories.length === 0 ? (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center text-xs text-[#8E9499]">
              Nenhuma memória gravada ainda. Conforme você conversar com a IA e registrar revisões, padrões verificados aparecerão aqui.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
              {memories.map(m => (
                <div key={m.id} className="p-3 rounded-xl bg-[#14181f] border border-white/8 flex items-start justify-between gap-3 group">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[#B8FF00]">
                        {m.memoryType}
                      </span>
                      <span className="text-[10px] text-[#8E9499]">
                        Confiança: {Math.round((m.confidence || 0.85) * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-[#F2F1ED] break-words">
                      {m.content}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteMemory(m.id)}
                    title="Excluir memória"
                    className="p-1.5 text-[#8E9499] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Memory Form */}
        <form onSubmit={handleAddMemory} className="pt-3 border-t border-white/8 space-y-3">
          <span className="text-[10px] font-mono text-[#8E9499] uppercase tracking-wider">
            Adicionar Memória Manualmente
          </span>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={newMemoryType}
              onChange={e => setNewMemoryType(e.target.value)}
              className="h-10 px-3 bg-[#14181f] border border-white/10 rounded-xl text-xs text-[#F2F1ED] focus:border-[#B8FF00] focus:outline-none"
            >
              <option value="preference">Preferência</option>
              <option value="goal">Meta / Foco</option>
              <option value="behavior_pattern">Padrão de Comportamento</option>
              <option value="difficulty">Dificuldade / Desafio</option>
              <option value="routine">Rotina</option>
              <option value="constraint">Restrição Real</option>
            </select>
            <input
              type="text"
              value={newMemoryContent}
              onChange={e => setNewMemoryContent(e.target.value)}
              placeholder="Ex: Prefiro treinar pela manhã e costumo viajar às terças..."
              className="flex-1 h-10 px-3.5 bg-[#14181f] border border-white/10 rounded-xl text-xs text-[#F2F1ED] placeholder-[#8E9499]/50 focus:border-[#B8FF00] focus:outline-none"
            />
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={addingMemory || !newMemoryContent.trim()}
              className="text-xs h-10 px-4"
            >
              <Plus size={14} />
              <span>Gravar</span>
            </Button>
          </div>
        </form>
      </div>

      {/* Reset Account & Redo Onboarding */}
      <div className="p-5 rounded-2xl bg-[#14181f] border border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <RotateCcw size={16} className="text-amber-400" />
            <h3 className="text-sm font-bold text-[#F2F1ED]">Onboarding & Trajetória Pessoal</h3>
          </div>
          <p className="text-xs text-[#8E9499]">
            Configure seu perfil real, defina seus próprios hábitos e estabeleça sua primeira meta sem dados herdados.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
          <button
            onClick={() => setIsOnboardingOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#F2F1ED] text-xs font-bold border border-white/10 transition-all flex items-center gap-2 select-none tactile-btn"
          >
            <span>Refazer Onboarding</span>
          </button>
          <button
            onClick={() => {
              if (window.confirm('Tem certeza que deseja limpar todos os dados e recomeçar sua conta 100% do zero?')) {
                resetToZero();
              }
            }}
            className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 transition-all flex items-center gap-2 select-none tactile-btn"
          >
            <RotateCcw size={14} />
            <span>Resetar do Zero</span>
          </button>
        </div>
      </div>

      {/* Logout Action Bar */}
      <div className="p-5 rounded-2xl bg-[#14181f] border border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-[#F2F1ED]">Sessão de Usuário</h3>
          <p className="text-xs text-[#8E9499]">
            Conectado como {user.name} ({user.role?.includes('Admin') ? 'Membro Fundador' : 'Usuário'}). Desconecte para acessar a tela de login.
          </p>
        </div>
        <button
          onClick={logout}
          className="px-5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/20 transition-all flex items-center gap-2 select-none"
        >
          <LogOut size={15} />
          <span>Sair da Conta (Logout)</span>
        </button>
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
