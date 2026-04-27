import { NextRequest, NextResponse } from 'next/server'
import { verifyCmsSessionToken } from '@/lib/cms-session'
import { CMS_AUTH_COOKIE } from '@/lib/cms-auth-constants'
import { GCSProvider } from '@/lib/upload/gcs-provider'

export const runtime = 'nodejs'

// Max size accepted at the presign stage (post client-compression, before GCS upload).
// Serves as a safety net — actual file content is never sent to this endpoint.
const IMAGE_PRESIGN_MAX_BYTES = 20 * 1024 * 1024 // 20 MB

export async function POST(request: NextRequest) {
  // ── Auth check ──
  const sessionCookie = request.cookies.get(CMS_AUTH_COOKIE)?.value
  if (!sessionCookie) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const session = await verifyCmsSessionToken(sessionCookie).catch(() => null)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Only GCS supports presigned direct upload ──
  const providerName = process.env.UPLOAD_PROVIDER?.trim().toLowerCase()
  if (providerName !== 'gcs') {
    return NextResponse.json({ method: 'proxy' })
  }

  let body: { filename?: unknown; mimeType?: unknown; folder?: unknown; size?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Request body tidak valid.' }, { status: 400 })
  }

  const { filename, mimeType, folder, size } = body

  if (typeof filename !== 'string' || !filename.trim()) {
    return NextResponse.json({ error: 'filename wajib diisi.' }, { status: 400 })
  }
  if (typeof mimeType !== 'string' || !mimeType.trim()) {
    return NextResponse.json({ error: 'mimeType wajib diisi.' }, { status: 400 })
  }

  // ── PDFs must go through the proxy (server needs Ghostscript compression) ──
  if (!mimeType.startsWith('image/')) {
    return NextResponse.json({ method: 'proxy' })
  }

  // ── Size guard ──
  if (typeof size === 'number' && size > IMAGE_PRESIGN_MAX_BYTES) {
    return NextResponse.json(
      { error: `Ukuran file melebihi batas maksimum 20 MB.` },
      { status: 413 },
    )
  }

  const folderStr = typeof folder === 'string' && folder.trim() ? folder.trim() : undefined

  try {
    const provider = new GCSProvider()
    const result = await provider.presign(filename.trim(), mimeType.trim(), folderStr)
    return NextResponse.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal membuat signed URL.'
    console.error('[Presign] Error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
