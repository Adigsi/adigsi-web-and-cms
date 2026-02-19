import Link from 'next/link'
import Image from 'next/image'
import { Mail, Phone, MapPin } from 'lucide-react'

function WhatsAppIcon( props: React.SVGProps<SVGSVGElement> ) {
  return (
    <svg
    xmlns="http://www.w3.org/2000/svg"
    width="21"
    height="21"
    fill="#fff"
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
    fill="#fff"
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
    fill="#fff"
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
  return (
    <footer className="bg-[#2d2d2d] text-white font-sans">
      <div className="max-w-300 mx-auto px-6 pt-12 pb-4">
        <div className="flex flex-wrap gap-8 pb-8 mb-4 border-b border-dashed border-[#6e6e6e]">
          {/* Left Section - About */}
          <div className="flex-1 min-w-70">
            <Image
              src="/images/logo-bottom.png"
              alt="ADIGSI Logo"
              width={80}
              height={80}
              className="mb-4"
              style={{ width: 'auto', height: '80px' }}
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
                <InstagramIcon className="w-5 h-5" />
              </Link>
              <Link
                href="https://wa.me/6285121117245"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center text-white border-[1.5px] border-white rounded-full transition-all duration-300 hover:bg-white hover:text-[#2d2d2d]"
              >
                <WhatsAppIcon className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/asosiasi-digitalisasi-dan-keamanan-siber-indonesia-adigsi"
                target="_blank"
                className="w-10 h-10 flex items-center justify-center text-white border-[1.5px] border-white rounded-full transition-all duration-300 hover:bg-white hover:text-[#2d2d2d]"
              >
                <LinkedinIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Right Section - Contact */}
          <div className="flex-1 min-w-70 border-l border-dashed border-[#6e6e6e] pl-8">
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
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 text-[13.6px]">
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
