'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children?: React.ReactNode;
  className?: string;
  static?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', static: isStatic, className, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium select-none cursor-pointer focus-visible:outline-2 focus-visible:outline-[#B8FF00] focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    // Better-UI: tactile scale on press (0.96) unless static prop is set
    const motionStyles = isStatic
      ? 'transition-colors duration-150'
      : 'transition-[transform,background-color,border-color,color] duration-150 active:scale-[0.96]';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-[#B8FF00] text-[#0D0F10] font-bold hover:bg-[#C6FF19] shadow-[0_0_20px_rgba(184,255,0,0.18)]',
      secondary: 'bg-[#1F2328] text-[#F2F1ED] border border-white/10 hover:bg-[#282D34] hover:border-white/20',
      ghost: 'bg-transparent text-[#8E9499] hover:text-[#F2F1ED] hover:bg-white/5',
      outline: 'bg-transparent border border-white/15 text-[#F2F1ED] hover:bg-white/5 hover:border-white/30',
      danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20',
    };

    const sizes: Record<ButtonSize, string> = {
      sm: 'text-sm px-4 py-2 rounded-lg gap-2 min-h-[36px]',
      md: 'text-sm px-5 py-2.5 rounded-lg gap-2 min-h-[40px]',
      lg: 'text-base px-6 py-3 rounded-xl gap-2.5 font-semibold min-h-[48px]',
      icon: 'min-w-[44px] min-h-[44px] p-2.5 rounded-lg flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, motionStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
