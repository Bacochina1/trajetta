import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/auth';
import { callGeminiAI } from '@/lib/ai/aiService';
import { PROMPT_REGISTRY } from '@/lib/ai/promptVersioning';
import { modelRouter } from '@/lib/ai/modelRouter';

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { rawText } = body;

    if (!rawText || !rawText.trim()) {
      return NextResponse.json({ ok: false, error: 'Texto é obrigatório' }, { status: 400 });
    }

    const route = modelRouter.getRoute('quick_capture');

    const messages = [
      { role: 'system' as const, content: PROMPT_REGISTRY.quick_capture_v1 },
      { role: 'user' as const, content: `Entrada do usuário: "${rawText.trim()}"` }
    ];

    const aiResponse = await callGeminiAI(messages, {
      maxTokens: route.maxTokens
    });

    // Parse JSON safely
    let parsedResult;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        parsedResult = JSON.parse(aiResponse);
      }
    } catch {
      // Fallback inference
      const lower = rawText.toLowerCase();
      let type: 'meta' | 'habito' | 'acao' | 'timeline' = 'acao';
      let area: 'corpo' | 'dinheiro' | 'carreira' | 'vida' = 'vida';

      if (lower.includes('quero') || lower.includes('meta')) type = 'meta';
      if (lower.includes('todo dia') || lower.includes('semana')) type = 'habito';
      if (lower.includes('comecei') || lower.includes('consegui')) type = 'timeline';

      if (lower.includes('correr') || lower.includes('treino') || lower.includes('dormir')) area = 'corpo';
      if (lower.includes('economizar') || lower.includes('dinheiro') || lower.includes('gasto')) area = 'dinheiro';
      if (lower.includes('emprego') || lower.includes('trabalho') || lower.includes('projeto')) area = 'carreira';

      parsedResult = {
        type,
        title: rawText.trim(),
        area,
        reasoning: 'Classificado com base no contexto informado.',
        actionProposal: `Criar ${type} com foco em ${area}.`
      };
    }

    return NextResponse.json({
      ok: true,
      capture: parsedResult,
      rawText: rawText.trim()
    });
  } catch (err) {
    console.error('Quick capture error:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao processar captura rápida' }, { status: 500 });
  }
}
