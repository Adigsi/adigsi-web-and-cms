'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

export function CMSLogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      await fetch('/api/cms/logout', {
        method: 'POST',
      })
    } finally {
      router.push('/login')
      router.refresh()
      setIsLoading(false)
    }
  }

  return (
    <Button variant="ghost" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  )
}
