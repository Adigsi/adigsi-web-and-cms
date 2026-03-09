import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { lookup as mimeLookup } from 'mime-types'

export const runtime = 'nodejs'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const basePath = process.env.UPLOAD_LOCAL_PATH
  if (!basePath) {
    return NextResponse.json(
      { error: 'UPLOAD_LOCAL_PATH belum dikonfigurasi di server.' },
      { status: 500 }
    )
  }

  // Reconstruct the relative path from URL segments
  const { path: segments } = await params
  if (!segments || segments.length === 0) {
    return new NextResponse(null, { status: 404 })
  }

  // Resolve the absolute path and validate it stays within basePath
  const resolvedBase = path.resolve(basePath)
  const requestedPath = path.resolve(resolvedBase, ...segments)

  // Path traversal prevention: ensure resolvedPath starts with resolvedBase
  if (!requestedPath.startsWith(resolvedBase + path.sep) && requestedPath !== resolvedBase) {
    return new NextResponse(null, { status: 403 })
  }

  // Check file exists
  let stat: fs.Stats
  try {
    stat = fs.statSync(requestedPath)
  } catch {
    return new NextResponse(null, { status: 404 })
  }

  if (!stat.isFile()) {
    return new NextResponse(null, { status: 404 })
  }

  const mimeType = mimeLookup(requestedPath) || 'application/octet-stream'
  const fileSize = stat.size

  // Stream the file
  const stream = fs.createReadStream(requestedPath)
  const readable = new ReadableStream({
    start(controller) {
      stream.on('data', (chunk) => controller.enqueue(chunk))
      stream.on('end', () => controller.close())
      stream.on('error', (err) => controller.error(err))
    },
    cancel() {
      stream.destroy()
    },
  })

  return new NextResponse(readable, {
    headers: {
      'Content-Type': mimeType,
      'Content-Length': String(fileSize),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
