import { NextResponse } from 'next/server'
import { getMongoDatabase } from '@/lib/mongodb'
import { calculateInsights, generateRecommendations } from '@/lib/server-insights'

function verifyPassword(request: Request): boolean {
  const password = request.headers.get('x-devtools-password')
  const expected = process.env.DEVTOOLS_PASSWORD || 'zullstack.dev'
  return password === expected
}

const RANGE_MS: Record<string, number> = {
  '1h': 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
  '90d': 90 * 24 * 60 * 60 * 1000,
  '1y': 365 * 24 * 60 * 60 * 1000,
}

export async function GET(request: Request) {
  if (!verifyPassword(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '24h'
    const includeInsights = searchParams.get('insights') === 'true'

    const rangeMs = RANGE_MS[range]
    if (!rangeMs) {
      return NextResponse.json(
        { error: 'Invalid range. Use: 1h, 6h, 24h, 7d, 30d, 90d, 1y' },
        { status: 400 }
      )
    }

    const db = await getMongoDatabase()
    const since = new Date(Date.now() - rangeMs)

    // For ranges > 30d, use daily summaries
    if (['90d', '1y'].includes(range)) {
      const dailyCollection = db.collection('server_stats_daily')
      const summaries = await dailyCollection
        .find({ date: { $gte: since } })
        .sort({ date: 1 })
        .toArray()

      const data = summaries.map((s) => ({
        timestamp: s.date,
        cpu: { avg: s.cpu.avg, min: s.cpu.min, max: s.cpu.max, p95: s.cpu.p95, p99: s.cpu.p99 },
        ram: { avg: s.ram.avg, min: s.ram.min, max: s.ram.max, p95: s.ram.p95, p99: s.ram.p99 },
        storage: { avg: s.storage.avg, min: s.storage.min, max: s.storage.max, p95: s.storage.p95, p99: s.storage.p99 },
        loadAvg1m: s.loadAvg1m,
        peakHour: s.peakHour,
        spikeCount: s.spikeCount,
        totalSamples: s.totalSamples,
      }))

      const result: Record<string, unknown> = { range, type: 'daily', data }

      if (includeInsights) {
        result.recommendations = generateRecommendations(
          summaries.map((s) => ({
            date: s.date,
            cpu: s.cpu,
            ram: s.ram,
            storage: s.storage,
            loadAvg1m: s.loadAvg1m,
            peakHour: s.peakHour,
            spikeCount: s.spikeCount,
            totalSamples: s.totalSamples,
          })),
          await getCurrentSpecs()
        )
      }

      return NextResponse.json(result)
    }

    // For ranges <= 30d, use raw data
    const rawCollection = db.collection('server_stats')

    // For 7d and 30d, aggregate by hour
    if (['7d', '30d'].includes(range)) {
      const pipeline = [
        { $match: { capturedAt: { $gte: since } } },
        { $sort: { capturedAt: 1 as const } },
        {
          $group: {
            _id: {
              year: { $year: '$capturedAt' },
              month: { $month: '$capturedAt' },
              day: { $dayOfMonth: '$capturedAt' },
              hour: { $hour: '$capturedAt' },
            },
            avgCpu: { $avg: '$cpu.usagePercent' },
            maxCpu: { $max: '$cpu.usagePercent' },
            avgRam: { $avg: '$ram.usagePercent' },
            maxRam: { $max: '$ram.usagePercent' },
            avgStorage: { $avg: '$storage.usagePercent' },
            avgLoad: { $avg: '$loadAverage.1m' },
            count: { $sum: 1 },
            firstTimestamp: { $first: '$capturedAt' },
          },
        },
        { $sort: { firstTimestamp: 1 as const } },
      ]

      const aggregated = await rawCollection.aggregate(pipeline).toArray()

      const data = aggregated.map((a) => ({
        timestamp: a.firstTimestamp,
        cpu: Math.round(a.avgCpu * 100) / 100,
        cpuMax: Math.round(a.maxCpu * 100) / 100,
        ram: Math.round(a.avgRam * 100) / 100,
        ramMax: Math.round(a.maxRam * 100) / 100,
        storage: Math.round(a.avgStorage * 100) / 100,
        loadAvg: Math.round(a.avgLoad * 100) / 100,
        samples: a.count,
      }))

      const result: Record<string, unknown> = { range, type: 'hourly', data }

      if (includeInsights) {
        const rawForInsights = await rawCollection
          .find({ capturedAt: { $gte: since } })
          .sort({ capturedAt: 1 })
          .project({ capturedAt: 1, 'cpu.usagePercent': 1, 'ram.usagePercent': 1, 'storage.usagePercent': 1 })
          .toArray()

        result.insights = calculateInsights(
          rawForInsights.map((d) => ({
            capturedAt: d.capturedAt.toISOString(),
            cpu: { usagePercent: d.cpu.usagePercent },
            ram: { usagePercent: d.ram.usagePercent },
            storage: { usagePercent: d.storage.usagePercent },
          }))
        )
      }

      return NextResponse.json(result)
    }

    // For 1h, 6h, 24h — return raw data
    const rawData = await rawCollection
      .find({ capturedAt: { $gte: since } })
      .sort({ capturedAt: 1 })
      .toArray()

    const data = rawData.map((d) => ({
      timestamp: d.capturedAt,
      cpu: d.cpu.usagePercent,
      ram: d.ram.usagePercent,
      storage: d.storage.usagePercent,
      loadAvg: d.loadAverage?.['1m'] ?? 0,
      cpuCores: d.cpu.cores,
      ramTotal: d.ram.totalBytes,
      storageTotal: d.storage.totalBytes,
    }))

    const result: Record<string, unknown> = { range, type: 'raw', data }

    if (includeInsights) {
      result.insights = calculateInsights(
        rawData.map((d) => ({
          capturedAt: d.capturedAt.toISOString(),
          cpu: { usagePercent: d.cpu.usagePercent },
          ram: { usagePercent: d.ram.usagePercent },
          storage: { usagePercent: d.storage.usagePercent },
        }))
      )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('[devtools] Failed to fetch history:', error)
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 })
  }
}

async function getCurrentSpecs() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const os = require('os')
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { execSync } = require('child_process')

  const ramTotalGB = Math.round((os.totalmem() / (1024 * 1024 * 1024)) * 10) / 10
  const cpuCores = os.cpus().length

  let storageTotalGB = 0
  try {
    const platform = os.platform()
    if (platform === 'win32') {
      const output = execSync('wmic logicaldisk get size /format:csv', { encoding: 'utf8' })
      const lines = output.trim().split('\n').filter(l => l.trim())
      if (lines.length >= 2) {
        storageTotalGB = Math.round(parseInt(lines[1].split(',')[1] || '0') / (1024 * 1024 * 1024))
      }
    } else {
      // Use df -k (1K-blocks) which works on both Linux and macOS
      const output = execSync('df -k /', { encoding: 'utf8' })
      const parts = output.trim().split('\n')[1]?.split(/\s+/)
      storageTotalGB = Math.round((parseInt(parts?.[1] || '0') * 1024) / (1024 * 1024 * 1024))
    }
  } catch {
    storageTotalGB = 0
  }

  return { cpuCores, ramTotalGB, storageTotalGB }
}
