import { NextResponse } from 'next/server';
import { getSessionUser, AUTH_COOKIE_NAME } from '@/lib/auth/auth';
import { prisma, ensureDbReady } from '@/lib/db';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    await ensureDbReady();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 });
    }

    const userId = user.id;

    // Delete all related records in transactional order or cascade
    await prisma.$transaction([
      prisma.habitLog.deleteMany({ where: { userId } }),
      prisma.habit.deleteMany({ where: { userId } }),
      prisma.goalAction.deleteMany({ where: { goal: { userId } } }),
      prisma.goalMilestone.deleteMany({ where: { goal: { userId } } }),
      prisma.goal.deleteMany({ where: { userId } }),
      prisma.journeyLog.deleteMany({ where: { userId } }),
      prisma.journey.deleteMany({ where: { userId } }),
      prisma.weeklyReview.deleteMany({ where: { userId } }),
      prisma.weeklyPlan.deleteMany({ where: { userId } }),
      prisma.weeklySnapshot.deleteMany({ where: { userId } }),
      prisma.activityEvent.deleteMany({ where: { userId } }),
      prisma.dailyLog.deleteMany({ where: { userId } }),
      prisma.userMemory.deleteMany({ where: { userId } }),
      prisma.userContextSummary.deleteMany({ where: { userId } }),
      prisma.emailLog.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } })
    ]);

    // Clear session cookie
    const cookieStore = await cookies();
    cookieStore.set({
      name: AUTH_COOKIE_NAME,
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0
    });

    return NextResponse.json({ ok: true, message: 'Conta e dados excluídos com sucesso em conformidade com a LGPD.' });
  } catch (err) {
    console.error('Error deleting account:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao excluir conta' }, { status: 500 });
  }
}
