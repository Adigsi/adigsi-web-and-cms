'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface DownloadReportModalProps {
  isOpen: boolean
  onClose: () => void
  onDownload: (userData: DownloadFormData) => void
  reportTitle: string
  isDownloading?: boolean
}

export interface DownloadFormData {
  fullname: string
  company: string
  position: string
  email: string
  member: string
}

export function DownloadReportModal({ isOpen, onClose, onDownload, reportTitle, isDownloading = false }: DownloadReportModalProps) {
  const { t } = useLanguage()
  const [formData, setFormData] = useState<DownloadFormData>({
    fullname: '',
    company: '',
    position: '',
    email: '',
    member: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onDownload(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white max-w-150 w-full rounded-2xl p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-2xl font-bold text-[#29294B] hover:text-gray-700 transition-colors"
          type="button"
        >
          <X className="h-6 w-6" />
        </button>
        
        <h2 className="text-2xl font-bold text-[#29294B] text-center mb-4">
          {t({ 
            en: `Download ${reportTitle}`, 
            id: `Unduh ${reportTitle}` 
          })}
        </h2>
        
        <img
          src="/images/design-mode/report.png"
          alt="Report"
          className="block w-30 mx-auto mb-6"
        />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-[#29294B] mb-2">
              {t({ en: 'Full Name', id: 'Nama Lengkap' })} <span className="text-red-500">*</span>
            </label>
            <input
              id="fullname"
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              placeholder={t({ en: 'Please enter your fullname...', id: 'Masukkan nama lengkap Anda...' })}
              required
              className="w-full text-[15.2px] border border-[#25627D] rounded-lg p-3 text-[#29294B] focus:outline-none focus:ring-2 focus:ring-[#25627D]"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-[#29294B] mb-2">
              {t({ en: 'Company/Institution', id: 'Perusahaan/Institusi' })} <span className="text-red-500">*</span>
            </label>
            <input
              id="company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder={t({ en: 'Please enter your company/institution name...', id: 'Masukkan nama perusahaan/institusi...' })}
              required
              className="w-full text-[15.2px] border border-[#25627D] rounded-lg p-3 text-[#29294B] focus:outline-none focus:ring-2 focus:ring-[#25627D]"
            />
          </div>

          <div>
            <label htmlFor="position" className="block text-sm font-medium text-[#29294B] mb-2">
              {t({ en: 'Position', id: 'Posisi' })} <span className="text-red-500">*</span>
            </label>
            <input
              id="position"
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              placeholder={t({ en: 'Please enter your position...', id: 'Masukkan posisi Anda...' })}
              required
              className="w-full text-[15.2px] border border-[#25627D] rounded-lg p-3 text-[#29294B] focus:outline-none focus:ring-2 focus:ring-[#25627D]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-[#29294B] mb-2">
              {t({ en: 'Email Address', id: 'Alamat Email' })} <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t({ en: 'Please enter your email address...', id: 'Masukkan alamat email Anda...' })}
              required
              className="w-full text-[15.2px] border border-[#25627D] rounded-lg p-3 text-[#29294B] focus:outline-none focus:ring-2 focus:ring-[#25627D]"
            />
          </div>

          <div>
            <label htmlFor="member" className="block text-sm font-medium text-[#29294B] mb-2">
              {t({ en: 'ADIGSI Membership', id: 'Keanggotaan ADIGSI' })} <span className="text-red-500">*</span>
            </label>
            <select
              id="member"
              name="member"
              value={formData.member}
              onChange={handleChange}
              required
              className="w-full text-[15.2px] border border-[#25627D] rounded-lg p-3 text-[#29294B] focus:outline-none focus:ring-2 focus:ring-[#25627D]"
            >
              <option value="">
                {t({ en: 'Are you ADIGSI member?', id: 'Apakah Anda anggota ADIGSI?' })}
              </option>
              <option value="Yes">{t({ en: 'Yes', id: 'Ya' })}</option>
              <option value="No">{t({ en: 'No', id: 'Tidak' })}</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isDownloading}
            className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold text-base rounded-lg p-3 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isDownloading 
              ? t({ en: 'Downloading...', id: 'Mengunduh...' })
              : t({ en: 'Download', id: 'Unduh' })
            }
          </button>
        </form>
      </div>
    </div>
  )
}
