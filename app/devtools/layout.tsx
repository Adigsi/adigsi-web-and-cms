import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Server Monitor',
  robots: { index: false, follow: false },
}

export default function DevtoolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen bg-zinc-950 text-zinc-100">
      {children}
    </div>
  )
}
