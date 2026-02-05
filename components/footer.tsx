import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react'

function WhatsAppIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer className="bg-[#2d2d2d] text-white font-sans">
      <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-4">
        <div className="flex flex-wrap gap-8 pb-8 mb-4 border-b border-dashed border-[#6e6e6e]">
          {/* Left Section - About */}
          <div className="flex-1 min-w-[280px]">
            <Image
              src="/images/design-mode/logo-bottom.png"
              alt="ADIGSI Logo"
              width={80}
              height={80}
              className="mb-4"
            />
            <p className="text-[15.2px] leading-[24.32px] text-[#e0e0e0] mb-6">
              ADIGSI was founded with the vision of becoming a key pillar in
              building a strong and sustainable cybersecurity ecosystem. ADIGSI
              promotes collaboration between government, private sector,
              academia, and international organizations to address the
              ever-evolving cyber threats.
            </p>
            <div className="flex gap-4">
              <Link
                href="https://instagram.com/adigsi.id"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center text-white border-[1.5px] border-white rounded-full transition-all duration-300 hover:bg-white hover:text-[#2d2d2d]"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://wa.me/6285121117245"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center text-white border-[1.5px] border-white rounded-full transition-all duration-300 hover:bg-white hover:text-[#2d2d2d]"
              >
                <WhatsAppIcon />
              </Link>
              <Link
                href="https://www.linkedin.com/company/asosiasi-digitalisasi-dan-keamanan-siber-indonesia-adigsi"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center text-white border-[1.5px] border-white rounded-full transition-all duration-300 hover:bg-white hover:text-[#2d2d2d]"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Right Section - Contact */}
          <div className="flex-1 min-w-[280px] border-l border-dashed border-[#6e6e6e] pl-8">
            <h3 className="text-[22.4px] font-bold text-white mb-6">
              Contact Us
            </h3>

            {/* Email */}
            <div className="flex items-start gap-4 mb-5">
              <div className="flex items-center justify-center border-2 border-white rounded-full p-2">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div className="text-[15.2px] leading-[22.8px] text-[#e0e0e0]">
                <div className="font-medium">Email</div>
                <div>info@adigsi.id</div>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4 mb-5">
              <div className="flex items-center justify-center border-2 border-white rounded-full p-2">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="text-[15.2px] leading-[22.8px] text-[#e0e0e0]">
                <div className="font-medium">Phone</div>
                <div>+62 851-2111-7245</div>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-4 mb-5">
              <div className="flex items-center justify-center border-2 border-white rounded-full p-2">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div className="text-[15.2px] leading-[22.8px] text-[#e0e0e0]">
                Bakrie Tower, Jl. Epicentrum Utama Raya No.2 18th Floor, Karet
                Kuningan, Setiabudi District, Jakarta, 12940
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-dashed border-[#6e6e6e] text-[13.6px]">
          <p className="text-white text-center md:text-left">
            Copyright © 2025 Asosiasi Digital dan Keamanan Siber Indonesia
            (ADIGSI) All Rights Reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-[#b0b0b0] hover:text-white transition-colors"
            >
              Terms & Conditions
            </Link>
            <Link
              href="#"
              className="text-[#b0b0b0] hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
