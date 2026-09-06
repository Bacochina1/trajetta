'use client';

import React from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { getCurrentDateFormatted } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Menu, Plus, CheckCircle2, RotateCcw, User, LogOut } from 'lucide-react';

export function Topbar({ onOpenMobile }: { onOpenMobile: () => void }) {
  const { weeklyPlan, user, setIsReviewModalOpen, setIsNewGoalModalOpen, resetToDemoData, setIsAuthModalOpen, logout } = useTrajetta();
  const dateFormatted = getCurrentDateFormatted();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#0D0F10]/90 backdrop-blur-md border-b border-white/8 px-4 sm:px-8 flex items-center justify-between">
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          aria-label="Abrir menu"
          className="min-w-[44px] min-h-[44px] p-2.5 rounded-lg text-[#8E9499] hover:text-[#F2F1ED] hover:bg-white/5 md:hidden tactile-btn flex items-center justify-center"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <span className="text-[#8E9499]">{dateFormatted}</span>
          <span className="text-white/20 hidden sm:inline">·</span>
          <span className="font-semibold text-[#F2F1ED] hidden sm:inline">
            Semana {weeklyPlan.weekNumber} de 52
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        {/* Nova Meta (Hidden on tiny screens, icon on md) */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsNewGoalModalOpen(true)}
          className="hidden sm:inline-flex"
        >
          <Plus size={14} />
          <span>Nova Meta</span>
        </Button>

        {/* Weekly Review CTA Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsReviewModalOpen(true)}
          className="text-xs px-2.5 sm:px-3 h-8 sm:h-9"
        >
          <CheckCircle2 size={13} strokeWidth={2.2} />
          <span className="hidden xs:inline sm:inline">Fechar Semana</span>
          <span className="xs:hidden sm:hidden">Revisão</span>
        </Button>

        {/* Account / Login Trigger */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          title="Conta & Autenticação"
          className="w-8 h-8 sm:w-auto min-h-[32px] sm:min-h-[36px] px-0 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[#8E9499] hover:text-[#F2F1ED] hover:bg-white/5 border border-white/8 hover:border-white/15 tactile-btn flex items-center justify-center gap-1.5 text-xs sm:text-sm"
        >
          <User size={14} className="text-[#B8FF00]" />
          <span className="hidden md:inline font-medium truncate max-w-[100px]">
            {user.role?.includes('Admin') ? 'Jim (Admin)' : (user.name || 'Conta')}
          </span>
        </button>

        {/* Sair / Logout (Desktop only, mobile accesses via Profile) */}
        <button
          onClick={logout}
          title="Sair da conta"
          className="min-h-[36px] px-2.5 py-1.5 rounded-lg text-[#8E9499] hover:text-red-400 hover:bg-white/5 border border-white/8 hover:border-red-500/20 tactile-btn hidden sm:flex items-center gap-1 text-xs"
        >
          <LogOut size={14} />
          <span className="hidden md:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}
