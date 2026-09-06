'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { trackMarketingEvent } from '@/lib/analytics';

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'A Trajetta é um aplicativo de hábitos?',
      a: 'Hábitos fazem parte da Trajetta, mas o produto conecta hábitos, metas nas 4 áreas essenciais, planejamento semanal, revisões de domingo e histórico de evolução. Ela funciona como um sistema completo de trajetória, e não apenas uma lista isolada.',
    },
    {
      q: 'Preciso organizar toda a minha vida antes de começar?',
      a: 'Não. Pelo contrário: a Trajetta ajuda você a começar pequeno, escolhendo apenas uma ou duas prioridades possíveis para os próximos dias. O onboarding dura menos de 3 minutos.',
    },
    {
      q: 'O que acontece se eu parar de usar durante alguns dias?',
      a: 'Seu histórico não desaparece nem zera. Nós não usamos streaks punitivos. Você pode retomar de onde parou usando o Modo Retomada com um clique, sem carregar listas acumuladas ou culpa.',
    },
    {
      q: 'A Trajetta AI toma decisões por mim?',
      a: 'Não. A IA não substitui seu julgamento nem altera seus dados sem sua autorização. Ela apenas observa seu histórico e sugere ajustes quando percebe que a sua rotina ficou pesada demais.',
    },
    {
      q: 'Posso apagar ou exportar minhas informações?',
      a: 'Sim, a qualquer momento. Você pode visualizar todas as memórias salvas, editar dados, exportar um arquivo completo em JSON/CSV ou solicitar a exclusão definitiva da sua conta.',
    },
    {
      q: 'Vai existir aplicativo para celular?',
      a: 'A Trajetta já funciona como um Web App (PWA) de alta performance, 100% otimizado para celulares. Você pode adicioná-la à tela de início do seu iPhone ou Android hoje mesmo. Aplicativos nativos dedicados na App Store e Google Play estão no roadmap oficial.',
    },
    {
      q: 'Como funcionam os 14 dias grátis?',
      a: 'Você cria sua conta em segundos e tem acesso a todas as funcionalidades do plano Pro durante 14 dias inteiros. Não há cobrança antes do término do período de teste, e você pode cancelar quando quiser.',
    },
  ];

  const toggleFaq = (idx: number) => {
    const next = openIdx === idx ? null : idx;
    setOpenIdx(next);
    if (next !== null) {
      trackMarketingEvent('faq_opened', { question_index: idx, question: faqs[idx].q });
    }
  };

  return (
    <section id="faq" className="py-20 sm:py-28 bg-[#080A0C] border-y border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8FF00]">
            Respostas Diretas
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F1ED] tracking-tight">
            Perguntas Frequentes
          </h2>
          <p className="text-sm sm:text-base text-[#8E9499]">
            Tudo o que você precisa saber para começar sua primeira semana com clareza.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3.5">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0D0F10] border border-white/8 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#B8FF00]"
                >
                  <span className="text-sm sm:text-base font-bold text-[#F2F1ED] leading-snug">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#8E9499] flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#B8FF00]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-[#8E9499] leading-relaxed border-t border-white/6 pt-4 animate-in fade-in duration-200">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
