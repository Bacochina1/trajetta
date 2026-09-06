import { describe, it, expect, vi, beforeEach } from 'vitest';
import { syncLeadToManyChat, LeadPayload } from '@/lib/crm/manychatService';

describe('Trajetta CRM: ManyChat Integration Suite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('should format payload correctly and handle mock mode without errors', async () => {
    const originalApiKey = process.env.MANYCHAT_API_KEY;
    const originalEnabled = process.env.MANYCHAT_ENABLED;

    try {
      process.env.MANYCHAT_API_KEY = '';
      process.env.MANYCHAT_ENABLED = 'false';

      const lead: LeadPayload = {
        email: 'lead@trajetta.app',
        name: 'Matheus Bacochina',
        source: 'landing_page_waitlist',
        status: 'waitlist',
        position: 1482,
        tags: ['trajetta_lead', 'trajetta_waitlist_vip'],
        customFields: {
          trajetta_focus_area: 'Corpo',
        },
      };

      const result = await syncLeadToManyChat(lead);
      expect(result.success).toBe(true);
      expect(result.subscriberId).toBeDefined();
      expect(result.appliedTags).toContain('trajetta_waitlist_vip');
    } finally {
      process.env.MANYCHAT_API_KEY = originalApiKey;
      process.env.MANYCHAT_ENABLED = originalEnabled;
    }
  });

  it('should handle 401 Unauthorized gracefully without throwing or crashing', async () => {
    const originalApiKey = process.env.MANYCHAT_API_KEY;
    const originalEnabled = process.env.MANYCHAT_ENABLED;

    try {
      process.env.MANYCHAT_API_KEY = '12430795:invalid_token_test';
      process.env.MANYCHAT_ENABLED = 'true';

      // Mock fetch to simulate ManyChat 401 Wrong token response
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        text: () => Promise.resolve('{"status":"error","message":"Wrong token"}'),
      } as any);

      const lead: LeadPayload = {
        email: 'founder@trajetta.app',
        name: 'Founder VIP',
        status: 'registered',
      };

      const result = await syncLeadToManyChat(lead);
      // Result should be caught gracefully
      expect(result.success).toBe(false);
      expect(result.error).toContain('401');
    } finally {
      process.env.MANYCHAT_API_KEY = originalApiKey;
      process.env.MANYCHAT_ENABLED = originalEnabled;
    }
  });

  it('should create subscriber, set custom fields, and apply tags on successful API response', async () => {
    const originalApiKey = process.env.MANYCHAT_API_KEY;
    const originalEnabled = process.env.MANYCHAT_ENABLED;

    try {
      process.env.MANYCHAT_API_KEY = '12430795:valid_token_test';
      process.env.MANYCHAT_ENABLED = 'true';

      const fetchMock = vi.fn().mockImplementation((url: string) => {
        if (url.includes('createSubscriber')) {
          return Promise.resolve({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ status: 'success', data: { id: 987654321 } }),
          });
        }
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve({ status: 'success' }),
        });
      });

      global.fetch = fetchMock as any;

      const lead: LeadPayload = {
        email: 'pro@trajetta.app',
        name: 'Ana Silva',
        phone: '+5511988887777',
        source: 'landing_page',
        status: 'waitlist',
        tags: ['trajetta_lead', 'trajetta_waitlist_vip'],
        customFields: {
          trajetta_focus_area: 'Carreira',
        },
      };

      const result = await syncLeadToManyChat(lead);
      expect(result.success).toBe(true);
      expect(result.subscriberId).toBe(987654321);
      expect(result.isNew).toBe(true);

      // Verify createSubscriber was called
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/subscriber/createSubscriber'),
        expect.objectContaining({
          method: 'POST',
        })
      );

      // Verify addTagByName was called
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/subscriber/addTagByName'),
        expect.objectContaining({
          method: 'POST',
        })
      );
    } finally {
      process.env.MANYCHAT_API_KEY = originalApiKey;
      process.env.MANYCHAT_ENABLED = originalEnabled;
    }
  });
});
