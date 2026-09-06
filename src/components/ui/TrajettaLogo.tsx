import React from 'react';

interface TrajettaLogoProps {
  className?: string;
  size?: number;
  showWordmark?: boolean;
  wordmarkClassName?: string;
}

export function TrajettaLogo({
  className = '',
  size = 28,
  showWordmark = false,
  wordmarkClassName = 'text-[#F2F1ED] font-extrabold text-lg tracking-tight',
}: TrajettaLogoProps) {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Icon mark without black background */}
      <div
        className="relative flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
        style={{ width: size, height: size }}
      >
        <img
          src="/trajetta-logo-transparent.png"
          alt="Trajetta Logo"
          className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(184,255,0,0.35)]"
        />
      </div>

      {showWordmark && (
        <div className="flex items-center">
          <span className={wordmarkClassName}>trajetta</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] ml-1 shadow-[0_0_8px_#B8FF00]" />
        </div>
      )}
    </div>
  );
}
