'use client';

import React from 'react';
import { cn } from '@/lib/utils';

export function ProgressBar({
  value,
  max = 100,
  color = '#B8FF00',
  height = 'h-2',
  glow = true,
  label,
  className,
}: {
  value: number;
  max?: number;
  color?: string;
  height?: string;
  glow?: boolean;
  className?: string;
  label?: string;
}) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || 'Progresso'}
      className={cn('w-full bg-[#1F2328] rounded-full overflow-hidden p-0.5', className)}
    >
      <div
        className={cn(
          'rounded-full transition-[width] duration-300 ease-out',
          height,
          glow && 'shadow-[0_0_10px_rgba(184,255,0,0.3)]'
        )}
        style={{
          width: `${percentage}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}
