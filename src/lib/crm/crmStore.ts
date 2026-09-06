import { prisma, ensureDbReady } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export interface CrmLead {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  source: string;
  status: 'waitlist' | 'vip' | 'contatado' | 'convertido' | 'arquivado';
  tags: string[];
  notes: string | null;
  position: number | null;
  createdAt: string;
  updatedAt: string;
}

const BACKUP_FILE = process.env.VERCEL
  ? path.join('/tmp', 'trajetta_crm_leads.json')
  : path.join(process.cwd(), 'prisma', 'trajetta_crm_leads.json');

function saveBackup(leads: CrmLead[]) {
  try {
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch (err) {
    console.warn('[CRM Backup warning]:', err);
  }
}

function loadBackup(): CrmLead[] {
  try {
    if (fs.existsSync(BACKUP_FILE)) {
      const raw = fs.readFileSync(BACKUP_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch {}
  return [];
}

export async function getAllLeads(): Promise<CrmLead[]> {
  await ensureDbReady();
  try {
    const dbLeads = await prisma.waitlist.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formatted: CrmLead[] = dbLeads.map((l) => {
      let tags: string[] = ['VIP', 'Lista de Espera'];
      try {
        if (l.tags) tags = JSON.parse(l.tags);
      } catch {}

      return {
        id: l.id,
        email: l.email,
        name: l.name,
        phone: l.phone,
        source: l.source,
        status: (l.status as CrmLead['status']) || 'waitlist',
        tags: Array.isArray(tags) ? tags : ['VIP'],
        notes: l.notes,
        position: l.position,
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
      };
    });

    if (formatted.length > 0) {
      saveBackup(formatted);
      return formatted;
    }

    return loadBackup();
  } catch (err) {
    console.error('[CRM getAllLeads error]:', err);
    return loadBackup();
  }
}

export async function saveLead(data: {
  email: string;
  name?: string;
  phone?: string;
  source?: string;
  status?: CrmLead['status'];
  tags?: string[];
  notes?: string;
  position?: number;
}): Promise<CrmLead> {
  await ensureDbReady();
  const cleanEmail = data.email.trim().toLowerCase();
  const defaultTags = data.tags && data.tags.length > 0 ? data.tags : ['VIP', 'Lista de Espera'];
  const tagsJson = JSON.stringify(defaultTags);

  const existing = await prisma.waitlist.findUnique({
    where: { email: cleanEmail },
  });

  let saved;
  if (existing) {
    saved = await prisma.waitlist.update({
      where: { email: cleanEmail },
      data: {
        name: data.name || existing.name,
        phone: data.phone || existing.phone,
        status: data.status || existing.status,
        tags: data.tags ? tagsJson : existing.tags,
        notes: data.notes !== undefined ? data.notes : existing.notes,
        position: data.position || existing.position,
      },
    });
  } else {
    saved = await prisma.waitlist.create({
      data: {
        email: cleanEmail,
        name: data.name || 'Membro VIP',
        phone: data.phone || null,
        source: data.source || 'landing_page',
        status: data.status || 'waitlist',
        tags: tagsJson,
        notes: data.notes || null,
        position: data.position || null,
      },
    });
  }

  let finalTags = defaultTags;
  try {
    if (saved.tags) finalTags = JSON.parse(saved.tags);
  } catch {}

  const result: CrmLead = {
    id: saved.id,
    email: saved.email,
    name: saved.name,
    phone: saved.phone,
    source: saved.source,
    status: (saved.status as CrmLead['status']) || 'waitlist',
    tags: Array.isArray(finalTags) ? finalTags : ['VIP'],
    notes: saved.notes,
    position: saved.position,
    createdAt: saved.createdAt.toISOString(),
    updatedAt: saved.updatedAt.toISOString(),
  };

  const backup = loadBackup().filter((l) => l.email !== cleanEmail);
  backup.unshift(result);
  saveBackup(backup);

  return result;
}

export async function updateLead(
  id: string,
  updates: Partial<Omit<CrmLead, 'id' | 'email' | 'createdAt'>>
): Promise<CrmLead | null> {
  await ensureDbReady();
  try {
    const dataToUpdate: any = {};
    if (updates.name !== undefined) dataToUpdate.name = updates.name;
    if (updates.phone !== undefined) dataToUpdate.phone = updates.phone;
    if (updates.status !== undefined) dataToUpdate.status = updates.status;
    if (updates.notes !== undefined) dataToUpdate.notes = updates.notes;
    if (updates.position !== undefined) dataToUpdate.position = updates.position;
    if (updates.tags !== undefined) dataToUpdate.tags = JSON.stringify(updates.tags);

    const updated = await prisma.waitlist.update({
      where: { id },
      data: dataToUpdate,
    });

    let tags = ['VIP'];
    try {
      if (updated.tags) tags = JSON.parse(updated.tags);
    } catch {}

    const lead: CrmLead = {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      phone: updated.phone,
      source: updated.source,
      status: (updated.status as CrmLead['status']) || 'waitlist',
      tags,
      notes: updated.notes,
      position: updated.position,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };

    const backup = loadBackup().map((l) => (l.id === id ? lead : l));
    saveBackup(backup);

    return lead;
  } catch (err) {
    console.error('[CRM updateLead error]:', err);
    return null;
  }
}

export async function deleteLead(id: string): Promise<boolean> {
  await ensureDbReady();
  try {
    await prisma.waitlist.delete({ where: { id } });
    const backup = loadBackup().filter((l) => l.id !== id);
    saveBackup(backup);
    return true;
  } catch (err) {
    console.error('[CRM deleteLead error]:', err);
    return false;
  }
}
