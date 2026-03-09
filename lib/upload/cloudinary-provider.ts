import { v2 as cloudinary } from 'cloudinary'
import { randomBytes } from 'crypto'
import path from 'path'
import type { IUploadProvider, UploadResult } from './types'

function generatePublicId(originalName: string, folder?: string): string {
  const ext = path.extname(originalName)
  const base = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()
  const random = randomBytes(4).toString('hex')
  const name = `${Date.now()}_${random}_${base}`
  return folder ? `${folder}/${name}` : name
}

export class CloudinaryProvider implements IUploadProvider {
  constructor() {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error(
        'Konfigurasi Cloudinary tidak lengkap. Pastikan CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, dan CLOUDINARY_API_SECRET sudah diset.'
      )
    }

    cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })
  }

  async upload(file: File, folder?: string): Promise<UploadResult> {
    const defaultFolder = process.env.CLOUDINARY_FOLDER || 'uploads'
    const targetFolder = folder || defaultFolder
    const publicId = generatePublicId(file.name, targetFolder)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          resource_type: 'auto',
          use_filename: false,
          overwrite: false,
        },
        (error, result) => {
          if (error) return reject(error)
          if (!result) return reject(new Error('Cloudinary tidak mengembalikan hasil upload'))
          resolve(result as { secure_url: string; public_id: string })
        }
      )
      stream.end(buffer)
    })

    return {
      url: result.secure_url,
      filename: path.basename(result.public_id),
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      provider: 'cloudinary',
    }
  }
}
