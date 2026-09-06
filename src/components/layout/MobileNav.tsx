'use client';

import React from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { ActiveView } from '@/types';
import { Calendar, CalendarDays, Crosshair, Repeat, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const { activeView, setActiveView } = useTrajetta();

  const items: { id: ActiveView; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
    { id: 'hoje', label: 'Hoje', icon: Calendar },
    { id: 'semana', label: 'Semana', icon: CalendarDays },
    { id: 'metas', label: 'Metas', icon: Crosshair },
    { id: 'habitos', label: 'Hábitos', icon: Repeat },
    { id: 'ia', label: 'IA Mentor', icon: Brain },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#111315]/95 backdrop-blur-xl border-t border-white/8 px-3 py-2 flex items-center justify-between safe-area-bottom">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn(
              'flex-1 min-h-[44px] flex flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium transition-all duration-150 tactile-btn relative',
              isActive
                ? 'text-[#B8FF00] font-bold'
                : 'text-[#8E9499] hover:text-[#F2F1ED]'
            )}
          >
            {isActive && (
              <span className="absolute top-0 w-6 h-0.5 rounded-full bg-[#B8FF00] shadow-[0_0_8px_rgba(184,255,0,0.6)]" />
            )}
            <Icon size={18} strokeWidth={isActive ? 2.3 : 1.8} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

