'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/contexts/language-context'

export function CMSLogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()

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
      {isLoading ? t({ en: 'Logging out...', id: 'Sedang keluar...' }) : t({ en: 'Logout', id: 'Keluar' })}
    </Button>
  )
}
