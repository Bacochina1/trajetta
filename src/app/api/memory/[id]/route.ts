import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/auth';
import { memoryService } from '@/lib/ai/memoryService';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    const userId = user?.id || 'demo-user';

    await memoryService.deleteMemory(userId, id);
    return NextResponse.json({ ok: true, message: 'Memória removida com sucesso' });
  } catch (error) {
    console.error('DELETE /api/memory/[id] error:', error);
    return NextResponse.json({ ok: false, error: 'Falha ao deletar memória' }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getSessionUser();
    const userId = user?.id || 'demo-user';

    const body = await req.json();
    await memoryService.updateMemory(userId, id, body);

    return NextResponse.json({ ok: true, message: 'Memória atualizada com sucesso' });
  } catch (error) {
    console.error('PATCH /api/memory/[id] error:', error);
    return NextResponse.json({ ok: false, error: 'Falha ao atualizar memória' }, { status: 500 });
  }
}
