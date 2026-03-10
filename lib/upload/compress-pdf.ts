import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import { tmpdir } from 'os'
import path from 'path'
import { randomBytes } from 'crypto'

const execAsync = promisify(exec)
const GS_TIMEOUT_MS = 120_000 // 2 minutes max

/**
 * Check if ghostscript is available on the system.
 * Result is cached after first check.
 */
let gsAvailableCache: boolean | null = null

async function isGhostscriptAvailable(): Promise<boolean> {
  if (gsAvailableCache !== null) return gsAvailableCache
  try {
    await execAsync('gs --version', { timeout: 5000 })
    gsAvailableCache = true
  } catch {
    gsAvailableCache = false
    console.warn('[PDF Compress] ghostscript not found. PDF will be uploaded without compression.')
    console.warn('[PDF Compress] Install with: sudo apt install ghostscript')
  }
  return gsAvailableCache
}

/**
 * Compress a PDF buffer using ghostscript /ebook preset.
 * - 150 dpi: high enough for reading, significantly smaller than /printer
 * - Text remains selectable and sharp
 *
 * Returns compressed buffer, or the original buffer if ghostscript is unavailable
 * or compression doesn't help (output > input).
 */
export async function compressPdf(inputBuffer: Buffer): Promise<Buffer> {
  const available = await isGhostscriptAvailable()
  if (!available) return inputBuffer

  const id = randomBytes(8).toString('hex')
  const inputPath = path.join(tmpdir(), `cms_pdf_in_${id}.pdf`)
  const outputPath = path.join(tmpdir(), `cms_pdf_out_${id}.pdf`)

  try {
    await fs.writeFile(inputPath, inputBuffer)

    const gsCmd = [
      'gs',
      '-sDEVICE=pdfwrite',
      '-dCompatibilityLevel=1.4',
      '-dPDFSETTINGS=/ebook',
      '-dNOPAUSE',
      '-dQUIET',
      '-dBATCH',
      `-sOutputFile=${outputPath}`,
      inputPath,
    ].join(' ')

    await execAsync(gsCmd, { timeout: GS_TIMEOUT_MS })

    const compressed = await fs.readFile(outputPath)

    // Only use compressed version if it's actually smaller
    if (compressed.byteLength < inputBuffer.byteLength) {
      console.info(
        `[PDF Compress] ${(inputBuffer.byteLength / 1024).toFixed(0)} KB → ${(compressed.byteLength / 1024).toFixed(0)} KB` +
        ` (${Math.round((1 - compressed.byteLength / inputBuffer.byteLength) * 100)}% reduction)`
      )
      return compressed
    }

    return inputBuffer
  } catch (error) {
    console.error('[PDF Compress] ghostscript error, using original:', error instanceof Error ? error.message : error)
    return inputBuffer
  } finally {
    await Promise.all([
      fs.unlink(inputPath).catch(() => {}),
      fs.unlink(outputPath).catch(() => {}),
    ])
  }
}
