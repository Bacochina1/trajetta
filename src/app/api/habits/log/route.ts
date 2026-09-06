import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/auth';
import { prisma, ensureDbReady } from '@/lib/db';

export async function POST(req: Request) {
  try {
    await ensureDbReady();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { habitId, date, completed } = body;

    if (!habitId) {
      return NextResponse.json({ ok: false, error: 'habitId é obrigatório' }, { status: 400 });
    }

    const targetDate = date || new Date().toISOString().split('T')[0];

    // Find existing log for this habit and date
    const existingLog = await prisma.habitLog.findUnique({
      where: {
        habitId_date: {
          habitId,
          date: targetDate
        }
      }
    });

    let isCompleted = completed !== undefined ? Boolean(completed) : true;
    if (completed === undefined && existingLog) {
      // Toggle if not specified
      isCompleted = !existingLog.completed;
    }

    const log = await prisma.habitLog.upsert({
      where: {
        habitId_date: {
          habitId,
          date: targetDate
        }
      },
      update: {
        completed: isCompleted
      },
      create: {
        habitId,
        userId: user.id,
        date: targetDate,
        completed: isCompleted
      }
    });

    const habit = await prisma.habit.findUnique({
      where: { id: habitId }
    });

    if (isCompleted && habit) {
      // Register immutable activity event
      try {
        await prisma.activityEvent.create({
          data: {
            userId: user.id,
            eventType: 'habit_logged',
            title: `Hábito Executado: ${habit.name}`,
            description: `Executado em ${targetDate}. Consistência acumulada com sucesso.`,
            lifeArea: habit.area,
            metadata: JSON.stringify({ habitId, date: targetDate })
          }
        });
      } catch {}
    }

    return NextResponse.json({
      ok: true,
      log,
      completed: isCompleted
    });
  } catch (err) {
    console.error('Error logging habit:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao registrar hábito' }, { status: 500 });
  }
}
