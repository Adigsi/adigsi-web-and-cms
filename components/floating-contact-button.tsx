'use client'

import { useState, useEffect } from 'react'
import { MessageCircle, X, Mail, MessageSquare, Send } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { ContactFormModal } from '@/components/contact-form-modal'

interface ContactButtonConfig {
  email: string
  whatsapp: string
}

const DEFAULT_CONFIG: ContactButtonConfig = {
  email: 'info@adigsi.id',
  whatsapp: 'https://wa.me/62',
}

export function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [config, setConfig] = useState<ContactButtonConfig>(DEFAULT_CONFIG)
  const { t } = useLanguage()

  useEffect(() => {
    fetch('/api/cms/home/floating-buttons')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data?.contactButton) setConfig({ ...DEFAULT_CONFIG, ...data.contactButton })
      })
      .catch(() => {})
  }, [])

  const handleMessageUs = () => {
    setIsOpen(false)
    setShowContactForm(true)
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Menu Items */}
        {isOpen && (
          <div className="absolute bottom-20 right-0 bg-card border border-border rounded-xl shadow-lg p-3 w-52 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="space-y-2">
              <a
                href={`mailto:${config.email}`}
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-all duration-200 hover:translate-x-1"
                onClick={() => setIsOpen(false)}
              >
                <Mail className="w-5 h-5 text-primary" />
                <span>{t({ en: 'Email Us', id: 'Kirim Email' })}</span>
              </a>
              <a
                href={config.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-all duration-200 hover:translate-x-1"
                onClick={() => setIsOpen(false)}
              >
                <MessageSquare className="w-5 h-5 text-primary" />
                <span>{t({ en: 'WhatsApp', id: 'WhatsApp' })}</span>
              </a>
              <button
                type="button"
                onClick={handleMessageUs}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-secondary hover:text-primary rounded-lg transition-all duration-200 hover:translate-x-1 cursor-pointer"
              >
                <Send className="w-5 h-5" />
                <span>{t({ en: 'Message Us', id: 'Kirim Pesan' })}</span>
              </button>
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

      <ContactFormModal
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
      />
    </>
  )
}
