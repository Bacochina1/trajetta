import { NextResponse } from 'next/server';
import { generateWeeklyReviewReflection } from '@/lib/ai/aiService';

export async function POST(req: Request) {
  try {
    const { wins, challenges, completedRatio, streakWeeks } = await req.json();

    const reflection = await generateWeeklyReviewReflection({
      wins: String(wins || ''),
      challenges: String(challenges || ''),
      completedRatio: String(completedRatio || '75%'),
      streakWeeks: Number(streakWeeks || 14),
    });

    return NextResponse.json({ ok: true, reflection });
  } catch (error) {
    console.error('AI review endpoint error:', error);
    return NextResponse.json(
      { ok: false, error: 'Erro ao gerar reflexão de revisão com a IA.' },
      { status: 500 }
    );
  }
}
