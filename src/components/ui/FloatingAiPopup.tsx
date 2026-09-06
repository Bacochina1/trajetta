'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useTrajetta } from '@/context/TrajettaContext';
import {
  Send,
  X,
  Maximize2,
  Sparkles,
  Compass,
  ArrowRight,
  Flame,
  Target,
  Scale,
  Brain,
  MessageSquare
} from 'lucide-react';
import { generatePersonalizedPrompts, PromptSuggestion } from '@/lib/ai/promptSuggestions';

interface Message {
  id: string;
  sender: 'user' | 'ia';
  text: string;
  timestamp: string;
}

type CornerPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

interface FloatingAiPopupProps {
  corner: CornerPosition;
  isOpen: boolean;
  onClose: () => void;
}

export function FloatingAiPopup({ corner, isOpen, onClose }: FloatingAiPopupProps) {
  const {
    user,
    goals,
    habits,
    journeys,
    weeklyPlan,
    weeklyReviews,
    timeline,
    lifeScore,
    setActiveView
  } = useTrajetta();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ia',
      text: `Olá ${user.name || 'Explorador'}! Acompanho sua trajetória em tempo real. Como posso ajudar a calibrar sua semana ou seus hábitos agora?`,
      timestamp: 'Hoje',
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'metas' | 'habitos' | 'lifescore' | 'estrategia'>('all');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Dynamic reflection prompts generated from user's live data
  const dynamicPrompts = useMemo(() => {
    return generatePersonalizedPrompts({
      user,
      goals,
      habits,
      journeys,
      weeklyPlan,
      lifeScore,
    });
  }, [user, goals, habits, journeys, weeklyPlan, lifeScore]);

  const filteredPrompts = useMemo(() => {
    if (selectedCategory === 'all') return dynamicPrompts.slice(0, 4);
    return dynamicPrompts.filter((p) => p.category === selectedCategory).slice(0, 4);
  }, [dynamicPrompts, selectedCategory]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  if (!isOpen) return null;

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
    setShowSuggestions(false);

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
          'Eu entendo a sobrecarga. Analisando seu histórico, você já acumulou consistência importante. Em vez de abandonar o hábito, que tal reduzirmos temporariamente a frequência para manter a identidade viva sem desgaste?';
      } else if (lower.includes('consistência') || lower.includes('semanas')) {
        fallback = `Você já registrou ${user.completedWeeksCount} semanas consecutivas de planejamento na Trajetta! Mantenha a atenção aos momentos de descanso para sustentar seu ritmo com calma.`;
      } else {
        fallback = `Entendido, ${user.name || 'Explorador'}. O segredo não é acelerar na marra, mas escolher uma única ação viável para hoje e sustentá-la com calma.`;
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

  const handleExpandToFullView = () => {
    onClose();
    setActiveView('ia');
  };

  // Position classes based on corner (on desktop)
  const desktopPositionClasses: Record<CornerPosition, string> = {
    'bottom-right': 'md:right-6 md:bottom-24',
    'bottom-left': 'md:left-[270px] md:bottom-24',
    'top-right': 'md:right-6 md:top-24',
    'top-left': 'md:left-[270px] md:top-24',
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden animate-fade-in"
        onClick={onClose}
      />

      {/* Main Floating Popup Container */}
      <div
        className={`fixed z-50 flex flex-col bg-[#0B0E14]/98 border border-[#B8FF00]/30 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(184,255,0,0.12)] backdrop-blur-2xl transition-all duration-200 overflow-hidden
          /* Mobile: Bottom-sheet drawer (fits 320px-420px screens gracefully) */
          inset-x-0 bottom-0 top-12 rounded-t-3xl max-h-[90vh]
          /* Desktop: Floating Window Card */
          md:inset-auto md:w-[440px] md:h-[620px] md:max-h-[82vh] md:rounded-3xl ${desktopPositionClasses[corner]}`}
      >
        {/* Mobile Drag/Close Handle */}
        <div className="flex md:hidden items-center justify-center pt-2 pb-1 cursor-pointer" onClick={onClose}>
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 border-b border-white/10 bg-[#0E1218]/90 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* 3D Mascot Avatar thumbnail */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-b from-[#1E2530] to-[#0D1015] border border-[#B8FF00]/40 flex items-center justify-center p-0.5 shadow-[0_0_12px_rgba(184,255,0,0.25)] flex-shrink-0">
              <img
                src="/trajetta-ai-avatar.png"
                alt="Mascote Trajetta AI"
                className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
              />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8FF00] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#B8FF00]" />
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold text-white tracking-tight truncate">Trajetta AI</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#B8FF00]/15 text-[#B8FF00] font-semibold border border-[#B8FF00]/30 hidden xs:inline">
                  COACH
                </span>
              </div>
              <p className="text-[10px] text-[#8E9499] font-mono truncate flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#58D6A7]" />
                <span>Memória Sincronizada</span>
              </p>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={handleExpandToFullView}
              title="Expandir para tela cheia"
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors hidden sm:flex"
            >
              <Maximize2 size={15} />
            </button>

            <button
              onClick={onClose}
              title="Fechar popup"
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Suggestions & Category Filter (Toggable) */}
        {showSuggestions && dynamicPrompts.length > 0 && (
          <div className="px-3 sm:px-4 py-2 bg-[#090C10] border-b border-white/5 flex-shrink-0 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
              <span className="flex items-center gap-1 text-[#B8FF00] font-semibold">
                <Sparkles size={11} />
                <span>Reflexões Sugeridas</span>
              </span>
              <button
                onClick={() => setShowSuggestions(false)}
                className="text-neutral-500 hover:text-neutral-300 text-[10px]"
              >
                Ocultar
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 text-[10px] font-mono">
              {[
                { id: 'all', label: 'Todas' },
                { id: 'metas', label: '🎯 Metas' },
                { id: 'habitos', label: '⚡ Hábitos' },
                { id: 'lifescore', label: '⚖️ Life Score' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`px-2 py-0.5 rounded-md transition-colors whitespace-nowrap ${
                    selectedCategory === tab.id
                      ? 'bg-white text-black font-bold'
                      : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Prompt Cards (Horizontal Carousel) */}
            <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {filteredPrompts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSend(p.text)}
                  className="flex-shrink-0 max-w-[210px] p-2 rounded-lg bg-[#12161E] hover:bg-[#181E29] border border-white/10 hover:border-[#B8FF00]/40 text-left transition-all group"
                >
                  <span className="text-[9px] font-mono text-[#B8FF00] block mb-0.5 truncate">
                    {p.badge}
                  </span>
                  <span className="text-[11px] text-neutral-200 line-clamp-2 leading-tight group-hover:text-white">
                    {p.text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Messages Body */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-3.5 text-xs">
          {messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div
                key={m.id}
                className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-[#14181F] border border-[#B8FF00]/30 flex items-center justify-center p-0.5 flex-shrink-0 mt-0.5">
                    <img
                      src="/trajetta-ai-avatar.png"
                      alt="IA"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                <div
                  className={`max-w-[82%] sm:max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#181D26] text-white border border-white/15 rounded-tr-none'
                      : 'bg-[#10141B] text-neutral-200 border border-white/8 rounded-tl-none relative shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>
                  <span className="text-[9px] font-mono text-neutral-500 block mt-1 text-right">
                    {m.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-neutral-400 text-xs pl-9">
              <div className="flex gap-1 items-center bg-[#10141B] px-3 py-2 rounded-xl border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-[#B8FF00] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-[10px] font-mono text-neutral-500">Analisando contexto...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-3.5 bg-[#0A0D12] border-t border-white/10 flex-shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 bg-[#12161E] border border-white/15 focus-within:border-[#B8FF00]/60 rounded-xl px-3 py-1.5 transition-all shadow-inner"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte ao seu coach de trajetória..."
              className="flex-1 bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none py-1"
            />

            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              aria-label="Enviar mensagem"
              className="w-8 h-8 rounded-lg bg-[#B8FF00] text-[#0D0F10] hover:bg-[#a5e600] disabled:opacity-40 disabled:hover:bg-[#B8FF00] flex items-center justify-center transition-all flex-shrink-0 shadow-md shadow-[#B8FF00]/20"
            >
              <Send size={13} className="mt-[-1px]" />
            </button>
          </form>

          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500 mt-2 px-1">
            <button
              type="button"
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="hover:text-neutral-300 transition-colors flex items-center gap-1"
            >
              <Sparkles size={10} className="text-[#B8FF00]" />
              <span>{showSuggestions ? 'Ocultar Sugestões' : 'Ver Sugestões'}</span>
            </button>

            <span className="hidden xs:inline">Shift + Enter quebra linha</span>
          </div>
        </div>
      </div>
    </>
  );
}
