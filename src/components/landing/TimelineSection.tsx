'use client';

import React from 'react';
import { History, Milestone, Award, Flame, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { appendUtmToUrl, trackMarketingEvent } from '@/lib/analytics';

export function TimelineSection() {
  const milestones = [
    {
      date: 'Novembro 2026',
      area: 'Carreira',
      badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      title: 'Transição Profissional Concluída',
      desc: 'Primeira proposta formal aceita no novo cargo após 14 semanas consecutivas de estudos estruturados e entregas comprovadas.',
    },
    {
      date: 'Agosto 2026',
      area: 'Corpo',
      badgeColor: 'bg-[#B8FF00]/10 text-[#B8FF00] border-[#B8FF00]/20',
      title: '6 Meses Sem Interrupção de Treinos',
      desc: 'Mais de 75 treinos realizados. Em 12 deles o piso mínimo salvou a constância. Peso e exames laboratoriais normalizados.',
    },
    {
      date: 'Junho 2026',
      area: 'Dinheiro',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      title: 'Reserva de Emergência Completa',
      desc: 'Atingida a meta de 6 meses de custo fixo guardados após renegociação de gastos e aportes consistentes todo dia 5.',
    },
    {
      date: 'Março 2026',
      area: 'Vida',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      title: 'Viagem em Família com Presença Real',
      desc: 'Sem notificações de trabalho no fim de semana. Semana planejada com antecedência para desfrutar o tempo com quem importa.',
    },
  ];

  return (
    <section id="timeline" className="py-20 sm:py-28 bg-[#060709] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8FF00]/10 border border-[#B8FF00]/25 text-xs font-bold text-[#B8FF00]">
            <History className="w-3.5 h-3.5" />
            <span>Memória de Longo Prazo</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F1ED] tracking-tight leading-tight">
            Outro aplicativo mostra sua lista de hoje.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B8FF00] via-[#D4FF5E] to-white">
              A Trajetta mostra o caminho que trouxe você até aqui.
            </span>
          </h2>
          <p className="text-sm sm:text-base text-[#8E9499] leading-relaxed">
            Metas concluídas, momentos marcantes e lições não são jogados fora. Sua evolução se transforma em um patrimônio visível.
          </p>
        </div>

        {/* Visual Timeline Stream */}
        <div className="max-w-3xl mx-auto relative border-l-2 border-white/10 pl-6 sm:pl-8 space-y-8">
          {milestones.map((item, idx) => (
            <div key={idx} className="relative group">
              {/* Dot on line */}
              <span className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-[#060709] border-2 border-[#B8FF00] group-hover:scale-125 transition-transform" />

              <div className="p-5 sm:p-6 rounded-2xl bg-[#0D0F10] border border-white/8 hover:border-white/20 transition-all space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.area}
                  </span>
                  <span className="text-xs text-[#8E9499] font-mono">{item.date}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#F2F1ED] pt-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#8E9499] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Callout */}
        <div className="text-center mt-12">
          <Link
            href={appendUtmToUrl('/register')}
            onClick={() => trackMarketingEvent('hero_cta_clicked', { location: 'timeline_section' })}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#B8FF00] hover:underline"
          >
            <span>Comece a registrar sua linha do tempo com 14 dias grátis</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
