'use client';

import React from 'react';
import { Target, CalendarCheck, CheckCircle2 } from 'lucide-react';

export function HowItWorksSection() {
  const steps = [
    {
      step: '1',
      title: 'Defina onde quer chegar',
      desc: 'Cadastre suas prioridades nas 4 áreas da vida. A Trajetta ajuda você a separar o essencial do que é apenas ruído.',
      icon: Target,
    },
    {
      step: '2',
      title: 'Transforme em uma semana possível',
      desc: 'Cada domingo ou segunda-feira, escolha suas 3 a 5 prioridades semanais. O capacity planning evita sobrecarga.',
      icon: CalendarCheck,
    },
    {
      step: '3',
      title: 'Acompanhe e ajuste o próximo passo',
      desc: 'Registre o que aconteceu com poucos toques no dia a dia. A Trajetta AI aprende seus padrões e você nunca volta ao zero.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#060709] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8FF00]">
            Simples de Começar
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F1ED] tracking-tight">
            Como a Trajetta funciona na prática
          </h2>
          <p className="text-sm sm:text-base text-[#8E9499] leading-relaxed">
            Sem sistemas complexos de produtividade que demoram horas para configurar. Você começa em 3 minutos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-[#0D0F10] border border-white/8 relative flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-[#B8FF00]/10 border border-[#B8FF00]/30 text-[#B8FF00] font-mono font-extrabold text-sm flex items-center justify-center">
                      {item.step}
                    </span>
                    <Icon className="w-5 h-5 text-[#8E9499]" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#F2F1ED]">
                    {item.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#8E9499] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
