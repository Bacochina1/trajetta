import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/auth';
import { prisma, ensureDbReady } from '@/lib/db';
import { memoryService } from '@/lib/ai/memoryService';

export async function GET() {
  try {
    await ensureDbReady();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 });
    }

    const reviews = await prisma.weeklyReview.findMany({
      where: { userId: user.id },
      orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }]
    });

    const snapshots = await prisma.weeklySnapshot.findMany({
      where: { userId: user.id },
      orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }]
    });

    return NextResponse.json({ ok: true, reviews, snapshots });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao buscar reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await ensureDbReady();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const {
      weekNumber,
      year,
      wins,
      challenges,
      aiReflection,
      actionsPlanned,
      actionsCompleted,
      habitsRate,
      topArea,
      neglectedArea,
      reflectionNextWeekAdjustment
    } = body;

    const currentYear = year || new Date().getFullYear();
    const currentWeek = weekNumber || 1;

    // 1. Create Weekly Review record
    const review = await prisma.weeklyReview.create({
      data: {
        userId: user.id,
        weekNumber: currentWeek,
        year: currentYear,
        wins: wins || '',
        challenges: challenges || '',
        aiReflection: aiReflection || 'Reflexão registrada.',
        northStarWeeks: 1
      }
    });

    // 2. Mark WeeklyPlan as completed
    try {
      await prisma.weeklyPlan.updateMany({
        where: { userId: user.id, weekNumber: currentWeek, year: currentYear },
        data: { isCompleted: true }
      });
    } catch {}

    // 3. Create Immutable Weekly Snapshot
    const summaryText = `Semana ${currentWeek}/${currentYear}: ${actionsCompleted || 0} ações executadas. Foco principal: ${topArea || 'geral'}. Ponto de atenção: ${neglectedArea || 'vida'}.`;
    const snapshot = await prisma.weeklySnapshot.create({
      data: {
        userId: user.id,
        weekNumber: currentWeek,
        year: currentYear,
        actionsPlanned: Number(actionsPlanned) || 10,
        actionsCompleted: Number(actionsCompleted) || 8,
        habitsActive: 4,
        habitsCompleted: Math.round(((Number(habitsRate) || 80) / 100) * 4),
        focusAreas: JSON.stringify([topArea || 'corpo']),
        summary: summaryText,
        rawSnapshotJson: JSON.stringify({
          wins,
          challenges,
          topArea,
          neglectedArea,
          habitsRate,
          reflectionNextWeekAdjustment
        })
      }
    });

    // 4. Register Immutable Activity Event
    try {
      await prisma.activityEvent.create({
        data: {
          userId: user.id,
          eventType: 'weekly_review_completed',
          title: `Weekly Review: Semana ${currentWeek}`,
          description: summaryText,
          lifeArea: topArea || 'corpo',
          metadata: JSON.stringify({ reviewId: review.id, snapshotId: snapshot.id })
        }
      });
    } catch {}

    // 5. Extract and persist strategic memories
    if (wins && wins.length > 10) {
      try {
        await memoryService.addMemory(user.id, {
          memoryType: 'achievement',
          content: `Vitória registrada na semana ${currentWeek}: ${wins.substring(0, 200)}`,
          importance: 0.8,
          confidence: 0.9,
          source: 'weekly_review',
          sourceId: review.id
        });
      } catch {}
    }

    if (challenges && challenges.length > 10) {
      try {
        await memoryService.addMemory(user.id, {
          memoryType: 'difficulty',
          content: `Dificuldade registrada na semana ${currentWeek}: ${challenges.substring(0, 200)}`,
          importance: 0.7,
          confidence: 0.85,
          source: 'weekly_review',
          sourceId: review.id
        });
      } catch {}
    }

    return NextResponse.json({
      ok: true,
      review,
      snapshot
    });
  } catch (err) {
    console.error('Error submitting weekly review:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao submeter weekly review' }, { status: 500 });
  }
}
