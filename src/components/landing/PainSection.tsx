'use client';

import React from 'react';
import { RotateCcw, BatteryLow, CalendarX, Target, ZapOff } from 'lucide-react';

export function PainSection() {
  const pains = [
    {
      icon: Target,
      headline: 'Você começa o ano com metas e meses depois nem lembra onde anotou.',
      description: 'Objetivos grandiosos em janeiro viram anotações esquecidas no bloco de notas em março porque não existia uma ponte real entre a intenção e a semana seguinte.',
    },
    {
      icon: BatteryLow,
      headline: 'Você monta uma rotina perfeita e abandona depois de três dias.',
      description: 'Tentar virar outra pessoa da noite para o dia cria um choque de realidade. Quando a vida real aperta, o planejamento engessado é a primeira coisa a cair.',
    },
    {
      icon: CalendarX,
      headline: 'Você termina semanas exausto, mas sem saber dizer o que realmente avançou.',
      description: 'Passou cinco dias apagando incêndios, respondendo mensagens e cumprindo listas de tarefas aleatórias, com a sensação angustiante de estar girando em círculos.',
    },
    {
      icon: ZapOff,
      headline: 'Você tenta melhorar saúde, dinheiro, carreira e vida ao mesmo tempo.',
      description: 'Sem capacity planning, você sobrecarrega sua atenção tentando maximizar todas as áreas simultaneamente e acaba não sustentando nenhuma com calma.',
    },
    {
      icon: RotateCcw,
      headline: 'Você está sempre recomeçando do zero.',
      description: 'Aplicativos tradicionais punem você por falhar um único dia zerando seus streaks. Você desanima, larga o app e espera a próxima segunda-feira para recomeçar.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-[#080A0C] border-y border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-20">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8FF00]">
            O Problema Real
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F1ED] tracking-tight leading-tight">
            O problema nunca foi sua força de vontade.
          </h2>
          <p className="text-sm sm:text-base text-[#8E9499] leading-relaxed">
            É tentar viver uma vida real com ferramentas que te forçam a viver no automático e a desistir no primeiro imprevisto.
          </p>
        </div>

        {/* Pain Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {pains.map((item, idx) => {
            const Icon = item.icon;
            const isFullWidth = idx === 4;
            return (
              <div
                key={idx}
                className={`p-6 sm:p-7 rounded-2xl bg-[#0D0F10] border border-white/8 hover:border-white/15 transition-all duration-200 flex flex-col justify-between space-y-4 ${
                  isFullWidth ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#F2F1ED] leading-snug">
                    “{item.headline}”
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-[#8E9499] leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
