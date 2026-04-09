export async function register() {
  if (typeof globalThis.EdgeRuntime !== 'undefined') return

  const { captureServerStats, saveStats, generateDailySummary } = await import('./lib/server-stats')

  let lastSummaryDate = ''

  async function tick() {
    try {
      const stats = await captureServerStats()
      await saveStats(stats)

      // Check if we need to generate daily summary for yesterday
      const now = new Date()
      const yesterday = new Date(now)
      yesterday.setUTCDate(yesterday.getUTCDate() - 1)
      const yesterdayStr = yesterday.toISOString().split('T')[0]

      if (yesterdayStr !== lastSummaryDate) {
        await generateDailySummary(yesterdayStr)
        lastSummaryDate = yesterdayStr
      }
    } catch (error) {
      console.error('[devtools] Failed to capture server stats:', error)
    }
  }

  // Capture first stats on startup (after a short delay to let DB connect)
  setTimeout(tick, 5000)

  // Schedule periodic capture
  const interval = parseInt(process.env.DEVTOOLS_STATS_INTERVAL || '300000', 10)
  setInterval(tick, interval)
}
