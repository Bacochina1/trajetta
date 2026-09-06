'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useTrajetta } from '@/context/TrajettaContext';
import { Sparkles, ArrowRight, Check, Target, Repeat, Clock, Milestone, Brain } from 'lucide-react';
import { AreaBadge } from '@/components/ui/AreaBadge';
import { LifeArea } from '@/types';

export function QuickCaptureModal() {
  const { isQuickCaptureOpen, setIsQuickCaptureOpen, createGoal, createHabit, addTimelineEvent } = useTrajetta();
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<{
    type: 'meta' | 'habito' | 'acao' | 'timeline';
    title: string;
    area: LifeArea;
    reasoning: string;
    actionProposal: string;
  } | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  if (!isQuickCaptureOpen) return null;

  const handleProcess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;

    setLoading(true);
    setSuggestion(null);
    try {
      const res = await fetch('/api/ai/quick-capture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: text.trim() })
      });
      const data = await res.json();
      if (data.ok && data.capture) {
        setSuggestion(data.capture);
      }
    } catch {
      // Fallback proposal
      setSuggestion({
        type: 'acao',
        title: text.trim(),
        area: 'vida',
        reasoning: 'Sugestão automática baseada no seu texto.',
        actionProposal: `Registrar ação em vida.`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!suggestion) return;

    if (suggestion.type === 'meta') {
      await createGoal({
        title: suggestion.title,
        lifeArea: suggestion.area,
        whyItMatters: suggestion.reasoning
      });
    } else if (suggestion.type === 'habito') {
      await createHabit({
        title: suggestion.title,
        lifeArea: suggestion.area,
        frequencyPerWeek: 4
      });
    } else if (suggestion.type === 'timeline') {
      await addTimelineEvent({
        title: suggestion.title,
        description: suggestion.reasoning,
        lifeArea: suggestion.area
      });
    }

    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setSuggestion(null);
      setText('');
      setIsQuickCaptureOpen(false);
    }, 1200);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'meta': return <Target size={16} className="text-[#B8FF00]" />;
      case 'habito': return <Repeat size={16} className="text-[#58D6A7]" />;
      case 'timeline': return <Milestone size={16} className="text-[#A98CF7]" />;
      default: return <Clock size={16} className="text-[#6FAEF7]" />;
    }
  };

  return (
    <Modal
      isOpen={isQuickCaptureOpen}
      onClose={() => {
        setIsQuickCaptureOpen(false);
        setSuggestion(null);
        setText('');
      }}
      title="Captura Rápida com IA"
      subtitle="Digite um pensamento, desejo ou objetivo. A Trajetta AI estrutura e você confirma."
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        <form onSubmit={handleProcess} className="space-y-3">
          <div className="relative">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Ex: "Quero correr 10 km", "Comecei num novo emprego hoje", "Economizar 5 mil"'
              className="w-full bg-[#171A1D] border border-white/10 rounded-xl px-4 py-3 text-sm text-[#F2F1ED] placeholder-[#8E9499] focus:outline-none focus:border-[#B8FF00] transition-colors"
              autoFocus
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={loading || !text.trim()}
              className="text-xs"
            >
              {loading ? (
                <>
                  <Brain size={14} className="animate-spin" />
                  <span>Analisando...</span>
                </>
              ) : (
                <>
                  <Brain size={14} />
                  <span>Estruturar com IA</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Suggestion Card */}
        {suggestion && (
          <div className="p-4 rounded-2xl bg-[#171A1D] border border-[#B8FF00]/30 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getTypeIcon(suggestion.type)}
                <span className="text-xs font-bold uppercase tracking-wider text-[#F2F1ED]">
                  Proposta: {suggestion.type.toUpperCase()}
                </span>
              </div>
              <AreaBadge area={suggestion.area} />
            </div>

            <div>
              <h4 className="text-base font-bold text-[#F2F1ED]">{suggestion.title}</h4>
              <p className="text-xs text-[#8E9499] mt-1 leading-relaxed">{suggestion.reasoning}</p>
            </div>

            <div className="pt-2 border-t border-white/8 flex items-center justify-between gap-3">
              <span className="text-[11px] text-[#8E9499]">A IA sugere, você decide.</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSuggestion(null)}
                  className="text-xs text-[#8E9499]"
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleConfirm}
                  disabled={confirmed}
                  className="text-xs"
                >
                  {confirmed ? (
                    <>
                      <Check size={14} />
                      <span>Confirmado!</span>
                    </>
                  ) : (
                    <>
                      <Check size={14} />
                      <span>Confirmar & Salvar</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
