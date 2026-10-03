import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma, ensureDbReady } from '../db';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'trajetta-super-secret-production-jwt-key-2026'
);

export const AUTH_COOKIE_NAME = 'trajetta_session';

export interface AuthSessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSessionToken(payload: AuthSessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(JWT_SECRET);
}

export async function verifySessionToken(token: string): Promise<AuthSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = await verifySessionToken(token);
    if (!payload?.userId) return null;

    try {
      await ensureDbReady();
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          subscriptionStatus: true,
          createdAt: true,
        },
      });

      // If user exists and email matches the cryptographically signed JWT email
      if (user && user.email.toLowerCase() === payload.email.toLowerCase()) {
        return user;
      }

      // If user not found in DB or email mismatch, token is invalid/revoked
      return null;
    } catch (dbErr) {
      console.warn('[Auth Session] Database check error:', dbErr);
      return null;
    }
  } catch {
    return null;
  }
}
