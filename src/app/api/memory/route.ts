import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/auth';
import { memoryService } from '@/lib/ai/memoryService';

export async function GET() {
  try {
    const user = await getSessionUser();
    const userId = user?.id || 'demo-user';

    const [memories, livingSummary] = await Promise.all([
      memoryService.getMemories(userId),
      memoryService.getLivingSummary(userId),
    ]);

    return NextResponse.json({
      ok: true,
      memories,
      livingSummary,
    });
  } catch (error) {
    console.error('GET /api/memory error:', error);
    return NextResponse.json({ ok: false, error: 'Falha ao buscar memórias' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    const userId = user?.id || 'demo-user';

    const body = await req.json();
    const { memoryType, content, importance, confidence, source } = body;

    if (!content || !memoryType) {
      return NextResponse.json({ ok: false, error: 'Campos content e memoryType são obrigatórios' }, { status: 400 });
    }

    const newMemory = await memoryService.addMemory(userId, {
      memoryType,
      content,
      importance: typeof importance === 'number' ? importance : 0.6,
      confidence: typeof confidence === 'number' ? confidence : 0.85,
      source: source || 'user_manual',
    });

    return NextResponse.json({ ok: true, memory: newMemory });
  } catch (error) {
    console.error('POST /api/memory error:', error);
    return NextResponse.json({ ok: false, error: 'Falha ao gravar memória' }, { status: 500 });
  }
}
