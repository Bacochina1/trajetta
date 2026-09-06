import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function runSeed() {
  console.log('🌱 Starting database seed...');

  const adminPasswordHash = await bcrypt.hash('TrajettaAdmin2026!', 10);
  const userPasswordHash = await bcrypt.hash('TrajettaUser2026!', 10);

  // Upsert Admin User (Jim)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@trajetta.app' },
    update: {
      name: 'Jim (Membro Fundador)',
      role: 'ADMIN',
      passwordHash: adminPasswordHash,
    },
    create: {
      email: 'admin@trajetta.app',
      name: 'Jim (Membro Fundador)',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    },
  });

  console.log(`✅ Admin account created: ${admin.email} (Role: ${admin.role})`);

  // Upsert Standard Demo User (Matheus)
  const matheus = await prisma.user.upsert({
    where: { email: 'matheus@trajetta.app' },
    update: {
      name: 'Matheus',
      passwordHash: userPasswordHash,
      role: 'USER',
    },
    create: {
      email: 'matheus@trajetta.app',
      name: 'Matheus',
      passwordHash: userPasswordHash,
      role: 'USER',
    },
  });

  // Seed default habits for Admin
  const existingHabits = await prisma.habit.count({ where: { userId: admin.id } });
  if (existingHabits === 0) {
    await prisma.habit.createMany({
      data: [
        {
          userId: admin.id,
          name: 'Treino de Força ou Corrida',
          area: 'Corpo',
          frequency: '4x por semana',
          targetValue: '60 min',
          streakWeeks: 9,
          completedDays: JSON.stringify(['2026-09-01', '2026-09-03', '2026-09-05']),
        },
        {
          userId: admin.id,
          name: 'Aporte Financeiro Semanal',
          area: 'Dinheiro',
          frequency: '1x por semana',
          targetValue: 'R$ 150 a R$ 300',
          streakWeeks: 14,
          completedDays: JSON.stringify(['2026-09-02']),
        },
        {
          userId: admin.id,
          name: 'Bloco de Foco Profundo Sem Notificações',
          area: 'Carreira',
          frequency: '5x por semana',
          targetValue: '90 min',
          streakWeeks: 6,
          completedDays: JSON.stringify(['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04']),
        },
        {
          userId: admin.id,
          name: 'Leitura de Livro ou Diário Noturno',
          area: 'Vida',
          frequency: '6x por semana',
          targetValue: '20 min',
          streakWeeks: 4,
          completedDays: JSON.stringify(['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-05']),
        },
      ],
    });
    console.log('✅ Default habits seeded for Admin');
  }

  // Seed default journey for Admin
  const existingJourneys = await prisma.journey.count({ where: { userId: admin.id } });
  if (existingJourneys === 0) {
    await prisma.journey.create({
      data: {
        userId: admin.id,
        title: '30 Dias de Movimento Consciente',
        area: 'Corpo',
        description: 'Prática ininterrupta de atividade física moderada ou intensa todo santo dia.',
        totalDays: 30,
        currentDay: 17,
        slipDays: 1,
        status: 'active',
      },
    });
    console.log('✅ Default journey seeded for Admin');
  }

  console.log('✨ Seed finished successfully!');
}

if (require.main === module) {
  runSeed()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
