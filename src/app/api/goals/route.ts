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

    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      include: {
        milestones: { orderBy: { order: 'asc' } },
        actions: { orderBy: { order: 'asc' } }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ ok: true, goals });
  } catch (err) {
    console.error('Error fetching goals:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao buscar metas' }, { status: 500 });
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
    const { title, area, whyItMatters, priority, targetDate, milestones, actions } = body;

    if (!title || !area) {
      return NextResponse.json({ ok: false, error: 'Título e área são obrigatórios' }, { status: 400 });
    }

    const newGoal = await prisma.goal.create({
      data: {
        userId: user.id,
        title: title.trim(),
        area: area || 'corpo',
        whyItMatters: whyItMatters || '',
        priority: priority || 'principal',
        status: 'active',
        progress: 0,
        targetDate: targetDate || null,
        milestones: {
          create: (milestones || []).map((m: any, idx: number) => ({
            title: typeof m === 'string' ? m : m.title,
            targetValue: m.targetValue || null,
            completed: Boolean(m.completed),
            order: idx
          }))
        },
        actions: {
          create: (actions || []).map((a: any, idx: number) => ({
            title: typeof a === 'string' ? a : a.title,
            isControllable: a.isControllable !== undefined ? Boolean(a.isControllable) : true,
            dayOfWeek: a.dayOfWeek !== undefined ? Number(a.dayOfWeek) : null,
            order: idx
          }))
        }
      },
      include: {
        milestones: true,
        actions: true
      }
    });

    // Register immutable activity event
    try {
      await prisma.activityEvent.create({
        data: {
          userId: user.id,
          eventType: 'goal_created',
          title: `Nova Meta: ${newGoal.title}`,
          description: `Meta cadastrada na área ${newGoal.area} com prioridade ${newGoal.priority}. Por quê: ${newGoal.whyItMatters || 'Não especificado'}`,
          lifeArea: newGoal.area,
          metadata: JSON.stringify({ goalId: newGoal.id, priority: newGoal.priority })
        }
      });
    } catch {}

    return NextResponse.json({ ok: true, goal: newGoal });
  } catch (err) {
    console.error('Error creating goal:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao criar meta' }, { status: 500 });
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
    const { goalId, milestoneId, actionId, completed, progress, priority, status } = body;

    if (!goalId) {
      return NextResponse.json({ ok: false, error: 'goalId é obrigatório' }, { status: 400 });
    }

    // Toggle milestone
    if (milestoneId) {
      const ms = await prisma.goalMilestone.update({
        where: { id: milestoneId },
        data: {
          completed: Boolean(completed),
          completedAt: completed ? new Date() : null
        }
      });

      // Recalculate goal progress
      const allMs = await prisma.goalMilestone.findMany({ where: { goalId } });
      const completedCount = allMs.filter(m => m.completed).length;
      const newProgress = allMs.length > 0 ? Math.round((completedCount / allMs.length) * 100) : 0;

      await prisma.goal.update({
        where: { id: goalId },
        data: { progress: newProgress }
      });

      if (completed) {
        try {
          await prisma.activityEvent.create({
            data: {
              userId: user.id,
              eventType: 'milestone_completed',
              title: `Marco Concluído: ${ms.title}`,
              description: `Marco da meta concluído com sucesso. Progresso atualizado para ${newProgress}%`,
              metadata: JSON.stringify({ goalId, milestoneId, newProgress })
            }
          });
        } catch {}
      }

      return NextResponse.json({ ok: true, milestone: ms, progress: newProgress });
    }

    // Toggle action
    if (actionId) {
      const act = await prisma.goalAction.update({
        where: { id: actionId },
        data: {
          completedToday: Boolean(completed),
          lastCompletedDate: completed ? new Date().toISOString().split('T')[0] : null
        }
      });

      if (completed) {
        try {
          await prisma.activityEvent.create({
            data: {
              userId: user.id,
              eventType: 'action_completed',
              title: `Ação Executada: ${act.title}`,
              description: 'Ação executada no dia de hoje.',
              metadata: JSON.stringify({ goalId, actionId })
            }
          });
        } catch {}
      }

      return NextResponse.json({ ok: true, action: act });
    }

    // General goal patch (progress, priority, status)
    const updateData: any = {};
    if (progress !== undefined) updateData.progress = Number(progress);
    if (priority) updateData.priority = priority;
    if (status) updateData.status = status;

    const updated = await prisma.goal.update({
      where: { id: goalId, userId: user.id },
      data: updateData,
      include: { milestones: true, actions: true }
    });

    return NextResponse.json({ ok: true, goal: updated });
  } catch (err) {
    console.error('Error updating goal:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao atualizar meta' }, { status: 500 });
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
      return NextResponse.json({ ok: false, error: 'ID da meta é obrigatório' }, { status: 400 });
    }

    await prisma.goal.delete({
      where: { id, userId: user.id }
    });

    return NextResponse.json({ ok: true, deletedId: id });
  } catch (err) {
    console.error('Error deleting goal:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao deletar meta' }, { status: 500 });
  }
}
