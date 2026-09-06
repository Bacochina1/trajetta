'use client';

import React from 'react';
import { LifeArea } from '@/types';
import { LIFE_AREAS } from '@/lib/constants';
import { Activity, Landmark, Briefcase, HeartHandshake } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AreaBadge({
  area,
  size = 'md',
  showIcon = true,
  className,
}: {
  area: LifeArea;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}) {
  const config = LIFE_AREAS[area];

  const icons: Record<LifeArea, React.ReactNode> = {
    corpo: <Activity size={size === 'sm' ? 12 : 14} strokeWidth={1.8} />,
    dinheiro: <Landmark size={size === 'sm' ? 12 : 14} strokeWidth={1.8} />,
    carreira: <Briefcase size={size === 'sm' ? 12 : 14} strokeWidth={1.8} />,
    vida: <HeartHandshake size={size === 'sm' ? 12 : 14} strokeWidth={1.8} />,
  };

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 gap-1.5 rounded-full',
    md: 'text-xs px-3 py-1 gap-2 rounded-full font-medium',
    lg: 'text-sm px-4 py-1.5 gap-2.5 rounded-full font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center select-none font-medium border',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: config.badgeBg,
        color: config.badgeText,
        borderColor: config.borderColor,
      }}
    >
      {showIcon && icons[area]}
      <span>{config.label}</span>
    </span>
  );
}
