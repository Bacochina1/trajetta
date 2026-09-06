/**
 * Trajetta Social Share Engine
 * Client-side High-DPI Canvas generator for Instagram Stories (9:16) and Feed/WhatsApp (1:1).
 * Inspired by Strava activities and Spotify Wrapped.
 */

export interface ShareCardData {
  userName: string;
  overallScore: number;
  scoreStatus: string;
  streakDays: number;
  consistencyRate: number; // e.g. 86
  completedHabitsCount: number;
  areas: {
    corpo: number;
    dinheiro: number;
    carreira: number;
    vida: number;
  };
}

export type CardFormat = 'stories' | 'square';
export type CardType = 'overall' | 'weekly';

export async function generateShareCardCanvas(
  format: CardFormat,
  type: CardType,
  data: ShareCardData
): Promise<HTMLCanvasElement> {
  const width = 1080;
  const height = format === 'stories' ? 1920 : 1080;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not supported');

  // Load logo image if available
  let logoImg: HTMLImageElement | null = null;
  try {
    logoImg = await new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = '/trajetta-logo-transparent.png';
    });
  } catch {
    logoImg = null;
  }

  // 1. Cinematic Background
  ctx.fillStyle = '#060709';
  ctx.fillRect(0, 0, width, height);

  // Radial luminous glow from top-right (#B8FF00 ambient)
  const glowX = width * 0.75;
  const glowY = format === 'stories' ? height * 0.28 : height * 0.35;
  const radGrad = ctx.createRadialGradient(glowX, glowY, 10, glowX, glowY, width * 0.7);
  radGrad.addColorStop(0, 'rgba(184, 255, 0, 0.12)');
  radGrad.addColorStop(0.5, 'rgba(184, 255, 0, 0.03)');
  radGrad.addColorStop(1, 'rgba(6, 7, 9, 0)');
  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, width, height);

  // Secondary ambient glow bottom-left (#A98CF7 deep violet)
  const grad2 = ctx.createRadialGradient(width * 0.2, height * 0.8, 20, width * 0.2, height * 0.8, width * 0.6);
  grad2.addColorStop(0, 'rgba(169, 140, 247, 0.08)');
  grad2.addColorStop(1, 'rgba(6, 7, 9, 0)');
  ctx.fillStyle = grad2;
  ctx.fillRect(0, 0, width, height);

  // Subtle grid/border frame
  const margin = format === 'stories' ? 72 : 54;
  const cardW = width - margin * 2;
  const cardH = height - margin * 2;

  // Main container card
  drawRoundedRect(ctx, margin, margin, cardW, cardH, 44);
  ctx.fillStyle = 'rgba(14, 18, 24, 0.75)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.stroke();

  // Header: Logo & Trajetta branding
  const headerY = margin + 64;
  if (logoImg) {
    ctx.drawImage(logoImg, margin + 54, headerY, 68, 68);
  }

  ctx.fillStyle = '#F2F1ED';
  ctx.font = '800 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('trajetta', margin + 136, headerY + 48);

  // Accent dot
  ctx.beginPath();
  ctx.arc(margin + 288, headerY + 45, 6, 0, Math.PI * 2);
  ctx.fillStyle = '#B8FF00';
  ctx.fill();

  // Header right tag
  const tagText = type === 'overall' ? 'DIAGNÓSTICO REAL' : 'RITMO SEMANAL';
  ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
  ctx.letterSpacing = '2px';
  ctx.fillStyle = '#8E9499';
  const tagW = ctx.measureText(tagText).width;
  ctx.fillText(tagText, margin + cardW - tagW - 54, headerY + 44);

  // Separator line
  ctx.beginPath();
  ctx.moveTo(margin + 54, headerY + 96);
  ctx.lineTo(margin + cardW - 54, headerY + 96);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  if (format === 'stories') {
    // ---------------- STORIES 9:16 LAYOUT ----------------
    // Category kicker
    const bodyTop = headerY + 140;
    ctx.fillStyle = '#B8FF00';
    ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
    ctx.letterSpacing = '3px';
    ctx.fillText('EVIDÊNCIA DE EVOLUÇÃO', margin + 54, bodyTop);

    // Headline
    ctx.fillStyle = '#F2F1ED';
    ctx.font = '900 58px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '-1px';
    ctx.fillText('Meu ritmo no Trajetta.', margin + 54, bodyTop + 72);

    // Giant Hero Score Box
    const scoreBoxY = bodyTop + 130;
    const scoreBoxH = 340;
    drawRoundedRect(ctx, margin + 54, scoreBoxY, cardW - 108, scoreBoxH, 32);
    ctx.fillStyle = 'rgba(23, 26, 29, 0.9)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(184, 255, 0, 0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Giant Score
    ctx.fillStyle = '#B8FF00';
    ctx.font = '900 180px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '-4px';
    const scoreStr = String(data.overallScore);
    ctx.fillText(scoreStr, margin + 96, scoreBoxY + 220);

    const scoreWidth = ctx.measureText(scoreStr).width;
    ctx.fillStyle = '#8E9499';
    ctx.font = '700 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('/ 100', margin + 104 + scoreWidth, scoreBoxY + 130);

    // Score label & status
    ctx.fillStyle = '#F2F1ED';
    ctx.font = '800 38px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Life Score Overall', margin + 104 + scoreWidth, scoreBoxY + 185);

    ctx.fillStyle = '#58D6A7';
    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`• ${data.scoreStatus}`, margin + 104 + scoreWidth, scoreBoxY + 225);

    // Bottom of score box: Streak & Pace
    const metricBoxY = scoreBoxY + scoreBoxH + 32;
    const halfW = (cardW - 108 - 24) / 2;

    // Metric 1: Streak
    drawRoundedRect(ctx, margin + 54, metricBoxY, halfW, 140, 24);
    ctx.fillStyle = 'rgba(23, 26, 29, 0.7)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#8E9499';
    ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('SEQUÊNCIA ATIVA', margin + 84, metricBoxY + 44);

    ctx.fillStyle = '#F2F1ED';
    ctx.font = '800 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${data.streakDays} dias seguidos`, margin + 84, metricBoxY + 100);

    // Metric 2: Consistency
    drawRoundedRect(ctx, margin + 54 + halfW + 24, metricBoxY, halfW, 140, 24);
    ctx.fillStyle = 'rgba(23, 26, 29, 0.7)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.stroke();

    ctx.fillStyle = '#8E9499';
    ctx.font = '600 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('PACE DE CONSISTÊNCIA', margin + 84 + halfW + 24, metricBoxY + 44);

    ctx.fillStyle = '#B8FF00';
    ctx.font = '800 44px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${data.consistencyRate}%`, margin + 84 + halfW + 24, metricBoxY + 100);

    // The 4 Pillars Breakdown (Strava-like telemetry)
    const pillarsY = metricBoxY + 172;
    ctx.fillStyle = '#8E9499';
    ctx.font = '700 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
    ctx.letterSpacing = '2px';
    ctx.fillText('PILARES CENTRAIS DE VIDA', margin + 54, pillarsY);

    const pillars = [
      { label: 'Corpo & Energia', score: data.areas.corpo, color: '#58D6A7' },
      { label: 'Dinheiro & Reserva', score: data.areas.dinheiro, color: '#F08A76' },
      { label: 'Carreira & Impacto', score: data.areas.carreira, color: '#A98CF7' },
      { label: 'Vida Pessoal & Mente', score: data.areas.vida, color: '#6FAEF7' },
    ];

    pillars.forEach((p, idx) => {
      const rowY = pillarsY + 40 + idx * 82;
      const rowW = cardW - 108;

      drawRoundedRect(ctx, margin + 54, rowY, rowW, 64, 18);
      ctx.fillStyle = 'rgba(23, 26, 29, 0.5)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.stroke();

      // Dot with area color
      ctx.beginPath();
      ctx.arc(margin + 84, rowY + 32, 7, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      // Label
      ctx.fillStyle = '#F2F1ED';
      ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(p.label, margin + 110, rowY + 40);

      // Score
      ctx.fillStyle = p.color;
      ctx.font = '800 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const sText = `${p.score}/100`;
      const sW = ctx.measureText(sText).width;
      ctx.fillText(sText, margin + 54 + rowW - sW - 28, rowY + 40);

      // Progress mini-bar under label
      const barX = margin + 110;
      const barY = rowY + 48;
      const barTotalW = rowW - 240;
      const fillW = (p.score / 100) * barTotalW;

      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      drawRoundedRect(ctx, barX, barY, barTotalW, 5, 3);
      ctx.fill();

      ctx.fillStyle = p.color;
      drawRoundedRect(ctx, barX, barY, fillW, 5, 3);
      ctx.fill();
    });

    // Stories Footer
    const footerY = margin + cardH - 120;
    ctx.beginPath();
    ctx.moveTo(margin + 54, footerY);
    ctx.lineTo(margin + cardW - 54, footerY);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.stroke();

    ctx.fillStyle = '#F2F1ED';
    ctx.font = '700 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(data.userName, margin + 54, footerY + 54);

    ctx.fillStyle = '#8E9499';
    ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('trajetta.app • Ritmo sustentável', margin + 54, footerY + 84);

    ctx.fillStyle = '#B8FF00';
    ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const tagBio = 'Planeje para a vida real';
    const tbW = ctx.measureText(tagBio).width;
    ctx.fillText(tagBio, margin + cardW - tbW - 54, footerY + 68);

  } else {
    // ---------------- SQUARE 1:1 LAYOUT (FEED / WHATSAPP) ----------------
    const contentTop = headerY + 120;

    // Left column: Overall Score Box
    const leftW = (cardW - 108 - 40) * 0.44;
    const rightW = (cardW - 108 - 40) * 0.56;
    const boxH = 460;

    // Score container
    drawRoundedRect(ctx, margin + 54, contentTop, leftW, boxH, 32);
    ctx.fillStyle = 'rgba(23, 26, 29, 0.9)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(184, 255, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#8E9499';
    ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
    ctx.letterSpacing = '2px';
    ctx.fillText('OVERALL SCORE', margin + 84, contentTop + 54);

    ctx.fillStyle = '#B8FF00';
    ctx.font = '900 140px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '-4px';
    ctx.fillText(String(data.overallScore), margin + 84, contentTop + 200);

    ctx.fillStyle = '#8E9499';
    ctx.font = '600 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('/ 100', margin + 84, contentTop + 245);

    ctx.fillStyle = '#F2F1ED';
    ctx.font = '700 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(data.scoreStatus, margin + 84, contentTop + 310);

    ctx.fillStyle = '#58D6A7';
    ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`🔥 ${data.streakDays} dias de streak`, margin + 84, contentTop + 355);

    ctx.fillStyle = '#8E9499';
    ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${data.consistencyRate}% de consistência semanal`, margin + 84, contentTop + 395);

    // Right column: 4 Areas
    const rightX = margin + 54 + leftW + 40;
    ctx.fillStyle = '#8E9499';
    ctx.font = '700 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace';
    ctx.letterSpacing = '2px';
    ctx.fillText('DIAGNÓSTICO POR PILAR', rightX, contentTop + 30);

    const pillars = [
      { label: 'Corpo & Energia', score: data.areas.corpo, color: '#58D6A7' },
      { label: 'Dinheiro & Reserva', score: data.areas.dinheiro, color: '#F08A76' },
      { label: 'Carreira & Impacto', score: data.areas.carreira, color: '#A98CF7' },
      { label: 'Vida Pessoal & Mente', score: data.areas.vida, color: '#6FAEF7' },
    ];

    pillars.forEach((p, idx) => {
      const pY = contentTop + 60 + idx * 96;

      drawRoundedRect(ctx, rightX, pY, rightW, 78, 20);
      ctx.fillStyle = 'rgba(23, 26, 29, 0.6)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(rightX + 28, pY + 39, 7, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();

      ctx.fillStyle = '#F2F1ED';
      ctx.font = '700 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(p.label, rightX + 50, pY + 38);

      ctx.fillStyle = p.color;
      ctx.font = '800 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const sStr = `${p.score}/100`;
      const sW = ctx.measureText(sStr).width;
      ctx.fillText(sStr, rightX + rightW - sW - 24, pY + 38);

      // Progress bar
      const barX = rightX + 50;
      const barY = pY + 54;
      const barTotalW = rightW - 140;
      const fillW = (p.score / 100) * barTotalW;

      ctx.fillStyle = 'rgba(255,255,255,0.08)';
      drawRoundedRect(ctx, barX, barY, barTotalW, 6, 3);
      ctx.fill();

      ctx.fillStyle = p.color;
      drawRoundedRect(ctx, barX, barY, fillW, 6, 3);
      ctx.fill();
    });

    // Square Footer
    const footerY = margin + cardH - 100;
    ctx.beginPath();
    ctx.moveTo(margin + 54, footerY);
    ctx.lineTo(margin + cardW - 54, footerY);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.stroke();

    ctx.fillStyle = '#F2F1ED';
    ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${data.userName} • @trajetta`, margin + 54, footerY + 52);

    ctx.fillStyle = '#8E9499';
    ctx.font = '500 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    const tagBio = '"Planeje para sua vida real, não para sua versão perfeita."';
    const tbW = ctx.measureText(tagBio).width;
    ctx.fillText(tagBio, margin + cardW - tbW - 54, footerY + 52);
  }

  return canvas;
}

// Helper to draw rounded rectangle
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/**
 * Downloads canvas as high-res PNG
 */
export function downloadCanvasAsPng(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}

/**
 * Copies canvas image directly to OS clipboard
 */
export async function copyCanvasToClipboard(canvas: HTMLCanvasElement): Promise<boolean> {
  try {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png', 1.0)
    );
    if (!blob) return false;
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': blob })
    ]);
    return true;
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}

/**
 * Native Web Share API (mobile Instagram Stories / WhatsApp / etc.)
 */
export async function shareCanvasNatively(
  canvas: HTMLCanvasElement,
  title: string,
  text: string
): Promise<boolean> {
  if (!navigator.share) return false;
  try {
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/png', 1.0)
    );
    if (!blob) return false;
    const file = new File([blob], 'trajetta-conquista.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title,
        text,
        files: [file],
      });
      return true;
    } else {
      await navigator.share({
        title,
        text,
        url: window.location.origin,
      });
      return true;
    }
  } catch (err) {
    console.error('Failed to share natively', err);
    return false;
  }
}
