import fs from 'fs/promises'
import path from 'path'
import { randomBytes } from 'crypto'
import type { IUploadProvider, UploadResult } from './types'

function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/_{2,}/g, '_')
    .toLowerCase()
}

function generateFilename(originalName: string): string {
  const ext = path.extname(originalName)
  const base = sanitizeFilename(path.basename(originalName, ext))
  const timestamp = Date.now()
  const random = randomBytes(4).toString('hex')
  return `${timestamp}_${random}_${base}${ext}`
}

export class LocalProvider implements IUploadProvider {
  private basePath: string

  constructor() {
    const basePath = process.env.UPLOAD_LOCAL_PATH
    if (!basePath) {
      throw new Error('UPLOAD_LOCAL_PATH belum diset di environment variables.')
    }
    this.basePath = basePath
  }

  async upload(file: File, folder?: string): Promise<UploadResult> {
    const filename = generateFilename(file.name)
    const subdir = folder ? sanitizeFilename(folder) : ''
    const targetDir = subdir ? path.join(this.basePath, subdir) : this.basePath

    await fs.mkdir(targetDir, { recursive: true })

    const targetPath = path.join(targetDir, filename)

    const arrayBuffer = await file.arrayBuffer()
    await fs.writeFile(targetPath, Buffer.from(arrayBuffer))

    const urlPath = subdir ? `/api/cms/upload/file/${subdir}/${filename}` : `/api/cms/upload/file/${filename}`

    return {
      url: urlPath,
      filename,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      provider: 'local',
    }
  }
}
