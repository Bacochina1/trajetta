import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/auth';
import { prisma, ensureDbReady } from '@/lib/db';

export async function POST() {
  try {
    await ensureDbReady();
    const user = await getSessionUser();
    
    // If not authenticated via session cookie, check fallback admin
    let targetUserId = user?.id;
    if (!targetUserId) {
      const admin = await prisma.user.findFirst({
        where: {
          OR: [
            { email: 'admin@trajetta.app' },
            { role: 'ADMIN' },
          ],
        },
      });
      targetUserId = admin?.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ ok: false, error: 'Usuário não encontrado' }, { status: 404 });
    }

    const userId = targetUserId;

    await prisma.$transaction([
      prisma.habitLog.deleteMany({ where: { habit: { userId } } }),
      prisma.habit.deleteMany({ where: { userId } }),
      prisma.goalAction.deleteMany({ where: { goal: { userId } } }),
      prisma.goalMilestone.deleteMany({ where: { goal: { userId } } }),
      prisma.goal.deleteMany({ where: { userId } }),
      prisma.journeyLog.deleteMany({ where: { journey: { userId } } }),
      prisma.journey.deleteMany({ where: { userId } }),
      prisma.weeklyReview.deleteMany({ where: { userId } }),
      prisma.weeklyPlan.deleteMany({ where: { userId } }),
      prisma.weeklySnapshot.deleteMany({ where: { userId } }),
      prisma.activityEvent.deleteMany({ where: { userId } }),
      prisma.dailyLog.deleteMany({ where: { userId } }),
      prisma.userMemory.deleteMany({ where: { userId } }),
      prisma.userContextSummary.deleteMany({ where: { userId } }),
    ]);

    return NextResponse.json({ ok: true, message: 'Dados da conta resetados com sucesso.' });
  } catch (err) {
    console.error('Error resetting account:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao resetar dados' }, { status: 500 });
  }
}
