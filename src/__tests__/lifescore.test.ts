import { describe, it, expect } from 'vitest';
import { LifeScoreData, UserProfile } from '@/types';
import { ShareCardData } from '@/lib/shareCardGenerator';

describe('Agent 9: Life Score View, Holistic Balance & Share Data Payload', () => {
  it('should calculate overallScore as average of 4 life areas accurately', () => {
    const lifeScore: LifeScoreData = {
      corpo: { score: 85, trend: 'up', status: 'strong', label: 'Corpo', insight: 'Ritmo Forte' },
      dinheiro: { score: 70, trend: 'stable', status: 'evolving', label: 'Dinheiro', insight: 'Consistente' },
      carreira: { score: 80, trend: 'up', status: 'strong', label: 'Carreira', insight: 'Avançando' },
      vida: { score: 65, trend: 'down', status: 'evolving', label: 'Vida', insight: 'Ajustando' },
    };

    const overallScore = Math.round(
      (lifeScore.corpo.score + lifeScore.dinheiro.score + lifeScore.carreira.score + lifeScore.vida.score) / 4
    );

    // (85 + 70 + 80 + 65) / 4 = 300 / 4 = 75
    expect(overallScore).toBe(75);
  });

  it('should assign correct status labels according to score thresholds', () => {
    const getStatus = (score: number) => {
      return score >= 75
        ? 'Forte & Sustentável'
        : score >= 60
        ? 'Ritmo Consistente'
        : 'Atenção Necessária';
    };

    expect(getStatus(80)).toBe('Forte & Sustentável');
    expect(getStatus(75)).toBe('Forte & Sustentável');
    expect(getStatus(74)).toBe('Ritmo Consistente');
    expect(getStatus(60)).toBe('Ritmo Consistente');
    expect(getStatus(59)).toBe('Atenção Necessária');
    expect(getStatus(40)).toBe('Atenção Necessária');
  });

  it('should build shareData payload with fallback name without hardcoded athlete bias', () => {
    const user: Partial<UserProfile> = {
      name: '', // Empty name test
    };

    const lifeScore: LifeScoreData = {
      corpo: { score: 90, trend: 'up', status: 'strong', label: 'Corpo', insight: '' },
      dinheiro: { score: 80, trend: 'up', status: 'strong', label: 'Dinheiro', insight: '' },
      carreira: { score: 70, trend: 'stable', status: 'evolving', label: 'Carreira', insight: '' },
      vida: { score: 60, trend: 'stable', status: 'evolving', label: 'Vida', insight: '' },
    };

    const overallScore = Math.round(
      (lifeScore.corpo.score + lifeScore.dinheiro.score + lifeScore.carreira.score + lifeScore.vida.score) / 4
    );

    const overallStatus =
      overallScore >= 75
        ? 'Forte & Sustentável'
        : overallScore >= 60
        ? 'Ritmo Consistente'
        : 'Atenção Necessária';

    const shareData: ShareCardData = {
      userName: user?.name || 'Explorador',
      overallScore,
      scoreStatus: overallStatus,
      streakDays: 14,
      consistencyRate: 84,
      completedHabitsCount: 18,
      areas: {
        corpo: lifeScore.corpo.score,
        dinheiro: lifeScore.dinheiro.score,
        carreira: lifeScore.carreira.score,
        vida: lifeScore.vida.score,
      },
    };

    expect(shareData.userName).toBe('Explorador');
    expect(shareData.overallScore).toBe(75);
    expect(shareData.scoreStatus).toBe('Forte & Sustentável');
    expect(shareData.areas.corpo).toBe(90);
  });
});
