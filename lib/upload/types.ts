export type UploadProvider = 'local' | 'cloudinary' | 'r2'

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
