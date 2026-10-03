/**
 * Trajetta Avatar Sanitizer & Optimizer
 * 
 * Segurança & Performance:
 * 1. Filtra estritamente por tipos MIME seguros (JPEG, PNG, WEBP).
 *    - Rejeita terminantemente SVG (que pode conter <script>, XXE ou XSS),
 *      HTML, executáveis ou scripts disfarçados.
 * 2. Re-renderiza a imagem via HTML5 Canvas em memória:
 *    - Descarta 100% dos metadados EXIF (incluindo geolocalização e dados da câmera).
 *    - Destrói qualquer payload malicioso, polyglots ou dados esteganográficos
 *      embutidos no arquivo original, recriando a imagem puramente a partir de pixels brutos.
 * 3. Faz o crop centralizado em proporção 1:1 e redimensiona para 256x256 pixels:
 *    - Resolução ideal para telas Retina mantendo o peso abaixo de 35KB.
 * 4. Exporta em WebP otimizado (qualidade 85%) com fallback para JPEG.
 */

export interface ProcessAvatarResult {
  dataUrl: string;
  sizeBytes: number;
  width: number;
  height: number;
  format: 'webp' | 'jpeg';
}

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
]);

const MAX_INPUT_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const TARGET_DIMENSION = 256; // 256x256 px
const TARGET_QUALITY = 0.85;

export async function processAndSanitizeAvatar(file: File): Promise<ProcessAvatarResult> {
  // 1. Validação inicial de tipo MIME
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    throw new Error('Formato não suportado. Por segurança, envie apenas imagens JPG, PNG ou WEBP.');
  }

  // 2. Validação de tamanho de entrada para evitar estouro de memória
  if (file.size > MAX_INPUT_FILE_SIZE) {
    throw new Error('A imagem deve ter no máximo 10MB.');
  }

  // 3. Carregar o arquivo em memória via FileReader
  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo no navegador.'));
    reader.readAsDataURL(file);
  });

  // 4. Renderizar em elemento HTMLImageElement
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('O arquivo selecionado não é uma imagem válida ou está corrompido.'));
    image.src = rawDataUrl;
  });

  // 5. Validar dimensões mínimas para evitar imagens vazias
  if (img.width < 16 || img.height < 16) {
    throw new Error('A resolução da imagem é muito baixa para uma foto de perfil.');
  }

  // 6. Criar Canvas offscreen para redimensionamento e sanitização por recriação de pixels
  const canvas = document.createElement('canvas');
  canvas.width = TARGET_DIMENSION;
  canvas.height = TARGET_DIMENSION;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    throw new Error('Não foi possível inicializar o processador gráfico do navegador.');
  }

  // Preencher fundo com tom neutro escuro antes de desenhar (caso de PNGs transparentes)
  ctx.fillStyle = '#14181F';
  ctx.fillRect(0, 0, TARGET_DIMENSION, TARGET_DIMENSION);

  // 7. Calcular corte centralizado (Square Center-Crop)
  const minSide = Math.min(img.width, img.height);
  const srcX = (img.width - minSide) / 2;
  const srcY = (img.height - minSide) / 2;

  // Habilitar suavização de imagem de alta qualidade
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Desenhar apenas os pixels brutos da imagem recortada
  ctx.drawImage(
    img,
    srcX,
    srcY,
    minSide,
    minSide,
    0,
    0,
    TARGET_DIMENSION,
    TARGET_DIMENSION
  );

  // 8. Exportar como WebP ou JPEG
  let format: 'webp' | 'jpeg' = 'webp';
  let processedDataUrl = canvas.toDataURL('image/webp', TARGET_QUALITY);

  // Se o navegador não suportar WebP no canvas.toDataURL, faz fallback para JPEG
  if (!processedDataUrl.startsWith('data:image/webp')) {
    format = 'jpeg';
    processedDataUrl = canvas.toDataURL('image/jpeg', TARGET_QUALITY);
  }

  // Calcular tamanho em bytes do DataURL
  const base64Part = processedDataUrl.split(',')[1] || '';
  const sizeBytes = Math.round((base64Part.length * 3) / 4);

  return {
    dataUrl: processedDataUrl,
    sizeBytes,
    width: TARGET_DIMENSION,
    height: TARGET_DIMENSION,
    format,
  };
}
