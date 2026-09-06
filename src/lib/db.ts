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

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "UserMemory" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "memoryType" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "embedding" TEXT,
        "importance" REAL NOT NULL DEFAULT 0.5,
        "confidence" REAL NOT NULL DEFAULT 0.8,
        "source" TEXT,
        "sourceId" TEXT,
        "lastAccessedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        CONSTRAINT "UserMemory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "UserMemory_userId_memoryType_idx" ON "UserMemory"("userId", "memoryType");`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "UserContextSummary" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "summary" TEXT NOT NULL,
        "focusAreas" TEXT NOT NULL DEFAULT '[]',
        "keyDifficulties" TEXT NOT NULL DEFAULT '[]',
        "keyWins" TEXT NOT NULL DEFAULT '[]',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        CONSTRAINT "UserContextSummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "UserContextSummary_userId_key" ON "UserContextSummary"("userId");`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "GoalMilestone" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "goalId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "targetValue" TEXT,
        "completed" BOOLEAN NOT NULL DEFAULT 0,
        "order" INTEGER NOT NULL DEFAULT 0,
        "completedAt" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        CONSTRAINT "GoalMilestone_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "GoalMilestone_goalId_idx" ON "GoalMilestone"("goalId");`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "GoalAction" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "goalId" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "isControllable" BOOLEAN NOT NULL DEFAULT 1,
        "dayOfWeek" INTEGER,
        "completedToday" BOOLEAN NOT NULL DEFAULT 0,
        "lastCompletedDate" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        CONSTRAINT "GoalAction_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "GoalAction_goalId_idx" ON "GoalAction"("goalId");`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "HabitLog" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "habitId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "date" TEXT NOT NULL,
        "completed" BOOLEAN NOT NULL DEFAULT 1,
        "notes" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "HabitLog_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "HabitLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "HabitLog_habitId_date_key" ON "HabitLog"("habitId", "date");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "HabitLog_userId_date_idx" ON "HabitLog"("userId", "date");`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "JourneyLog" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "journeyId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "dayNumber" INTEGER NOT NULL,
        "date" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "notes" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "JourneyLog_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "JourneyLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "JourneyLog_journeyId_idx" ON "JourneyLog"("journeyId");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "JourneyLog_userId_idx" ON "JourneyLog"("userId");`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "WeeklyPlan" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "weekNumber" INTEGER NOT NULL,
        "year" INTEGER NOT NULL,
        "northStarGoal" TEXT,
        "areaPriorities" TEXT NOT NULL DEFAULT '{}',
        "perceivedCapacity" TEXT NOT NULL DEFAULT 'normal',
        "weekIntention" TEXT,
        "isCompleted" BOOLEAN NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL,
        CONSTRAINT "WeeklyPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "WeeklyPlan_userId_weekNumber_year_key" ON "WeeklyPlan"("userId", "weekNumber", "year");`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "WeeklySnapshot" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "weekNumber" INTEGER NOT NULL,
        "year" INTEGER NOT NULL,
        "actionsPlanned" INTEGER NOT NULL DEFAULT 0,
        "actionsCompleted" INTEGER NOT NULL DEFAULT 0,
        "habitsActive" INTEGER NOT NULL DEFAULT 0,
        "habitsCompleted" INTEGER NOT NULL DEFAULT 0,
        "focusAreas" TEXT NOT NULL DEFAULT '[]',
        "summary" TEXT NOT NULL,
        "rawSnapshotJson" TEXT NOT NULL DEFAULT '{}',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "WeeklySnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "WeeklySnapshot_userId_year_weekNumber_idx" ON "WeeklySnapshot"("userId", "year", "weekNumber");`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ActivityEvent" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "eventType" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "lifeArea" TEXT,
        "metadata" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "ActivityEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "ActivityEvent_userId_eventType_idx" ON "ActivityEvent"("userId", "eventType");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "ActivityEvent_userId_createdAt_idx" ON "ActivityEvent"("userId", "createdAt");`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "EmailLog" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT,
        "to" TEXT NOT NULL,
        "subject" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "providerId" TEXT,
        "error" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "EmailLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "EmailLog_to_idx" ON "EmailLog"("to");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "EmailLog_createdAt_idx" ON "EmailLog"("createdAt");`);

    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "FeatureFlag" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "key" TEXT NOT NULL,
        "enabled" BOOLEAN NOT NULL DEFAULT 0,
        "description" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "FeatureFlag_key_key" ON "FeatureFlag"("key");`);

    // Ensure Default Core & Admin Users exist in every runtime container
    const defaultUsers = [
      {
        id: 'cmtp970550000cd7k2oor3pck',
        email: 'admin@trajetta.app',
        name: 'Jim (Membro Fundador)',
        passwordHash: '$2b$10$ppLmRuMDdS4U/0jKVwao2uQctVGLP/8sQgfQGnLpHdWqdBjqA6CKq', // TrajettaAdmin2026!
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      },
      {
        id: 'cmtp970550001cd7k2oor3pma',
        email: 'bacochinamatheus@gmail.com',
        name: 'Matheus Bacochina',
        passwordHash: '$2b$10$aRcuFXP02ED9N.yQAPsxRuGcQleItzLVpvz7rA7jhcrd99UsVcIx.', // Trajetta2026!
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
      },
      {
        id: 'cmtp970550002cd7k2oor3pco',
        email: 'companytrajetta@gmail.com',
        name: 'Matheus Trajetta',
        passwordHash: '$2b$10$aRcuFXP02ED9N.yQAPsxRuGcQleItzLVpvz7rA7jhcrd99UsVcIx.', // Trajetta2026!
        role: 'ADMIN',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256',
      }
    ];

    for (const u of defaultUsers) {
      const exists = await prisma.user.findUnique({ where: { email: u.email } });
      if (!exists) {
        await prisma.user.create({
          data: {
            id: u.id,
            email: u.email,
            name: u.name,
            passwordHash: u.passwordHash,
            role: u.role,
            avatar: u.avatar,
            updatedAt: new Date(),
          },
        });
      }
    }

    globalForPrisma.dbInitialized = true;
  } catch (error) {
    console.warn('ensureDbReady notice:', error);
  }
}

