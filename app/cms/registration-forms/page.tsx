'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useToast } from '@/hooks/use-toast'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  ClipboardList,
  Mail,
  MailOpen,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  FileText,
  Circle,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'

interface RegistrationForm {
  _id: string
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
  isRead: boolean
  status: 'new' | 'reviewed' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

type StatusFilter = 'all' | 'unread' | 'new' | 'reviewed' | 'approved' | 'rejected'

const ORG_TYPE_LABELS: Record<string, { en: string; id: string }> = {
  private_company: { en: 'Private Company', id: 'Perusahaan Swasta' },
  government_institution: { en: 'Government Institution', id: 'Instansi Pemerintah' },
  non_profit: { en: 'Non-Profit', id: 'Nirlaba' },
}

const STATUS_CONFIG: Record<
  RegistrationForm['status'],
  { label: { en: string; id: string }; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  new: {
    label: { en: 'New', id: 'Baru' },
    icon: Circle,
    className: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
  },
  reviewed: {
    label: { en: 'Reviewed', id: 'Ditinjau' },
    icon: Clock,
    className: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
  },
  approved: {
    label: { en: 'Approved', id: 'Disetujui' },
    icon: CheckCircle2,
    className: 'text-green-500 bg-green-500/10 border-green-500/30',
  },
  rejected: {
    label: { en: 'Rejected', id: 'Ditolak' },
    icon: XCircle,
    className: 'text-destructive bg-destructive/10 border-destructive/30',
  },
}

const TABS: { key: StatusFilter; labelEn: string; labelId: string }[] = [
  { key: 'all', labelEn: 'All', labelId: 'Semua' },
  { key: 'unread', labelEn: 'Unread', labelId: 'Belum Dibaca' },
  { key: 'new', labelEn: 'New', labelId: 'Baru' },
  { key: 'reviewed', labelEn: 'Reviewed', labelId: 'Ditinjau' },
  { key: 'approved', labelEn: 'Approved', labelId: 'Disetujui' },
  { key: 'rejected', labelEn: 'Rejected', labelId: 'Ditolak' },
]

function formatDate(dateStr: string, lang: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function CMSRegistrationFormsPage() {
  const { t, language } = useLanguage()
  const { toast } = useToast()

  const [forms, setForms] = useState<RegistrationForm[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState<StatusFilter>('all')
  const [selected, setSelected] = useState<RegistrationForm | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const fetchForms = useCallback(
    async (tab: StatusFilter, p: number, silent = false) => {
      if (!silent) setIsLoading(true)
      else setIsRefreshing(true)

      const params = new URLSearchParams({ page: String(p), limit: '20' })
      if (tab === 'unread') params.set('isRead', 'false')
      else if (tab !== 'all') params.set('status', tab)

      try {
        const res = await fetch(`/api/cms/registration-forms?${params}`)
        if (res.ok) {
          const data = await res.json()
          setForms(data.forms)
          setTotal(data.total)
          setTotalPages(data.totalPages)
        }
      } catch {
        toast({
          title: t({ en: 'Error', id: 'Kesalahan' }),
          description: t({ en: 'Failed to load registration forms', id: 'Gagal memuat formulir pendaftaran' }),
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
        setIsRefreshing(false)
      }
    },
    [t, toast],
  )

  useEffect(() => {
    fetchForms(activeTab, page)
  }, [fetchForms, activeTab, page])

  const handleTabChange = (tab: StatusFilter) => {
    setActiveTab(tab)
    setPage(1)
    setSelected(null)
  }

  const handleSelect = async (form: RegistrationForm) => {
    setSelected(form)
    setConfirmDelete(false)
    if (!form.isRead) {
      try {
        await fetch(`/api/cms/registration-forms/${form._id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isRead: true }),
        })
        setForms((prev) => prev.map((f) => (f._id === form._id ? { ...f, isRead: true } : f)))
        setSelected((prev) => (prev ? { ...prev, isRead: true } : prev))
        window.dispatchEvent(new CustomEvent('cms:reg-forms-unread-changed'))
      } catch {
        // silently fail
      }
    }
  }

  const handleUpdateStatus = async (status: RegistrationForm['status']) => {
    if (!selected) return
    setIsUpdatingStatus(true)
    try {
      const res = await fetch(`/api/cms/registration-forms/${selected._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (res.ok) {
        setForms((prev) => prev.map((f) => (f._id === selected._id ? { ...f, status } : f)))
        setSelected((prev) => (prev ? { ...prev, status } : prev))
        toast({ title: t({ en: 'Status updated', id: 'Status diperbarui' }) })
      }
    } catch {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), variant: 'destructive' })
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const handleDelete = async () => {
    if (!selected) return
    setIsDeleting(true)
    setConfirmDelete(false)
    try {
      const res = await fetch(`/api/cms/registration-forms/${selected._id}`, { method: 'DELETE' })
      if (res.ok) {
        if (!selected.isRead) window.dispatchEvent(new CustomEvent('cms:reg-forms-unread-changed'))
        setForms((prev) => prev.filter((f) => f._id !== selected._id))
        setTotal((prev) => prev - 1)
        setSelected(null)
        toast({ title: t({ en: 'Submission deleted', id: 'Pengajuan dihapus' }) })
      }
    } catch {
      toast({ title: t({ en: 'Error', id: 'Kesalahan' }), variant: 'destructive' })
    } finally {
      setIsDeleting(false)
    }
  }

  const StatusBadge = ({ status }: { status: RegistrationForm['status'] }) => {
    const cfg = STATUS_CONFIG[status]
    const Icon = cfg.icon
    return (
      <span
        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${cfg.className}`}
      >
        <Icon className="w-3 h-3" />
        {t(cfg.label)}
      </span>
    )
  }

  const DetailRow = ({ label, value }: { label: string; value: string | boolean }) => (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-foreground wrap-break-word whitespace-pre-wrap">
        {typeof value === 'boolean' ? (value ? '✓ Yes' : '✗ No') : value || '—'}
      </p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mt-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="w-6 h-6" />
            {t({ en: 'Registration Forms', id: 'Formulir Pendaftaran' })}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t({ en: 'Membership applications submitted via the registration form', id: 'Pengajuan keanggotaan yang masuk melalui formulir pendaftaran' })}
            {total > 0 && (
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {total} {t({ en: 'total', id: 'total' })}
              </span>
            )}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchForms(activeTab, page, true)}
          disabled={isRefreshing}
          className="gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {t({ en: 'Refresh', id: 'Segarkan' })}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {language === 'en' ? tab.labelEn : tab.labelId}
          </button>
        ))}
      </div>

      {/* Master-detail layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4 min-h-125">
        {/* Left: Form List */}
        <div className="space-y-2">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" />
              {t({ en: 'Loading...', id: 'Memuat...' })}
            </div>
          ) : forms.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
              <FileText className="w-10 h-10 mb-3 opacity-30" />
              <p className="font-medium">{t({ en: 'No submissions', id: 'Tidak ada pengajuan' })}</p>
              <p className="text-xs mt-1">{t({ en: 'No registration forms submitted yet', id: 'Belum ada formulir pendaftaran yang masuk' })}</p>
            </div>
          ) : (
            forms.map((form) => (
              <button
                key={form._id}
                onClick={() => handleSelect(form)}
                className={`w-full text-left rounded-lg border p-3 transition-all duration-150 hover:shadow-md ${
                  selected?._id === form._id
                    ? 'border-primary bg-primary/5'
                    : form.isRead
                    ? 'border-border bg-card hover:border-primary/30'
                    : 'border-accent/40 bg-accent/5 hover:border-accent'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-1 shrink-0">
                    {form.isRead ? (
                      <MailOpen className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Mail className="w-4 h-4 text-accent" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={`text-sm truncate ${form.isRead ? 'text-foreground' : 'font-bold text-foreground'}`}>
                        {form.organizationName}
                      </span>
                      {!form.isRead && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mb-1">
                      {form.contactPersonName} · {form.contactEmail}
                    </p>
                    <div className="flex items-center justify-between gap-2 mt-1.5">
                      <StatusBadge status={form.status} />
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {formatDate(form.createdAt, language)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))
          )}

          {/* Pagination */}
          {!isLoading && totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Right: Detail Panel */}
        <div>
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full py-24 text-center text-muted-foreground rounded-lg border border-border border-dashed">
              <Search className="w-10 h-10 mb-3 opacity-30" />
              <p className="font-medium">{t({ en: 'Select a submission', id: 'Pilih pengajuan' })}</p>
              <p className="text-xs mt-1">
                {t({ en: 'Click on an item from the list to view details', id: 'Klik item dari daftar untuk melihat detail' })}
              </p>
            </div>
          ) : (
            <Card className="p-6 space-y-6">
              {/* Detail Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-border">
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-foreground truncate">{selected.organizationName}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {selected.contactPersonName} · {selected.contactPersonPosition}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t({ en: 'Submitted', id: 'Dikirim' })}: {formatDate(selected.createdAt, language)}
                  </p>
                </div>
                <div className="flex flex-col gap-2 items-end shrink-0">
                  <StatusBadge status={selected.status} />
                </div>
              </div>

              {/* Status Actions */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                  {t({ en: 'Update Status', id: 'Perbarui Status' })}
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['new', 'reviewed', 'approved', 'rejected'] as const).map((s) => {
                    const cfg = STATUS_CONFIG[s]
                    const Icon = cfg.icon
                    return (
                      <button
                        key={s}
                        onClick={() => handleUpdateStatus(s)}
                        disabled={isUpdatingStatus || selected.status === s}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border transition-opacity ${cfg.className} ${
                          selected.status === s ? 'opacity-100 ring-2 ring-offset-1 ring-current' : 'opacity-60 hover:opacity-100'
                        } disabled:cursor-not-allowed`}
                      >
                        <Icon className="w-3 h-3" />
                        {t(cfg.label)}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Company Details */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border">
                  {t({ en: 'Company Information', id: 'Informasi Perusahaan' })}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailRow
                    label={t({ en: 'Organization Name', id: 'Nama Organisasi' })}
                    value={selected.organizationName}
                  />
                  <DetailRow
                    label={t({ en: 'Type of Organization', id: 'Jenis Organisasi' })}
                    value={
                      ORG_TYPE_LABELS[selected.organizationType]
                        ? t(ORG_TYPE_LABELS[selected.organizationType])
                        : selected.organizationType
                    }
                  />
                  <DetailRow
                    label={t({ en: 'Year Established', id: 'Tahun Berdiri' })}
                    value={selected.yearEstablished}
                  />
                  <DetailRow
                    label={t({ en: 'Primary Industry', id: 'Industri Utama' })}
                    value={selected.primaryIndustry}
                  />
                  <div className="sm:col-span-2">
                    <DetailRow
                      label={t({ en: 'Registered Address', id: 'Alamat Terdaftar' })}
                      value={selected.registeredAddress}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <DetailRow
                      label={t({ en: 'Organization Description', id: 'Deskripsi Organisasi' })}
                      value={selected.organizationDescription}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <DetailRow
                      label={t({ en: 'Official Website', id: 'Situs Web Resmi' })}
                      value={selected.officialWebsite}
                    />
                  </div>
                </div>
              </div>

              {/* Contact Person Details */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border">
                  {t({ en: 'Contact Person', id: 'Penanggung Jawab' })}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <DetailRow
                    label={t({ en: 'Contact Person Name', id: 'Nama Penanggung Jawab' })}
                    value={selected.contactPersonName}
                  />
                  <DetailRow
                    label={t({ en: 'Position', id: 'Jabatan' })}
                    value={selected.contactPersonPosition}
                  />
                  <DetailRow
                    label={t({ en: 'Email', id: 'Email' })}
                    value={selected.contactEmail}
                  />
                  <DetailRow
                    label={t({ en: 'Phone (WhatsApp)', id: 'Telepon (WhatsApp)' })}
                    value={selected.contactPhone}
                  />
                  <div className="sm:col-span-2">
                    <DetailRow
                      label={t({ en: 'Certifications', id: 'Sertifikasi' })}
                      value={selected.certifications}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <DetailRow
                      label={t({
                        en: 'Previous Engagement in Cybersecurity',
                        id: 'Keterlibatan Sebelumnya dalam Keamanan Siber',
                      })}
                      value={selected.previousEngagement}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <DetailRow
                      label={t({ en: 'Reason for Joining ADIGSI', id: 'Alasan Bergabung dengan ADIGSI' })}
                      value={selected.reasonForJoining}
                    />
                  </div>
                </div>
              </div>

              {/* Declarations */}
              <div>
                <h3 className="text-sm font-bold text-foreground mb-3 pb-2 border-b border-border">
                  {t({ en: 'Declarations', id: 'Pernyataan' })}
                </h3>
                <div className="space-y-2">
                  <DetailRow
                    label={t({ en: 'Agrees to Code of Conduct & Policies', id: 'Setuju Kode Etik & Kebijakan' })}
                    value={selected.agreeCodeOfConduct}
                  />
                  <DetailRow
                    label={t({ en: 'Declares willingness to join ADIGSI', id: 'Menyatakan bersedia bergabung ADIGSI' })}
                    value={selected.agreeToJoin}
                  />
                  <DetailRow
                    label={t({ en: 'Declares information is truthful', id: 'Menyatakan informasi adalah benar' })}
                    value={selected.declareTruth}
                  />
                </div>
              </div>

              {/* Delete */}
              <div className="pt-2 border-t border-border">
                {confirmDelete ? (
                  <div className="flex items-center gap-3">
                    <p className="text-sm text-destructive font-medium">
                      {t({ en: 'Confirm delete?', id: 'Konfirmasi hapus?' })}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        t({ en: 'Yes, delete', id: 'Ya, hapus' })
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmDelete(false)}
                      disabled={isDeleting}
                    >
                      {t({ en: 'Cancel', id: 'Batal' })}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
                    onClick={() => setConfirmDelete(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t({ en: 'Delete Submission', id: 'Hapus Pengajuan' })}
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
