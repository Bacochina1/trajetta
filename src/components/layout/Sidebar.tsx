'use client';

import React from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { TrajettaLogo } from '@/components/ui/TrajettaLogo';
import { ActiveView } from '@/types';
import {
  Calendar,
  CalendarDays,
  Crosshair,
  Repeat,
  Compass,
  History,
  Layers,
  Brain,
  ChevronRight,
  TrendingUp,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { activeView, setActiveView, user, setIsReviewModalOpen, setIsOnboardingOpen, setIsAuthModalOpen } = useTrajetta();

  const navItems: { id: ActiveView; label: string; icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }> }[] = [
    { id: 'hoje', label: 'Hoje', icon: Calendar },
    { id: 'semana', label: 'Minha Semana', icon: CalendarDays },
    { id: 'metas', label: 'Metas', icon: Crosshair },
    { id: 'habitos', label: 'Hábitos', icon: Repeat },
    { id: 'jornadas', label: 'Jornadas', icon: Compass },
    { id: 'timeline', label: 'Linha do Tempo', icon: History },
    { id: 'lifescore', label: 'Life Score', icon: Layers },
    { id: 'voce', label: 'Você & Perfil', icon: User },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#0D0F10]/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[250px] bg-[#111315] border-r border-white/8 flex flex-col p-5 transition-transform duration-200 md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Brand Lockup */}
        <div className="flex items-center justify-between pb-5 border-b border-white/8">
          <div className="flex items-center gap-2.5">
            <TrajettaLogo size={30} />
            <div className="flex flex-col">
              <span className="font-extrabold tracking-tight text-base text-[#F2F1ED] leading-none">
                trajetta
              </span>
              <span className="text-[10px] text-[#8E9499] tracking-wider uppercase mt-1">
                Evolução Pessoal
              </span>
            </div>
          </div>
        </div>

        {/* North Star Metric Card */}
        <div className="my-4 p-3 rounded-xl bg-[#171A1D] border border-white/8 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#B8FF00]/10 border border-[#B8FF00]/25 flex items-center justify-center text-[#B8FF00] flex-shrink-0">
            <TrendingUp size={16} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-[#F2F1ED] tabular-numbers leading-none">
                {user.completedWeeksCount}
              </span>
              <span className="text-[11px] text-[#8E9499]">semanas</span>
            </div>
            <p className="text-[10px] text-[#B8FF00] font-medium tracking-tight mt-0.5">
              North Star em construção
            </p>
          </div>
        </div>

        {/* Onboarding Callout Banner when not onboarded */}
        {!user.isOnboarded && (
          <div className="mb-4 p-3 rounded-xl bg-[#B8FF00]/10 border border-[#B8FF00]/30 space-y-2">
            <div className="flex items-center gap-2 text-[#B8FF00] font-bold text-xs">
              <span className="w-2 h-2 rounded-full bg-[#B8FF00] animate-pulse" />
              <span>Configure seu perfil</span>
            </div>
            <p className="text-[11px] text-[#8E9499] leading-tight">
              Defina seu nome, hábitos e primeira meta real.
            </p>
            <button
              onClick={() => {
                setIsOnboardingOpen(true);
                onClose();
              }}
              className="w-full py-1.5 px-2.5 rounded-lg bg-[#B8FF00] text-[#0D0F10] text-xs font-bold hover:bg-[#a3e600] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Fazer Onboarding</span>
            </button>
          </div>
        )}

        {/* Navigation label */}
        <div className="text-[10px] font-bold text-[#8E9499] uppercase tracking-[0.18em] px-2 mb-2">
          Ciclo de Evolução
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  onClose();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-[background-color,color,transform] duration-150 text-left select-none tactile-btn',
                  isActive
                    ? 'bg-[#B8FF00] text-[#0D0F10] font-bold shadow-[0_0_15px_rgba(184,255,0,0.15)]'
                    : 'text-[#8E9499] hover:text-[#F2F1ED] hover:bg-white/5'
                )}
              >
                <Icon size={17} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className="flex-1">{item.label}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0D0F10]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="pt-3 border-t border-white/8 space-y-2">
          {/* User Profile Chip */}
          <button
            onClick={() => {
              setActiveView('voce');
              onClose();
            }}
            title="Configurações & Perfil"
            className="w-full flex items-center gap-2.5 p-2 rounded-xl text-left hover:bg-white/5 transition-colors duration-150 tactile-btn group"
          >
            <div className="w-8 h-8 rounded-full bg-[#252A2E] border border-white/10 flex items-center justify-center text-xs font-bold text-[#F2F1ED] overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.avatarText || user.name.charAt(0)
              )}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-[#F2F1ED] block truncate group-hover:text-[#B8FF00] transition-colors">
                {user.name}
              </span>
              <span className="text-[10px] text-[#8E9499] block truncate">
                {user.role}
              </span>
            </div>
            <ChevronRight size={14} className="text-[#8E9499] group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </aside>
    </>
  );
}
