'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { DownloadReportModal, DownloadFormData } from './download-report-modal'

interface ReportData {
  titleEn: string
  titleId: string
  descriptionEn: string
  descriptionId: string
  buttonTextEn: string
  buttonTextId: string
  hasPdf: boolean
  image: string
}

export function IndustryReportSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const { t, language } = useLanguage()

  useEffect(() => {
    const fetchReportData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/cms/home/report')
        if (response.ok) {
          const data = await response.json()
          setReportData(data)
        }
      } catch (error) {
        console.error('Error fetching report data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchReportData()
  }, [])

  const handleDownloadPdf = async (userData: DownloadFormData) => {
    setIsDownloading(true)
    try {
      // Save download data and get PDF
      const response = await fetch('/api/cms/report-downloads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.pdfFile) {
          // Create a temporary link element to trigger download
          const link = document.createElement('a')
          link.href = data.pdfFile
          link.download = 'report.pdf'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          
          // Close modal after successful download
          setIsModalOpen(false)
        }
      }
    } catch (error) {
      console.error('Error downloading PDF:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  if (isLoading) {
    return (
      <section ref={sectionRef} className="max-w-310 mx-auto px-4 md:px-8 lg:px-32.75 py-20 w-full">
        <div className="text-center py-8 text-muted-foreground">
          {t({ en: 'Loading...', id: 'Memuat...' })}
        </div>
      </section>
    )
  }

  if (!reportData) {
    return null
  }

  return (
    <section 
      ref={sectionRef}
      className="max-w-310 mx-auto px-4 md:px-8 lg:px-32.75 py-20 w-full"
    >
      <div className={`flex flex-col items-center justify-center text-center mb-4 ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <h2 className="text-primary text-[21px] uppercase mb-2 font-bold">
          {t({ en: 'REPORT', id: 'LAPORAN' })}
        </h2>
      </div>

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center mt-4 ${isVisible ? 'animate-fade-in-up animate-delay-200' : 'opacity-0'}`}>
        {/* Image Section */}
        <div className="flex justify-center lg:justify-start">
          <Image
            src={reportData.image}
            alt={language === 'en' ? reportData.titleEn : reportData.titleId}
            width={522}
            height={600}
            className="rounded-lg shadow-lg max-w-full h-auto"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col">
          <h2 className="text-[32px] font-bold text-[#1f2937] mb-4">
            {language === 'en' ? reportData.titleEn : reportData.titleId}
          </h2>
          
          {(language === 'en' ? reportData.descriptionEn : reportData.descriptionId)
            .split('\n')
            .filter(p => p.trim())
            .map((para, i) => (
              <p key={i} className="text-[#374151] text-base leading-[27.2px] mb-6">
                {para}
              </p>
            ))}
          
          {reportData.hasPdf && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-block bg-[#22c55e] hover:bg-[#16a34a] text-white font-semibold rounded-lg px-6 py-3 shadow-[0_4px_10px_rgba(34,197,94,0.3)] transition-colors duration-300 w-fit no-underline"
            >
              {language === 'en' ? reportData.buttonTextEn : reportData.buttonTextId}
            </button>
          )}
        </div>
      </div>

      <DownloadReportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={handleDownloadPdf}
        reportTitle={language === 'en' ? reportData.titleEn : reportData.titleId}
        isDownloading={isDownloading}
      />
    </section>
  )
}
