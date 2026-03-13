import type { IUploadProvider } from './types'
import { LocalProvider } from './local-provider'
import { CloudinaryProvider } from './cloudinary-provider'
import { R2Provider } from './r2-provider'
import { GCSProvider } from './gcs-provider'

export function getUploadProvider(): IUploadProvider {
  const provider = process.env.UPLOAD_PROVIDER?.trim().toLowerCase()

  if (!provider) {
    throw new Error('UPLOAD_PROVIDER belum diset di environment variables. Nilai yang valid: local, cloudinary, r2, gcs')
  }

  if (provider === 'local') {
    return new LocalProvider()
  }

  if (provider === 'cloudinary') {
    return new CloudinaryProvider()
  }

  if (provider === 'r2') {
    return new R2Provider()
  }

  if (provider === 'gcs') {
    return new GCSProvider()
  }

  throw new Error(`UPLOAD_PROVIDER tidak dikenali: "${provider}". Nilai yang valid: local, cloudinary, r2, gcs`)
}
