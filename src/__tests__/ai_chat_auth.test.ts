import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/lib/auth/auth', () => ({ getSessionUser: vi.fn() }));
vi.mock('@/lib/ai/aiService', () => ({ callGeminiAI: vi.fn() }));
vi.mock('@/lib/ai/memoryService', () => ({
  memoryService: { assembleContextPack: vi.fn(), extractAndSaveChatMemory: vi.fn() },
}));

import { getSessionUser } from '@/lib/auth/auth';
import { callGeminiAI } from '@/lib/ai/aiService';
import { POST } from '@/app/api/ai/chat/route';

describe('AI chat access', () => {
  beforeEach(() => vi.clearAllMocks());

  it('rejects callers without a session before invoking the paid AI API', async () => {
    vi.mocked(getSessionUser).mockResolvedValue(null);
    const request = new Request('http://localhost/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [{ role: 'user', content: 'Hello' }] }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(callGeminiAI).not.toHaveBeenCalled();
  });
});
