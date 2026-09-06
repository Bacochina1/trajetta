'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  generateShareCardCanvas,
  downloadCanvasAsPng,
  copyCanvasToClipboard,
  shareCanvasNatively,
  CardFormat,
  CardType,
  ShareCardData,
} from '@/lib/shareCardGenerator';
import {
  X,
  Download,
  Copy,
  Share2,
  Check,
  Smartphone,
  Square,
  Sparkles,
  Flame,
  Activity,
  Layers,
} from 'lucide-react';
import { TrajettaLogo } from './TrajettaLogo';

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareCardData;
}

export function ShareCardModal({ isOpen, onClose, data }: ShareCardModalProps) {
  const [format, setFormat] = useState<CardFormat>('stories');
  const [type, setType] = useState<CardType>('overall');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const canvas = await generateShareCardCanvas(format, type, data);
      const filename = `trajetta-${type}-${format}-${data.overallScore}`;
      downloadCanvasAsPng(canvas, filename);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    setIsGenerating(true);
    try {
      const canvas = await generateShareCardCanvas(format, type, data);
      const success = await copyCanvasToClipboard(canvas);
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNativeShare = async () => {
    setIsGenerating(true);
    try {
      const canvas = await generateShareCardCanvas(format, type, data);
      const title = `Trajetta — Overall ${data.overallScore}`;
      const text = `Meu ritmo no Trajetta: Overall ${data.overallScore}/100 com ${data.streakDays} dias de streak ativo. Planeje para sua vida real!`;
      await shareCanvasNatively(canvas, title, text);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const captionText = `Fechei a semana com overall ${data.overallScore} no @trajetta (${data.streakDays} dias de consistência). Ritmo sustentável > picos de exaustão. 🏃‍♂️📊 #Trajetta #Consistencia #Habitos`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(captionText);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Compartilhar Conquista no Instagram"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#060709]/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      {/* Outer Card */}
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#0E1218] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#12161E]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#B8FF00]/10 border border-[#B8FF00]/25 flex items-center justify-center text-[#B8FF00]">
              <Share2 size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#F2F1ED] flex items-center gap-2">
                Compartilhar no Instagram & WhatsApp
              </h3>
              <p className="text-xs text-[#8E9499]">
                Gere um card visual de alta resolução estilo Strava / Spotify Wrapped
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#8E9499] hover:text-[#F2F1ED] hover:bg-white/5 transition-colors"
            aria-label="Fechar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Live Preview Frame */}
          <div className="md:col-span-6 flex flex-col items-center justify-center bg-[#070809] border border-white/6 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-3 left-3 text-[10px] font-mono tracking-widest text-[#8E9499] uppercase">
              Preview em Tempo Real
            </div>

            {/* Visual Card Container */}
            <div
              className={`w-full transition-all duration-300 rounded-2xl border border-white/10 bg-[#0E1218] p-5 shadow-2xl flex flex-col justify-between ${
                format === 'stories'
                  ? 'max-w-[280px] aspect-[9/16] my-2'
                  : 'max-w-[340px] aspect-square my-4'
              }`}
            >
              {/* Header inside card */}
              <div className="flex items-center justify-between pb-3 border-b border-white/8">
                <TrajettaLogo size={22} showWordmark wordmarkClassName="text-sm font-extrabold text-[#F2F1ED]" />
                <span className="text-[9px] font-mono uppercase font-bold text-[#8E9499] tracking-wider">
                  {type === 'overall' ? 'OVERALL' : 'SEMANAL'}
                </span>
              </div>

              {/* Main content inside card preview */}
              <div className="my-auto py-2 space-y-3">
                <div className="p-3.5 rounded-xl bg-[#171A1D] border border-[#B8FF00]/25 text-center relative overflow-hidden">
                  <span className="text-[10px] font-mono tracking-widest text-[#8E9499] uppercase block">
                    Life Score Overall
                  </span>
                  <div className="flex items-baseline justify-center gap-1 mt-0.5">
                    <span className="text-5xl font-black text-[#B8FF00] tracking-tight">
                      {data.overallScore}
                    </span>
                    <span className="text-xs text-[#8E9499]">/100</span>
                  </div>
                  <span className="inline-block text-[11px] font-semibold text-[#58D6A7] mt-1 bg-[#58D6A7]/10 px-2 py-0.5 rounded-full">
                    • {data.scoreStatus}
                  </span>
                </div>

                {/* Metrics Row */}
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-white/3 border border-white/6">
                    <span className="text-[9px] text-[#8E9499] block font-mono uppercase">Streak</span>
                    <span className="text-xs font-bold text-[#F2F1ED] flex items-center justify-center gap-1">
                      <Flame size={12} className="text-[#F08A76]" /> {data.streakDays} dias
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/3 border border-white/6">
                    <span className="text-[9px] text-[#8E9499] block font-mono uppercase">Pace</span>
                    <span className="text-xs font-bold text-[#B8FF00] flex items-center justify-center gap-1">
                      <Activity size={12} /> {data.consistencyRate}%
                    </span>
                  </div>
                </div>

                {/* 4 Pillars preview */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1 text-[#F2F1ED]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#58D6A7]" /> Corpo
                    </span>
                    <span className="font-bold text-[#58D6A7]">{data.areas.corpo}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1 text-[#F2F1ED]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F08A76]" /> Dinheiro
                    </span>
                    <span className="font-bold text-[#F08A76]">{data.areas.dinheiro}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1 text-[#F2F1ED]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#A98CF7]" /> Carreira
                    </span>
                    <span className="font-bold text-[#A98CF7]">{data.areas.carreira}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="flex items-center gap-1 text-[#F2F1ED]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6FAEF7]" /> Vida
                    </span>
                    <span className="font-bold text-[#6FAEF7]">{data.areas.vida}</span>
                  </div>
                </div>
              </div>

              {/* Footer preview */}
              <div className="pt-2 border-t border-white/8 flex items-center justify-between text-[9px] text-[#8E9499]">
                <span>{data.userName}</span>
                <span className="text-[#B8FF00] font-medium">trajetta.app</span>
              </div>
            </div>
          </div>

          {/* Right Column: Controls & Share Actions */}
          <div className="md:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Format Switcher */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#8E9499] block mb-2">
                  Formato da Imagem
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setFormat('stories')}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                      format === 'stories'
                        ? 'bg-[#B8FF00]/10 border-[#B8FF00] text-[#B8FF00] shadow-[0_0_15px_rgba(184,255,0,0.15)]'
                        : 'bg-[#171A1D] border-white/8 text-[#8E9499] hover:text-[#F2F1ED]'
                    }`}
                  >
                    <Smartphone size={16} />
                    <span>Instagram Stories (9:16)</span>
                  </button>
                  <button
                    onClick={() => setFormat('square')}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-xs font-bold transition-all ${
                      format === 'square'
                        ? 'bg-[#B8FF00]/10 border-[#B8FF00] text-[#B8FF00] shadow-[0_0_15px_rgba(184,255,0,0.15)]'
                        : 'bg-[#171A1D] border-white/8 text-[#8E9499] hover:text-[#F2F1ED]'
                    }`}
                  >
                    <Square size={16} />
                    <span>Feed / WhatsApp (1:1)</span>
                  </button>
                </div>
              </div>

              {/* Card Type */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#8E9499] block mb-2">
                  Tipo de Conquista
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setType('overall')}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      type === 'overall'
                        ? 'bg-white/10 border-white/20 text-[#F2F1ED]'
                        : 'bg-[#171A1D] border-white/8 text-[#8E9499] hover:text-[#F2F1ED]'
                    }`}
                  >
                    <Layers size={14} />
                    <span>Overall Life Score</span>
                  </button>
                  <button
                    onClick={() => setType('weekly')}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all ${
                      type === 'weekly'
                        ? 'bg-white/10 border-white/20 text-[#F2F1ED]'
                        : 'bg-[#171A1D] border-white/8 text-[#8E9499] hover:text-[#F2F1ED]'
                    }`}
                  >
                    <Activity size={14} />
                    <span>Ritmo Semanal</span>
                  </button>
                </div>
              </div>

              {/* Caption Sugestion */}
              <div className="p-3.5 rounded-xl bg-[#171A1D] border border-white/8 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#F2F1ED]">Legenda Sugerida</span>
                  <button
                    onClick={handleCopyCaption}
                    className="text-[10px] font-semibold text-[#B8FF00] hover:underline flex items-center gap-1"
                  >
                    {copiedCaption ? (
                      <>
                        <Check size={11} /> Copiada!
                      </>
                    ) : (
                      <>
                        <Copy size={11} /> Copiar texto
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-[#8E9499] leading-relaxed line-clamp-2">
                  &ldquo;{captionText}&rdquo;
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#B8FF00] hover:bg-[#a6e600] text-[#0D0F10] font-extrabold text-sm transition-all shadow-[0_0_20px_rgba(184,255,0,0.25)] active:scale-[0.98] disabled:opacity-50"
              >
                <Download size={18} />
                <span>{isGenerating ? 'Gerando imagem HD...' : 'Baixar Imagem PNG (Alta Resolução)'}</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCopy}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#171A1D] hover:bg-white/5 border border-white/10 text-[#F2F1ED] font-bold text-xs transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  {copied ? (
                    <>
                      <Check size={16} className="text-[#58D6A7]" />
                      <span className="text-[#58D6A7]">Imagem Copiada!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copiar Imagem</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleNativeShare}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#171A1D] hover:bg-white/5 border border-white/10 text-[#F2F1ED] font-bold text-xs transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <Share2 size={16} />
                  <span>Compartilhar Direto</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
