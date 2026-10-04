'use client';

import React, { useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { trackMarketingEvent } from '@/lib/analytics';
import { useI18n } from '@/lib/i18n/context';

export function FaqSection() {
  const { locale } = useI18n();
  const isEn = locale === 'en';
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqsPt = [
    {
      q: 'Como funciona a ativação e liberação do Trajetta Pro?',
      a: 'A liberação é instantânea e você começa com 3 dias de degustação gratuita (R$ 0,00 cobrado hoje). Você recebe suas credenciais no e-mail na mesma hora e tem acesso imediato a todas as 4 áreas da vida, metas, hábitos com piso mínimo e Trajetta AI sem limites. Além do teste grátis, você conta com garantia incondicional de 7 dias com reembolso total se não amar.',
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
      q: 'Posso cancelar a qualquer momento?',
      a: 'Sim. Sem letras miúdas ou burocracia. O cancelamento pode ser feito em 1 clique diretamente pelo painel do seu perfil ou pela Stripe. Além disso, você conta com a garantia legal de 7 dias com reembolso integral.',
    },
    {
      q: 'Como funciona a Trajetta AI?',
      a: 'A Trajetta AI utiliza tecnologia de ponta combinada com um motor de memória que aprende o seu histórico. Ela não cospe clichês motivacionais; ela lê seus ciclos e sugere ajustes objetivos no ritmo da sua rotina.',
    },
    {
      q: 'Meus dados e reflexões pessoais são privados?',
      a: 'Sim, com soberania absoluta. Suas reflexões não são vendidas para anunciantes nem compartilhadas com terceiros. Você pode exportar todos os seus dados ou solicitar exclusão a qualquer momento.',
    },
  ];

  const faqsEn = [
    {
      q: 'How does Trajetta Pro activation work?',
      a: 'Activation is instant. As soon as your payment is confirmed securely via Stripe, your account is unlocked immediately with full access to all 4 life areas, habits with minimum floor, weekly planning, and unlimited Trajetta AI. You also have an unconditional 7-day money-back guarantee.',
    },
    {
      q: 'Is Trajetta just another habit tracker or todo app?',
      a: 'No. Most apps focus on micro-tasks and fragile punitive streaks that collapse on busy days. Trajetta bridges a 12-month North Star vision, 3-priority weekly capacity planning, minimum floors for difficult days, and Sunday debriefs with longitudinal AI.',
    },
    {
      q: 'What does "non-punitive system" mean?',
      a: 'It means if you spend 4 days without opening the app, your history does not reset to zero, and you receive no red shame notifications. The framework recalibrates your plan calmly, because true consistency compounds in real life.',
    },
    {
      q: 'Can I cancel anytime?',
      a: 'Yes. With zero bureaucracy. You can cancel with 1 click directly in your dashboard or via Stripe. Furthermore, you are backed by our 7-day unconditional money-back guarantee.',
    },
    {
      q: 'How does Trajetta AI work?',
      a: 'Trajetta AI combines frontier intelligence with a longitudinal memory engine that learns your unique execution patterns. It never spits generic self-help clichés; it analyzes your cycles and surfaces objective, lucid adjustments.',
    },
    {
      q: 'Are my personal reflections and data private?',
      a: 'Yes, with absolute sovereignty. Your reflections and data are encrypted, never sold to advertisers, and never used to train public language models. You can export everything in JSON/CSV or delete your account anytime.',
    },
  ];

  const faqs = isEn ? faqsEn : faqsPt;

  const toggleFaq = (idx: number) => {
    const next = openIdx === idx ? null : idx;
    setOpenIdx(next);
    if (next !== null) {
      trackMarketingEvent('faq_opened', { question_index: idx, question: faqs[idx].q, locale });
    }
  };

  return (
    <section id="faq" className="max-w-[1440px] mx-auto px-4 xs:px-6 sm:px-10 lg:px-14 py-14 sm:py-28 border-t border-white/10" data-purpose="faq-section">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3 tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]"></span>
        <span>{isEn ? 'Frequently Asked Questions' : 'Perguntas Frequentes'}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Left Col: Heading & CTA */}
        <div className="lg:col-span-5">
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-3 sm:mb-4 [text-wrap:balance]">
            {isEn ? 'Everything you ' : 'Tudo o que você '}
            <span className="text-neutral-500">{isEn ? 'need to know' : 'precisa saber'}</span>
          </h2>
          <p className="text-xs xs:text-sm text-neutral-400 font-light leading-relaxed mb-6 sm:mb-8">
            {isEn
              ? 'Clear and direct answers regarding Trajetta Pro, our non-punitive methodology, and rigorous data privacy.'
              : 'Dúvidas claras e diretas sobre o funcionamento do Trajetta Pro, a metodologia sem punição e a segurança dos seus dados.'}
          </p>

          <a
            href="#planos"
            className="w-full xs:w-auto inline-flex items-center justify-center space-x-2 bg-[#B8FF00] hover:bg-[#a6e600] text-[#060709] text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-full transition-all active:scale-95 shadow-lg shadow-[0_0_20px_rgba(184,255,0,0.25)] text-center"
          >
            <span>{isEn ? 'GET TRAJETTA PRO' : 'ASSINAR TRAJETTA PRO'}</span>
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
                  className="w-full text-left px-4 xs:px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3 sm:gap-4 focus:outline-none cursor-pointer"
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
