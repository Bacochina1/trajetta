'use client';

import React from 'react';

export function SubHeaderSection() {
  return (
    <section className="relative z-20 max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 pt-20 pb-12" data-purpose="sub-section-header" id="metodo">
      {/* Tag Pill */}
      <div className="inline-flex items-center space-x-2 text-xs font-mono tracking-wide text-neutral-400 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
        <span>Sistema Pessoal de Evolução</span>
      </div>

      {/* Huge Lead Typography */}
      <h2 className="text-3xl sm:text-5xl lg:text-[58px] font-normal tracking-tight leading-[1.1]">
        <span className="text-white">Viva com direção clara,</span>
        <span className="text-[#555d68]"> sem a ansiedade</span>
        <br />
        <span className="text-[#555d68]">dos rastreadores comuns.</span>
      </h2>
    </section>
  );
}
