import { NextRequest, NextResponse } from 'next/server'
import { getUploadProvider } from '@/lib/upload'
import { verifyCmsSessionToken } from '@/lib/cms-session'
import { CMS_AUTH_COOKIE } from '@/lib/cms-auth-constants'
import { processImage } from '@/lib/upload/process-image'
import { compressPdf } from '@/lib/upload/compress-pdf'

// Per-MIME size limits (server-side enforcement)
const SIZE_LIMITS: { prefix: string; bytes: number; label: string }[] = [
  { prefix: 'image/', bytes: 5 * 1024 * 1024, label: '5 MB' },
  { prefix: 'application/pdf', bytes: 20 * 1024 * 1024, label: '20 MB' },
]
const DEFAULT_LIMIT = { bytes: 10 * 1024 * 1024, label: '10 MB' }

function getSizeLimit(mimeType: string) {
  return SIZE_LIMITS.find((l) => mimeType.startsWith(l.prefix)) ?? DEFAULT_LIMIT
}

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  // Auth check — middleware only covers /cms/* routes, not /api/cms/*
  const sessionCookie = request.cookies.get(CMS_AUTH_COOKIE)?.value
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const session = await verifyCmsSessionToken(sessionCookie).catch(() => null)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return NextResponse.json({ error: 'Request body tidak valid. Gunakan multipart/form-data.' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Field "file" wajib ada dan harus berupa file.' }, { status: 400 })
  }

  if (file.size === 0) {
    return NextResponse.json({ error: 'File tidak boleh kosong.' }, { status: 400 })
  }

  const limit = getSizeLimit(file.type)
  if (file.size > limit.bytes) {
    return NextResponse.json(
      { error: `Ukuran file melebihi batas maksimum ${limit.label} untuk tipe ${file.type || 'file'} ini.` },
      { status: 413 }
    )
  }

  const folder = formData.get('folder')
  const folderStr = typeof folder === 'string' && folder.trim() ? folder.trim() : undefined

  let provider
  try {
    provider = getUploadProvider()
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Konfigurasi upload provider bermasalah.'
    console.error('[Upload] Provider init error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }

  try {
    const isImage = file.type.startsWith('image/')
    const isPdf = file.type === 'application/pdf'

    if (isImage) {
      // ── Image pipeline: read → sharp WebP → upload ──
      const inputBuffer = Buffer.from(await file.arrayBuffer())
      const processed = await processImage(inputBuffer, file.type, file.name)

      if (processed) {
        // Processed to WebP — create a new File with updated name and mime
        const processedFile = new File([new Uint8Array(processed.buffer)], processed.filename, { type: processed.mimeType })
        const result = await provider.upload(processedFile, folderStr)
        return NextResponse.json({ success: true, ...result })
      }

      // SVG / GIF / already-small WebP — upload original
      const result = await provider.upload(file, folderStr)
      return NextResponse.json({ success: true, ...result })
    }

    if (isPdf) {
      // ── PDF pipeline: read → ghostscript → upload ──
      const inputBuffer = Buffer.from(await file.arrayBuffer())
      const compressedBuffer = await compressPdf(inputBuffer)
      const compressedFile = new File([new Uint8Array(compressedBuffer)], file.name, { type: 'application/pdf' })
      const result = await provider.upload(compressedFile, folderStr)
      return NextResponse.json({ success: true, ...result })
    }

    // ── Other file types — upload as-is ──
    const result = await provider.upload(file, folderStr)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal mengupload file.'
    console.error('[Upload] Upload error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
