'use client'

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type Language = 'en' | 'id'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (translations: { en: string; id: string }) => string
  isLoading: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isLoading, setIsLoading] = useState(true)

  // Initialize language from localStorage and user profile
  useEffect(() => {
    const initializeLanguage = async () => {
      try {
        // First, check if language is saved in localStorage (from login or previous session)
        const savedLanguage = localStorage.getItem('language') as Language | null
        if (savedLanguage && ['en', 'id'].includes(savedLanguage)) {
          setLanguageState(savedLanguage)
          setIsLoading(false)
          return
        }

        // If not in localStorage, try to fetch from user profile (for logged-in users)
        const response = await fetch('/api/cms/user/profile', {
          credentials: 'include',
        }).catch(() => null)

        if (response?.ok) {
          // User is logged in, get language from profile
          const userData = await response.json()
          const userLanguage = userData.user?.language || 'en'
          setLanguageState((userLanguage as Language) || 'en')
          localStorage.setItem('language', userLanguage)
        } else {
          // User not logged in, use default
          setLanguageState('en')
        }
      } catch (error) {
        // Fallback to default
        setLanguageState('en')
      } finally {
        setIsLoading(false)
      }
    }

    initializeLanguage()
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    // Save to localStorage
    localStorage.setItem('language', lang)
    
    // If user is logged in, save to profile
    const saveToProfile = async () => {
      try {
        await fetch('/api/cms/user/preferences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ language: lang }),
          credentials: 'include',
        }).catch(() => null)
      } catch (error) {
        console.error('Error saving language preference:', error)
      }
    }

    saveToProfile()
  }

  const t = (translations: { en: string; id: string }) => {
    return translations[language]
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isLoading }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
