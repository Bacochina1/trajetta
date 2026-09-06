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

    const userId = user.id;

    const [
      dbUser,
      goals,
      habits,
      journeys,
      weeklyPlans,
      weeklyReviews,
      weeklySnapshots,
      activityEvents,
      memories,
      contextSummary
    ] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, name: true, role: true, timezone: true, currentLifePhase: true, createdAt: true }
      }),
      prisma.goal.findMany({
        where: { userId },
        include: { milestones: true, actions: true }
      }),
      prisma.habit.findMany({
        where: { userId },
        include: { logs: true }
      }),
      prisma.journey.findMany({
        where: { userId },
        include: { logs: true }
      }),
      prisma.weeklyPlan.findMany({ where: { userId } }),
      prisma.weeklyReview.findMany({ where: { userId } }),
      prisma.weeklySnapshot.findMany({ where: { userId } }),
      prisma.activityEvent.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } }),
      prisma.userMemory.findMany({ where: { userId } }),
      prisma.userContextSummary.findUnique({ where: { userId } })
    ]);

    const exportData = {
      format: 'Trajetta Personal Evolution Data Export (LGPD Art. 18 / 19)',
      exportDate: new Date().toISOString(),
      user: dbUser,
      goals,
      habits,
      journeys,
      weeklyPlans,
      weeklyReviews,
      weeklySnapshots,
      activityEvents,
      aiMemories: memories,
      contextSummary
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="trajetta-dados-${user.email}-${new Date().toISOString().split('T')[0]}.json"`
      }
    });
  } catch (err) {
    console.error('Error exporting user data:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao exportar dados' }, { status: 500 });
  }
}
