'use client'

import { useState, useEffect, useCallback } from 'react'
import { Lock, Server, RefreshCw } from 'lucide-react'
import { StatsOverview } from './_components/stats-overview'
import { StatsChart } from './_components/stats-chart'
import { TrafficHeatmap } from './_components/traffic-heatmap'
import { InsightsPanel } from './_components/insights-panel'
import { RecommendationPanel } from './_components/recommendation-panel'

export default function DevtoolsPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authError, setAuthError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [storedPassword, setStoredPassword] = useState('')

  useEffect(() => {
    const saved = sessionStorage.getItem('devtools_password')
    if (saved) {
      setStoredPassword(saved)
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setAuthError('')

    try {
      const res = await fetch('/api/devtools/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        sessionStorage.setItem('devtools_password', password)
        setStoredPassword(password)
        setIsAuthenticated(true)
      } else {
        setAuthError('Invalid password')
      }
    } catch {
      setAuthError('Connection error')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700">
              <Lock className="w-5 h-5 text-zinc-400" />
            </div>
            <h1 className="text-lg font-medium text-zinc-200">Server Monitor</h1>
            <p className="text-sm text-zinc-500">Enter password to continue</p>
          </div>

          <div className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 text-sm"
              autoFocus
            />
            {authError && (
              <p className="text-red-400 text-xs">{authError}</p>
            )}
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full px-3 py-2 bg-zinc-100 text-zinc-900 rounded-md text-sm font-medium hover:bg-zinc-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Verifying...' : 'Access'}
            </button>
          </div>
        </form>
      </div>
    )
  }

  return <Dashboard password={storedPassword} />
}

function Dashboard({ password }: { password: string }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [liveStats, setLiveStats] = useState<any>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const headers = { 'x-devtools-password': password }

  const fetchLiveStats = useCallback(async () => {
    try {
      setRefreshing(true)
      const res = await fetch('/api/devtools/stats', { headers: { 'x-devtools-password': password } })
      if (res.ok) {
        const data = await res.json()
        setLiveStats(data)
        setLastUpdate(new Date())
      }
    } catch (error) {
      console.error('Failed to fetch live stats:', error)
    } finally {
      setRefreshing(false)
    }
  }, [password])

  useEffect(() => {
    fetchLiveStats()
    const interval = setInterval(fetchLiveStats, 30000)
    return () => clearInterval(interval)
  }, [fetchLiveStats])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Server className="w-4 h-4 text-zinc-400" />
            <h1 className="text-sm font-medium text-zinc-200">Server Monitor</h1>
            {liveStats && (
              <span className="text-xs text-zinc-500 hidden sm:inline">
                — {liveStats.hostname} ({liveStats.platform}, {liveStats.arch})
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {lastUpdate && (
              <span className="text-xs text-zinc-500">
                Updated {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchLiveStats}
              disabled={refreshing}
              className="p-1.5 rounded-md hover:bg-zinc-800 transition-colors disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-zinc-400 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Live Stats Overview */}
        <StatsOverview stats={liveStats} />

        {/* Charts */}
        <StatsChart headers={headers} />

        {/* Heatmap & Insights side by side on larger screens */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <TrafficHeatmap headers={headers} />
          <InsightsPanel headers={headers} />
        </div>

        {/* Recommendations */}
        <RecommendationPanel headers={headers} />
      </main>
    </div>
  )
}
