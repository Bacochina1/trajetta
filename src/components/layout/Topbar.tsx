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
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Account / Login Trigger */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          title="Conta & Autenticação"
          className="min-h-[36px] px-3 py-1.5 rounded-lg text-[#8E9499] hover:text-[#F2F1ED] hover:bg-white/5 border border-white/8 hover:border-white/15 tactile-btn flex items-center gap-1.5 text-xs sm:text-sm"
        >
          <User size={14} className="text-[#B8FF00]" />
          <span className="hidden sm:inline font-medium">
            {user.role?.includes('Admin') ? 'Jim (Admin)' : user.name}
          </span>
        </button>

        {/* Sair / Logout */}
        <button
          onClick={logout}
          title="Sair da conta"
          className="min-h-[36px] px-2.5 py-1.5 rounded-lg text-[#8E9499] hover:text-red-400 hover:bg-white/5 border border-white/8 hover:border-red-500/20 tactile-btn flex items-center gap-1 text-xs"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Sair</span>
        </button>

        {/* Reset Demo Data button (Discreet) */}
        <button
          onClick={resetToDemoData}
          title="Restaurar dados iniciais de demonstração"
          className="min-h-[36px] px-3 py-1.5 rounded-lg text-[#8E9499] hover:text-[#F2F1ED] hover:bg-white/5 tactile-btn hidden lg:flex items-center gap-1.5 text-xs sm:text-sm"
        >
          <RotateCcw size={14} />
          <span>Restaurar Demo</span>
        </button>

        {/* Nova Meta */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsNewGoalModalOpen(true)}
        >
          <Plus size={14} />
          <span className="hidden sm:inline">Nova Meta</span>
        </Button>

        {/* Weekly Review CTA Button */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsReviewModalOpen(true)}
        >
          <CheckCircle2 size={14} strokeWidth={2.2} />
          <span>Fechar Semana</span>
        </Button>
      </div>
    </header>
  );
}
