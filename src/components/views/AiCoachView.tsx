'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { Button } from '@/components/ui/Button';
import { Brain, Send, Compass, Sparkles, User, ArrowRight, ShieldCheck } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ia';
  text: string;
  timestamp: string;
}

export function AiCoachView() {
  const { user, goals, habits, journeys, lifeScore } = useTrajetta();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ia',
      text: `Olá ${user.name}. Eu acompanho sua trajetória desde que você começou. Sei que sua meta principal de 12 meses é "${user.target12Months}". Como posso ajudar a calibrar sua semana ou seus hábitos hoje?`,
      timestamp: 'Hoje às 09:00',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    'Estou pensando em reduzir os treinos esse mês por causa do trabalho.',
    'Como foi minha consistência nas últimas semanas?',
    'Qual área da minha vida mais precisa de atenção hoje?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: 'Agora',
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    // Contextual responses based on Trajetta's memory logic
    setTimeout(() => {
      let reply = '';
      const lower = query.toLowerCase();

      if (lower.includes('reduzir') || lower.includes('parar') || lower.includes('treino')) {
        reply =
          'Eu entendo a sobrecarga de trabalho. Analisando seu histórico, você já acumulou 43 treinos nos últimos 4 meses e sua meta é a Meia Maratona de 21 km. Em vez de abandonar o hábito, que tal reduzirmos temporariamente de 4 para 2 treinos curtos de 30 minutos na semana? Assim você não quebra a identidade que já construiu e mantém o ritmo sem desgaste.';
      } else if (lower.includes('consistência') || lower.includes('semanas')) {
        reply =
          `Você já concluiu ${user.completedWeeksCount} semanas consecutivas de planejamento na Trajetta! Sua consistência média em treinos está em 84% e sua taxa de blocos de foco profundo atingiu 88%. O ponto que oscilou foram os descansos desconectados à noite no meio da semana.`;
      } else if (lower.includes('atenção') || lower.includes('área')) {
        reply =
          'Pelo seu Life Score atual, a área de Dinheiro e Vida pedem atenção. Você tem sido exemplar em Corpo e Carreira, mas o tempo com quem você ama à noite encolheu nos últimos 10 dias. Uma noite inteira livre de telas nesta semana trará um retorno enorme para seu equilíbrio.';
      } else {
        reply =
          `Entendido, ${user.name}. Com base no seu compromisso de longo prazo ("${user.target12Months}"), o segredo não é acelerar na marra, mas escolher uma única ação realizável para o dia de hoje e sustentá-la.`;
      }

      const iaMsg: Message = {
        id: 'ia-' + Date.now(),
        sender: 'ia',
        text: reply,
        timestamp: 'Agora',
      };

      setMessages(prev => [...prev, iaMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-16">
      {/* Header */}
      <div className="pb-2 border-b border-white/8">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#A98CF7] uppercase">
            Inteligência Contextual
          </span>
          <span className="w-8 h-px bg-[#A98CF7]/40 inline-block" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#F2F1ED] mt-2">
          IA da <span className="text-[#A98CF7]">Trajetta.</span>
        </h1>
        <p className="text-sm text-[#8E9499] mt-1">
          Não é um chat genérico. A Trajetta conhece seus 4 meses de histórico e sugere ajustes de rota realistas.
        </p>
      </div>

      {/* Memory Context Tag */}
      <div className="p-3 rounded-xl bg-[#171A1D] border border-white/8 flex items-center justify-between text-xs text-[#8E9499]">
        <div className="flex items-center gap-2">
          <Brain size={15} className="text-[#A98CF7]" />
          <span>Contexto Ativo: <strong>{user.completedWeeksCount} semanas registradas</strong> · 4 metas ativas</span>
        </div>
        <span className="text-[#B8FF00] font-semibold text-[11px]">Memória Estruturada</span>
      </div>

      {/* Messages Thread */}
      <div className="trajetta-card p-4 sm:p-6 min-h-[400px] flex flex-col justify-between space-y-4">
        <div className="space-y-4 overflow-y-auto max-h-[460px] pr-1">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#A98CF7]/20 border border-[#A98CF7]/30 flex items-center justify-center text-[#A98CF7] flex-shrink-0 mt-0.5">
                    <Brain size={15} />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#B8FF00] text-[#0D0F10] font-semibold'
                      : 'bg-[#111315] border border-white/8 text-[#F2F1ED]'
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`text-[10px] block mt-1.5 ${
                      isUser ? 'text-[#0D0F10]/70 text-right' : 'text-[#8E9499]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-[#8E9499] pl-10">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A98CF7] animate-pulse" />
              <span>Trajetta IA analisando seu contexto...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="space-y-2 pt-2 border-t border-white/8">
          <span className="text-[10px] font-bold text-[#8E9499] uppercase tracking-wider block">
            Sugestões de Reflexão:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-[11px] text-[#8E9499] hover:text-[#F2F1ED] bg-[#111315] hover:bg-white/5 border border-white/8 px-2.5 py-1.5 rounded-lg text-left transition-colors tactile-btn"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2 pt-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ex: Como posso readequar meus objetivos nesta semana?"
            className="flex-1 bg-[#111315] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-[#F2F1ED] placeholder-[#8E9499]/60 focus:outline-none focus:border-[#B8FF00]"
          />
          <Button variant="primary" size="md" type="submit" disabled={!input.trim()}>
            <Send size={15} />
          </Button>
        </form>
      </div>
    </div>
  );
}
