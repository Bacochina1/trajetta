'use client';

import React from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { ActiveView } from '@/types';
import { Calendar, CalendarDays, Crosshair, Repeat, Compass, History } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const { activeView, setActiveView } = useTrajetta();

  const items: { id: ActiveView; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    { id: 'hoje', label: 'Hoje', icon: Calendar },
    { id: 'semana', label: 'Semana', icon: CalendarDays },
    { id: 'metas', label: 'Metas', icon: Crosshair },
    { id: 'habitos', label: 'Hábitos', icon: Repeat },
    { id: 'jornadas', label: 'Jornadas', icon: Compass },
    { id: 'timeline', label: 'Timeline', icon: History },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#111315]/95 backdrop-blur-lg border-t border-white/8 px-2 py-1.5 flex items-center justify-around">
      {items.map(item => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn(
              'flex flex-col items-center gap-1 py-1 px-2 rounded-lg text-[10px] font-medium transition-colors duration-150 tactile-btn',
              isActive ? 'text-[#B8FF00] font-bold' : 'text-[#8E9499] hover:text-[#F2F1ED]'
            )}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
