import { Storage } from '@google-cloud/storage'
import { randomBytes } from 'crypto'
import path from 'path'
import type { IUploadProvider, UploadResult } from './types'

function generateKey(originalName: string, folder?: string): string {
  const ext = path.extname(originalName)
  const base = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
  const random = randomBytes(4).toString('hex')
  const filename = `${Date.now()}_${random}_${base}${ext}`
  return folder ? `${folder}/${filename}` : filename
}

export class GCSProvider implements IUploadProvider {
  private storage: Storage
  private bucket: string
  private publicUrl: string

  constructor() {
    const projectId = process.env.GCS_PROJECT_ID
    const bucket = process.env.GCS_BUCKET
    const publicUrl = process.env.GCS_PUBLIC_URL

    if (!projectId || !bucket) {
      throw new Error(
        'Konfigurasi Google Cloud Storage tidak lengkap. Pastikan GCS_PROJECT_ID dan GCS_BUCKET sudah diset.'
      )
    }

    this.bucket = bucket
    // Default public URL jika tidak diset: format storage.googleapis.com
    this.publicUrl = (publicUrl || `https://storage.googleapis.com/${bucket}`).replace(/\/$/, '')

    // Autentikasi via GOOGLE_APPLICATION_CREDENTIALS (path ke service account JSON)
    // atau GCS_KEY_JSON (isi JSON langsung sebagai string env var)
    const keyJson = process.env.GCS_KEY_JSON
    if (keyJson) {
      let credentials: object
      try {
        credentials = JSON.parse(keyJson)
      } catch {
        throw new Error(
          'GCS_KEY_JSON tidak valid. Gunakan JSON satu baris (single-line) atau pakai GOOGLE_APPLICATION_CREDENTIALS ke path file service account JSON.'
        )
      }
      this.storage = new Storage({ projectId, credentials })
    } else {
      // Fallback ke Application Default Credentials (GOOGLE_APPLICATION_CREDENTIALS)
      this.storage = new Storage({ projectId })
    }
  }

  async upload(file: File, folder?: string): Promise<UploadResult> {
    const defaultFolder = process.env.GCS_FOLDER || ''
    const targetFolder = folder || defaultFolder || undefined
    const key = generateKey(file.name, targetFolder)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const bucketRef = this.storage.bucket(this.bucket)
    const fileRef = bucketRef.file(key)

    await fileRef.save(buffer, {
      contentType: file.type || 'application/octet-stream',
      resumable: false,
    })

    return {
      url: `${this.publicUrl}/${key}`,
      filename: path.basename(key),
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      provider: 'gcs',
    }
  }
}
