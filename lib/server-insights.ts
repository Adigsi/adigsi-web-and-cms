import type { DailySummary } from './server-stats'

export interface Insight {
  type: 'peak' | 'trend' | 'spike' | 'correlation'
  severity: 'info' | 'warning' | 'critical'
  title: string
  description: string
  metric?: string
}

export interface Recommendation {
  component: 'cpu' | 'ram' | 'storage'
  action: 'upgrade' | 'downgrade' | 'maintain'
  urgency: 'low' | 'medium' | 'high'
  currentValue: string
  recommendedValue: string
  reason: string
  confidence: 'low' | 'medium' | 'high'
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/** Convert a Date to a new Date whose local fields reflect Asia/Jakarta (WIB) */
function toJakarta(date: Date): Date {
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
}

export function calculateInsights(
  historyData: Array<{
    capturedAt: string
    cpu: { usagePercent: number }
    ram: { usagePercent: number }
    storage: { usagePercent: number }
  }>
): Insight[] {
  if (historyData.length < 3) return []

  const insights: Insight[] = []

  // 1. Peak hours analysis
  const hourBuckets: Record<number, { cpu: number[]; ram: number[] }> = {}
  const dayHourBuckets: Record<string, { cpu: number[]; ram: number[] }> = {}

  for (const d of historyData) {
    const date = toJakarta(new Date(d.capturedAt))
    const hour = date.getHours()
    const dayOfWeek = date.getDay()
    const key = `${dayOfWeek}-${hour}`

    if (!hourBuckets[hour]) hourBuckets[hour] = { cpu: [], ram: [] }
    hourBuckets[hour].cpu.push(d.cpu.usagePercent)
    hourBuckets[hour].ram.push(d.ram.usagePercent)

    if (!dayHourBuckets[key]) dayHourBuckets[key] = { cpu: [], ram: [] }
    dayHourBuckets[key].cpu.push(d.cpu.usagePercent)
    dayHourBuckets[key].ram.push(d.ram.usagePercent)
  }

  // Find top 3 peak hours
  const hourAvgs = Object.entries(hourBuckets)
    .map(([hour, data]) => ({
      hour: parseInt(hour),
      avgCpu: data.cpu.reduce((a, b) => a + b, 0) / data.cpu.length,
      avgRam: data.ram.reduce((a, b) => a + b, 0) / data.ram.length,
      combined: (data.cpu.reduce((a, b) => a + b, 0) / data.cpu.length +
                 data.ram.reduce((a, b) => a + b, 0) / data.ram.length) / 2,
    }))
    .sort((a, b) => b.combined - a.combined)

  if (hourAvgs.length > 0) {
    const top = hourAvgs.slice(0, 3)
    const hourStr = top.map(h => `${String(h.hour).padStart(2, '0')}:00`).join(', ')
    insights.push({
      type: 'peak',
      severity: top[0].combined > 80 ? 'critical' : top[0].combined > 50 ? 'warning' : 'info',
      title: 'Peak Usage Hours',
      description: `Highest server load occurs at ${hourStr} WIB. Peak combined usage: ${Math.round(top[0].combined)}%.`,
    })
  }

  // Find peak day-hour combination
  const dayHourAvgs = Object.entries(dayHourBuckets)
    .map(([key, data]) => {
      const [day, hour] = key.split('-').map(Number)
      return {
        day, hour,
        combined: (data.cpu.reduce((a, b) => a + b, 0) / data.cpu.length +
                   data.ram.reduce((a, b) => a + b, 0) / data.ram.length) / 2,
      }
    })
    .sort((a, b) => b.combined - a.combined)

  if (dayHourAvgs.length > 0) {
    const top = dayHourAvgs[0]
    insights.push({
      type: 'peak',
      severity: 'info',
      title: 'Peak Day & Time',
      description: `Highest load on ${DAY_NAMES[top.day]} at ${String(top.hour).padStart(2, '0')}:00 WIB (avg ${Math.round(top.combined)}%).`,
    })
  }

  // 2. Spike detection (values > 2 standard deviations from mean)
  for (const metric of ['cpu', 'ram', 'storage'] as const) {
    const values = historyData.map((d) => {
      if (metric === 'cpu') return d.cpu.usagePercent
      if (metric === 'ram') return d.ram.usagePercent
      return d.storage.usagePercent
    })

    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length)
    const threshold = mean + 2 * stdDev
    const spikes = values.filter((v) => v > threshold)

    if (spikes.length > 0 && stdDev > 5) {
      insights.push({
        type: 'spike',
        severity: spikes.some(s => s > 90) ? 'critical' : 'warning',
        title: `${metric.toUpperCase()} Spikes Detected`,
        description: `${spikes.length} spike(s) detected (>${Math.round(threshold)}%). Mean: ${Math.round(mean)}%, StdDev: ${Math.round(stdDev)}%.`,
        metric,
      })
    }
  }

  // 3. Trend analysis (first half vs second half)
  const mid = Math.floor(historyData.length / 2)
  if (mid > 0) {
    const firstHalf = historyData.slice(0, mid)
    const secondHalf = historyData.slice(mid)

    for (const metric of ['cpu', 'ram'] as const) {
      const getVal = (d: typeof historyData[0]) => metric === 'cpu' ? d.cpu.usagePercent : d.ram.usagePercent
      const firstAvg = firstHalf.reduce((a, d) => a + getVal(d), 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((a, d) => a + getVal(d), 0) / secondHalf.length
      const changePct = ((secondAvg - firstAvg) / (firstAvg || 1)) * 100

      if (Math.abs(changePct) > 10) {
        const trend = changePct > 0 ? 'increasing' : 'decreasing'
        insights.push({
          type: 'trend',
          severity: changePct > 20 ? 'warning' : 'info',
          title: `${metric.toUpperCase()} Usage ${trend === 'increasing' ? 'Rising' : 'Declining'}`,
          description: `${metric.toUpperCase()} usage ${trend} by ${Math.abs(Math.round(changePct))}% (${Math.round(firstAvg)}% → ${Math.round(secondAvg)}%).`,
          metric,
        })
      }
    }
  }

  // 4. Correlation: CPU + RAM spike = traffic spike
  let correlatedSpikes = 0
  for (const d of historyData) {
    if (d.cpu.usagePercent > 70 && d.ram.usagePercent > 70) {
      correlatedSpikes++
    }
  }
  if (correlatedSpikes > 2) {
    insights.push({
      type: 'correlation',
      severity: correlatedSpikes > 10 ? 'critical' : 'warning',
      title: 'Traffic Surge Pattern',
      description: `${correlatedSpikes} instances where both CPU and RAM exceeded 70%, indicating potential traffic surges.`,
    })
  }

  return insights
}

const CPU_TIERS = [1, 2, 4, 8, 16, 32, 64]
const RAM_TIERS_GB = [0.5, 1, 2, 4, 8, 16, 32, 64, 128]
const STORAGE_TIERS_GB = [10, 20, 40, 50, 80, 100, 150, 200, 250, 300, 500, 1000, 2000]

function findNextTier(current: number, tiers: number[], direction: 'up' | 'down'): number {
  if (direction === 'up') {
    return tiers.find((t) => t > current) ?? tiers[tiers.length - 1]
  }
  return [...tiers].reverse().find((t) => t < current) ?? tiers[0]
}

export function generateRecommendations(
  dailySummaries: DailySummary[],
  currentSpecs: {
    cpuCores: number
    ramTotalGB: number
    storageTotalGB: number
  }
): Recommendation[] {
  const recommendations: Recommendation[] = []
  const dataPoints = dailySummaries.length
  const confidence: 'low' | 'medium' | 'high' = dataPoints < 30 ? 'low' : dataPoints < 90 ? 'medium' : 'high'

  if (dataPoints === 0) return recommendations

  // CPU Recommendation
  const cpuAvg = dailySummaries.reduce((a, d) => a + d.cpu.avg, 0) / dataPoints
  const cpuP95 = Math.max(...dailySummaries.map(d => d.cpu.p95))
  const cpuMax = Math.max(...dailySummaries.map(d => d.cpu.max))

  if (cpuAvg > 75 || cpuP95 > 90) {
    const next = findNextTier(currentSpecs.cpuCores, CPU_TIERS, 'up')
    recommendations.push({
      component: 'cpu',
      action: 'upgrade',
      urgency: cpuAvg > 85 ? 'high' : cpuP95 > 90 ? 'high' : 'medium',
      currentValue: `${currentSpecs.cpuCores} Core${currentSpecs.cpuCores > 1 ? 's' : ''}`,
      recommendedValue: `${next} Core${next > 1 ? 's' : ''}`,
      reason: `Average CPU usage ${Math.round(cpuAvg)}%, P95: ${Math.round(cpuP95)}%, Peak: ${Math.round(cpuMax)}%.`,
      confidence,
    })
  } else if (cpuAvg < 25 && cpuP95 < 50) {
    const next = findNextTier(currentSpecs.cpuCores, CPU_TIERS, 'down')
    if (next < currentSpecs.cpuCores) {
      recommendations.push({
        component: 'cpu',
        action: 'downgrade',
        urgency: 'low',
        currentValue: `${currentSpecs.cpuCores} Core${currentSpecs.cpuCores > 1 ? 's' : ''}`,
        recommendedValue: `${next} Core${next > 1 ? 's' : ''}`,
        reason: `Average CPU usage only ${Math.round(cpuAvg)}%, P95: ${Math.round(cpuP95)}%. Resources are underutilized.`,
        confidence,
      })
    }
  } else {
    recommendations.push({
      component: 'cpu',
      action: 'maintain',
      urgency: 'low',
      currentValue: `${currentSpecs.cpuCores} Core${currentSpecs.cpuCores > 1 ? 's' : ''}`,
      recommendedValue: `${currentSpecs.cpuCores} Core${currentSpecs.cpuCores > 1 ? 's' : ''}`,
      reason: `CPU usage is healthy. Average: ${Math.round(cpuAvg)}%, P95: ${Math.round(cpuP95)}%.`,
      confidence,
    })
  }

  // RAM Recommendation
  const ramAvg = dailySummaries.reduce((a, d) => a + d.ram.avg, 0) / dataPoints
  const ramP95 = Math.max(...dailySummaries.map(d => d.ram.p95))
  const ramMax = Math.max(...dailySummaries.map(d => d.ram.max))

  if (ramAvg > 75 || ramP95 > 90) {
    const next = findNextTier(currentSpecs.ramTotalGB, RAM_TIERS_GB, 'up')
    recommendations.push({
      component: 'ram',
      action: 'upgrade',
      urgency: ramAvg > 85 ? 'high' : ramP95 > 90 ? 'high' : 'medium',
      currentValue: `${currentSpecs.ramTotalGB} GB`,
      recommendedValue: `${next} GB`,
      reason: `Average RAM usage ${Math.round(ramAvg)}%, P95: ${Math.round(ramP95)}%, Peak: ${Math.round(ramMax)}%.`,
      confidence,
    })
  } else if (ramAvg < 25 && ramP95 < 50) {
    const next = findNextTier(currentSpecs.ramTotalGB, RAM_TIERS_GB, 'down')
    if (next < currentSpecs.ramTotalGB) {
      recommendations.push({
        component: 'ram',
        action: 'downgrade',
        urgency: 'low',
        currentValue: `${currentSpecs.ramTotalGB} GB`,
        recommendedValue: `${next} GB`,
        reason: `Average RAM usage only ${Math.round(ramAvg)}%, P95: ${Math.round(ramP95)}%. Resources are underutilized.`,
        confidence,
      })
    }
  } else {
    recommendations.push({
      component: 'ram',
      action: 'maintain',
      urgency: 'low',
      currentValue: `${currentSpecs.ramTotalGB} GB`,
      recommendedValue: `${currentSpecs.ramTotalGB} GB`,
      reason: `RAM usage is healthy. Average: ${Math.round(ramAvg)}%, P95: ${Math.round(ramP95)}%.`,
      confidence,
    })
  }

  // Storage Recommendation
  const storageAvg = dailySummaries.reduce((a, d) => a + d.storage.avg, 0) / dataPoints
  const storageMax = Math.max(...dailySummaries.map(d => d.storage.max))

  if (storageAvg > 80 || storageMax > 90) {
    const next = findNextTier(currentSpecs.storageTotalGB, STORAGE_TIERS_GB, 'up')
    recommendations.push({
      component: 'storage',
      action: 'upgrade',
      urgency: storageAvg > 90 ? 'high' : 'medium',
      currentValue: `${currentSpecs.storageTotalGB} GB`,
      recommendedValue: `${next} GB`,
      reason: `Average storage usage ${Math.round(storageAvg)}%, Peak: ${Math.round(storageMax)}%. Running out of space.`,
      confidence,
    })
  } else if (storageAvg < 30 && storageMax < 50) {
    const next = findNextTier(currentSpecs.storageTotalGB, STORAGE_TIERS_GB, 'down')
    if (next < currentSpecs.storageTotalGB) {
      recommendations.push({
        component: 'storage',
        action: 'downgrade',
        urgency: 'low',
        currentValue: `${currentSpecs.storageTotalGB} GB`,
        recommendedValue: `${next} GB`,
        reason: `Average storage usage only ${Math.round(storageAvg)}%. Significant space unused.`,
        confidence,
      })
    }
  } else {
    recommendations.push({
      component: 'storage',
      action: 'maintain',
      urgency: 'low',
      currentValue: `${currentSpecs.storageTotalGB} GB`,
      recommendedValue: `${currentSpecs.storageTotalGB} GB`,
      reason: `Storage usage is healthy. Average: ${Math.round(storageAvg)}%, Peak: ${Math.round(storageMax)}%.`,
      confidence,
    })
  }

  return recommendations
}
