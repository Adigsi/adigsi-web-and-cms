import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { randomBytes } from 'crypto'
import path from 'path'
import { Readable } from 'stream'
import type { IUploadProvider, UploadResult } from './types'

function generateKey(originalName: string, folder?: string): string {
  const ext = path.extname(originalName)
  const base = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
  const random = randomBytes(4).toString('hex')
  const filename = `${Date.now()}_${random}_${base}${ext}`
  return folder ? `${folder}/${filename}` : filename
}

export class R2Provider implements IUploadProvider {
  private client: S3Client
  private bucket: string
  private publicUrl: string

  constructor() {
    const accountId = process.env.R2_ACCOUNT_ID
    const accessKeyId = process.env.R2_ACCESS_KEY_ID
    const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
    const bucket = process.env.R2_BUCKET
    const publicUrl = process.env.R2_PUBLIC_URL

    if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrl) {
      throw new Error(
        'Konfigurasi Cloudflare R2 tidak lengkap. Pastikan R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, dan R2_PUBLIC_URL sudah diset.'
      )
    }

    this.bucket = bucket
    this.publicUrl = publicUrl.replace(/\/$/, '')

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  }

  async upload(file: File, folder?: string): Promise<UploadResult> {
    const key = generateKey(file.name, folder)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const stream = Readable.from(buffer)

    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.bucket,
        Key: key,
        Body: stream,
        ContentType: file.type || 'application/octet-stream',
        ContentLength: file.size,
      },
    })

    await upload.done()

    return {
      url: `${this.publicUrl}/${key}`,
      filename: path.basename(key),
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      provider: 'r2',
    }
  }
}
