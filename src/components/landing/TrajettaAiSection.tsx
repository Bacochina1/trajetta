'use client';

import React from 'react';
import { Sparkles, Brain, Check, Shield } from 'lucide-react';
import { trackMarketingEvent } from '@/lib/analytics';

export function TrajettaAiSection() {
  return (
    <section id="ia" className="py-20 sm:py-28 bg-[#080A0C] border-y border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B8FF00]/10 border border-[#B8FF00]/25 text-xs font-bold text-[#B8FF00]">
            <Brain className="w-3.5 h-3.5" />
            <span>Inteligência Contextual</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F2F1ED] tracking-tight">
            A Trajetta lembra do que você construiu.
          </h2>
          <p className="text-sm sm:text-base text-[#8E9499] leading-relaxed">
            Metas, semanas, hábitos, dificuldades e mudanças deixam de ser informações isoladas. A Trajetta AI utiliza seu histórico para dar respostas mais contextualizadas e ajudar você a ajustar o caminho.
          </p>
        </div>

        {/* Real Dialog Experience Showcase */}
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#0D0F10] border border-[#B8FF00]/30 shadow-[0_0_50px_rgba(184,255,0,0.08)] space-y-5">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-white/8">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B8FF00] shadow-[0_0_8px_#B8FF00]" />
              <span className="text-xs font-bold text-[#F2F1ED]">Trajetta AI · Coach de Trajetória</span>
            </div>
            <span className="text-[11px] text-[#8E9499] font-mono">Memória ativa de 4 semanas</span>
          </div>

          {/* User message */}
          <div className="flex justify-end">
            <div className="max-w-[85%] p-3.5 sm:p-4 rounded-2xl rounded-tr-sm bg-[#1A1F27] border border-white/10 text-xs sm:text-sm text-[#F2F1ED] leading-relaxed">
              “Estou pensando em diminuir meus treinos este mês.”
            </div>
          </div>

          {/* Trajetta AI response */}
          <div className="flex justify-start">
            <div className="max-w-[90%] p-4 sm:p-5 rounded-2xl rounded-tl-sm bg-[#14181F] border border-[#B8FF00]/20 text-xs sm:text-sm text-[#F2F1ED] leading-relaxed space-y-3">
              <p>
                “Nas últimas quatro semanas sua frequência caiu de quatro para dois treinos. Como seu trabalho está mais intenso, quer adaptar temporariamente sua meta para dois treinos e manter consistência?”
              </p>

              {/* Action Buttons as demonstrated in the prompt */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => trackMarketingEvent('section_viewed', { section: 'ia_adaptar_plano' })}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#B8FF00] text-[#060709] hover:bg-[#c6ff24] transition-all"
                >
                  Adaptar plano
                </button>
                <button
                  type="button"
                  onClick={() => trackMarketingEvent('section_viewed', { section: 'ia_manter_como_esta' })}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#202630] text-[#F2F1ED] hover:bg-[#28303C] transition-all border border-white/10"
                >
                  Manter como está
                </button>
              </div>
            </div>
          </div>

          {/* Key Principles of the AI */}
          <div className="pt-4 border-t border-white/8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#8E9499]">
            <div className="flex items-start gap-2">
              <Check className="w-4 h-4 text-[#B8FF00] flex-shrink-0 mt-0.5" />
              <span>A IA não decide por você. Ela ilumina padrões para você tomar decisões melhores.</span>
            </div>
            <div className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-[#B8FF00] flex-shrink-0 mt-0.5" />
              <span>Zero modelos externos treinados com seus dados privados. Privacidade total.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
