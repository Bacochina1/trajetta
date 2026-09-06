'use client';

import React, { useState } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { Button } from '@/components/ui/Button';
import { Brain, Send, Compass, User, ArrowRight, ShieldCheck } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ia';
  text: string;
  timestamp: string;
}

export function AiCoachView() {
  const { user, goals, habits, journeys, weeklyPlan, weeklyReviews, timeline, lifeScore } = useTrajetta();

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
    `Como está meu avanço rumo a "${goals[0]?.title || 'minha meta principal'}"?`,
    'Qual área da minha vida mais precisa de atenção pelo Life Score?',
    'Analise meu histórico recente e sugira um ajuste para esta semana.',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: 'u-' + Date.now(),
      sender: 'user',
      text: query,
      timestamp: 'Agora',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const history = messages.slice(-5).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      }));
      history.push({ role: 'user', content: query });

      const ragContext = {
        user,
        goals,
        habits,
        journeys,
        weeklyPlan,
        weeklyReviews,
        timeline,
        lifeScore,
      };

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history, ragContext }),
      });


      const data = await res.json();
      const replyText = data?.reply;

      if (!replyText) {
        throw new Error('Empty reply');
      }

      const iaMsg: Message = {
        id: 'ia-' + Date.now(),
        sender: 'ia',
        text: replyText,
        timestamp: 'Agora',
      };

      setMessages((prev) => [...prev, iaMsg]);
    } catch {
      let fallback = '';
      const lower = query.toLowerCase();
      if (lower.includes('reduzir') || lower.includes('parar') || lower.includes('treino')) {
        fallback =
          'Eu entendo a sobrecarga de trabalho. Analisando seu histórico, você já acumulou consistência notável nos últimos meses. Em vez de abandonar o hábito, que tal reduzirmos temporariamente a duração ou frequência? Assim você não quebra a identidade construída e mantém o ritmo sem desgaste.';
      } else if (lower.includes('consistência') || lower.includes('semanas')) {
        fallback = `Você já concluiu ${user.completedWeeksCount} semanas consecutivas de planejamento na Trajetta! Mantenha a atenção aos momentos de descanso no meio da semana para sustentar essa consistência.`;
      } else if (lower.includes('atenção') || lower.includes('área')) {
        fallback =
          'Pelo seu Life Score atual, a área de Dinheiro e Vida pedem atenção equilibrada. Você tem sido exemplar em Corpo e Carreira, mas o tempo com quem você ama à noite encolheu nos últimos 10 dias. Uma noite inteira livre de telas nesta semana trará um retorno enorme para seu equilíbrio.';
      } else {
        fallback = `Entendido, ${user.name}. Com base no seu compromisso de longo prazo ("${user.target12Months}"), o segredo não é acelerar na marra, mas escolher uma única ação realizável para o dia de hoje e sustentá-la com calma.`;
      }

      const iaMsg: Message = {
        id: 'ia-' + Date.now(),
        sender: 'ia',
        text: fallback,
        timestamp: 'Agora',
      };

      setMessages((prev) => [...prev, iaMsg]);
    } finally {
      setIsTyping(false);
    }
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

      {/* Live RAG Engine Context Badge */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#171A1D] via-[#15181B] to-[#121416] border border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#8E9499]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#B8FF00] animate-pulse" />
          <Brain size={15} className="text-[#B8FF00]" />
          <span>
            RAG Conectado: <strong className="text-[#F2F1ED]">{user.completedWeeksCount} semanas</strong> · {goals.length} metas · {habits.length} hábitos · Life Score
          </span>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00]" />
          <span className="text-[#B8FF00] font-bold text-[10px] tracking-wider uppercase">
            RAG Trajetta Ativo
          </span>
        </div>
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
            <div className="flex items-center gap-2.5 text-xs text-[#8E9499] pl-10">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A98CF7] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#A98CF7] animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#A98CF7] animate-pulse [animation-delay:300ms]" />
              </div>
              <span className="text-[11px]">Trajetta IA formulando reflexão serena...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="space-y-2 pt-2 border-t border-white/8">
          <span className="text-[11px] font-bold text-[#8E9499] uppercase tracking-wider block">
            Sugestões de Reflexão:
          </span>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p)}
                className="text-xs text-[#8E9499] hover:text-[#F2F1ED] bg-[#111315] hover:bg-white/5 border border-white/8 px-3 py-2 rounded-lg text-left transition-colors tactile-btn min-h-[36px]"
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
          className="flex gap-2.5 pt-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ex: Como posso readequar meus objetivos nesta semana?"
            className="flex-1 h-11 bg-[#111315] border border-white/10 rounded-xl px-4 text-sm text-[#F2F1ED] placeholder:text-white/40 focus:ring-1 focus:ring-[#B8FF00]/50 focus:border-[#B8FF00] focus:outline-none transition-colors"
          />
          <Button variant="primary" size="icon" type="submit" disabled={!input.trim()} aria-label="Enviar mensagem">
            <Send size={16} />
          </Button>
        </form>
      </div>
    </div>
  );
}
