'use client'

import { useState, useEffect, useCallback } from 'react'

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

interface TrafficHeatmapProps {
  headers: Record<string, string>
}

function getHeatColor(value: number): string {
  if (value === -1) return 'bg-zinc-800/50'
  if (value >= 80) return 'bg-red-500'
  if (value >= 60) return 'bg-orange-500'
  if (value >= 40) return 'bg-yellow-500'
  if (value >= 20) return 'bg-emerald-500'
  if (value > 0) return 'bg-emerald-700'
  return 'bg-zinc-800/50'
}

function getHeatOpacity(value: number): string {
  if (value === -1) return 'opacity-30'
  if (value >= 80) return 'opacity-100'
  if (value >= 60) return 'opacity-90'
  if (value >= 40) return 'opacity-75'
  if (value >= 20) return 'opacity-60'
  if (value > 0) return 'opacity-40'
  return 'opacity-20'
}

export function TrafficHeatmap({ headers }: TrafficHeatmapProps) {
  const [heatData, setHeatData] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [metric, setMetric] = useState<'cpu' | 'ram'>('cpu')
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/devtools/history?range=7d', { headers })
      if (res.ok) {
        const json = await res.json()
        const buckets: Record<string, number[]> = {}

        for (const d of json.data) {
          const jakartaDate = new Date(new Date(d.timestamp).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
          const day = jakartaDate.getDay()
          const hour = jakartaDate.getHours()
          const key = `${day}-${hour}`
          if (!buckets[key]) buckets[key] = []
          const value = metric === 'cpu' ? d.cpu : d.ram
          // Handle both raw and hourly data formats
          buckets[key].push(typeof value === 'number' ? value : value?.avg ?? 0)
        }

        const averages: Record<string, number> = {}
        for (const [key, values] of Object.entries(buckets)) {
          averages[key] = Math.round(values.reduce((a, b) => a + b, 0) / values.length)
        }
        setHeatData(averages)
      }
    } catch (error) {
      console.error('Failed to fetch heatmap data:', error)
    } finally {
      setLoading(false)
    }
  }, [headers, metric])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Get the past 7 days in order (today last)
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })).getDay()
  const dayOrder = Array.from({ length: 7 }, (_, i) => (today - 6 + i + 7) % 7)

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-medium text-zinc-200">Usage Heatmap</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Last 7 days · Hourly average · WIB</p>
        </div>
        <div className="flex items-center bg-zinc-800 rounded-md p-0.5">
          {(['cpu', 'ram'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                metric === m ? 'bg-zinc-700 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {m.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-50">
          <div className="h-5 w-5 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-150">
            {/* Hour labels */}
            <div className="flex mb-1 ml-10">
              {HOURS.map((h) => (
                <div key={h} className="flex-1 text-center text-[9px] text-zinc-600">
                  {h % 3 === 0 ? `${String(h).padStart(2, '0')}` : ''}
                </div>
              ))}
            </div>

            {/* Grid rows */}
            {dayOrder.map((day) => (
              <div key={day} className="flex items-center gap-1 mb-1">
                <span className="text-[10px] text-zinc-500 w-8 text-right shrink-0">
                  {DAY_LABELS[day]}
                </span>
                <div className="flex flex-1 gap-0.5">
                  {HOURS.map((hour) => {
                    const key = `${day}-${hour}`
                    const value = heatData[key] ?? -1
                    const isHovered = hoveredCell === key

                    return (
                      <div
                        key={key}
                        className={`flex-1 h-6 rounded-sm cursor-default transition-all ${getHeatColor(value)} ${getHeatOpacity(value)} ${
                          isHovered ? 'ring-1 ring-zinc-400 scale-110 z-10' : ''
                        }`}
                        onMouseEnter={() => setHoveredCell(key)}
                        onMouseLeave={() => setHoveredCell(null)}
                        title={value >= 0 ? `${DAY_LABELS[day]} ${String(hour).padStart(2, '0')}:00 — ${value}%` : `${DAY_LABELS[day]} ${String(hour).padStart(2, '0')}:00 — No data`}
                      />
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Legend */}
            <div className="flex items-center justify-end gap-1 mt-3">
              <span className="text-[9px] text-zinc-600 mr-1">Low</span>
              {[0, 20, 40, 60, 80].map((v) => (
                <div
                  key={v}
                  className={`w-4 h-3 rounded-sm ${getHeatColor(v || 1)} ${getHeatOpacity(v || 1)}`}
                  title={`${v}%`}
                />
              ))}
              <span className="text-[9px] text-zinc-600 ml-1">High</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
