'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CheckCircle({
  checked,
  onClick,
  color = '#B8FF00',
  className,
  'aria-label': ariaLabel,
}: {
  checked: boolean;
  onClick: () => void;
  color?: string;
  className?: string;
  'aria-label'?: string;
}) {
  return (
    <button
      type="button"
      onClick={e => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={ariaLabel || (checked ? 'Concluído' : 'Marcar como concluído')}
      className={cn(
        'w-5 h-5 rounded-full flex items-center justify-center transition-[transform,background-color,border-color] duration-150 active:scale-[0.92] cursor-pointer flex-shrink-0',
        checked ? 'border-transparent' : 'border border-white/25 hover:border-white/50 bg-white/5',
        className
      )}
      style={{
        backgroundColor: checked ? color : undefined,
      }}
    >
      {checked && (
        <Check size={13} strokeWidth={2.5} className="text-[#0D0F10]" />
      )}
    </button>
  );
}
