'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

export function AudienceSection() {
  const isFor = [
    'Para quem tem objetivos em mais de uma área e se sente dividido.',
    'Para quem já tentou planners de papel, Notion ou habit trackers e desistiu.',
    'Para quem vive recomeçando do zero e quer consistência sustentável.',
    'Para quem busca um método simples de auto-observação semanal.',
    'Para quem quer ver o progresso real acumulado ao longo dos meses.',
  ];

  const isNotFor = [
    'Não é para quem busca um simples bloco de notas ou lista rápida de compras.',
    'Não é para quem quer um chatbot genérico que promete trabalhar no seu lugar.',
    'Não é para quem acredita em hacks mágicos ou produtividade tóxica de 18 horas por dia.',
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#080A0C] border-y border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8FF00]">
            Alinhamento de Expectativa
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F1ED] tracking-tight">
            Para quem a Trajetta foi desenhada?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Card: É para você se */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0D0F10] border border-[#B8FF00]/30 space-y-5">
            <h3 className="text-lg font-bold text-[#F2F1ED] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B8FF00]" />
              A Trajetta é ideal para você se:
            </h3>
            <ul className="space-y-3.5">
              {isFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#C9CDD1]">
                  <Check className="w-4 h-4 text-[#B8FF00] flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card: Não é para você se */}
          <div className="p-6 sm:p-8 rounded-2xl bg-[#0D0F10] border border-white/8 space-y-5">
            <h3 className="text-lg font-bold text-[#F2F1ED] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              Não recomendamos a Trajetta se:
            </h3>
            <ul className="space-y-3.5">
              {isNotFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#8E9499]">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
