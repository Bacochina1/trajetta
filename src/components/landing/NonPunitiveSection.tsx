'use client';

import React from 'react';
import { Heart, RefreshCw, Award } from 'lucide-react';
import { useI18n } from '@/lib/i18n/context';

export function NonPunitiveSection() {
  const { locale } = useI18n();
  const isEn = locale === 'en';

  return (
    <section className="py-20 sm:py-28 bg-[#060709] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8FF00]">
            {isEn ? 'Real-Life Philosophy' : 'Filosofia de Vida Real'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F1ED] tracking-tight">
            {isEn ? 'You never have to reset to zero.' : 'Você não precisa voltar para o zero.'}
          </h2>
          <p className="text-sm sm:text-base text-[#8E9499] leading-relaxed">
            {isEn
              ? 'Conventional habit apps treat a tough day as a moral failure and wipe out your hard-earned chain. At Trajetta, your accumulated progress stays permanently intact.'
              : 'Aplicativos convencionais tratam um dia ruim como falha moral e apagam seus dias seguidos. Na Trajetta, sua história continua existindo.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0D0F10] border border-white/8 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#B8FF00]/10 border border-[#B8FF00]/20 flex items-center justify-center text-[#B8FF00]">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F2F1ED]">
              {isEn ? 'Zero Punitive Streaks' : 'Sem Streaks Punitivos'}
            </h3>
            <p className="text-xs sm:text-sm text-[#8E9499] leading-relaxed">
              {isEn
                ? 'The fragile "burning flame" model only generates anxiety. Skipping a day never invalidates the 30 times you showed up consistently.'
                : 'O modelo de “fogo queimando” só cria ansiedade. Falhar um dia não anula as 30 vezes que você fez certo.'}
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-[#0D0F10] border border-white/8 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F2F1ED]">
              {isEn ? 'Cumulative Volume' : 'Volume Acumulado'}
            </h3>
            <p className="text-xs sm:text-sm text-[#8E9499] leading-relaxed">
              {isEn
                ? '42 workouts completed this year remain 42 workouts. What sculpts your new identity is cumulative critical mass compounded over time.'
                : '42 treinos no ano são 42 treinos. O que constrói sua nova versão é a massa crítica acumulada no longo prazo.'}
            </p>
          </div>

          <div className="p-6 sm:p-7 rounded-2xl bg-[#0D0F10] border border-white/8 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <RefreshCw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F2F1ED]">
              {isEn ? 'Instant Restart Mode' : 'Modo Retomada Instantâneo'}
            </h3>
            <p className="text-xs sm:text-sm text-[#8E9499] leading-relaxed">
              {isEn
                ? 'Away for two weeks due to travel or illness? Zero shame notifications. Pick right back up from where you left with 1 click.'
                : 'Ficou duas semanas longe por viagem ou doença? O app não acumula notificações culpadas. Você retoma de onde parou com 1 clique.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
