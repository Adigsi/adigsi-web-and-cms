'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { format } from 'date-fns'

/** Convert a Date to a new Date whose local fields reflect Asia/Jakarta (WIB) */
function toJakarta(date: Date): Date {
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
}

const RANGES = ['1h', '6h', '24h', '7d', '30d', '90d', '1y'] as const
type Range = typeof RANGES[number]

const METRICS = [
  { key: 'cpu', label: 'CPU', color: '#f87171' },
  { key: 'ram', label: 'RAM', color: '#60a5fa' },
  { key: 'storage', label: 'Storage', color: '#a78bfa' },
] as const

interface StatsChartProps {
  headers: Record<string, string>
}

export function StatsChart({ headers }: StatsChartProps) {
  const [range, setRange] = useState<Range>('24h')
  const [activeMetrics, setActiveMetrics] = useState<Set<string>>(new Set(['cpu', 'ram', 'storage']))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [chartData, setChartData] = useState<any[]>([])
  const [dataType, setDataType] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/devtools/history?range=${range}`, { headers })
      if (res.ok) {
        const json = await res.json()
        setDataType(json.type)

        if (json.type === 'daily') {
          setChartData(
            json.data.map((d: Record<string, unknown>) => ({
              timestamp: new Date(d.timestamp as string).getTime(),
              cpu: (d.cpu as Record<string, number>).avg,
              cpuMax: (d.cpu as Record<string, number>).max,
              ram: (d.ram as Record<string, number>).avg,
              ramMax: (d.ram as Record<string, number>).max,
              storage: (d.storage as Record<string, number>).avg,
              storageMax: (d.storage as Record<string, number>).max,
            }))
          )
        } else {
          setChartData(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            json.data.map((d: any) => ({
              timestamp: new Date(d.timestamp).getTime(),
              cpu: d.cpu,
              ram: d.ram,
              storage: d.storage,
            }))
          )
        }
      }
    } catch (error) {
      console.error('Failed to fetch chart data:', error)
    } finally {
      setLoading(false)
    }
  }, [range, headers])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const toggleMetric = (key: string) => {
    setActiveMetrics((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        if (next.size > 1) next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const formatXAxis = (timestamp: number) => {
    const date = toJakarta(new Date(timestamp))
    if (['1h', '6h'].includes(range)) return format(date, 'HH:mm')
    if (range === '24h') return format(date, 'HH:mm')
    if (['7d', '30d'].includes(range)) return format(date, 'MMM d HH:mm')
    return format(date, 'MMM d')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatTooltip = (value: number, name: string, entry: any) => {
    const suffix = dataType === 'daily' ? ` (avg)` : ''
    const maxKey = `${name}Max`
    const maxVal = entry?.payload?.[maxKey]
    const maxStr = maxVal !== undefined ? ` · max: ${maxVal.toFixed(1)}%` : ''
    return [`${value.toFixed(1)}%${suffix}${maxStr}`, name.toUpperCase()]
  }

  const formatTooltipLabel = (timestamp: number) => {
    return format(toJakarta(new Date(timestamp)), 'MMM d, yyyy HH:mm') + ' WIB'
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="text-sm font-medium text-zinc-200">Resource Usage Over Time</h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {dataType === 'daily' ? 'Daily averages' : dataType === 'hourly' ? 'Hourly averages' : 'Raw data points'}
            {chartData.length > 0 && ` · ${chartData.length} data points`}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Metric toggles */}
          <div className="flex items-center gap-1 mr-2">
            {METRICS.map((m) => (
              <button
                key={m.key}
                onClick={() => toggleMetric(m.key)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
                  activeMetrics.has(m.key)
                    ? 'text-white'
                    : 'text-zinc-600 hover:text-zinc-400'
                }`}
                style={activeMetrics.has(m.key) ? { backgroundColor: m.color + '33', color: m.color } : {}}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Range selector */}
          <div className="flex items-center bg-zinc-800 rounded-md p-0.5">
            {RANGES.map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                  range === r
                    ? 'bg-zinc-700 text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-75 sm:h-87.5">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="h-5 w-5 border-2 border-zinc-600 border-t-zinc-300 rounded-full animate-spin" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-500 text-sm">
            No data available for this range
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <defs>
                {METRICS.map((m) => (
                  <linearGradient key={m.key} id={`gradient-${m.key}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={m.color} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={m.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatXAxis}
                tick={{ fontSize: 10, fill: '#71717a' }}
                stroke="#3f3f46"
                tickLine={false}
                minTickGap={40}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: '#71717a' }}
                stroke="#3f3f46"
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                width={40}
              />
              <Tooltip
                formatter={formatTooltip}
                labelFormatter={formatTooltipLabel}
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: '1px solid #3f3f46',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#e4e4e7',
                }}
                itemStyle={{ color: '#e4e4e7' }}
                labelStyle={{ color: '#a1a1aa', marginBottom: '4px' }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', color: '#a1a1aa' }}
                iconType="circle"
                iconSize={6}
              />
              {METRICS.map((m) =>
                activeMetrics.has(m.key) ? (
                  <Area
                    key={m.key}
                    type="monotone"
                    dataKey={m.key}
                    name={m.label}
                    stroke={m.color}
                    fill={`url(#gradient-${m.key})`}
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 3, strokeWidth: 0 }}
                  />
                ) : null
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
