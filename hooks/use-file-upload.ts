'use client'

import { useState, useCallback } from 'react'
import { validateFileSize, compressImageClient } from '@/lib/upload/compress-image'
import type { UploadResult } from '@/lib/upload/types'

export type UploadStatus = 'idle' | 'compressing' | 'uploading' | 'done' | 'error'

export interface UseFileUploadReturn {
  status: UploadStatus
  progress: number
  error: string | null
  result: UploadResult | null
  upload: (file: File, folder?: string) => Promise<UploadResult | null>
  reset: () => void
}

/**
 * React hook for CMS file upload with client-side validation and compression.
 *
 * Usage:
 *   const { upload, status, progress, error, result } = useFileUpload()
 *   await upload(file, 'images')
 */
export function useFileUpload(): UseFileUploadReturn {
  const [status, setStatus] = useState<UploadStatus>('idle')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<UploadResult | null>(null)

  const reset = useCallback(() => {
    setStatus('idle')
    setProgress(0)
    setError(null)
    setResult(null)
  }, [])

  const upload = useCallback(async (file: File, folder?: string): Promise<UploadResult | null> => {
    setStatus('idle')
    setProgress(0)
    setError(null)
    setResult(null)

    // ── 1. Client-side size validation ──
    const sizeError = validateFileSize(file)
    if (sizeError) {
      setError(sizeError)
      setStatus('error')
      return null
    }

    // ── 2. Client-side image compression ──
    let fileToUpload = file
    if (file.type.startsWith('image/')) {
      setStatus('compressing')
      fileToUpload = await compressImageClient(file)
    }

    // ── 3. Upload to server via XHR (enables upload progress) ──
    setStatus('uploading')

    return new Promise<UploadResult | null>((resolve) => {
      const formData = new FormData()
      formData.append('file', fileToUpload)
      if (folder) formData.append('folder', folder)

      const xhr = new XMLHttpRequest()

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          setProgress(Math.round((e.loaded / e.total) * 100))
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          let data: UploadResult & { success: boolean }
          try {
            data = JSON.parse(xhr.responseText)
          } catch {
            setError('Respons server tidak valid.')
            setStatus('error')
            return resolve(null)
          }

          setProgress(100)
          setStatus('done')
          setResult(data)
          resolve(data)
        } else {
          let message = 'Upload gagal.'
          try {
            const body = JSON.parse(xhr.responseText)
            if (body.error) message = body.error
          } catch {}
          setError(message)
          setStatus('error')
          resolve(null)
        }
      }

      xhr.onerror = () => {
        setError('Koneksi gagal. Periksa jaringan Anda.')
        setStatus('error')
        resolve(null)
      }

      xhr.open('POST', '/api/cms/upload')
      xhr.send(formData)
    })
  }, [])

  return { status, progress, error, result, upload, reset }
}
