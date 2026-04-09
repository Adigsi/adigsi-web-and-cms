'use client'

import { useState, useEffect, useCallback } from 'react'
import { AlertTriangle, TrendingUp, Zap, Activity, Info } from 'lucide-react'

interface InsightsPanelProps {
  headers: Record<string, string>
}

interface Insight {
  type: 'peak' | 'trend' | 'spike' | 'correlation'
  severity: 'info' | 'warning' | 'critical'
  title: string
  description: string
  metric?: string
}

const SEVERITY_STYLES = {
  info: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: Info, color: 'text-blue-400' },
  warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: AlertTriangle, color: 'text-yellow-400' },
  critical: { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle, color: 'text-red-400' },
}

const TYPE_ICONS = {
  peak: TrendingUp,
  trend: TrendingUp,
  spike: Zap,
  correlation: Activity,
}

export function InsightsPanel({ headers }: InsightsPanelProps) {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  const fetchInsights = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/devtools/history?range=7d&insights=true', { headers })
      if (res.ok) {
        const json = await res.json()
        setInsights(json.insights || [])
      }
    } catch (error) {
      console.error('Failed to fetch insights:', error)
    } finally {
      setLoading(false)
    }
  }, [headers])

  useEffect(() => {
    fetchInsights()
  }, [fetchInsights])

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="mb-4">
        <h2 className="text-sm font-medium text-zinc-200">Insights</h2>
        <p className="text-xs text-zinc-500 mt-0.5">Auto-detected patterns from the last 7 days</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 bg-zinc-800 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : insights.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-zinc-500">
          <Info className="w-8 h-8 mb-2 opacity-50" />
          <p className="text-sm">No patterns detected yet</p>
          <p className="text-xs mt-1">Insights will appear as more data is collected</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
          {insights
            .sort((a, b) => {
              const order = { critical: 0, warning: 1, info: 2 }
              return order[a.severity] - order[b.severity]
            })
            .map((insight, i) => {
              const style = SEVERITY_STYLES[insight.severity]
              const TypeIcon = TYPE_ICONS[insight.type]

              return (
                <div
                  key={i}
                  className={`${style.bg} border ${style.border} rounded-lg p-3`}
                >
                  <div className="flex items-start gap-2">
                    <TypeIcon className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${style.color}`} />
                    <div className="min-w-0">
                      <p className={`text-xs font-medium ${style.color}`}>{insight.title}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
