export type UploadProvider = 'local' | 'cloudinary' | 'r2' | 'gcs'

export interface UploadResult {
  url: string
  filename: string
  originalName: string
  size: number
  mimeType: string
  provider: UploadProvider
}

export interface IUploadProvider {
  upload(file: File, folder?: string): Promise<UploadResult>
}

/** Returned by the presign endpoint when direct upload to the storage provider is supported. */
export interface PresignDirectResult {
  method: 'direct'
  signedUrl: string
  publicUrl: string
  key: string
}

/** Returned by the presign endpoint when the client should fall back to proxy upload. */
export interface PresignProxyResult {
  method: 'proxy'
}

export type PresignResponse = PresignDirectResult | PresignProxyResult
