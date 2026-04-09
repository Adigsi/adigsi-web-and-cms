'use client'

import { Cpu, MemoryStick, HardDrive, Clock, Activity } from 'lucide-react'

interface StatsOverviewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stats: any
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  if (days > 0) return `${days}d ${hours}h ${mins}m`
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

function getStatusColor(value: number): string {
  if (value >= 80) return 'text-red-400'
  if (value >= 50) return 'text-yellow-400'
  return 'text-emerald-400'
}

function getBarColor(value: number): string {
  if (value >= 80) return 'bg-red-400'
  if (value >= 50) return 'bg-yellow-400'
  return 'bg-emerald-400'
}

function getBorderColor(value: number): string {
  if (value >= 80) return 'border-red-400/20'
  if (value >= 50) return 'border-yellow-400/20'
  return 'border-zinc-800'
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  if (!stats) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-zinc-800 rounded w-16 mb-3" />
            <div className="h-7 bg-zinc-800 rounded w-20 mb-2" />
            <div className="h-2 bg-zinc-800 rounded" />
          </div>
        ))}
      </div>
    )
  }

  const disks: Array<{ mountPoint: string; filesystem: string; totalBytes: number; usedBytes: number; usagePercent: number }> = stats.storage.disks || []

  const cards = [
    {
      label: 'CPU',
      icon: Cpu,
      value: `${stats.cpu.usagePercent}%`,
      detail: `${stats.cpu.cores} cores · ${stats.cpu.model.split(' ').slice(0, 3).join(' ')}`,
      percent: stats.cpu.usagePercent,
    },
    {
      label: 'RAM',
      icon: MemoryStick,
      value: `${stats.ram.usagePercent}%`,
      detail: `${formatBytes(stats.ram.usedBytes)} / ${formatBytes(stats.ram.totalBytes)}`,
      percent: stats.ram.usagePercent,
    },
    {
      label: 'Storage',
      icon: HardDrive,
      value: `${stats.storage.usagePercent}%`,
      detail: `${formatBytes(stats.storage.usedBytes)} / ${formatBytes(stats.storage.totalBytes)}` +
        (disks.length > 1 ? ` · ${disks.length} disks` : ''),
      percent: stats.storage.usagePercent,
    },
    {
      label: 'Uptime',
      icon: Clock,
      value: formatUptime(stats.uptime),
      detail: 'Server uptime',
      percent: -1,
    },
    {
      label: 'Load Avg',
      icon: Activity,
      value: `${stats.loadAverage['1m']}`,
      detail: `1m: ${stats.loadAverage['1m']} · 5m: ${stats.loadAverage['5m']} · 15m: ${stats.loadAverage['15m']}`,
      percent: Math.min((stats.loadAverage['1m'] / stats.cpu.cores) * 100, 100),
    },
  ]

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {cards.map((card) => (
          <div
            key={card.label}
            className={`bg-zinc-900 border rounded-lg p-4 ${
              card.percent >= 0 ? getBorderColor(card.percent) : 'border-zinc-800'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <card.icon className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-xs text-zinc-500 font-medium">{card.label}</span>
            </div>
            <p className={`text-xl font-semibold tabular-nums ${
              card.percent >= 0 ? getStatusColor(card.percent) : 'text-zinc-200'
            }`}>
              {card.value}
            </p>
            <p className="text-[11px] text-zinc-500 mt-1 truncate">{card.detail}</p>
            {card.percent >= 0 && (
              <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${getBarColor(card.percent)}`}
                  style={{ width: `${Math.min(card.percent, 100)}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Per-disk breakdown (only shown when multiple disks) */}
      {disks.length > 1 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <HardDrive className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-xs text-zinc-500 font-medium">Disk Breakdown</span>
          </div>
          <div className="space-y-2">
            {disks.map((disk, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-[11px] text-zinc-400 w-24 shrink-0 truncate font-mono" title={disk.filesystem}>
                  {disk.mountPoint}
                </span>
                <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getBarColor(disk.usagePercent)}`}
                    style={{ width: `${Math.min(disk.usagePercent, 100)}%` }}
                  />
                </div>
                <span className={`text-[11px] tabular-nums w-10 text-right ${getStatusColor(disk.usagePercent)}`}>
                  {disk.usagePercent}%
                </span>
                <span className="text-[11px] text-zinc-500 w-28 text-right shrink-0">
                  {formatBytes(disk.usedBytes)} / {formatBytes(disk.totalBytes)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
