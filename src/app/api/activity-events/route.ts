import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/auth';
import { prisma, ensureDbReady } from '@/lib/db';

export async function GET() {
  try {
    await ensureDbReady();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 });
    }

    const events = await prisma.activityEvent.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return NextResponse.json({ ok: true, events });
  } catch (err) {
    console.error('Error fetching activity events:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao buscar eventos' }, { status: 500 });
  }
}
