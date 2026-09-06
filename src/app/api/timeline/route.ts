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

    // Retrieve events from ActivityEvent and map to TimelineEvent format
    const rawEvents = await prisma.activityEvent.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    const timeline = rawEvents.map(e => {
      const d = new Date(e.createdAt);
      return {
        id: e.id,
        date: d.toISOString().split('T')[0],
        year: d.getFullYear(),
        month: months[d.getMonth()],
        title: e.title,
        description: e.description || '',
        type: e.eventType,
        lifeArea: e.lifeArea || 'corpo',
        tag: e.eventType.replace('_', ' ').toUpperCase()
      };
    });

    return NextResponse.json({ ok: true, timeline });
  } catch (err) {
    console.error('Error fetching timeline:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao buscar linha do tempo' }, { status: 500 });
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
    const { title, description, lifeArea, date } = body;

    if (!title) {
      return NextResponse.json({ ok: false, error: 'Título é obrigatório' }, { status: 400 });
    }

    const eventDate = date ? new Date(date) : new Date();

    const event = await prisma.activityEvent.create({
      data: {
        userId: user.id,
        eventType: 'life_event',
        title: title.trim(),
        description: description || '',
        lifeArea: lifeArea || 'vida',
        createdAt: eventDate
      }
    });

    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const formatted = {
      id: event.id,
      date: eventDate.toISOString().split('T')[0],
      year: eventDate.getFullYear(),
      month: months[eventDate.getMonth()],
      title: event.title,
      description: event.description,
      type: 'life_event',
      lifeArea: event.lifeArea,
      tag: 'Marco Pessoal'
    };

    return NextResponse.json({ ok: true, event: formatted });
  } catch (err) {
    console.error('Error creating timeline event:', err);
    return NextResponse.json({ ok: false, error: 'Erro ao criar evento na linha do tempo' }, { status: 500 });
  }
}
