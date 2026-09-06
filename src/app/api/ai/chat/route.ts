import { NextResponse } from 'next/server';
import { callNvidiaAI } from '@/lib/ai/aiService';

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { messages, heavyReasoning, ragContext } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { ok: false, error: 'O formato de mensagens é inválido.' },
        { status: 400 }
      );
    }

    const reply = await callNvidiaAI(messages, {
      heavyReasoning: Boolean(heavyReasoning),
      ragContext,
    });

    return NextResponse.json({ ok: true, reply });

  } catch (error) {
    console.error('AI chat endpoint error:', error);
    return NextResponse.json(
      { ok: false, error: 'Erro ao processar reflexão com a IA.' },
      { status: 500 }
    );
  }
}
