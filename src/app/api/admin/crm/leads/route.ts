import { NextResponse } from 'next/server';
import { getAllLeads, saveLead, updateLead, deleteLead } from '@/lib/crm/crmStore';

const ADMIN_SECRET = 'TrajettaAdmin2026!';

function isAuthorized(req: Request): boolean {
  const authHeader = req.headers.get('authorization');
  const cookie = req.headers.get('cookie') || '';
  if (cookie.includes('trajetta_admin_session=authenticated')) return true;
  if (authHeader && authHeader.includes(ADMIN_SECRET)) return true;
  const url = new URL(req.url);
  if (url.searchParams.get('secret') === 'trajetta-admin-2026' || url.searchParams.get('secret') === ADMIN_SECRET) {
    return true;
  }
  return false;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const leads = await getAllLeads();
    return NextResponse.json({
      ok: true,
      total: leads.length,
      leads,
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const lead = await saveLead(body);
    return NextResponse.json({ ok: true, lead });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID do lead ausente' }, { status: 400 });
    }
    const updated = await updateLead(id, updates);
    return NextResponse.json({ ok: true, lead: updated });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: 'Não autorizado' }, { status: 401 });
  }

  try {
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
      return NextResponse.json({ ok: false, error: 'ID ausente' }, { status: 400 });
    }
    const success = await deleteLead(id);
    return NextResponse.json({ ok: success });
  } catch (error) {
    return NextResponse.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
