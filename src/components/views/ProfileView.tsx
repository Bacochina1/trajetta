'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  ExternalLink,
  Receipt,
  XCircle,
  Smartphone,
  Camera,
  UploadCloud,
  Compass,
} from 'lucide-react';
import { startGuidedTour } from '@/components/ui/GuidedTour';
import { useI18n } from '@/lib/i18n/context';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import { triggerPwaInstall } from '@/components/pwa/PwaManager';
import { processAndSanitizeAvatar } from '@/lib/avatar/avatarProcessor';

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
    setActiveView,
    logout,
  } = useTrajetta();
  const { t, locale, setLocale, formatDate } = useI18n();

  const [notifications, setNotifications] = useState({
    weeklyPlanning: true,
    dailyHabits: true,
    weeklyReview: true,
  });

  const [exportSuccess, setExportSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showResetZeroConfirm, setShowResetZeroConfirm] = useState(false);
  const [showPurgeMemoriesConfirm, setShowPurgeMemoriesConfirm] = useState(false);
  const [accountDeleted, setAccountDeleted] = useState(false);

  // Subscription & Billing Governance State
  const [subDetails, setSubDetails] = useState<{
    status?: string;
    cancelAtPeriodEnd?: boolean;
    formattedPeriodEnd?: string | null;
    formattedTrialEnd?: string | null;
    recentInvoices?: Array<{
      id: string;
      number: string;
      amount: number;
      date: string;
      pdfUrl?: string;
      hostedUrl?: string;
    }>;
  }>({});
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelFeedback, setCancelFeedback] = useState<string | null>(null);
  const [cancelError, setCancelError] = useState<string | null>(null);

  // Avatar Upload & Security State
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [avatarSuccess, setAvatarSuccess] = useState<string | null>(null);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setAvatarUploading(true);
      setAvatarError(null);
      setAvatarSuccess(null);

      // 1. Sanitização no cliente: descarta metadados EXIF, destrói qualquer payload malicioso e re-renderiza em Canvas 256x256 WebP
      const processed = await processAndSanitizeAvatar(file);

      // 2. Transmissão para endpoint protegido com validação de magic bytes
      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatar: processed.dataUrl }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Erro ao salvar avatar.');
      }

      // 3. Atualizar contexto local do perfil
      setUserProfile({ avatar: data.avatar });
      setAvatarSuccess('Foto de perfil atualizada com sucesso!');
      setTimeout(() => setAvatarSuccess(null), 4000);
    } catch (err: any) {
      console.error('Avatar upload error:', err);
      setAvatarError(err.message || 'Falha ao processar imagem.');
      setTimeout(() => setAvatarError(null), 5000);
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      setAvatarUploading(true);
      setAvatarError(null);
      const res = await fetch('/api/user/avatar', { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.ok) {
        setUserProfile({ avatar: undefined });
        setAvatarSuccess('Foto de perfil removida.');
        setTimeout(() => setAvatarSuccess(null), 3000);
      }
    } catch {
      setAvatarError('Erro ao remover foto de perfil.');
    } finally {
      setAvatarUploading(false);
    }
  };

  useEffect(() => {
    fetch('/api/subscription/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setSubDetails(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleConfirmCancel = async () => {
    try {
      setCancelLoading(true);
      setCancelError(null);
      const res = await fetch('/api/subscription/cancel', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        setCancelFeedback(
          data.formattedDate
            ? `Assinatura cancelada. Seu acesso Pro continua ativo até ${data.formattedDate}.`
            : 'Assinatura cancelada com sucesso. Não haverá novas cobranças.'
        );
        setSubDetails((prev) => ({
          ...prev,
          cancelAtPeriodEnd: true,
        }));
        setTimeout(() => {
          setShowCancelModal(false);
          setCancelFeedback(null);
        }, 3500);
      } else {
        setCancelError(data.error || 'Não foi possível processar o cancelamento.');
      }
    } catch {
      setCancelError('Erro ao conectar ao serviço de cancelamento.');
    } finally {
      setCancelLoading(false);
    }
  };

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
    try {
      await fetch('/api/memory/all', { method: 'DELETE' });
      setMemories([]);
      setShowPurgeMemoriesConfirm(false);
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

        <div className="flex items-center gap-2">
          {user.role === 'ADMIN' && (
            <Link
              href="/admin/crm"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#B8FF00]/10 hover:bg-[#B8FF00]/20 text-[#B8FF00] border border-[#B8FF00]/30 text-xs font-bold transition-all"
            >
              <Shield size={14} />
              <span>Painel CRM</span>
            </Link>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={logout}
            className="text-xs text-red-400 hover:text-red-300 hover:border-red-500/30"
          >
            <LogOut size={14} />
            <span>Sair da Conta</span>
          </Button>
        </div>
      </div>

      {/* Avatar Feedback Notices */}
      {avatarSuccess && (
        <div className="p-3.5 rounded-xl bg-[#B8FF00]/10 border border-[#B8FF00]/30 text-[#B8FF00] text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
          <Check size={14} />
          <span>{avatarSuccess}</span>
        </div>
      )}
      {avatarError && (
        <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
          <AlertTriangle size={14} />
          <span>{avatarError}</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="trajetta-card p-4 sm:p-6 border border-white/8 space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
            {/* Avatar with Camera Trigger */}
            <div className="relative group flex-shrink-0">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#1F2328] border border-white/10 flex items-center justify-center text-lg sm:text-xl font-bold text-[#F2F1ED] overflow-hidden shadow-[0_0_20px_rgba(184,255,0,0.1)]">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.avatarText || user.name.charAt(0)
                )}
              </div>

              {/* Floating Camera Button */}
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
                title="Alterar foto de perfil (JPG, PNG ou WEBP)"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#B8FF00] hover:bg-[#c8ff3b] text-[#060709] flex items-center justify-center shadow-lg transition-transform hover:scale-110 disabled:opacity-50"
              >
                {avatarUploading ? (
                  <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={12} strokeWidth={2.4} />
                )}
              </button>

              {/* Hidden Secure File Input */}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-[#F2F1ED] truncate">{user.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-[#B8FF00]/10 text-[#B8FF00] text-[10px] font-bold">
                  {user.role}
                </span>
                {user.avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={avatarUploading}
                    className="text-[10px] text-red-400/80 hover:text-red-400 underline underline-offset-2 transition-colors ml-1"
                  >
                    Remover foto
                  </button>
                )}
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

      {/* Language & PWA Preferences Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Language Selection */}
        <div className="trajetta-card p-5 border border-white/8 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B8FF00]/10 border border-[#B8FF00]/20 flex items-center justify-center text-[#B8FF00]">
              <Globe size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F2F1ED]">{t.app.language}</h3>
              <p className="text-[11px] text-[#8E9499]">Português (Brasil) ou English (US).</p>
            </div>
          </div>
          <LanguageSwitcher variant="full" />
        </div>

        {/* PWA Mobile Installation */}
        <div className="trajetta-card p-5 border border-white/8 space-y-3 flex flex-col justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B8FF00]/10 border border-[#B8FF00]/20 flex items-center justify-center text-[#B8FF00]">
              <Smartphone size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F2F1ED]">{t.app.installApp}</h3>
              <p className="text-[11px] text-[#8E9499]">{t.app.installAppDesc}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={triggerPwaInstall}
            className="text-xs w-full justify-center"
          >
            <Download size={13} className="text-[#B8FF00]" />
            <span>{t.pwa.installButton}</span>
          </Button>
        </div>
      </div>

      {/* Subscription & Paywall Card */}
      <div className="trajetta-card p-6 border border-white/8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#B8FF00]/10 border border-[#B8FF00]/20 flex items-center justify-center text-[#B8FF00]">
              <CreditCard size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F2F1ED]">Assinatura & Faturamento</h3>
              <p className="text-xs text-[#8E9499]">Governança clara, recibos automáticos e cancelamento em 1 clique.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenPaywall}
              className="text-xs bg-[#B8FF00] text-[#0D0F10] font-bold"
            >
              <Zap size={13} />
              <span>Alterar Plano</span>
            </Button>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111315] border border-white/5 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#F2F1ED]">
                  {user.subscriptionPlan === 'pro_annual'
                    ? 'Trajetta Pro Anual'
                    : user.subscriptionPlan === 'founding'
                    ? 'Membro Fundador'
                    : user.subscriptionPlan === 'pro_monthly'
                    ? 'Trajetta Pro Mensal'
                    : 'Período de Experiência (Trial)'}
                </span>
                <span className={`w-2 h-2 rounded-full ${subDetails.cancelAtPeriodEnd ? 'bg-amber-400' : 'bg-[#B8FF00]'}`} />
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-[#8E9499]">
                  {subDetails.cancelAtPeriodEnd ? 'Cancelamento Agendado' : 'Ativo'}
                </span>
              </div>
              <p className="text-[11px] text-[#8E9499] mt-1">
                {subDetails.cancelAtPeriodEnd
                  ? `Seu acesso Pro permanecerá ativo até ${subDetails.formattedPeriodEnd || 'o fim do período'}. Nenhuma nova cobrança será realizada.`
                  : subDetails.formattedPeriodEnd
                  ? `Próxima renovação automática: ${subDetails.formattedPeriodEnd}.`
                  : 'Acesso sem restrições liberado. Gerencie quando quiser sem pegadinhas.'}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              {!subDetails.cancelAtPeriodEnd && (
                <button
                  type="button"
                  onClick={() => setShowCancelModal(true)}
                  className="text-xs text-rose-400/80 hover:text-rose-300 underline underline-offset-4 transition-colors"
                >
                  Cancelar Assinatura
                </button>
              )}
            </div>
          </div>

          {/* Histórico recente de faturas e recibos */}
          {subDetails.recentInvoices && subDetails.recentInvoices.length > 0 && (
            <div className="pt-3 border-t border-white/5 space-y-2">
              <span className="text-[10px] font-bold text-[#8E9499] uppercase tracking-wider block">
                Recibos Recentes:
              </span>
              <div className="space-y-1.5">
                {subDetails.recentInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between text-xs py-1 px-2.5 rounded bg-white/3 border border-white/5">
                    <div className="flex items-center gap-2 text-[#8E9499]">
                      <Receipt size={13} className="text-[#B8FF00]" />
                      <span>{inv.date}</span>
                      <span className="text-white/40">•</span>
                      <span className="text-[#F2F1ED] font-mono">{inv.amount > 0 ? `R$ ${inv.amount.toFixed(2)}` : 'R$ 0,00 (Trial)'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {inv.pdfUrl && (
                        <a
                          href={inv.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#B8FF00] hover:underline"
                        >
                          Baixar PDF
                        </a>
                      )}
                      {inv.hostedUrl && (
                        <a
                          href={inv.hostedUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#8E9499] hover:text-white"
                        >
                          Ver Online
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Transparente de Cancelamento (Código de Defesa do Consumidor) */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111315] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 flex-shrink-0">
                <XCircle size={20} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-[#F2F1ED]">Cancelar assinatura do Trajetta Pro?</h3>
                <p className="text-xs text-[#8E9499] leading-relaxed">
                  Sentiremos sua falta, mas respeitamos totalmente seu momento. Sem perguntas chatas ou burocracia.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/3 border border-white/6 space-y-2 text-xs text-[#8E9499]">
              <div className="flex items-start gap-2">
                <Check size={14} className="text-[#B8FF00] flex-shrink-0 mt-0.5" />
                <span><strong>Zero cobranças futuras:</strong> nenhuma nova cobrança será realizada no seu cartão.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check size={14} className="text-[#B8FF00] flex-shrink-0 mt-0.5" />
                <span><strong>Acesso mantido:</strong> você continuará com o Pro até o término do ciclo atual já contratado.</span>
              </div>
              <div className="flex items-start gap-2">
                <Check size={14} className="text-[#B8FF00] flex-shrink-0 mt-0.5" />
                <span><strong>Seus dados continuam seus:</strong> suas metas, hábitos e histórico nunca serão deletados.</span>
              </div>
            </div>

            {cancelFeedback && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold text-center">
                {cancelFeedback}
              </div>
            )}

            {cancelError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold text-center">
                {cancelError}
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/8">
              <Button
                variant="ghost"
                size="sm"
                disabled={cancelLoading}
                onClick={() => setShowCancelModal(false)}
                className="text-xs"
              >
                Voltar
              </Button>
              <button
                type="button"
                disabled={cancelLoading}
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30 transition-all disabled:opacity-50"
              >
                {cancelLoading ? 'Cancelando...' : 'Confirmar Cancelamento'}
              </button>
            </div>
          </div>
        </div>
      )}

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
            !showPurgeMemoriesConfirm ? (
              <button
                type="button"
                onClick={() => setShowPurgeMemoriesConfirm(true)}
                className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-lg border border-red-500/20 hover:bg-red-500/10"
              >
                <Trash2 size={13} />
                <span>Limpar Todas</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 bg-red-500/15 border border-red-500/40 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={handlePurgeMemories}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setShowPurgeMemoriesConfirm(false)}
                  className="px-2 py-1 rounded-lg text-xs text-[#8E9499] hover:text-[#F2F1ED]"
                >
                  Cancelar
                </button>
              </div>
            )
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

      {/* Guia & Tour do Sistema (Sempre disponível nas Configurações) */}
      <div className="p-5 rounded-2xl bg-[#14181f] border border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Compass size={16} className="text-[#B8FF00]" />
            <h3 className="text-sm font-bold text-[#F2F1ED]">Guia Interativo do Sistema</h3>
            <span className="text-[10px] font-mono uppercase bg-[#B8FF00]/10 text-[#B8FF00] px-2 py-0.5 rounded-full font-semibold">
              Tour
            </span>
          </div>
          <p className="text-xs text-[#8E9499]">
            Reveja o passo a passo guiado pelos ritos diários, inteligência silenciosa, jornadas de foco e princípios sem punição.
          </p>
        </div>
        <button
          onClick={() => {
            setActiveView('hoje');
            setTimeout(() => startGuidedTour(), 300);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#B8FF00]/10 hover:bg-[#B8FF00]/20 text-[#B8FF00] text-xs font-bold border border-[#B8FF00]/30 transition-all flex items-center gap-2 select-none tactile-btn flex-shrink-0"
        >
          <Compass size={14} />
          <span>Fazer Tour Guiado</span>
        </button>
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
          {!showResetZeroConfirm ? (
            <button
              onClick={() => setShowResetZeroConfirm(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold border border-amber-500/30 transition-all flex items-center gap-2 select-none tactile-btn"
            >
              <RotateCcw size={14} />
              <span>Resetar do Zero</span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/40 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => {
                  setShowResetZeroConfirm(false);
                  resetToZero();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500 text-black hover:bg-amber-400 transition-colors"
              >
                Confirmar Reset
              </button>
              <button
                type="button"
                onClick={() => setShowResetZeroConfirm(false)}
                className="px-2.5 py-1.5 rounded-lg text-xs text-[#8E9499] hover:text-[#F2F1ED]"
              >
                Cancelar
              </button>
            </div>
          )}
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
