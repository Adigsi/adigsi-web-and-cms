'use client'

import { useState, useCallback } from 'react'
import { validateFileSize, compressImageClient } from '@/lib/upload/compress-image'
import type { UploadResult, PresignResponse, PresignDirectResult } from '@/lib/upload/types'

export type UploadStatus = 'idle' | 'compressing' | 'uploading' | 'done' | 'error'

export interface UseFileUploadReturn {
  status: UploadStatus
  /** Upload progress 0–100. Reflects real GCS transfer progress when using direct upload. */
  progress: number
  error: string | null
  result: UploadResult | null
  upload: (file: File, folder?: string) => Promise<UploadResult>
  reset: () => void
}

const XHR_TIMEOUT_MS = 5 * 60 * 1000 // 5 minutes

type DirectUploadOutcome =
  | { type: 'success'; result: UploadResult }
  | { type: 'fallback' }     // network error or non-2xx → try proxy
  | { type: 'timeout' }      // hard timeout → surface as error

/**
 * Attempt a direct PUT to the GCS signed URL.
 * Resolves with a discriminated outcome so the caller can decide whether to
 * fall back to the proxy route without unwinding the React state.
 */
function attemptDirectUpload(
  presignData: PresignDirectResult,
  fileToUpload: File,
  originalFile: File,
  onProgress: (pct: number) => void,
): Promise<DirectUploadOutcome> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const uploadResult: UploadResult = {
          url: presignData.publicUrl,
          filename: presignData.key.split('/').pop() ?? fileToUpload.name,
          originalName: originalFile.name,
          size: fileToUpload.size,
          mimeType: fileToUpload.type,
          provider: 'gcs',
        }
        resolve({ type: 'success', result: uploadResult })
      } else {
        console.warn(`[useFileUpload] Direct GCS upload returned HTTP ${xhr.status}, falling back to proxy.`)
        resolve({ type: 'fallback' })
      }
    }

    xhr.onerror = () => {
      // Most likely CORS is not configured on the GCS bucket.
      // Fall back transparently to the proxy route.
      console.warn('[useFileUpload] Direct GCS upload network error (check bucket CORS), falling back to proxy.')
      resolve({ type: 'fallback' })
    }

    xhr.ontimeout = () => {
      console.warn('[useFileUpload] Direct GCS upload timed out.')
      resolve({ type: 'timeout' })
    }

    xhr.timeout = XHR_TIMEOUT_MS
    xhr.open('PUT', presignData.signedUrl)
    xhr.setRequestHeader('Content-Type', fileToUpload.type)
    xhr.send(fileToUpload)
  })
}

/**
 * Perform a proxy upload via the internal /api/cms/upload route.
 * Used for PDFs, non-GCS providers, and as a fallback when direct upload fails.
 */
function doProxyUpload(
  fileToUpload: File,
  folder: string | undefined,
  onProgress: (pct: number) => void,
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', fileToUpload)
    if (folder) formData.append('folder', folder)

    const xhr = new XMLHttpRequest()

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        let data: UploadResult & { success?: boolean }
        try {
          data = JSON.parse(xhr.responseText)
        } catch {
          return reject(new Error('Respons server tidak valid.'))
        }
        resolve(data)
      } else {
        let message = 'Upload gagal.'
        try {
          const body = JSON.parse(xhr.responseText)
          if (body.error) message = body.error
        } catch {}
        reject(new Error(message))
      }
    }

    xhr.onerror = () => reject(new Error('Koneksi gagal. Periksa jaringan Anda.'))

    xhr.ontimeout = () => reject(new Error('Upload timeout. Koneksi lambat atau file terlalu besar.'))

    xhr.timeout = XHR_TIMEOUT_MS
    xhr.open('POST', '/api/cms/upload')
    xhr.send(formData)
  })
}

/**
 * React hook for CMS file upload with client-side validation and compression.
 *
 * For images when UPLOAD_PROVIDER=gcs: attempts direct upload to GCS via a
 * v4 signed URL (real GCS progress). If the direct upload fails for any reason
 * (e.g. CORS not configured on bucket), it automatically retries via the proxy
 * route so uploads always succeed.
 *
 * For PDFs or non-GCS providers: uses the proxy route (/api/cms/upload) only.
 *
 * `upload()` always either resolves with an UploadResult or throws an Error.
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

  const upload = useCallback(async (file: File, folder?: string): Promise<UploadResult> => {
    setStatus('idle')
    setProgress(0)
    setError(null)
    setResult(null)

    // ── 1. Client-side size validation ──
    const sizeError = validateFileSize(file)
    if (sizeError) {
      setError(sizeError)
      setStatus('error')
      throw new Error(sizeError)
    }

    // ── 2. Client-side image compression ──
    let fileToUpload = file
    if (file.type.startsWith('image/')) {
      setStatus('compressing')
      fileToUpload = await compressImageClient(file)
    }

    setStatus('uploading')

    // ── 3. For images: try presign → direct GCS upload (with proxy fallback) ──
    if (fileToUpload.type.startsWith('image/')) {
      let presignData: PresignResponse | null = null
      try {
        const res = await fetch('/api/cms/upload/presign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            filename: fileToUpload.name,
            mimeType: fileToUpload.type,
            folder,
            size: fileToUpload.size,
          }),
        })
        if (res.ok) {
          presignData = await res.json() as PresignResponse
        } else if (res.status === 413) {
          const body = await res.json().catch(() => ({})) as { error?: string }
          const msg = body.error ?? 'Ukuran file melebihi batas maksimum.'
          setError(msg)
          setStatus('error')
          throw new Error(msg)
        }
        // Other non-OK responses → fall through to proxy
      } catch (err) {
        if (err instanceof Error && err.message.includes('batas maksimum')) throw err
        // Network failure on presign → fall through to proxy
        console.warn('[useFileUpload] Presign request failed, falling back to proxy:', err)
      }

      if (presignData?.method === 'direct') {
        const outcome = await attemptDirectUpload(presignData, fileToUpload, file, setProgress)

        if (outcome.type === 'success') {
          setProgress(100)
          setStatus('done')
          setResult(outcome.result)
          return outcome.result
        }

        if (outcome.type === 'timeout') {
          const msg = 'Upload timeout. Koneksi lambat atau file terlalu besar.'
          setError(msg)
          setStatus('error')
          throw new Error(msg)
        }

        // outcome.type === 'fallback': reset progress and retry via proxy
        setProgress(0)
      }
      // presignData?.method === 'proxy', direct failed, or presign unavailable → proxy
    }

    // ── 4. Proxy upload via /api/cms/upload ──
    try {
      const data = await doProxyUpload(fileToUpload, folder, setProgress)
      setProgress(100)
      setStatus('done')
      setResult(data)
      return data
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload gagal.'
      setError(msg)
      setStatus('error')
      throw new Error(msg)
    }
  }, [])

  return { status, progress, error, result, upload, reset }
}

