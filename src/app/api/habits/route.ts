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

    // Get habits with their logs
    const habits = await prisma.habit.findMany({
      where: { userId: user.id },
      include: {
        logs: {
          orderBy: { date: 'desc' },
          take: 90
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Compute today's index & current week's dates
    const now = new Date();
    const currentDayOfWeek = now.getDay(); // 0 = Sunday
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - currentDayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const formattedHabits = habits.map(h => {
      const daysCompletedThisWeek: number[] = [];
      let totalCompletedAllTime = 0;

      h.logs.forEach(log => {
        if (log.completed) {
          totalCompletedAllTime++;
          const logDate = new Date(log.date + 'T12:00:00Z');
          if (logDate >= startOfWeek) {
            const dayIdx = logDate.getDay();
            if (!daysCompletedThisWeek.includes(dayIdx)) {
              daysCompletedThisWeek.push(dayIdx);
            }
          }
        }
      });

      return {
        id: h.id,
        title: h.name,
        name: h.name,
        lifeArea: h.area,
        area: h.area,
        frequency: h.frequency,
        frequencyPerWeek: h.frequencyPerWeek,
        targetDescription: h.targetValue || `${h.frequencyPerWeek}x por semana`,
        targetValue: h.targetValue,
        streakWeeks: h.streakWeeks,
        daysCompletedThisWeek,
        totalCompletedAllTime,
        iconName: h.iconName || 'Repeat',
        createdAt: h.createdAt
      };
    });

    return NextResponse.json({ ok: true, habits: formattedHabits });
  } catch (err) {
    console.error('Error fetching habits:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao buscar hábitos' }, { status: 500 });
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
    const { title, name, area, lifeArea, frequencyPerWeek, targetDescription, targetValue, iconName } = body;

    const habitName = (title || name || '').trim();
    const habitArea = area || lifeArea || 'corpo';

    if (!habitName) {
      return NextResponse.json({ ok: false, error: 'Nome do hábito é obrigatório' }, { status: 400 });
    }

    const freq = Number(frequencyPerWeek) || 4;
    const target = targetDescription || targetValue || `${freq}x por semana`;

    const newHabit = await prisma.habit.create({
      data: {
        userId: user.id,
        name: habitName,
        area: habitArea,
        frequency: `${freq}x`,
        frequencyPerWeek: freq,
        targetValue: target,
        iconName: iconName || 'Repeat',
        completedDays: '[]'
      }
    });

    // Record immutable activity event
    try {
      await prisma.activityEvent.create({
        data: {
          userId: user.id,
          eventType: 'habit_created',
          title: `Novo Hábito: ${newHabit.name}`,
          description: `Hábito criado na área ${newHabit.area} com frequência de ${newHabit.frequencyPerWeek}x por semana.`,
          lifeArea: newHabit.area,
          metadata: JSON.stringify({ habitId: newHabit.id, frequency: newHabit.frequencyPerWeek })
        }
      });
    } catch {}

    return NextResponse.json({
      ok: true,
      habit: {
        id: newHabit.id,
        title: newHabit.name,
        name: newHabit.name,
        lifeArea: newHabit.area,
        area: newHabit.area,
        frequency: newHabit.frequency,
        frequencyPerWeek: newHabit.frequencyPerWeek,
        targetDescription: newHabit.targetValue,
        targetValue: newHabit.targetValue,
        streakWeeks: 0,
        daysCompletedThisWeek: [],
        totalCompletedAllTime: 0,
        iconName: newHabit.iconName
      }
    });
  } catch (err) {
    console.error('Error creating habit:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao criar hábito' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await ensureDbReady();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 });
    }

    const body = await req.json();
    const { id, title, name, area, frequencyPerWeek, targetValue } = body;

    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID do hábito é obrigatório' }, { status: 400 });
    }

    const updateData: any = {};
    if (title || name) updateData.name = (title || name).trim();
    if (area) updateData.area = area;
    if (frequencyPerWeek) {
      updateData.frequencyPerWeek = Number(frequencyPerWeek);
      updateData.frequency = `${frequencyPerWeek}x`;
    }
    if (targetValue) updateData.targetValue = targetValue;

    const updated = await prisma.habit.update({
      where: { id, userId: user.id },
      data: updateData
    });

    return NextResponse.json({ ok: true, habit: updated });
  } catch (err) {
    console.error('Error updating habit:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao atualizar hábito' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await ensureDbReady();
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID do hábito é obrigatório' }, { status: 400 });
    }

    await prisma.habit.delete({
      where: { id, userId: user.id }
    });

    return NextResponse.json({ ok: true, deletedId: id });
  } catch (err) {
    console.error('Error deleting habit:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao deletar hábito' }, { status: 500 });
  }
}
