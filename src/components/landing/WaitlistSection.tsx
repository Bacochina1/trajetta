'use client';

import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Gift, 
  Lock, 
  Users,
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import { trackMarketingEvent } from '@/lib/analytics';

export function WaitlistSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    position: number;
    message: string;
    alreadyRegistered?: boolean;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [totalWaitlistCount, setTotalWaitlistCount] = useState<number>(1480);

  useEffect(() => {
    // Fetch live waitlist counter
    fetch('/api/waitlist')
      .then(res => res.json())
      .then(data => {
        if (data.ok && data.totalCount) {
          setTotalWaitlistCount(data.totalCount);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Por favor, informe um e-mail válido.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      trackMarketingEvent('waitlist_submit_attempt', { email, name });
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, phone }),
      });

      const data = await res.json();
      if (data.ok) {
        setSuccessData({
          position: data.position || totalWaitlistCount + 1,
          message: data.message,
          alreadyRegistered: data.alreadyRegistered,
        });
        trackMarketingEvent('waitlist_success', { position: data.position });
      } else {
        setErrorMessage(data.error || 'Ocorreu um erro ao salvar seu cadastro. Tente novamente.');
      }
    } catch (err) {
      setErrorMessage('Erro de conexão ao enviar seus dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 xs:px-6 sm:px-10 lg:px-14 py-16 sm:py-28 border-t border-white/10" data-purpose="pricing-plans" id="waitlist">
      {/* Eyebrow */}
      <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 mb-3 tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-pulse"></span>
        <span>Acesso Antecipado & Vagas Limitadas</span>
      </div>

      {/* Section Heading */}
      <div className="max-w-3xl mb-12">
        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white mb-3 sm:mb-4 [text-wrap:balance]">
          Garanta sua vaga no <span className="text-neutral-500">próximo ciclo de convites</span>
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
          Liberamos novos acessos em pequenos lotes fechados para acompanhar de perto a evolução de cada membro.
          Cadastre-se na lista de espera prioritária para garantir prioridade e condição vitalícia de membro fundador.
        </p>
      </div>

      {/* Central Waitlist Card */}
      <div className="relative rounded-2xl sm:rounded-3xl bg-[#090c10] border border-white/15 p-3.5 xs:p-5 sm:p-10 lg:p-12 overflow-hidden shadow-2xl mb-10 sm:mb-14">
        {/* Subtle background glow */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#B8FF00]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Form or Success */}
          <div className="lg:col-span-7">
            {successData ? (
              <div className="bg-[#12161e] border border-white/20 rounded-2xl p-4 sm:p-8 space-y-4 text-left">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#B8FF00]/15 border border-[#B8FF00]/30 flex items-center justify-center text-[#B8FF00]">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                <div>
                  <span className="text-[11px] sm:text-xs font-mono uppercase tracking-widest text-[#B8FF00]">
                    Vaga VIP Reservada
                  </span>
                  <h3 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white mt-1">
                    Você é o #{successData.position} na fila de acesso!
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
                    {successData.message}
                  </p>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                  <a
                    href="https://wa.me/?text=Garantir%20minha%20vaga%20na%20Lista%20VIP%20da%20Trajetta!"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-[#1e2329] hover:bg-[#28303a] text-white text-xs font-mono px-4 py-3 rounded-xl border border-white/10 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[#58D6A7]" />
                    <span>Canal Silencioso no WhatsApp</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-4">
                <div className="flex items-center gap-2 text-[11px] xs:text-xs font-mono text-neutral-300 mb-1 sm:mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#B8FF00]"></span>
                  <span>{totalWaitlistCount.toLocaleString('pt-BR')} pessoas na lista de espera</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-3.5">
                  <div>
                    <label className="block text-[11px] xs:text-xs font-mono text-neutral-400 mb-1">
                      Seu Nome Completo
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex.: Carlos Mendes"
                      className="w-full bg-[#12161f] border border-white/15 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-colors font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] xs:text-xs font-mono text-neutral-400 mb-1">
                      WhatsApp com DDD (Opcional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(11) 98765-4321"
                      className="w-full bg-[#12161f] border border-white/15 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-colors font-sans"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] xs:text-xs font-mono text-neutral-400 mb-1">
                    Seu Melhor E-mail <span className="text-[#B8FF00]">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@exemplo.com"
                    className="w-full bg-[#12161f] border border-white/15 rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-base sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-colors font-sans"
                  />
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-neutral-100 disabled:bg-neutral-400 text-black text-[11px] xs:text-xs sm:text-sm font-bold tracking-wider uppercase px-4 xs:px-6 sm:px-8 py-3.5 sm:py-4 rounded-full transition-all active:scale-95 shadow-xl shadow-white/5 cursor-pointer mt-2 text-center"
                >
                  <span>{loading ? 'RESERVANDO VAGA...' : 'GARANTIR MINHA VAGA NA LISTA VIP'}</span>
                  <ArrowRight className="w-4 h-4 flex-shrink-0" />
                </button>

                <p className="text-[10px] xs:text-[11px] font-mono text-neutral-500 pt-1 leading-normal">
                  🔒 Zero spam. Seus dados nunca são comercializados e você pode sair da lista a qualquer momento.
                </p>
              </form>
            )}
          </div>

          {/* Right Column: VIP Guarantee Box */}
          <div className="lg:col-span-5 bg-[#0f131a] border border-white/10 rounded-2xl p-4 xs:p-5 sm:p-7 space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-white/10">
              <span className="font-mono text-xs text-neutral-300 uppercase tracking-wider">
                Lote Fundador 2026
              </span>
              <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                Acesso Gradual
              </span>
            </div>

            <div className="space-y-2.5 sm:space-y-3 font-sans text-xs text-neutral-300 leading-relaxed">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B8FF00] flex-shrink-0 mt-0.5" />
                <span><strong>Prioridade absoluta:</strong> Convite enviado diretamente para o seu e-mail na abertura do lote.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B8FF00] flex-shrink-0 mt-0.5" />
                <span><strong>Condição Vitalícia de Fundador:</strong> Mensalidade com valor fixado para sempre, sem reajustes.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#B8FF00] flex-shrink-0 mt-0.5" />
                <span><strong>Acesso antecipado ao Trajetta AI:</strong> Modelo com memória ativa de ciclos.</span>
              </div>
            </div>

            <div className="pt-2.5 sm:pt-3 border-t border-white/5 text-[10.5px] sm:text-[11px] font-mono text-neutral-400 flex items-center justify-between">
              <span>Status do Lote:</span>
              <span className="text-[#B8FF00] font-medium">92% Preenchido</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 VIP Perks Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="rounded-2xl bg-[#090c10] border border-white/10 p-5 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div>
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Benefício 01</span>
            <h3 className="text-base sm:text-lg font-medium text-white mt-1.5 sm:mt-2 mb-2 sm:mb-3">Valor Travado de Fundador</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Membros cadastrados na lista de espera recebem condição vitalícia diferenciada, protegida contra reajustes futuros do aplicativo.
            </p>
          </div>
          <div className="pt-4 sm:pt-6 mt-3 sm:mt-4 border-t border-white/5 text-[11px] sm:text-xs font-mono text-neutral-500">
            Apenas para o lote inicial
          </div>
        </div>

        <div className="rounded-2xl bg-[#090c10] border border-white/10 p-5 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div>
            <span className="text-xs font-mono text-[#B8FF00] uppercase tracking-wider">Benefício 02</span>
            <h3 className="text-base sm:text-lg font-medium text-white mt-1.5 sm:mt-2 mb-2 sm:mb-3">Onboarding da Estrela-Guia</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Roteiro assistido para estruturar seus objetivos de 12 meses nas 4 áreas essenciais e calibrar seus pisos mínimos de segurança.
            </p>
          </div>
          <div className="pt-4 sm:pt-6 mt-3 sm:mt-4 border-t border-white/5 text-[11px] sm:text-xs font-mono text-neutral-500">
            Suporte direto da equipe
          </div>
        </div>

        <div className="rounded-2xl bg-[#090c10] border border-white/10 p-5 sm:p-7 flex flex-col justify-between hover:border-white/20 transition-all">
          <div>
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">Benefício 03</span>
            <h3 className="text-base sm:text-lg font-medium text-white mt-1.5 sm:mt-2 mb-2 sm:mb-3">IA com Memória Expandida</h3>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Acesso exclusivo ao motor de memória que conecta seus reviews semanais e entende seu ritmo biológico e profissional ao longo do tempo.
            </p>
          </div>
          <div className="pt-4 sm:pt-6 mt-3 sm:mt-4 border-t border-white/5 text-[11px] sm:text-xs font-mono text-neutral-500">
            Inteligência contextual ativa
          </div>
        </div>
      </div>
    </section>
  );
}
