'use client';

import React from 'react';
import { ShieldCheck, Download, Trash2, Eye } from 'lucide-react';

export function PrivacySection() {
  return (
    <section className="py-20 sm:py-28 bg-[#080A0C] border-y border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14 sm:mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#B8FF00]">
            Soberania dos Dados
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F1ED] tracking-tight">
            Sua trajetória continua sendo sua.
          </h2>
          <p className="text-sm sm:text-base text-[#8E9499] leading-relaxed">
            Seus objetivos, reflexões e memórias são privados. Sem venda de dados, sem monetização com anúncios e sem modelos públicos treinados com sua vida.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-[#0D0F10] border border-white/8 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-[#B8FF00]/10 flex items-center justify-center text-[#B8FF00]">
              <Eye className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#F2F1ED]">Visualização Transparente</h3>
            <p className="text-xs sm:text-sm text-[#8E9499] leading-relaxed">
              Você pode ver exatamente o que a Trajetta AI memorizou sobre você e editar qualquer fato quando quiser.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D0F10] border border-white/8 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
              <Download className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#F2F1ED]">Exportação Total (JSON/CSV)</h3>
            <p className="text-xs sm:text-sm text-[#8E9499] leading-relaxed">
              Com um clique, exporte todo o seu histórico, hábitos e reflexões para guardar com você. Sem lock-in.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0D0F10] border border-white/8 space-y-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
              <Trash2 className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-[#F2F1ED]">Exclusão Definitiva</h3>
            <p className="text-xs sm:text-sm text-[#8E9499] leading-relaxed">
              Se decidir parar, você pode apagar sua conta e todos os dados de forma permanente e irreversível.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
