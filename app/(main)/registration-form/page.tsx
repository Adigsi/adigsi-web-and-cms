'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface FormData {
  organizationName: string
  organizationType: string
  registeredAddress: string
  yearEstablished: string
  primaryIndustry: string
  organizationDescription: string
  officialWebsite: string
  contactPersonName: string
  contactPersonPosition: string
  contactEmail: string
  contactPhone: string
  certifications: string
  previousEngagement: string
  reasonForJoining: string
  agreeCodeOfConduct: boolean
  agreeToJoin: boolean
  declareTruth: boolean
}

const INITIAL_FORM: FormData = {
  organizationName: '',
  organizationType: '',
  registeredAddress: '',
  yearEstablished: '',
  primaryIndustry: '',
  organizationDescription: '',
  officialWebsite: '',
  contactPersonName: '',
  contactPersonPosition: '',
  contactEmail: '',
  contactPhone: '',
  certifications: '',
  previousEngagement: '',
  reasonForJoining: '',
  agreeCodeOfConduct: false,
  agreeToJoin: false,
  declareTruth: false,
}

export default function RegistrationFormPage() {
  const { t } = useLanguage()
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleChange = (field: keyof FormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => { const next = { ...prev }; delete next[field]; return next })
    }
    if (submitError) setSubmitError(null)
  }

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    const requiredFields: (keyof FormData)[] = [
      'organizationName', 'organizationType', 'registeredAddress', 'yearEstablished',
      'primaryIndustry', 'organizationDescription', 'officialWebsite',
      'contactPersonName', 'contactPersonPosition', 'contactEmail', 'contactPhone',
      'certifications', 'previousEngagement', 'reasonForJoining',
    ]
    for (const field of requiredFields) {
      if (!String(form[field]).trim()) {
        newErrors[field] = t({ en: 'This field is required', id: 'Kolom ini wajib diisi' })
      }
    }
    if (form.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.contactEmail)) {
      newErrors.contactEmail = t({ en: 'Invalid email address', id: 'Alamat email tidak valid' })
    }
    if (!form.agreeCodeOfConduct) {
      newErrors.agreeCodeOfConduct = t({ en: 'You must agree to continue', id: 'Anda harus menyetujui untuk melanjutkan' })
    }
    if (!form.agreeToJoin) {
      newErrors.agreeToJoin = t({ en: 'You must agree to continue', id: 'Anda harus menyetujui untuk melanjutkan' })
    }
    if (!form.declareTruth) {
      newErrors.declareTruth = t({ en: 'You must agree to continue', id: 'Anda harus menyetujui untuk melanjutkan' })
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/cms/registration-forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to submit')
      }
      setIsSuccess(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Failed to submit')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            {t({ en: 'Registration Submitted!', id: 'Pendaftaran Terkirim!' })}
          </h1>
          <p className="text-muted-foreground">
            {t({
              en: 'Thank you for your interest in joining ADIGSI. We have received your registration form and will review it shortly.',
              id: 'Terima kasih atas ketertarikan Anda untuk bergabung dengan ADIGSI. Kami telah menerima formulir pendaftaran Anda dan akan meninjaunya segera.',
            })}
          </p>
        </div>
      </div>
    )
  }

  const fieldClass =
    'w-full bg-background border border-input rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors'

  const ErrorMsg = ({ field }: { field: keyof FormData }) =>
    errors[field] ? <p className="text-xs text-destructive mt-1">{errors[field]}</p> : null

  const SectionLabel = ({ enLabel, idLabel }: { enLabel: string; idLabel: string }) => (
    <p className="text-xs text-muted-foreground font-medium mb-1">
      <span className="font-semibold text-foreground">{enLabel}</span> / {idLabel}
    </p>
  )

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 pt-24">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t({ en: 'Membership Registration Form', id: 'Formulir Pendaftaran Keanggotaan' })}
          </h1>
          <p className="text-muted-foreground">
            {t({
              en: 'Please fill in all the required fields to register your organization as a member of ADIGSI.',
              id: 'Harap isi semua kolom yang diperlukan untuk mendaftarkan organisasi Anda sebagai anggota ADIGSI.',
            })}
          </p>
        </div>

        {submitError && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {submitError}
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <div className="mb-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {t({
              en: 'Please correct the errors below before submitting.',
              id: 'Harap perbaiki kesalahan di bawah sebelum mengirimkan formulir.',
            })}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Company Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground pb-3 border-b border-border">
              {t({ en: 'Company Information', id: 'Informasi Perusahaan' })}
            </h2>
            <div className="space-y-5">

              {/* Organization Name */}
              <div>
                <SectionLabel enLabel="Organization Name" idLabel="Nama Organisasi" />
                <Input
                  value={form.organizationName}
                  onChange={(e) => handleChange('organizationName', e.target.value)}
                  placeholder={t({ en: 'Enter organization name', id: 'Masukkan nama organisasi' })}
                  className={errors.organizationName ? 'border-destructive' : ''}
                />
                <ErrorMsg field="organizationName" />
              </div>

              {/* Type of Organization */}
              <div>
                <SectionLabel enLabel="Type of Organization" idLabel="Jenis Organisasi" />
                <Select
                  value={form.organizationType}
                  onValueChange={(val) => handleChange('organizationType', val)}
                >
                  <SelectTrigger className={`w-full ${errors.organizationType ? 'border-destructive' : ''}`}>
                    <SelectValue placeholder={t({ en: 'Select type...', id: 'Pilih jenis...' })} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="private_company">
                      Private Company / Perusahaan Swasta
                    </SelectItem>
                    <SelectItem value="government_institution">
                      Government Institution / Instansi Pemerintah
                    </SelectItem>
                    <SelectItem value="non_profit">
                      Non-Profit / Nirlaba
                    </SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMsg field="organizationType" />
              </div>

              {/* Registered Address */}
              <div>
                <SectionLabel enLabel="Registered Address" idLabel="Alamat Terdaftar" />
                <Textarea
                  value={form.registeredAddress}
                  onChange={(e) => handleChange('registeredAddress', e.target.value)}
                  placeholder={t({ en: 'Enter registered address', id: 'Masukkan alamat terdaftar' })}
                  rows={2}
                  className={errors.registeredAddress ? 'border-destructive' : ''}
                />
                <ErrorMsg field="registeredAddress" />
              </div>

              {/* Year Established */}
              <div>
                <SectionLabel enLabel="Year Established" idLabel="Tahun Berdiri" />
                <Input
                  value={form.yearEstablished}
                  onChange={(e) => handleChange('yearEstablished', e.target.value)}
                  placeholder={t({ en: 'e.g. 2010', id: 'mis. 2010' })}
                  className={errors.yearEstablished ? 'border-destructive' : ''}
                />
                <ErrorMsg field="yearEstablished" />
              </div>

              {/* Primary Industry */}
              <div>
                <SectionLabel enLabel="Primary Industry / Field of Work" idLabel="Industri / Fokus Utama" />
                <Input
                  value={form.primaryIndustry}
                  onChange={(e) => handleChange('primaryIndustry', e.target.value)}
                  placeholder={t({ en: 'e.g. Cybersecurity, Digital Finance', id: 'mis. Keamanan Siber, Keuangan Digital' })}
                  className={errors.primaryIndustry ? 'border-destructive' : ''}
                />
                <ErrorMsg field="primaryIndustry" />
              </div>

              {/* Brief Description */}
              <div>
                <SectionLabel enLabel="Brief Description of the Organization" idLabel="Deskripsi Singkat Organisasi" />
                <Textarea
                  value={form.organizationDescription}
                  onChange={(e) => handleChange('organizationDescription', e.target.value)}
                  placeholder={t({
                    en: 'Briefly describe your organization',
                    id: 'Deskripsikan singkat organisasi Anda',
                  })}
                  rows={3}
                  className={errors.organizationDescription ? 'border-destructive' : ''}
                />
                <ErrorMsg field="organizationDescription" />
              </div>

              {/* Official Website */}
              <div>
                <SectionLabel enLabel="Official Website" idLabel="Situs Web Resmi" />
                <Input
                  type="url"
                  value={form.officialWebsite}
                  onChange={(e) => handleChange('officialWebsite', e.target.value)}
                  placeholder="https://example.com"
                  className={errors.officialWebsite ? 'border-destructive' : ''}
                />
                <ErrorMsg field="officialWebsite" />
              </div>
            </div>
          </Card>

          {/* Contact Person Section */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground pb-3 border-b border-border">
              {t({ en: 'Contact Person', id: 'Penanggung Jawab' })}
            </h2>
            <div className="space-y-5">

              {/* Contact Person Name */}
              <div>
                <SectionLabel enLabel="Contact Person Name" idLabel="Nama Penanggung Jawab" />
                <Input
                  value={form.contactPersonName}
                  onChange={(e) => handleChange('contactPersonName', e.target.value)}
                  placeholder={t({ en: 'Full name', id: 'Nama lengkap' })}
                  className={errors.contactPersonName ? 'border-destructive' : ''}
                />
                <ErrorMsg field="contactPersonName" />
              </div>

              {/* Position */}
              <div>
                <SectionLabel enLabel="Position of Contact Person" idLabel="Jabatan Penanggung Jawab" />
                <Input
                  value={form.contactPersonPosition}
                  onChange={(e) => handleChange('contactPersonPosition', e.target.value)}
                  placeholder={t({ en: 'e.g. Director, Manager', id: 'mis. Direktur, Manajer' })}
                  className={errors.contactPersonPosition ? 'border-destructive' : ''}
                />
                <ErrorMsg field="contactPersonPosition" />
              </div>

              {/* Contact Email */}
              <div>
                <SectionLabel enLabel="Contact Email Address" idLabel="Alamat Email Penanggung Jawab" />
                <Input
                  type="email"
                  value={form.contactEmail}
                  onChange={(e) => handleChange('contactEmail', e.target.value)}
                  placeholder="email@example.com"
                  className={errors.contactEmail ? 'border-destructive' : ''}
                />
                <ErrorMsg field="contactEmail" />
              </div>

              {/* Contact Phone */}
              <div>
                <SectionLabel
                  enLabel="Contact Phone Number (WhatsApp)"
                  idLabel="Nomor Telepon Penanggung Jawab"
                />
                <Input
                  type="tel"
                  value={form.contactPhone}
                  onChange={(e) => handleChange('contactPhone', e.target.value)}
                  placeholder="+62..."
                  className={errors.contactPhone ? 'border-destructive' : ''}
                />
                <ErrorMsg field="contactPhone" />
              </div>

              {/* Certifications */}
              <div>
                <SectionLabel
                  enLabel="Relevant Certifications or Credentials in Cybersecurity"
                  idLabel="Sertifikasi atau Kredensial Relevan dalam Keamanan Siber"
                />
                <Textarea
                  value={form.certifications}
                  onChange={(e) => handleChange('certifications', e.target.value)}
                  placeholder={t({
                    en: 'List any relevant certifications (e.g. CISSP, ISO 27001, CEH)',
                    id: 'Sebutkan sertifikasi yang relevan (mis. CISSP, ISO 27001, CEH)',
                  })}
                  rows={3}
                  className={errors.certifications ? 'border-destructive' : ''}
                />
                <ErrorMsg field="certifications" />
              </div>

              {/* Previous Engagement */}
              <div>
                <SectionLabel
                  enLabel="Previous Engagement or Contribution to Cybersecurity Initiatives (if any)"
                  idLabel="Keterlibatan atau Kontribusi Sebelumnya dalam Inisiatif Keamanan Siber (jika ada)"
                />
                <Textarea
                  value={form.previousEngagement}
                  onChange={(e) => handleChange('previousEngagement', e.target.value)}
                  placeholder={t({
                    en: 'Describe any previous involvement in cybersecurity initiatives',
                    id: 'Jelaskan keterlibatan sebelumnya dalam inisiatif keamanan siber',
                  })}
                  rows={3}
                  className={errors.previousEngagement ? 'border-destructive' : ''}
                />
                <ErrorMsg field="previousEngagement" />
              </div>

              {/* Reason for Joining */}
              <div>
                <SectionLabel
                  enLabel="Reason for Joining ADIGSI"
                  idLabel="Alasan Bergabung dengan ADIGSI"
                />
                <p className="text-xs text-muted-foreground mb-1.5">
                  {t({
                    en: 'Please explain why your organization is interested in becoming a member of ADIGSI.',
                    id: 'Jelaskan mengapa organisasi Anda tertarik untuk menjadi anggota ADIGSI.',
                  })}
                </p>
                <Textarea
                  value={form.reasonForJoining}
                  onChange={(e) => handleChange('reasonForJoining', e.target.value)}
                  placeholder={t({
                    en: 'Explain your reason for joining...',
                    id: 'Jelaskan alasan bergabung Anda...',
                  })}
                  rows={4}
                  className={errors.reasonForJoining ? 'border-destructive' : ''}
                />
                <ErrorMsg field="reasonForJoining" />
              </div>
            </div>
          </Card>

          {/* Declarations & Checkboxes */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-foreground pb-3 border-b border-border">
              {t({ en: 'Declarations', id: 'Pernyataan' })}
            </h2>
            <div className="space-y-5">

              {/* Checkbox 1 */}
              <div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="agreeCodeOfConduct"
                    checked={form.agreeCodeOfConduct}
                    onCheckedChange={(checked) => handleChange('agreeCodeOfConduct', !!checked)}
                    className={`mt-0.5 ${errors.agreeCodeOfConduct ? 'border-destructive' : ''}`}
                  />
                  <Label htmlFor="agreeCodeOfConduct" className="text-sm leading-relaxed cursor-pointer flex flex-col">
                    <span className="font-semibold">Agree to ADIGSI&apos;s Code of Conduct and Membership Policies</span>
                    <span className="text-muted-foreground">Setuju dengan Kode Etik dan Kebijakan Keanggotaan ADIGSI</span>
                  </Label>
                </div>
                <ErrorMsg field="agreeCodeOfConduct" />
              </div>

              {/* Checkbox 2 */}
              <div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="agreeToJoin"
                    checked={form.agreeToJoin}
                    onCheckedChange={(checked) => handleChange('agreeToJoin', !!checked)}
                    className={`mt-0.5 ${errors.agreeToJoin ? 'border-destructive' : ''}`}
                  />
                  <Label htmlFor="agreeToJoin" className="text-sm leading-relaxed cursor-pointer flex flex-col">
                    <span className="font-semibold">
                      I hereby declare that we are willing or interested in joining the Indonesian Digitalization and
                      Cybersecurity Association (ADIGSI)
                    </span>
                    <span className="text-muted-foreground">
                      Dengan ini saya menyatakan bahwa kami bersedia atau tertarik untuk bergabung bersama Asosiasi
                      Digitalisasi dan Keamanan Siber Indonesia (ADIGSI)
                    </span>
                  </Label>
                </div>
                <ErrorMsg field="agreeToJoin" />
              </div>

              {/* Checkbox 3 */}
              <div>
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="declareTruth"
                    checked={form.declareTruth}
                    onCheckedChange={(checked) => handleChange('declareTruth', !!checked)}
                    className={`mt-0.5 ${errors.declareTruth ? 'border-destructive' : ''}`}
                  />
                  <Label htmlFor="declareTruth" className="text-sm leading-relaxed cursor-pointer flex flex-col">
                    <span className="font-semibold">
                      I hereby declare that all the information I have provided is true, in accordance with the facts,
                      and I am willing to accept legal consequences should any discrepancies be found in the future.
                    </span>
                    <span className="text-muted-foreground">
                      Dengan ini saya menyatakan bahwa seluruh informasi yang saya berikan adalah benar, sesuai dengan
                      kenyataan, dan saya bersedia menerima konsekuensi hukum apabila di kemudian hari ditemukan
                      ketidaksesuaian.
                    </span>
                  </Label>
                </div>
                <ErrorMsg field="declareTruth" />
              </div>
            </div>
          </Card>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isSubmitting} className="min-w-36">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t({ en: 'Submitting...', id: 'Mengirimkan...' })}
                </>
              ) : (
                t({ en: 'Submit Registration', id: 'Kirim Pendaftaran' })
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
