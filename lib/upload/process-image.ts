import sharp from 'sharp'

// Image types that should be skipped (not re-encoded)
const SKIP_MIME = new Set(['image/svg+xml', 'image/gif'])

// Skip re-encoding if already small (WebP < 200KB)
const SKIP_THRESHOLD_BYTES = 200 * 1024

export interface ProcessedImage {
  buffer: Buffer
  mimeType: 'image/webp'
  filename: string
}

/**
 * Server-side image processing:
 * - Convert to WebP
 * - Max dimension 1920px (preserves aspect ratio)
 * - Quality 80
 * - Strip EXIF metadata
 *
 * Returns null for SVG/GIF (caller should upload original).
 */
export async function processImage(
  inputBuffer: Buffer,
  originalMimeType: string,
  originalFilename: string,
): Promise<ProcessedImage | null> {
  if (SKIP_MIME.has(originalMimeType)) {
    return null
  }

  // If already WebP and small enough, skip re-encode
  if (originalMimeType === 'image/webp' && inputBuffer.byteLength < SKIP_THRESHOLD_BYTES) {
    const filenameWebp = toWebpFilename(originalFilename)
    return { buffer: inputBuffer, mimeType: 'image/webp', filename: filenameWebp }
  }

  const outputBuffer = await sharp(inputBuffer)
    .rotate() // auto-rotate based on EXIF orientation
    .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()

  return {
    buffer: outputBuffer,
    mimeType: 'image/webp',
    filename: toWebpFilename(originalFilename),
  }
}

function toWebpFilename(filename: string): string {
  const dotIndex = filename.lastIndexOf('.')
  const base = dotIndex !== -1 ? filename.slice(0, dotIndex) : filename
  return `${base}.webp`
}
