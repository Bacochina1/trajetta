'use client';

import React from 'react';
import { Activity, Landmark, Briefcase, HeartHandshake } from 'lucide-react';

export function LifeAreasSection() {
  const areas = [
    {
      name: 'Corpo',
      tag: 'Saúde, Energia & Sono',
      color: 'text-[#B8FF00] bg-[#B8FF00]/10 border-[#B8FF00]/25',
      desc: 'Movimento sustentável, qualidade de descanso, recuperação e disposição física para enfrentar a semana.',
      icon: Activity,
    },
    {
      name: 'Dinheiro',
      tag: 'Segurança & Liberdade',
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/25',
      desc: 'Reserva de emergência, controle de gastos essenciais, disciplina em aportes e clareza sobre o futuro.',
      icon: Landmark,
    },
    {
      name: 'Carreira',
      tag: 'Profissão & Habilidades',
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/25',
      desc: 'Projetos estratégicos, transições profissionais, aprendizado contínuo e entregas que movem o ponteiro.',
      icon: Briefcase,
    },
    {
      name: 'Vida',
      tag: 'Presença & Relações',
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
      desc: 'Família, relacionamentos afetivos, desconexão digital intencional, lazer e a vida que acontece fora da tela.',
      icon: HeartHandshake,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#080A0C] border-b border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8FF00]">
            Visão Integrada
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F1ED] tracking-tight">
            Sua vida não acontece em uma única categoria.
          </h2>
          <p className="text-sm sm:text-base text-[#8E9499] leading-relaxed">
            O objetivo não é tentar maximizar tudo ao mesmo tempo, mas entender onde colocar sua atenção em cada fase.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {areas.map((area, idx) => {
            const Icon = area.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#0D0F10] border border-white/8 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${area.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#F2F1ED]">{area.name}</h3>
                    <div className="text-[11px] font-mono text-[#8E9499]">{area.tag}</div>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-[#8E9499] leading-relaxed">
                  {area.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
