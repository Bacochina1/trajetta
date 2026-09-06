import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/auth';
import { prisma, ensureDbReady } from '@/lib/db';

function getWeekNumber(d: Date): [number, number] {
  const target = new Date(d.valueOf());
  const dayNr = (d.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  const weekNum = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  return [weekNum, target.getFullYear()];
}

export async function GET() {
  try {
    await ensureDbReady();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 });
    }

    const [currentWeek, currentYear] = getWeekNumber(new Date());

    // Fetch or create current week's plan
    let plan = await prisma.weeklyPlan.findUnique({
      where: {
        userId_weekNumber_year: {
          userId: user.id,
          weekNumber: currentWeek,
          year: currentYear
        }
      }
    });

    if (!plan) {
      plan = await prisma.weeklyPlan.create({
        data: {
          userId: user.id,
          weekNumber: currentWeek,
          year: currentYear,
          northStarGoal: 'Construir consistência nas ações essenciais e preservar energia.',
          areaPriorities: JSON.stringify({
            corpo: 'Treinar 4x e dormir 7h+',
            dinheiro: 'Aporte semanal e revisão de gastos',
            carreira: 'Blocos de deep work sem interrupção',
            vida: 'Tempo com pessoas queridas e desconectar à noite'
          }),
          perceivedCapacity: 'normal',
          weekIntention: 'Avançar com tranquilidade e foco nas prioridades reais.',
          isCompleted: false
        }
      });
    }

    // Historical capacity planning calculation
    const pastSnapshots = await prisma.weeklySnapshot.findMany({
      where: { userId: user.id },
      orderBy: [{ year: 'desc' }, { weekNumber: 'desc' }],
      take: 4
    });

    let avgCompletedActions = 8; // Sensible default baseline
    if (pastSnapshots.length > 0) {
      const sum = pastSnapshots.reduce((acc, s) => acc + s.actionsCompleted, 0);
      avgCompletedActions = Math.max(3, Math.round(sum / pastSnapshots.length));
    }

    // Parse current priorities
    let priorities: Record<string, string> = {};
    try {
      priorities = JSON.parse(plan.areaPriorities);
    } catch {
      priorities = {};
    }

    return NextResponse.json({
      ok: true,
      plan: {
        ...plan,
        areaPriorities: priorities
      },
      capacityPlanning: {
        historicalAverageActions: avgCompletedActions,
        recommendedActionMax: Math.round(avgCompletedActions * 1.3),
        pastWeeksAnalyzed: pastSnapshots.length
      }
    });
  } catch (err) {
    console.error('Error fetching weekly plan:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao buscar plano semanal' }, { status: 500 });
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
    const [currentWeek, currentYear] = getWeekNumber(new Date());

    const {
      northStarGoal,
      areaPriorities,
      perceivedCapacity,
      weekIntention,
      isCompleted
    } = body;

    const prioritiesStr = typeof areaPriorities === 'object'
      ? JSON.stringify(areaPriorities)
      : areaPriorities || '{}';

    const plan = await prisma.weeklyPlan.upsert({
      where: {
        userId_weekNumber_year: {
          userId: user.id,
          weekNumber: currentWeek,
          year: currentYear
        }
      },
      update: {
        northStarGoal: northStarGoal || undefined,
        areaPriorities: prioritiesStr,
        perceivedCapacity: perceivedCapacity || undefined,
        weekIntention: weekIntention || undefined,
        isCompleted: isCompleted !== undefined ? Boolean(isCompleted) : undefined
      },
      create: {
        userId: user.id,
        weekNumber: currentWeek,
        year: currentYear,
        northStarGoal: northStarGoal || 'Construir consistência nas ações essenciais.',
        areaPriorities: prioritiesStr,
        perceivedCapacity: perceivedCapacity || 'normal',
        weekIntention: weekIntention || 'Avançar com tranquilidade.',
        isCompleted: isCompleted !== undefined ? Boolean(isCompleted) : false
      }
    });

    let parsedPriorities: Record<string, string> = {};
    try {
      parsedPriorities = JSON.parse(plan.areaPriorities);
    } catch {
      parsedPriorities = {};
    }

    return NextResponse.json({
      ok: true,
      plan: {
        ...plan,
        areaPriorities: parsedPriorities
      }
    });
  } catch (err) {
    console.error('Error saving weekly plan:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao salvar plano semanal' }, { status: 500 });
  }
}
