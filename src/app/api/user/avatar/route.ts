import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/auth';
import { prisma, ensureDbReady } from '@/lib/db';

const MAX_AVATAR_PAYLOAD_SIZE = 250 * 1024; // 250KB max (sanitized client avatar is ~25KB)

/**
 * Validação de Magic Bytes para garantir que o payload binário
 * corresponde estritamente a um formato de imagem genuíno (WebP, JPEG ou PNG).
 */
function validateImageMagicBytes(buffer: Buffer): { valid: boolean; format?: string } {
  if (buffer.length < 12) return { valid: false };

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, format: 'jpeg' };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { valid: true, format: 'png' };
  }

  // WebP: RIFF (bytes 0-3) + WEBP (bytes 8-11)
  const isRiff =
    buffer[0] === 0x52 && // R
    buffer[1] === 0x49 && // I
    buffer[2] === 0x46 && // F
    buffer[3] === 0x46;   // F

  const isWebp =
    buffer[8] === 0x57 && // W
    buffer[9] === 0x45 && // E
    buffer[10] === 0x42 && // B
    buffer[11] === 0x50;   // P

  if (isRiff && isWebp) {
    return { valid: true, format: 'webp' };
  }

  return { valid: false };
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user?.id) {
      return NextResponse.json({ ok: false, error: 'Acesso não autorizado.' }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const avatar = body.avatar;

    if (!avatar || typeof avatar !== 'string') {
      return NextResponse.json({ ok: false, error: 'Payload de avatar inválido.' }, { status: 400 });
    }

    // 1. Validar estrutura do Data URL
    const match = avatar.match(/^data:image\/(webp|jpeg|png);base64,([A-Za-z0-9+/=]+)$/);
    if (!match) {
      return NextResponse.json(
        { ok: false, error: 'Formato inválido. Aceitos apenas WebP, JPEG ou PNG codificados em base64.' },
        { status: 400 }
      );
    }

    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, 'base64');

    // 2. Validar tamanho máximo do binário
    if (buffer.length > MAX_AVATAR_PAYLOAD_SIZE) {
      return NextResponse.json(
        { ok: false, error: 'A imagem comprimida ultrapassa o limite seguro de tamanho.' },
        { status: 400 }
      );
    }

    // 3. Validar Magic Bytes de segurança
    const magicCheck = validateImageMagicBytes(buffer);
    if (!magicCheck.valid) {
      return NextResponse.json(
        { ok: false, error: 'Assinatura binária do arquivo rejeitada por motivos de segurança.' },
        { status: 400 }
      );
    }

    // 4. Persistir com segurança no banco de dados
    await ensureDbReady();
    await prisma.user.update({
      where: { id: user.id },
      data: { avatar },
    });

    return NextResponse.json({
      ok: true,
      avatar,
      format: magicCheck.format,
      sizeBytes: buffer.length,
    });
  } catch (error: any) {
    console.error('Error saving user avatar:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Erro interno ao salvar avatar.' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user?.id) {
      return NextResponse.json({ ok: false, error: 'Acesso não autorizado.' }, { status: 401 });
    }

    await ensureDbReady();
    await prisma.user.update({
      where: { id: user.id },
      data: { avatar: null },
    });

    return NextResponse.json({ ok: true, avatar: null });
  } catch (error: any) {
    console.error('Error removing user avatar:', error);
    return NextResponse.json(
      { ok: false, error: error.message || 'Erro interno ao remover avatar.' },
      { status: 500 }
    );
  }
}
