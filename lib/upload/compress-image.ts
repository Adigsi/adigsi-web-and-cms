'use client'

import imageCompression from 'browser-image-compression'

// Pre-compression limit for images — browser compresses to ~1MB before upload,
// so this limit applies to the original file before any compression.
export const IMAGE_MAX_SIZE_MB = 20
export const PDF_MAX_SIZE_MB = 20
export const OTHER_MAX_SIZE_MB = 10

const IMAGE_MAX_BYTES = IMAGE_MAX_SIZE_MB * 1024 * 1024
const PDF_MAX_BYTES = PDF_MAX_SIZE_MB * 1024 * 1024
const OTHER_MAX_BYTES = OTHER_MAX_SIZE_MB * 1024 * 1024

/**
 * Validate file size client-side before upload.
 * Returns an error message string, or null if valid.
 */
export function validateFileSize(file: File): string | null {
  const isImage = file.type.startsWith('image/')
  const isPdf = file.type === 'application/pdf'

  if (isImage && file.size > IMAGE_MAX_BYTES) {
    return `Ukuran gambar maksimal ${IMAGE_MAX_SIZE_MB} MB. File Anda: ${(file.size / 1024 / 1024).toFixed(1)} MB.`
  }
  if (isPdf && file.size > PDF_MAX_BYTES) {
    return `Ukuran PDF maksimal ${PDF_MAX_SIZE_MB} MB. File Anda: ${(file.size / 1024 / 1024).toFixed(1)} MB.`
  }
  if (!isImage && !isPdf && file.size > OTHER_MAX_BYTES) {
    return `Ukuran file maksimal ${OTHER_MAX_SIZE_MB} MB. File Anda: ${(file.size / 1024 / 1024).toFixed(1)} MB.`
  }
  return null
}

/**
 * Compress an image client-side before upload.
 *
 * Target: ~1 MB, max dimension 1920px.
 * Server will re-encode to WebP regardless, so format here is less important.
 *
 * SVG and GIF are returned as-is (not compressible this way).
 */
export async function compressImageClient(file: File): Promise<File> {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file
  }

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      preserveExif: false,
    })
    return compressed
  } catch {
    // If client compression fails, return original — server will handle it
    console.warn('[compressImageClient] Compression failed, using original file.')
    return file
  }
}
