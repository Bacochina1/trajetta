'use client';

import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { trackMarketingEvent } from '@/lib/analytics';

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Quando vou receber meu convite de acesso?',
      a: 'Liberamos novos acessos em pequenos lotes graduais. Ao se cadastrar na Lista VIP, sua posição fica registrada e você receberá um e-mail com seu link exclusivo assim que a próxima turma abrir.',
    },
    {
      q: 'A Trajetta é mais um aplicativo de hábitos ou listas?',
      a: 'Não. A maioria dos apps foca em micro-tarefas e streaks punitivos. A Trajetta conecta visão de 12 meses, planejamento semanal em 3 prioridades, pisos mínimos para dias difíceis e revisões de domingo com IA contextual.',
    },
    {
      q: 'O que significa "sistema sem punição"?',
      a: 'Significa que se você passar 4 dias sem abrir o app, seu histórico não zera e você não recebe alertas vermelhos de culpa. O sistema recalibra o plano da semana sem drama, porque consistência real se constrói na vida como ela é.',
    },
    {
      q: 'Quem entrar na Lista VIP terá condições especiais?',
      a: 'Sim. Os membros cadastrados na lista de espera terão prioridade na fila e acesso à condição vitalícia de Membro Fundador, com valor de assinatura protegido contra reajustes futuros.',
    },
    {
      q: 'Como funciona a Trajetta AI?',
      a: 'A Trajetta AI utiliza tecnologia Google Gemini Flash combinada com um motor de memória que aprende o seu histórico. Ela não cospe clichês motivacionais; ela lê seus ciclos e sugere ajustes objetivos no ritmo da sua rotina.',
    },
    {
      q: 'Meus dados e reflexões pessoais são privados?',
      a: 'Sim, com soberania absoluta. Suas reflexões não são vendidas para anunciantes nem compartilhadas com terceiros. Você pode exportar todos os seus dados ou solicitar exclusão a qualquer momento.',
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
    <section id="faq" className="max-w-[1440px] mx-auto px-4 xs:px-6 sm:px-10 lg:px-14 py-14 sm:py-28 border-t border-white/10" data-purpose="faq-section">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3 tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
        <span>Perguntas Frequentes</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Left Col: Heading & CTA */}
        <div className="lg:col-span-5">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-3 sm:mb-4 [text-wrap:balance]">
            Tudo o que você <span className="text-neutral-500">precisa saber</span>
          </h2>
          <p className="text-xs xs:text-sm text-neutral-400 font-light leading-relaxed mb-6 sm:mb-8">
            Dúvidas claras e diretas sobre o funcionamento da lista VIP, a metodologia sem punição e a segurança dos seus dados.
          </p>

          <a
            href="#waitlist"
            className="w-full xs:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-neutral-100 text-black text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-full transition-all active:scale-95 shadow-lg shadow-white/5 text-center"
          >
            <span>ENTRAR NA LISTA VIP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Right Col: Accordion */}
        <div className="lg:col-span-7 space-y-2.5 sm:space-y-3">
          {faqs.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="border border-white/10 rounded-xl sm:rounded-2xl bg-[#0a0d12] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-4 xs:px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 sm:gap-4 focus:outline-none"
                >
                  <span className="text-xs xs:text-sm sm:text-base font-normal text-white">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-neutral-400 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-white' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-4 xs:px-5 sm:px-6 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-neutral-400 font-light leading-relaxed border-t border-white/5">
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
