import { getMongoDatabase } from './mongodb'

// Dynamic imports to avoid Edge Runtime bundling errors
// These modules are only available in Node.js runtime
function getOs(): typeof import('os') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('os')
}
function exec(cmd: string): string {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('child_process').execSync(cmd, { encoding: 'utf8' })
}

export interface ServerStats {
  cpu: {
    cores: number
    model: string
    usagePercent: number
    perCore: number[]
  }
  ram: {
    totalBytes: number
    usedBytes: number
    freeBytes: number
    usagePercent: number
  }
  storage: {
    totalBytes: number
    usedBytes: number
    availableBytes: number
    usagePercent: number
    disks: Array<{
      mountPoint: string
      filesystem: string
      totalBytes: number
      usedBytes: number
      availableBytes: number
      usagePercent: number
    }>
  }
  loadAverage: {
    '1m': number
    '5m': number
    '15m': number
  }
  uptime: number
  hostname: string
  platform: string
  arch: string
  capturedAt: Date
}

export interface DailySummary {
  date: Date
  cpu: MetricSummary
  ram: MetricSummary
  storage: MetricSummary
  loadAvg1m: MetricSummary
  peakHour: number
  spikeCount: { cpu: number; ram: number; storage: number }
  totalSamples: number
}

export interface MetricSummary {
  avg: number
  min: number
  max: number
  p95: number
  p99: number
}

function getCpuUsage(): Promise<{ usagePercent: number; perCore: number[] }> {
  return new Promise((resolve) => {
    const os = getOs()
    const startCpus = os.cpus()

    setTimeout(() => {
      const endCpus = os.cpus()
      const perCore: number[] = []
      let totalIdleDiff = 0
      let totalTotalDiff = 0

      for (let i = 0; i < endCpus.length; i++) {
        const startTotal = Object.values(startCpus[i].times).reduce((a, b) => a + b, 0)
        const endTotal = Object.values(endCpus[i].times).reduce((a, b) => a + b, 0)
        const totalDiff = endTotal - startTotal
        const idleDiff = endCpus[i].times.idle - startCpus[i].times.idle

        totalIdleDiff += idleDiff
        totalTotalDiff += totalDiff

        const coreUsage = totalDiff > 0 ? ((totalDiff - idleDiff) / totalDiff) * 100 : 0
        perCore.push(Math.round(coreUsage * 100) / 100)
      }

      const usagePercent = totalTotalDiff > 0
        ? Math.round(((totalTotalDiff - totalIdleDiff) / totalTotalDiff) * 100 * 100) / 100
        : 0

      resolve({ usagePercent, perCore })
    }, 1000)
  })
}

interface DiskInfo {
  mountPoint: string
  filesystem: string
  totalBytes: number
  usedBytes: number
  availableBytes: number
  usagePercent: number
}

interface StorageInfo {
  totalBytes: number
  usedBytes: number
  availableBytes: number
  usagePercent: number
  disks: DiskInfo[]
}

// Filesystems to exclude (virtual/pseudo filesystems)
const EXCLUDED_FS_TYPES = new Set([
  'tmpfs', 'devtmpfs', 'sysfs', 'proc', 'devpts', 'securityfs',
  'cgroup', 'cgroup2', 'pstore', 'debugfs', 'hugetlbfs', 'mqueue',
  'configfs', 'fusectl', 'tracefs', 'bpf', 'overlay', 'squashfs',
  'nsfs', 'ramfs', 'rpc_pipefs', 'nfsd', 'autofs',
])

// Filesystem name patterns to exclude
const EXCLUDED_FS_PATTERNS = [
  /^\/dev\/loop/, // snap loop devices
  /^none$/,
  /^udev$/,
  /^shm$/,
]

function getStorageInfo(): StorageInfo {
  try {
    const os = getOs()
    const platform = os.platform()

    if (platform === 'win32') {
      const output = exec('wmic logicaldisk get size,freespace,caption,filesystem /format:csv')
      const lines = output.trim().split('\n').filter(l => l.trim())
      const disks: DiskInfo[] = []

      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',')
        if (parts.length < 4) continue
        const freeSpace = parseInt(parts[2]) || 0
        const size = parseInt(parts[3]) || 0
        if (size === 0) continue
        disks.push({
          mountPoint: parts[0] || `Drive${i}`,
          filesystem: parts[1] || 'NTFS',
          totalBytes: size,
          usedBytes: size - freeSpace,
          availableBytes: freeSpace,
          usagePercent: Math.round(((size - freeSpace) / size) * 100 * 100) / 100,
        })
      }

      const totalBytes = disks.reduce((s, d) => s + d.totalBytes, 0)
      const usedBytes = disks.reduce((s, d) => s + d.usedBytes, 0)
      const availableBytes = disks.reduce((s, d) => s + d.availableBytes, 0)

      return {
        totalBytes,
        usedBytes,
        availableBytes,
        usagePercent: totalBytes > 0 ? Math.round((usedBytes / totalBytes) * 100 * 100) / 100 : 0,
        disks,
      }
    }

    // Linux / macOS: use df -kT (with filesystem type) on Linux, df -k on macOS
    let output: string
    let hasType = false
    try {
      // df -kT includes filesystem type column (Linux only)
      output = exec('df -kT')
      hasType = true
    } catch {
      // macOS doesn't support -T, use df -k
      output = exec('df -k')
    }

    const lines = output.trim().split('\n')
    if (lines.length < 2) throw new Error('No disk info')

    const disks: DiskInfo[] = []

    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(/\s+/)
      if (parts.length < 6) continue

      const filesystem = parts[0]
      let fsType: string
      let kBlocks: number
      let used: number
      let available: number
      let mountPoint: string

      if (hasType) {
        // df -kT columns: Filesystem, Type, 1K-blocks, Used, Available, Use%, Mounted on
        fsType = parts[1]
        kBlocks = parseInt(parts[2]) || 0
        used = parseInt(parts[3]) || 0
        available = parseInt(parts[4]) || 0
        mountPoint = parts[6] || parts[parts.length - 1]
      } else {
        // df -k columns: Filesystem, 1K-blocks, Used, Available, Use%, Mounted on
        fsType = ''
        kBlocks = parseInt(parts[1]) || 0
        used = parseInt(parts[2]) || 0
        available = parseInt(parts[3]) || 0
        mountPoint = parts[5] || parts[parts.length - 1]
      }

      // Skip virtual/pseudo filesystems
      if (fsType && EXCLUDED_FS_TYPES.has(fsType)) continue
      if (EXCLUDED_FS_PATTERNS.some(p => p.test(filesystem))) continue
      if (!filesystem.startsWith('/') && filesystem !== 'map') continue // only real device paths
      if (kBlocks === 0) continue

      const totalBytes = kBlocks * 1024
      const usedBytes = used * 1024
      const availableBytes = available * 1024

      disks.push({
        mountPoint,
        filesystem,
        totalBytes,
        usedBytes,
        availableBytes,
        usagePercent: totalBytes > 0 ? Math.round((usedBytes / totalBytes) * 100 * 100) / 100 : 0,
      })
    }

    // Deduplicate: on macOS, same device can appear for multiple mount points (e.g. /dev/disk3s1 and /dev/disk3s1s1)
    // Keep the entry mounted at / and other unique devices
    const seen = new Set<string>()
    const uniqueDisks = disks.filter(d => {
      // Normalize filesystem name (strip snapshot suffix like s1s1 → s1)
      const baseFs = d.filesystem.replace(/s\d+$/, '')
      if (seen.has(baseFs)) return false
      seen.add(baseFs)
      return true
    })

    const totalBytes = uniqueDisks.reduce((s, d) => s + d.totalBytes, 0)
    const usedBytes = uniqueDisks.reduce((s, d) => s + d.usedBytes, 0)
    const availableBytes = uniqueDisks.reduce((s, d) => s + d.availableBytes, 0)

    return {
      totalBytes,
      usedBytes,
      availableBytes,
      usagePercent: totalBytes > 0 ? Math.round((usedBytes / totalBytes) * 100 * 100) / 100 : 0,
      disks: uniqueDisks,
    }
  } catch {
    return {
      totalBytes: 0,
      usedBytes: 0,
      availableBytes: 0,
      usagePercent: 0,
      disks: [],
    }
  }
}

export async function captureServerStats(): Promise<ServerStats> {
  const os = getOs()
  const cpuInfo = os.cpus()
  const { usagePercent, perCore } = await getCpuUsage()
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem
  const storage = getStorageInfo()
  const [load1, load5, load15] = os.loadavg()

  return {
    cpu: {
      cores: cpuInfo.length,
      model: cpuInfo[0]?.model || 'Unknown',
      usagePercent,
      perCore,
    },
    ram: {
      totalBytes: totalMem,
      usedBytes: usedMem,
      freeBytes: freeMem,
      usagePercent: Math.round((usedMem / totalMem) * 100 * 100) / 100,
    },
    storage: {
      totalBytes: storage.totalBytes,
      usedBytes: storage.usedBytes,
      availableBytes: storage.availableBytes,
      usagePercent: storage.usagePercent,
      disks: storage.disks,
    },
    loadAverage: {
      '1m': Math.round(load1 * 100) / 100,
      '5m': Math.round(load5 * 100) / 100,
      '15m': Math.round(load15 * 100) / 100,
    },
    uptime: os.uptime(),
    hostname: os.hostname(),
    platform: `${os.platform()} ${os.release()}`,
    arch: os.arch(),
    capturedAt: new Date(),
  }
}

export async function saveStats(stats: ServerStats): Promise<void> {
  const db = await getMongoDatabase()
  const collection = db.collection('server_stats')

  await collection.insertOne(stats)

  // Ensure TTL index exists
  const retentionDays = parseInt(process.env.DEVTOOLS_STATS_RETENTION_DAYS || '30', 10)
  const indexes = await collection.indexes()
  const hasTTL = indexes.some((idx) => idx.name === 'capturedAt_ttl')
  if (!hasTTL) {
    await collection.createIndex(
      { capturedAt: 1 },
      { expireAfterSeconds: retentionDays * 86400, name: 'capturedAt_ttl' }
    )
  }
}

export async function generateDailySummary(dateStr: string): Promise<void> {
  const db = await getMongoDatabase()
  const dailyCollection = db.collection('server_stats_daily')

  // Check if summary already exists for this date
  const startOfDay = new Date(dateStr + 'T00:00:00.000Z')
  const endOfDay = new Date(dateStr + 'T23:59:59.999Z')

  const existing = await dailyCollection.findOne({
    date: { $gte: startOfDay, $lte: endOfDay },
  })
  if (existing) return

  const rawCollection = db.collection('server_stats')
  const rawData = await rawCollection
    .find({ capturedAt: { $gte: startOfDay, $lte: endOfDay } })
    .toArray()

  if (rawData.length === 0) return

  const cpuValues = rawData.map((d) => d.cpu.usagePercent)
  const ramValues = rawData.map((d) => d.ram.usagePercent)
  const storageValues = rawData.map((d) => d.storage.usagePercent)
  const loadValues = rawData.map((d) => d.loadAverage['1m'])

  // Find peak hour
  const hourBuckets: Record<number, number[]> = {}
  for (const d of rawData) {
    const hour = new Date(d.capturedAt).getUTCHours()
    if (!hourBuckets[hour]) hourBuckets[hour] = []
    hourBuckets[hour].push(d.cpu.usagePercent + d.ram.usagePercent)
  }
  let peakHour = 0
  let peakAvg = 0
  for (const [hour, values] of Object.entries(hourBuckets)) {
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    if (avg > peakAvg) {
      peakAvg = avg
      peakHour = parseInt(hour)
    }
  }

  const summary: DailySummary = {
    date: startOfDay,
    cpu: calcMetricSummary(cpuValues),
    ram: calcMetricSummary(ramValues),
    storage: calcMetricSummary(storageValues),
    loadAvg1m: calcMetricSummary(loadValues),
    peakHour,
    spikeCount: {
      cpu: cpuValues.filter((v) => v > 90).length,
      ram: ramValues.filter((v) => v > 90).length,
      storage: storageValues.filter((v) => v > 90).length,
    },
    totalSamples: rawData.length,
  }

  await dailyCollection.insertOne(summary)

  // Ensure TTL index exists
  const retentionDays = parseInt(process.env.DEVTOOLS_SUMMARY_RETENTION_DAYS || '365', 10)
  const indexes = await dailyCollection.indexes()
  const hasTTL = indexes.some((idx) => idx.name === 'date_ttl')
  if (!hasTTL) {
    await dailyCollection.createIndex(
      { date: 1 },
      { expireAfterSeconds: retentionDays * 86400, name: 'date_ttl' }
    )
  }
}

function calcMetricSummary(values: number[]): MetricSummary {
  const sorted = [...values].sort((a, b) => a - b)
  const len = sorted.length

  const avg = Math.round((values.reduce((a, b) => a + b, 0) / len) * 100) / 100
  const min = Math.round(sorted[0] * 100) / 100
  const max = Math.round(sorted[len - 1] * 100) / 100
  const p95 = Math.round(sorted[Math.floor(len * 0.95)] * 100) / 100
  const p99 = Math.round(sorted[Math.floor(len * 0.99)] * 100) / 100

  return { avg, min, max, p95, p99 }
}
