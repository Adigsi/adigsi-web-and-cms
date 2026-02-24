'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageCircle, X, Mail, MessageSquare, UserPlus } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Menu Items */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 bg-card border border-border rounded-xl shadow-lg p-3 w-48 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="space-y-2">
            <Link
              href="mailto:info@adigsi.id"
              className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-all duration-200 hover:translate-x-1"
              onClick={() => setIsOpen(false)}
            >
              <Mail className="w-5 h-5 text-primary" />
              <span>{t({ en: 'Email Us', id: 'Kirim Email' })}</span>
            </Link>
            <a
              href="https://wa.me/62"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-all duration-200 hover:translate-x-1"
              onClick={() => setIsOpen(false)}
            >
              <MessageSquare className="w-5 h-5 text-primary" />
              <span>{t({ en: 'WhatsApp', id: 'WhatsApp' })}</span>
            </a>
            <Link
              href="/register"
              className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-all duration-200 hover:translate-x-1"
              onClick={() => setIsOpen(false)}
            >
              <UserPlus className="w-5 h-5 text-primary" />
              <span>{t({ en: 'Join Us', id: 'Bergabung' })}</span>
            </Link>
          </div>
        </div>
      )}

      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 flex items-center justify-center group relative"
        aria-label="Contact Us"
      >
        {/* Pulse Animation Background */}
        <span className="absolute inset-0 rounded-full bg-primary animate-pulse opacity-75" />
        <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-50" />
        
        {/* Button Content */}
        <span className="relative z-10">
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6 group-hover:scale-125 transition-transform" />
          )}
        </span>
      </button>
    </div>
  )
}
