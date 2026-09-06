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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0F10]/80 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      {/* Modal Container: Concentric Radius (20px outer) */}
      <div
        className={cn(
          'relative w-full bg-[#171A1D] border border-white/10 rounded-[20px] shadow-[0_25px_60px_rgba(0,0,0,0.6)] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150',
          maxWidth
        )}
      >
        <div className="flex items-start justify-between p-6 border-b border-white/8">
          <div>
            <h3 className="text-xl font-bold tracking-tight text-[#F2F1ED]">{title}</h3>
            {subtitle && <p className="text-sm text-[#8E9499] mt-1">{subtitle}</p>}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Fechar"
            className="text-[#8E9499] hover:text-[#F2F1ED]"
          >
            <X size={18} />
          </Button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
