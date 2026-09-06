import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  dbInitialized: boolean | undefined;
};

function createClient(): PrismaClient {
  if (process.env.VERCEL) {
    const tmpDbPath = path.join('/tmp', 'dev.db');
    try {
      if (!fs.existsSync(tmpDbPath)) {
        const src = path.join(process.cwd(), 'prisma', 'dev.db');
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, tmpDbPath);
        }
      }
    } catch {
      // fallback to automatic schema initialization
    }
    return new PrismaClient({
      datasources: {
        db: {
          url: `file:${tmpDbPath}`,
        },
      },
    });
  }

  return new PrismaClient();
}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Ensures tables exist and admin user is seeded on serverless environments
 */
export async function ensureDbReady(): Promise<void> {
  if (globalForPrisma.dbInitialized) return;

  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "passwordHash" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'USER',
        "avatar" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Waitlist" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "email" TEXT NOT NULL,
        "name" TEXT,
        "source" TEXT NOT NULL DEFAULT 'landing_page',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "Waitlist_email_key" ON "Waitlist"("email");`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Habit" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "area" TEXT NOT NULL,
        "frequency" TEXT NOT NULL,
        "targetValue" TEXT NOT NULL,
        "streakWeeks" INTEGER NOT NULL DEFAULT 0,
        "completedDays" TEXT NOT NULL DEFAULT '[]',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        CONSTRAINT "Habit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Goal" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "area" TEXT NOT NULL,
        "whyItMatters" TEXT NOT NULL,
        "targetMetric" TEXT NOT NULL,
        "milestones" TEXT NOT NULL,
        "currentMilestoneIndex" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        CONSTRAINT "Goal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Journey" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "area" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "totalDays" INTEGER NOT NULL DEFAULT 30,
        "currentDay" INTEGER NOT NULL DEFAULT 1,
        "slipDays" INTEGER NOT NULL DEFAULT 0,
        "status" TEXT NOT NULL DEFAULT 'active',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        CONSTRAINT "Journey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "WeeklyReview" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "weekNumber" INTEGER NOT NULL,
        "year" INTEGER NOT NULL,
        "wins" TEXT NOT NULL,
        "challenges" TEXT NOT NULL,
        "aiReflection" TEXT NOT NULL,
        "northStarWeeks" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "WeeklyReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "DailyLog" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "date" TEXT NOT NULL,
        "quickNote" TEXT NOT NULL,
        "consistencyScore" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "DailyLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);

    // Ensure Admin Jim exists
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@trajetta.app' },
    });

    if (!admin) {
      await prisma.user.create({
        data: {
          id: 'cmtp970550000cd7k2oor3pck',
          email: 'admin@trajetta.app',
          name: 'Jim (Membro Fundador)',
          passwordHash: '$2b$10$ppLmRuMDdS4U/0jKVwao2uQctVGLP/8sQgfQGnLpHdWqdBjqA6CKq',
          role: 'ADMIN',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          updatedAt: new Date(),
        },
      });
    }

    globalForPrisma.dbInitialized = true;
  } catch (error) {
    console.warn('ensureDbReady notice:', error);
  }
}

