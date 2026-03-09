import { NextRequest, NextResponse } from 'next/server'
import { getUploadProvider } from '@/lib/upload'
import { verifyCmsSessionToken } from '@/lib/cms-session'
import { CMS_AUTH_COOKIE } from '@/lib/cms-auth-constants'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

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

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: `Ukuran file melebihi batas maksimum ${MAX_FILE_SIZE / (1024 * 1024)} MB.` },
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
    const result = await provider.upload(file, folderStr)
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Gagal mengupload file.'
    console.error('[Upload] Upload error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
