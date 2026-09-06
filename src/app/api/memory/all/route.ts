import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/auth';
import { memoryService } from '@/lib/ai/memoryService';

export async function DELETE() {
  try {
    const user = await getSessionUser();
    const userId = user?.id || 'demo-user';

    await memoryService.deleteAllMemories(userId);
    return NextResponse.json({ ok: true, message: 'Todas as memórias foram apagadas com sucesso' });
  } catch (error) {
    console.error('DELETE /api/memory/all error:', error);
    return NextResponse.json({ ok: false, error: 'Falha ao apagar memórias' }, { status: 500 });
  }
}
