'use client';

import React from 'react';

export function SubHeaderSection() {
  return (
    <section className="relative z-20 max-w-[1440px] mx-auto px-4 xs:px-6 sm:px-10 lg:px-14 pt-14 sm:pt-20 pb-8 sm:pb-12" data-purpose="sub-section-header" id="metodo">
      {/* Tag Pill */}
      <div className="inline-flex items-center space-x-2 text-[11px] sm:text-xs font-mono tracking-wide text-neutral-400 mb-4 sm:mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
        <span>Sistema Pessoal de Evolução</span>
      </div>

      {/* Huge Lead Typography */}
      <h2 className="text-[22px] xs:text-[28px] sm:text-4xl md:text-5xl lg:text-[58px] font-normal tracking-tight leading-[1.18] sm:leading-[1.1] break-words [text-wrap:balance]">
        <span className="text-white">Viva com direção clara,</span>
        <span className="text-[#555d68]"> sem a ansiedade</span>{' '}
        <br className="hidden md:inline" />
        <span className="text-[#555d68]">dos rastreadores comuns.</span>
      </h2>
    </section>
  );
}
