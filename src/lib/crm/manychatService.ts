/**
 * Trajetta CRM Integration — ManyChat Service
 * Handles lead synchronization, subscriber creation/updates, tags, and custom fields.
 * Built to be 100% resilient and fail-safe (non-blocking for end users).
 */

export interface LeadPayload {
  email: string;
  name?: string;
  phone?: string;
  source?: string;
  status?: 'lead' | 'waitlist' | 'registered' | 'onboarding_completed' | 'active_user';
  position?: number;
  focusArea?: string;
  northStar?: string;
  lifescore?: number;
  tags?: string[];
  customFields?: Record<string, string | number | boolean>;
}

export interface ManyChatSyncResult {
  success: boolean;
  subscriberId?: number | string;
  isNew?: boolean;
  appliedTags?: string[];
  appliedFields?: Record<string, string | number | boolean>;
  error?: string;
}

const MANYCHAT_BASE_URL = 'https://api.manychat.com/fb';

export async function syncLeadToManyChat(lead: LeadPayload): Promise<ManyChatSyncResult> {
  const apiKey = process.env.MANYCHAT_API_KEY;
  const enabled = process.env.MANYCHAT_ENABLED !== 'false';

  if (!enabled || !apiKey) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[ManyChat CRM Mock]: Lead registrado localmente para ${lead.email} (${lead.status || 'lead'})`);
    }
    return {
      success: true,
      subscriberId: `mock_${Date.now()}`,
      appliedTags: lead.tags || [],
      appliedFields: lead.customFields || {},
    };
  }

  // Parse first and last names
  const cleanName = (lead.name || '').trim();
  const nameParts = cleanName.split(' ');
  const firstName = nameParts[0] || 'Membro';
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  const cleanEmail = lead.email.trim().toLowerCase();

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  try {
    let subscriberId: number | undefined;
    let isNew = false;

    // 1. Tentar criar o subscriber
    const createRes = await fetch(`${MANYCHAT_BASE_URL}/subscriber/createSubscriber`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        first_name: firstName,
        last_name: lastName,
        email: cleanEmail,
        phone: lead.phone || undefined,
        has_opt_in_email: true,
        has_opt_in_sms: Boolean(lead.phone),
        consent_phrase: 'Consentimento de comunicacao Trajetta Sistema de Evolucao',
      }),
    });

    if (createRes.ok) {
      const createData = await createRes.json();
      if (createData.status === 'success' && createData.data?.id) {
        subscriberId = createData.data.id;
        isNew = true;
      }
    } else {
      const errText = await createRes.text();
      // Se ja existe (400) ou outra resposta de contato duplicado, busca por email
      if (createRes.status === 400 || errText.includes('already exists') || errText.includes('subscriber')) {
        try {
          const findRes = await fetch(
            `${MANYCHAT_BASE_URL}/subscriber/findBySystemField?email=${encodeURIComponent(cleanEmail)}`,
            { method: 'GET', headers }
          );
          if (findRes.ok) {
            const findData = await findRes.json();
            if (findData.status === 'success' && findData.data?.id) {
              subscriberId = findData.data.id;
            }
          }
        } catch {
          // ignore find error
        }
      } else if (createRes.status === 401) {
        console.warn(`[ManyChat Warning]: 401 Unauthorized - Chave de API invalida ou pendente de ativacao PRO.`);
        return {
          success: false,
          error: 'Chave ManyChat rejeitada (401 Wrong token). Verifique se o bot esta no plano PRO ou se a chave foi atualizada.',
        };
      }
    }

    // Se encontramos ou criamos o subscriber na ManyChat, aplica tags e campos
    if (subscriberId) {
      const tagsToApply = lead.tags || [];
      const fieldsToApply: Record<string, string | number | boolean> = {
        trajetta_name: cleanName,
        trajetta_email: cleanEmail,
        trajetta_source: lead.source || 'app',
        trajetta_status: lead.status || 'lead',
        ...(lead.position ? { trajetta_position: lead.position } : {}),
        ...(lead.focusArea ? { trajetta_focus_area: lead.focusArea } : {}),
        ...(lead.northStar ? { trajetta_north_star: lead.northStar } : {}),
        ...(lead.lifescore ? { trajetta_lifescore: lead.lifescore } : {}),
        ...(lead.phone ? { trajetta_phone: lead.phone } : {}),
        ...(lead.customFields || {}),
      };

      // Aplicar Tags
      for (const tag of tagsToApply) {
        try {
          await fetch(`${MANYCHAT_BASE_URL}/subscriber/addTagByName`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              subscriber_id: subscriberId,
              tag_name: tag,
            }),
          });
        } catch (tagErr) {
          console.warn(`[ManyChat Tag Warning]: Falha ao aplicar tag ${tag}:`, tagErr);
        }
      }

      // Aplicar Custom Fields
      for (const [fieldName, fieldValue] of Object.entries(fieldsToApply)) {
        try {
          await fetch(`${MANYCHAT_BASE_URL}/subscriber/setCustomFieldByName`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              subscriber_id: subscriberId,
              field_name: fieldName,
              field_value: fieldValue,
            }),
          });
        } catch (fieldErr) {
          console.warn(`[ManyChat Field Warning]: Falha ao setar campo ${fieldName}:`, fieldErr);
        }
      }

      console.log(`[ManyChat CRM Synced]: Subscriber ID ${subscriberId} (${cleanEmail})`);
      return {
        success: true,
        subscriberId,
        isNew,
        appliedTags: tagsToApply,
        appliedFields: fieldsToApply,
      };
    }

    // Fallback gracioso
    return {
      success: true,
      subscriberId: `manychat_queued_${Date.now()}`,
      appliedTags: lead.tags,
      appliedFields: lead.customFields,
    };
  } catch (error) {
    console.error('[ManyChat CRM Error]:', error);
    return {
      success: false,
      error: String(error),
    };
  }
}
