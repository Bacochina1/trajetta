import { prisma } from '../db';

export type MemoryCategory =
  | 'preference'
  | 'goal'
  | 'behavior_pattern'
  | 'difficulty'
  | 'achievement'
  | 'life_context'
  | 'decision'
  | 'relationship'
  | 'routine'
  | 'motivation'
  | 'constraint';

export interface ContextPack {
  livingSummary: string;
  focusAreas: string[];
  structuredData: {
    goals: Array<{ title: string; area: string; progress: number; whyItMatters: string }>;
    habits: Array<{ name: string; area: string; streakWeeks: number; frequency: string }>;
    recentConsistency: number;
    lastReviewReflection?: string;
  };
  relevantMemories: Array<{
    id: string;
    memoryType: MemoryCategory;
    content: string;
    importance: number;
    confidence: number;
    relevanceScore: number;
  }>;
  currentQuery: string;
}

function calculateTextSimilarity(text1: string, text2: string): number {
  const set1 = new Set(text1.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  const set2 = new Set(text2.toLowerCase().split(/\s+/).filter(w => w.length > 2));
  if (set1.size === 0 || set2.size === 0) return 0.1;

  let common = 0;
  set1.forEach(word => {
    if (set2.has(word)) common++;
  });

  const jaccard = common / (set1.size + set2.size - common);
  return Math.min(1.0, Math.max(0.1, jaccard * 1.8 + 0.15));
}

function calculateFreshness(date: Date): number {
  const diffDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  return Math.exp(-diffDays / 90);
}

export const memoryService = {
  async getMemories(userId: string, category?: MemoryCategory) {
    try {
      const where: Record<string, unknown> = { userId };
      if (category) where.memoryType = category;

      return await prisma.userMemory.findMany({
        where,
        orderBy: [{ importance: 'desc' }, { updatedAt: 'desc' }],
      });
    } catch (e) {
      console.warn('Could not fetch user memories:', e);
      return [];
    }
  },

  async addMemory(
    userId: string,
    data: {
      memoryType: MemoryCategory;
      content: string;
      importance?: number;
      confidence?: number;
      source?: string;
      sourceId?: string;
    }
  ) {
    try {
      return await prisma.userMemory.create({
        data: {
          userId,
          memoryType: data.memoryType,
          content: data.content,
          importance: data.importance ?? 0.5,
          confidence: data.confidence ?? 0.8,
          source: data.source ?? 'user_input',
          sourceId: data.sourceId,
        },
      });
    } catch (e) {
      console.error('Error creating user memory:', e);
      return null;
    }
  },

  async updateMemory(
    userId: string,
    memoryId: string,
    data: Partial<{
      content: string;
      memoryType: string;
      importance: number;
      confidence: number;
    }>
  ) {
    try {
      return await prisma.userMemory.updateMany({
        where: { id: memoryId, userId },
        data: {
          ...data,
          lastAccessedAt: new Date(),
          updatedAt: new Date(),
        },
      });
    } catch (e) {
      console.error('Error updating user memory:', e);
      return null;
    }
  },

  async deleteMemory(userId: string, memoryId: string) {
    try {
      return await prisma.userMemory.deleteMany({
        where: { id: memoryId, userId },
      });
    } catch (e) {
      console.error('Error deleting user memory:', e);
      return null;
    }
  },

  async deleteAllMemories(userId: string) {
    try {
      return await prisma.userMemory.deleteMany({
        where: { userId },
      });
    } catch (e) {
      console.error('Error purging user memories:', e);
      return null;
    }
  },

  async getLivingSummary(userId: string) {
    try {
      const existing = await prisma.userContextSummary.findUnique({
        where: { userId },
      });
      if (existing) return existing;

      return await prisma.userContextSummary.create({
        data: {
          userId,
          summary:
            'Usuário atualmente focado em saúde (corpo) e carreira. Construindo consistência de hábitos com rotina sustentável. Busca correr sua primeira meia maratona e consolidar patrimônio.',
          focusAreas: JSON.stringify(['corpo', 'carreira', 'dinheiro']),
          keyDifficulties: JSON.stringify(['Demandas de trabalho de alta intensidade que tendem a pressionar horários de treino']),
          keyWins: JSON.stringify(['Consistência de 4x treinos semanais sustentada']),
        },
      });
    } catch (e) {
      console.warn('Error reading living summary:', e);
      return {
        id: 'fallback-summary',
        userId,
        summary: 'Usuário focado em consistência de hábitos, metas de longo prazo e equilíbrio sustentável.',
        focusAreas: '["corpo","carreira"]',
        keyDifficulties: '[]',
        keyWins: '[]',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
  },

  async assembleContextPack(userId: string, queryMessage: string): Promise<ContextPack> {
    const summaryRecord = await this.getLivingSummary(userId);
    let focusAreas: string[] = ['corpo', 'carreira', 'dinheiro', 'vida'];
    try {
      focusAreas = JSON.parse(summaryRecord.focusAreas);
    } catch {
      // fallback
    }

    const [goals, habits, lastReview] = await Promise.all([
      prisma.goal.findMany({
        where: { userId },
        take: 5,
        orderBy: { updatedAt: 'desc' },
      }).catch(() => []),
      prisma.habit.findMany({
        where: { userId },
        take: 8,
        orderBy: { streakWeeks: 'desc' },
      }).catch(() => []),
      prisma.weeklyReview.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      }).catch(() => null),
    ]);

    const structuredGoals = goals.map(g => {
      let progress = 50;
      try {
        const milestones = JSON.parse(g.milestones || '[]');
        if (milestones.length > 0) {
          const completed = milestones.filter((m: { completed?: boolean }) => m.completed).length;
          progress = Math.round((completed / milestones.length) * 100);
        }
      } catch {
        // ignore
      }
      return {
        title: g.title,
        area: g.area,
        progress,
        whyItMatters: g.whyItMatters,
      };
    });

    const structuredHabits = habits.map(h => ({
      name: h.name,
      area: h.area,
      streakWeeks: h.streakWeeks,
      frequency: h.frequency,
    }));

    const allMemories = await this.getMemories(userId);
    const rankedMemories = allMemories
      .map(m => {
        const similarity = calculateTextSimilarity(queryMessage, m.content);
        const freshness = calculateFreshness(m.updatedAt || m.createdAt);
        const relevanceScore = similarity * m.importance * freshness * m.confidence;

        return {
          id: m.id,
          memoryType: m.memoryType as MemoryCategory,
          content: m.content,
          importance: m.importance,
          confidence: m.confidence,
          relevanceScore,
        };
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 6);

    return {
      livingSummary: summaryRecord.summary,
      focusAreas,
      structuredData: {
        goals: structuredGoals,
        habits: structuredHabits,
        recentConsistency: 82,
        lastReviewReflection: lastReview?.aiReflection || undefined,
      },
      relevantMemories: rankedMemories,
      currentQuery: queryMessage,
    };
  },
};
