import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/auth';
import { prisma, ensureDbReady } from '@/lib/db';

export async function GET() {
  try {
    await ensureDbReady();
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ ok: false, error: 'Acesso restrito a administradores' }, { status: 403 });
    }

    const [
      totalUsers,
      totalWaitlist,
      totalGoals,
      totalHabits,
      totalReviews,
      totalSnapshots,
      totalMemories,
      totalActivityEvents,
      emailLogs,
      recentUsers,
      featureFlags
    ] = await Promise.all([
      prisma.user.count(),
      prisma.waitlist.count(),
      prisma.goal.count(),
      prisma.habit.count(),
      prisma.weeklyReview.count(),
      prisma.weeklySnapshot.count(),
      prisma.userMemory.count(),
      prisma.activityEvent.count(),
      prisma.emailLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 20
      }),
      prisma.featureFlag.findMany()
    ]);

    return NextResponse.json({
      ok: true,
      metrics: {
        totalUsers,
        totalWaitlist,
        totalGoals,
        totalHabits,
        totalReviews,
        totalSnapshots,
        totalMemories,
        totalActivityEvents
      },
      emailLogs,
      recentUsers,
      featureFlags
    });
  } catch (err) {
    console.error('Error fetching admin metrics:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao buscar métricas administrativas' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDbReady();
    const user = await getSessionUser();
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ ok: false, error: 'Acesso restrito a administradores' }, { status: 403 });
    }

    const body = await req.json();
    const { key, enabled, description } = body;

    if (!key) {
      return NextResponse.json({ ok: false, error: 'Chave da feature flag é obrigatória' }, { status: 400 });
    }

    const flag = await prisma.featureFlag.upsert({
      where: { key },
      update: {
        enabled: Boolean(enabled),
        description: description !== undefined ? description : undefined
      },
      create: {
        key,
        enabled: Boolean(enabled),
        description: description || null
      }
    });

    return NextResponse.json({ ok: true, flag });
  } catch (err) {
    console.error('Error updating feature flag:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao atualizar feature flag' }, { status: 500 });
  }
}
