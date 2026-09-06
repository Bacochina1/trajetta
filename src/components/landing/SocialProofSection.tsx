'use client';

import React from 'react';
import { Quote } from 'lucide-react';

export function SocialProofSection() {
  const testimonials = [
    {
      quote: 'Foi a primeira vez que consegui olhar para um mês inteiro e realmente perceber o que tinha avançado, em vez de focar apenas no que faltava fazer.',
      author: 'Eduardo M.',
      role: 'Desenvolvedor & Criador',
      highlight: 'Percepção real de progresso',
    },
    {
      quote: 'O fim dos streaks punitivos mudou minha relação com hábitos. Faltar na quarta não destruiu minha semana; mantive o piso mínimo e fechei o mês com 22 treinos.',
      author: 'Camila S.',
      role: 'Médica & Pesquisadora',
      highlight: 'Fim da culpa e consistência',
    },
    {
      quote: 'A capacidade semanal me impediu de colocar 10 prioridades num período de fechamento no trabalho. Escolhi 3 e entreguei as 3 com serenidade.',
      author: 'Lucas R.',
      role: 'Líder de Produto',
      highlight: 'Planejamento realista',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#060709] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8FF00]">
            Comunidade Fundadora
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F1ED] tracking-tight">
            Construído junto com os primeiros usuários.
          </h2>
          <p className="text-sm sm:text-base text-[#8E9499] leading-relaxed">
            Depoimentos reais de quem trocou o ciclo de recomeços infinitos por uma trajetória visível.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 sm:p-7 rounded-2xl bg-[#0D0F10] border border-white/8 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <span className="text-[11px] font-mono font-bold text-[#B8FF00] px-2 py-0.5 rounded bg-[#B8FF00]/10 border border-[#B8FF00]/20 inline-block">
                  {t.highlight}
                </span>
                <p className="text-xs sm:text-sm text-[#C9CDD1] leading-relaxed italic">
                  “{t.quote}”
                </p>
              </div>

              <div className="pt-3 border-t border-white/8">
                <div className="text-xs font-bold text-[#F2F1ED]">{t.author}</div>
                <div className="text-[11px] text-[#8E9499]">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
