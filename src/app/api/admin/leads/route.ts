import { NextResponse } from 'next/server';
import { prisma, ensureDbReady } from '@/lib/db';

// Simple secret-based protection
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'trajetta-admin-2026';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const secret = url.searchParams.get('secret');

  if (secret !== ADMIN_SECRET) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await ensureDbReady();
    const leads = await prisma.waitlist.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      ok: true,
      total: leads.length,
      leads,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
