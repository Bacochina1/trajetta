import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { hashPassword, verifyPassword, createSessionToken, verifySessionToken, AuthSessionPayload } from '@/lib/auth/auth';

describe('Agent 1: Auth, Session, Security & Token Gate', () => {
  beforeEach(() => vi.stubEnv('JWT_SECRET', 'test-session-secret-with-sufficient-entropy'));
  afterEach(() => vi.unstubAllEnvs());

  it('should correctly hash and verify passwords', async () => {
    const rawPass = 'MinhaSenhaSegura2026!';
    const hash = await hashPassword(rawPass);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(rawPass);
    expect(hash.startsWith('$2')).toBe(true);

    const isMatch = await verifyPassword(rawPass, hash);
    expect(isMatch).toBe(true);

    const isWrong = await verifyPassword('SenhaErrada123', hash);
    expect(isWrong).toBe(false);
  });

  it('should generate and cryptographically verify a valid session JWT token', async () => {
    const payload: AuthSessionPayload = {
      userId: 'usr_test_123',
      email: 'explorador@trajetta.app',
      name: 'Explorador Real',
      role: 'USER',
    };

    const token = await createSessionToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3);

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe(payload.userId);
    expect(verified?.email).toBe(payload.email);
    expect(verified?.name).toBe(payload.name);
    expect(verified?.role).toBe(payload.role);
  });

  it('should reject tampered or invalid tokens', async () => {
    const fakeToken = 'invalid.jwt.token';
    const verified = await verifySessionToken(fakeToken);
    expect(verified).toBeNull();
  });

  it('does not issue or accept sessions without a configured signing secret', async () => {
    const token = await createSessionToken({
      userId: 'usr_test_123',
      email: 'explorador@trajetta.app',
      name: 'Explorador Real',
      role: 'USER',
    });
    vi.stubEnv('JWT_SECRET', '');

    await expect(verifySessionToken(token)).resolves.toBeNull();
    await expect(createSessionToken({
      userId: 'usr_test_123',
      email: 'explorador@trajetta.app',
      name: 'Explorador Real',
      role: 'USER',
    })).rejects.toThrow('JWT_SECRET must be configured');
  });
});
