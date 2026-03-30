'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'

interface FooterData {
  aboutTitleEn: string
  aboutTitleId: string
  aboutDescriptionEn: string
  aboutDescriptionId: string
  instagramUrl: string
  whatsappUrl: string
  linkedinUrl: string
  email: string
  phone: string
  addressEn: string
  addressId: string
  copyrightYear: string
}

function WhatsAppIcon( props: React.SVGProps<SVGSVGElement> ) {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="21"
    fill="currentColor"
    viewBox="0 0 256 256"
    style={{}}
    {...props}
  >
    <path
      d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"
      style={{}}
    ></path>
  </svg>
  )
}

function InstagramIcon( props: React.SVGProps<SVGSVGElement> ) {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="21"
    fill="currentColor"
    viewBox="0 0 256 256"
    style={{}}
    {...props}
  >
    <path
      d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"
      style={{}}
    ></path>
  </svg>
  )
}

function LinkedinIcon( props: React.SVGProps<SVGSVGElement> ) {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="21"
    fill="currentColor"
    viewBox="0 0 256 256"
    style={{}}
    {...props}
  >
    <path
      d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"
      style={{}}
    ></path>
  </svg>
  )
}

export function Footer() {
  const { language } = useLanguage()
  const [footerData, setFooterData] = useState<FooterData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await fetch('/api/cms/home/footer')
        if (response.ok) {
          const data = await response.json()
          setFooterData(data)
        }
      } catch (error) {
        console.error('Error fetching footer data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFooterData()
  }, [])

  if (isLoading || !footerData) {
    return (
      <footer className="bg-card text-foreground border-t border-border">
        <div className="max-w-300 mx-auto px-5 py-6 text-sm">Loading footer...</div>
      </footer>
    )
  }

  return (
    <footer className="bg-card text-foreground border-t border-border">
      <div className="max-w-300 mx-auto px-5 py-8">
        <div className="flex flex-wrap gap-6 pb-6 mb-4 border-b border-border">
          {/* Left Section - About */}
          <div className="flex-1 min-w-70">
            <Image
              src="/images/logo-bottom.png"
              alt="ADIGSI Logo"
              width={120}
              height={120}
              className="mb-3"
              style={{ width: 'auto', height: '80px' }}
            />
            <p className="text-sm leading-6 text-muted-foreground mb-4">
              {language === 'id' ? footerData.aboutDescriptionId : footerData.aboutDescriptionEn}
            </p>
            <div className="flex gap-3">
              <Link
                href={footerData.instagramUrl}
                target="_blank"
                className="w-9 h-9 flex items-center justify-center text-foreground border border-border rounded-full transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
              >
                <InstagramIcon className="w-4 h-4" />
              </Link>
              <Link
                href={footerData.whatsappUrl}
                target="_blank"
                className="w-9 h-9 flex items-center justify-center text-foreground border border-border rounded-full transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
              >
                <WhatsAppIcon className="w-4 h-4" />
              </Link>
              <Link
                href={footerData.linkedinUrl}
                target="_blank"
                className="w-9 h-9 flex items-center justify-center text-foreground border border-border rounded-full transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
              >
                <LinkedinIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Section - Contact */}
          <div className="flex-1 min-w-70 border-l border-border pl-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Contact Us
            </h3>

            {/* Email */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex items-center justify-center border border-border rounded-full p-2">
                <Mail className="w-4 h-4 text-foreground" />
              </div>
              <div className="text-sm leading-5 text-muted-foreground">
                <div className="font-medium text-foreground">Email</div>
                <div>{footerData.email}</div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex items-center justify-center border border-border rounded-full p-2">
                <Phone className="w-4 h-4 text-foreground" />
              </div>
              <div className="text-sm leading-5 text-muted-foreground">
                <div className="font-medium text-foreground">Phone</div>
                <div>{footerData.phone}</div>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3 mb-4">
              <div className="flex items-center justify-center border border-border rounded-full p-2">
                <MapPin className="w-4 h-4 text-foreground" />
              </div>
              <div className="text-sm leading-5 text-muted-foreground">
                {language === 'id' ? footerData.addressId : footerData.addressEn}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 pb-4 text-xs">
          <p className="text-muted-foreground text-center md:text-left">
            Copyright © {footerData.copyrightYear} Asosiasi Digital dan Keamanan Siber Indonesia
            (ADIGSI) All Rights Reserved.
          </p>
          <div className="flex gap-6 md:mr-20">
            <Link
              href="/terms-conditions"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {language === 'id' ? 'Syarat & Ketentuan' : 'Terms & Conditions'}
            </Link>
            <Link
              href="/privacy-policy"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {language === 'id' ? 'Kebijakan Privasi' : 'Privacy Policy'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
