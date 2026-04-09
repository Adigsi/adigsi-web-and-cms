'use client'

import { useState, useEffect, useCallback } from 'react'
import { ArrowUp, ArrowDown, Minus, Cpu, MemoryStick, HardDrive, AlertCircle, Shield } from 'lucide-react'

interface RecommendationPanelProps {
  headers: Record<string, string>
}

interface Recommendation {
  component: 'cpu' | 'ram' | 'storage'
  action: 'upgrade' | 'downgrade' | 'maintain'
  urgency: 'low' | 'medium' | 'high'
  currentValue: string
  recommendedValue: string
  reason: string
  confidence: 'low' | 'medium' | 'high'
}

const COMPONENT_ICONS = {
  cpu: Cpu,
  ram: MemoryStick,
  storage: HardDrive,
}

const COMPONENT_LABELS = {
  cpu: 'CPU',
  ram: 'RAM',
  storage: 'Storage',
}

const ACTION_STYLES = {
  upgrade: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    badge: 'bg-red-500/20 text-red-400',
    icon: ArrowUp,
    label: 'Upgrade',
  },
  downgrade: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    badge: 'bg-emerald-500/20 text-emerald-400',
    icon: ArrowDown,
    label: 'Downgrade',
  },
  maintain: {
    bg: 'bg-zinc-800/50',
    border: 'border-zinc-700',
    badge: 'bg-zinc-700 text-zinc-300',
    icon: Minus,
    label: 'Maintain',
  },
}

const URGENCY_BADGE = {
  low: 'bg-zinc-700 text-zinc-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  high: 'bg-red-500/20 text-red-400',
}

const CONFIDENCE_LABELS = {
  low: 'Low confidence (< 30 days of data)',
  medium: 'Medium confidence (30-90 days of data)',
  high: 'High confidence (90+ days of data)',
}

export function RecommendationPanel({ headers }: RecommendationPanelProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState('')

  const fetchRecommendations = useCallback(async () => {
    setLoading(true)
    try {
      // Try to get recommendations from daily summaries (long-term data)
      let res = await fetch('/api/devtools/history?range=1y&insights=true', { headers })
      if (res.ok) {
        const json = await res.json()
        if (json.recommendations && json.recommendations.length > 0) {
          setRecommendations(json.recommendations)
          setDataSource(`Based on ${json.data.length} daily summaries`)
          setLoading(false)
          return
        }
      }

      // Fallback: use 30d raw data
      res = await fetch('/api/devtools/history?range=30d&insights=true', { headers })
      if (res.ok) {
        const json = await res.json()
        // Generate client-side recommendations from raw/hourly data
        if (json.data && json.data.length > 0) {
          const recs = generateClientRecommendations(json.data, json.type)
          setRecommendations(recs)
          setDataSource(`Based on ${json.data.length} ${json.type} data points (limited data)`)
        }
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    } finally {
      setLoading(false)
    }
  }, [headers])

  useEffect(() => {
    fetchRecommendations()
  }, [fetchRecommendations])

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="mb-4">
        <h2 className="text-sm font-medium text-zinc-200">Server Recommendations</h2>
        <p className="text-xs text-zinc-500 mt-0.5">{dataSource || 'Loading recommendations...'}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-zinc-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : recommendations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
          <Shield className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm">No recommendations yet</p>
          <p className="text-xs mt-1">Recommendations will appear once enough data is collected</p>
        </div>
      ) : (
        <>
          {/* Confidence disclaimer */}
          {recommendations.some((r) => r.confidence === 'low') && (
            <div className="flex items-start gap-2 mb-4 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-yellow-400" />
              <p className="text-[11px] text-yellow-400 leading-relaxed">
                Limited data available. Recommendations may change as more data is collected.
                Ideally, wait for 90+ days of data for accurate recommendations.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recommendations.map((rec) => {
              const style = ACTION_STYLES[rec.action]
              const CompIcon = COMPONENT_ICONS[rec.component]
              const ActionIcon = style.icon

              return (
                <div
                  key={rec.component}
                  className={`${style.bg} border ${style.border} rounded-lg p-4`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <CompIcon className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm font-medium text-zinc-200">
                        {COMPONENT_LABELS[rec.component]}
                      </span>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${style.badge}`}>
                      <ActionIcon className="w-2.5 h-2.5" />
                      {style.label}
                    </span>
                  </div>

                  {rec.action !== 'maintain' ? (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
                        {rec.currentValue}
                      </span>
                      <ActionIcon className={`w-3 h-3 ${rec.action === 'upgrade' ? 'text-red-400' : 'text-emerald-400'}`} />
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        rec.action === 'upgrade'
                          ? 'bg-red-500/20 text-red-300'
                          : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        {rec.recommendedValue}
                      </span>
                    </div>
                  ) : (
                    <div className="mb-3">
                      <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-1 rounded">
                        {rec.currentValue}
                      </span>
                    </div>
                  )}

                  <p className="text-[11px] text-zinc-400 leading-relaxed">{rec.reason}</p>

                  <div className="flex items-center gap-2 mt-3 pt-2 border-t border-zinc-700/50">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded ${URGENCY_BADGE[rec.urgency]}`}>
                      {rec.urgency.toUpperCase()} URGENCY
                    </span>
                    <span className="text-[9px] text-zinc-600" title={CONFIDENCE_LABELS[rec.confidence]}>
                      {rec.confidence.toUpperCase()} CONF.
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

// Client-side recommendation generator for when daily summaries aren't available
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateClientRecommendations(data: any[], type: string): Recommendation[] {
  if (data.length === 0) return []

  const recommendations: Recommendation[] = []
  const confidence: 'low' | 'medium' | 'high' = data.length < 50 ? 'low' : data.length < 200 ? 'medium' : 'high'

  const cpuValues = data.map((d) => typeof d.cpu === 'number' ? d.cpu : d.cpu?.avg ?? 0)
  const ramValues = data.map((d) => typeof d.ram === 'number' ? d.ram : d.ram?.avg ?? 0)
  const storageValues = data.map((d) => typeof d.storage === 'number' ? d.storage : d.storage?.avg ?? 0)

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length
  const p95 = (arr: number[]) => {
    const sorted = [...arr].sort((a, b) => a - b)
    return sorted[Math.floor(sorted.length * 0.95)]
  }

  // Get current specs from first data point
  const first = data[0]
  const cpuCores = first.cpuCores || 0
  const ramTotalGB = first.ramTotal ? Math.round(first.ramTotal / (1024 * 1024 * 1024) * 10) / 10 : 0
  const storageTotalGB = first.storageTotal ? Math.round(first.storageTotal / (1024 * 1024 * 1024)) : 0

  const CPU_TIERS = [1, 2, 4, 8, 16, 32, 64]
  const RAM_TIERS = [0.5, 1, 2, 4, 8, 16, 32, 64, 128]
  const STORAGE_TIERS = [10, 20, 40, 50, 80, 100, 150, 200, 250, 300, 500, 1000, 2000]

  const findNext = (current: number, tiers: number[], dir: 'up' | 'down') => {
    if (dir === 'up') return tiers.find(t => t > current) ?? tiers[tiers.length - 1]
    return [...tiers].reverse().find(t => t < current) ?? tiers[0]
  }

  // CPU
  const cpuAvg = avg(cpuValues)
  const cpuP95 = p95(cpuValues)
  if (cpuCores > 0) {
    if (cpuAvg > 75 || cpuP95 > 90) {
      const next = findNext(cpuCores, CPU_TIERS, 'up')
      recommendations.push({
        component: 'cpu', action: 'upgrade', urgency: cpuAvg > 85 ? 'high' : 'medium',
        currentValue: `${cpuCores} Core${cpuCores > 1 ? 's' : ''}`, recommendedValue: `${next} Core${next > 1 ? 's' : ''}`,
        reason: `Average CPU usage ${Math.round(cpuAvg)}%, P95: ${Math.round(cpuP95)}%.`, confidence,
      })
    } else if (cpuAvg < 25 && cpuP95 < 50) {
      const next = findNext(cpuCores, CPU_TIERS, 'down')
      recommendations.push({
        component: 'cpu', action: next < cpuCores ? 'downgrade' : 'maintain',
        urgency: 'low',
        currentValue: `${cpuCores} Core${cpuCores > 1 ? 's' : ''}`,
        recommendedValue: next < cpuCores ? `${next} Core${next > 1 ? 's' : ''}` : `${cpuCores} Core${cpuCores > 1 ? 's' : ''}`,
        reason: `Average CPU usage ${Math.round(cpuAvg)}%, P95: ${Math.round(cpuP95)}%.`, confidence,
      })
    } else {
      recommendations.push({
        component: 'cpu', action: 'maintain', urgency: 'low',
        currentValue: `${cpuCores} Core${cpuCores > 1 ? 's' : ''}`, recommendedValue: `${cpuCores} Core${cpuCores > 1 ? 's' : ''}`,
        reason: `CPU usage is healthy. Avg: ${Math.round(cpuAvg)}%, P95: ${Math.round(cpuP95)}%.`, confidence,
      })
    }
  }

  // RAM
  if (ramTotalGB > 0) {
    const ramAvg = avg(ramValues)
    const ramP95Val = p95(ramValues)
    if (ramAvg > 75 || ramP95Val > 90) {
      const next = findNext(ramTotalGB, RAM_TIERS, 'up')
      recommendations.push({
        component: 'ram', action: 'upgrade', urgency: ramAvg > 85 ? 'high' : 'medium',
        currentValue: `${ramTotalGB} GB`, recommendedValue: `${next} GB`,
        reason: `Average RAM usage ${Math.round(ramAvg)}%, P95: ${Math.round(ramP95Val)}%.`, confidence,
      })
    } else if (ramAvg < 25 && ramP95Val < 50) {
      const next = findNext(ramTotalGB, RAM_TIERS, 'down')
      recommendations.push({
        component: 'ram', action: next < ramTotalGB ? 'downgrade' : 'maintain',
        urgency: 'low',
        currentValue: `${ramTotalGB} GB`,
        recommendedValue: next < ramTotalGB ? `${next} GB` : `${ramTotalGB} GB`,
        reason: `Average RAM usage ${Math.round(ramAvg)}%, P95: ${Math.round(ramP95Val)}%.`, confidence,
      })
    } else {
      recommendations.push({
        component: 'ram', action: 'maintain', urgency: 'low',
        currentValue: `${ramTotalGB} GB`, recommendedValue: `${ramTotalGB} GB`,
        reason: `RAM usage is healthy. Avg: ${Math.round(ramAvg)}%, P95: ${Math.round(ramP95Val)}%.`, confidence,
      })
    }
  }

  // Storage
  if (storageTotalGB > 0) {
    const storageAvg = avg(storageValues)
    const storageMax = Math.max(...storageValues)
    if (storageAvg > 80 || storageMax > 90) {
      const next = findNext(storageTotalGB, STORAGE_TIERS, 'up')
      recommendations.push({
        component: 'storage', action: 'upgrade', urgency: storageAvg > 90 ? 'high' : 'medium',
        currentValue: `${storageTotalGB} GB`, recommendedValue: `${next} GB`,
        reason: `Average storage usage ${Math.round(storageAvg)}%, Peak: ${Math.round(storageMax)}%.`, confidence,
      })
    } else if (storageAvg < 30 && storageMax < 50) {
      const next = findNext(storageTotalGB, STORAGE_TIERS, 'down')
      recommendations.push({
        component: 'storage', action: next < storageTotalGB ? 'downgrade' : 'maintain',
        urgency: 'low',
        currentValue: `${storageTotalGB} GB`,
        recommendedValue: next < storageTotalGB ? `${next} GB` : `${storageTotalGB} GB`,
        reason: `Average storage ${Math.round(storageAvg)}%, Peak: ${Math.round(storageMax)}%.`, confidence,
      })
    } else {
      recommendations.push({
        component: 'storage', action: 'maintain', urgency: 'low',
        currentValue: `${storageTotalGB} GB`, recommendedValue: `${storageTotalGB} GB`,
        reason: `Storage is healthy. Avg: ${Math.round(storageAvg)}%, Peak: ${Math.round(storageMax)}%.`, confidence,
      })
    }
  }

  return recommendations
}
