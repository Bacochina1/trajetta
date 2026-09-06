'use client';

import React, { useState, useMemo } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import { Button } from '@/components/ui/Button';
import { Brain, Send, Compass, ArrowRight, RefreshCw, Sparkles, Flame, Target, Scale } from 'lucide-react';
import { generatePersonalizedPrompts, PromptSuggestion } from '@/lib/ai/promptSuggestions';
import { FormattedMessage } from '@/components/ui/FormattedMessage';

interface Message {
  id: string;
  sender: 'user' | 'ia';
  text: string;
  timestamp: string;
}

export function AiCoachView() {
  const { user, goals, habits, journeys, weeklyPlan, weeklyReviews, timeline, lifeScore } = useTrajetta();

  const firstName = user.name ? user.name.split(' ')[0] : 'Explorador';
  const targetNote = user.target12Months && user.target12Months.length > 2 ? ` com foco em ${user.target12Months}` : '';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ia',
      text: `Olá, ${firstName}. Acompanho sua trajetória${targetNote}. Quer organizar o dia de hoje ou ajustar o plano da semana?`,
      timestamp: 'Hoje às 09:00',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'evolucao' | 'metas' | 'habitos' | 'lifescore' | 'estrategia'>('all');
  const [refreshSeed, setRefreshSeed] = useState(0);

  // Dynamic reflection prompts generated from user's live data
  const dynamicPrompts = useMemo(() => {
    return generatePersonalizedPrompts({
      user,
      goals,
      habits,
      journeys,
      weeklyPlan,
      weeklyReviews,
      lifeScore,
    });
  }, [user, goals, habits, journeys, weeklyPlan, weeklyReviews, lifeScore, refreshSeed]);

  const filteredPrompts = useMemo(() => {
    if (selectedCategory === 'all') return dynamicPrompts;
    return dynamicPrompts.filter(p => p.category === selectedCategory);
  }, [dynamicPrompts, selectedCategory]);

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
    } catch (err) {
      console.warn('Chat request fallback:', err);
      let fallback = 'Quer organizar o dia de hoje ou precisa de direcionamento para a semana?';
      const lower = query.toLowerCase();
      if (lower.includes('cansa') || lower.includes('sobrecarga') || lower.includes('pesad')) {
        fallback = 'Em dias de sobrecarga, reduza a pressão. Escolha apenas o piso mínimo dos seus hábitos para manter a constância sem se esgotar.';
      } else if (lower.includes('hoje')) {
        fallback = 'O que precisa estar resolvido até o final do dia para você encerrar com tranquilidade?';
      } else if (lower.includes('semana') || lower.includes('plano') || lower === 'pla') {
        fallback = 'Quer organizar o dia de hoje ou montar o plano da semana?';
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
      {/* Header with Mascot */}
      <div className="flex items-center gap-4 pb-2 border-b border-white/8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#1E2530] to-[#0D1015] border border-[#B8FF00]/30 flex items-center justify-center flex-shrink-0 p-1 shadow-[0_0_16px_rgba(184,255,0,0.2)]">
          <img
            src="/trajetta-ai-avatar.png"
            alt="Trajetta AI Mascot"
            className="w-full h-full object-contain filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#B8FF00] uppercase">
              Inteligência Contextual
            </span>
            <span className="w-8 h-px bg-[#B8FF00]/40 inline-block" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#F2F1ED] mt-0.5">
            IA da <span className="text-[#B8FF00]">Trajetta.</span>
          </h1>
          <p className="text-sm text-[#8E9499] mt-0.5">
            Não é um chat genérico. O coach conhece seu histórico real e sugere ajustes de rota calibrados.
          </p>
        </div>
      </div>

      {/* Live Context & Memory Engine Status */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#171A1D] via-[#15181B] to-[#121416] border border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#8E9499]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#B8FF00] animate-pulse" />
          <Brain size={15} className="text-[#B8FF00]" />
          <span>
            Contexto Ativo: <strong className="text-[#F2F1ED]">{user.completedWeeksCount} sem. de consistência</strong> · {goals.length} {goals.length === 1 ? 'meta' : 'metas'} · {habits.length} {habits.length === 1 ? 'hábito' : 'hábitos'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] shadow-[0_0_6px_#B8FF00]" />
          <span className="text-[#B8FF00] font-bold text-[10px] tracking-wider uppercase">
            Memória Sincronizada
          </span>
        </div>
      </div>

      {/* Messages Thread */}
      <div className="trajetta-card p-4 sm:p-6 min-h-[400px] flex flex-col justify-between space-y-4">
        <div className="space-y-4 overflow-y-auto max-h-[420px] pr-1">
          {messages.map(msg => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-full bg-[#171A1D] border border-[#B8FF00]/40 flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden shadow-[0_0_10px_rgba(184,255,0,0.15)] p-0.5">
                    <img
                      src="/trajetta-ai-avatar.png"
                      alt="Trajetta AI"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#B8FF00] text-[#0D0F10] font-semibold'
                      : 'bg-[#111315] border border-white/8 text-[#F2F1ED]'
                  }`}
                >
                  {isUser ? (
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  ) : (
                    <FormattedMessage content={msg.text} />
                  )}
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
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-pulse" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-pulse [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-pulse [animation-delay:300ms]" />
              </div>
              <span className="text-[11px]">Trajetta IA formulando reflexão serena...</span>
            </div>
          )}
        </div>

        {/* Personalized Reflection Prompts (Dynamic from user data) */}
        <div className="space-y-2.5 pt-3 border-t border-white/8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[#8E9499] uppercase tracking-wider flex items-center gap-1.5">
                <Compass size={13} className="text-[#B8FF00]" />
                Sugestões Baseadas na Sua Trajetória:
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-pulse" />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'Todas' },
                { id: 'evolucao', label: '🚀 Evolução' },
                { id: 'metas', label: '🎯 Metas' },
                { id: 'habitos', label: '⚡ Hábitos' },
                { id: 'lifescore', label: '⚖️ Life Score' },
                { id: 'estrategia', label: '🧭 Desejos & Futuro' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-[#B8FF00]/15 text-[#B8FF00] border border-[#B8FF00]/30 shadow-[0_0_8px_rgba(184,255,0,0.15)]'
                      : 'text-[#8E9499] hover:text-[#F2F1ED] bg-white/3'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[175px] overflow-y-auto pr-1">
            {filteredPrompts.map(prompt => (
              <button
                key={prompt.id}
                onClick={() => handleSend(prompt.text)}
                className="group p-2.5 rounded-xl bg-[#12161E]/80 hover:bg-[#181E29] border border-white/8 hover:border-[#B8FF00]/30 text-left transition-all flex flex-col justify-between gap-1.5 active:scale-[0.99] shadow-sm"
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[9px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${prompt.badgeColor}`}>
                    {prompt.badge}
                  </span>
                  <ArrowRight size={12} className="text-[#8E9499] group-hover:text-[#B8FF00] group-hover:translate-x-0.5 transition-all" />
                </div>
                <p className="text-xs text-[#CED2D6] group-hover:text-white leading-relaxed line-clamp-2">
                  {prompt.text}
                </p>
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
