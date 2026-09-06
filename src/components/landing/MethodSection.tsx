'use client';

import React from 'react';
import { Compass, Calendar, CheckSquare, Sparkles, RefreshCw, History } from 'lucide-react';

export function MethodSection() {
  const steps = [
    {
      num: '01',
      title: 'Direção',
      concept: 'Decidir o que realmente importa.',
      detail: 'Antes de abrir qualquer lista, você define com clareza seus objetivos nas áreas essenciais: Corpo, Dinheiro, Carreira e Vida. Menos metas, mais intenção.',
      icon: Compass,
    },
    {
      num: '02',
      title: 'Semana',
      concept: 'Transformar objetivos em prioridades possíveis.',
      detail: 'Uma semana é o horizonte perfeito da vida real. O capacity planning impede você de se comprometer com 20 horas quando só tem 4 disponíveis.',
      icon: Calendar,
    },
    {
      num: '03',
      title: 'Ação',
      concept: 'Saber o que precisa acontecer hoje.',
      detail: 'A visão do dia foca no que está sob seu controle. Hábitos com piso mínimo garantem que um dia difícil ainda preserve sua consistência.',
      icon: CheckSquare,
    },
    {
      num: '04',
      title: 'Reflexão',
      concept: 'Entender o que a semana te ensinou.',
      detail: 'O Weekly Review registra vitórias, dificuldades e padrões em 5 minutos. Uma semana sem reflexão é apenas tempo passando no automático.',
      icon: Sparkles,
    },
    {
      num: '05',
      title: 'Ajuste',
      concept: 'Adaptar o plano à vida real.',
      detail: 'Imprevistos acontecem. Em vez de desistir ou carregar culpa, você adapta a rota com o Modo Retomada e segue em frente sem voltar ao zero.',
      icon: RefreshCw,
    },
    {
      num: '06',
      title: 'Evolução',
      concept: 'Construir um histórico visível ao longo do tempo.',
      detail: 'Sua Timeline guarda momentos, metas concluídas e memórias. Você olha para trás e tem a evidência incontestável de quem está se tornando.',
      icon: History,
    },
  ];

  return (
    <section id="metodo" className="py-20 sm:py-28 bg-[#060709] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8FF00]/10 border border-[#B8FF00]/25 text-xs font-bold text-[#B8FF00]">
            Metodologia Proprietária
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F1ED] tracking-tight">
            O Método Trajetta
          </h2>
          <p className="text-sm sm:text-base text-[#8E9499] leading-relaxed">
            Uma esteira de evolução contínua desenhada para que sua vida não dependa de motivação diária ou agendas imaginárias.
          </p>
        </div>

        {/* Visual Workflow: Direção -> Semana -> Ação -> Reflexão -> Ajuste -> Evolução */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="p-6 sm:p-7 rounded-2xl bg-[#0D0F10] border border-white/8 hover:border-[#B8FF00]/30 transition-all group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-extrabold text-[#B8FF00] tracking-wider px-2 py-0.5 rounded bg-[#B8FF00]/10 border border-[#B8FF00]/20">
                    FASE {step.num}
                  </span>
                  <div className="w-8 h-8 rounded-lg bg-[#171B20] text-[#8E9499] group-hover:text-[#B8FF00] flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-[#F2F1ED] mb-1">
                  {step.title}
                </h3>
                <h4 className="text-xs sm:text-sm font-semibold text-[#B8FF00] mb-3">
                  {step.concept}
                </h4>
                <p className="text-xs sm:text-sm text-[#8E9499] leading-relaxed">
                  {step.detail}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
