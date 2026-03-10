import type { IUploadProvider } from './types'

export function getUploadProvider(): IUploadProvider {
  const provider = process.env.UPLOAD_PROVIDER

  if (!provider) {
    throw new Error('UPLOAD_PROVIDER belum diset di environment variables. Nilai yang valid: local, cloudinary, r2, gcs')
  }

  if (provider === 'local') {
    const { LocalProvider } = require('./local-provider')
    return new LocalProvider()
  }

  if (provider === 'cloudinary') {
    const { CloudinaryProvider } = require('./cloudinary-provider')
    return new CloudinaryProvider()
  }

  if (provider === 'r2') {
    const { R2Provider } = require('./r2-provider')
    return new R2Provider()
  }

  if (provider === 'gcs') {
    const { GCSProvider } = require('./gcs-provider')
    return new GCSProvider()
  }

  throw new Error(`UPLOAD_PROVIDER tidak dikenali: "${provider}". Nilai yang valid: local, cloudinary, r2, gcs`)
}
