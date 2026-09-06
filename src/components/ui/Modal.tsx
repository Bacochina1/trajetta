'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0F10]/80 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Container: Concentric Radius (20px outer) */}
      <div
        className={cn(
          'relative w-full max-h-[92dvh] flex flex-col bg-[#171A1D] border border-white/10 rounded-[20px] shadow-depth-2 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150',
          maxWidth
        )}
      >
        <div className="flex items-start justify-between p-4 sm:p-6 border-b border-white/8 flex-shrink-0">
          <div className="pr-2 min-w-0">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#F2F1ED] truncate">{title}</h3>
            {subtitle && <p className="text-xs sm:text-sm text-[#8E9499] mt-0.5 sm:mt-1 leading-relaxed">{subtitle}</p>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar"
            className="text-[#8E9499] hover:text-[#F2F1ED] flex-shrink-0"
          >
            <X size={18} />
          </Button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}
