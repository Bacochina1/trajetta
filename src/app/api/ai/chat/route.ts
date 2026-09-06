import { NextResponse } from 'next/server';
import { callNvidiaAI } from '@/lib/ai/aiService';
import { getSessionUser } from '@/lib/auth/auth';
import { memoryService } from '@/lib/ai/memoryService';

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

    const user = await getSessionUser();
    const userId = user?.id || 'demo-user';
    const lastUserQuery = messages[messages.length - 1]?.content || '';

    // Assemble Level 1, 2, 3 Memory Pack
    let contextPack;
    try {
      contextPack = await memoryService.assembleContextPack(userId, lastUserQuery);
    } catch (e) {
      console.warn('Could not assemble memory context pack:', e);
    }

    const reply = await callNvidiaAI(messages, {
      heavyReasoning: Boolean(heavyReasoning),
      ragContext,
      contextPack,
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
