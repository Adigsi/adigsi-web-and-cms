'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronDown, Plus, Trash2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CyberIcon } from '@/components/ui/cyber-icon'
import { useLanguage } from '@/contexts/language-context'
import { useToast } from '@/hooks/use-toast'

function IconPicker({
  value,
  onChange
}: {
  value: string
  onChange: (icon: string) => void
}) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          className="w-full h-8 px-2 border border-input rounded-md bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring flex items-center gap-2 justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="text-muted-foreground shrink-0">
              <CyberIcon type={value} />
            </div>
            <span className="text-foreground capitalize truncate text-xs">{value || 'Select icon...'}</span>
          </div>
          <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-3">
        <div className="grid grid-cols-10 gap-2">
          {ICON_OPTIONS.map((iconType) => (
            <button
              key={iconType}
              onClick={() => {
                onChange(iconType)
                setOpen(false)
              }}
              className={`p-2 rounded border transition-all flex flex-col items-center justify-center gap-1 text-xs capitalize hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 ${
                value === iconType
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
                  : 'border-muted hover:border-gray-400'
              }`}
              title={iconType}
            >
              <div className="text-muted-foreground">
                {value === iconType && <Check className="h-3 w-3 text-blue-500" />}
              </div>
              <div className="shrink-0">
                <CyberIcon type={iconType} />
              </div>
              <span className="text-[10px] text-center">{iconType.substring(0, 5)}</span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

const ICON_OPTIONS = [
  // Cybersecurity Icons
  'network', 'web', 'endpoint', 'app', 'mssp', 'data', 'mobile', 'risk',
  'secops', 'threat', 'identity', 'digitalrisk', 'blockchain', 'iot',
  'messaging', 'consulting', 'fraud', 'cloud', 'server', 'database',
  'firewall', 'vpn', 'encryption', 'malware', 'virus', 'monitoring',
  'audit', 'compliance',
  // Digital Business Icons
  'ecommerce', 'logistic', 'financial', 'edutech', 'telecom', 'media',
  'healthcare', 'venture', 'consultant', 'university', 'bumn',
  'retail', 'shopping', 'cart', 'manufacturing', 'agriculture', 'energy', 'construction',
  // Custom Icons
  'shield-check', 'tri-network', 'hex-core',
]

interface BannerData {
  titleEn: string
  titleId: string
}

interface MembershipCategory {
  titleEn: string
  titleId: string
  descriptionEn: string
  descriptionId: string
  iconUrl: string
}

interface MembershipSectionData {
  sectionTitleEn: string
  sectionTitleId: string
  sectionDescriptionEn: string
  sectionDescriptionId: string
  categories: MembershipCategory[]
}

interface JoinData {
  titleEn: string
  titleId: string
  buttonTextEn: string
  buttonTextId: string
  buttonUrl: string
}

interface Membership {
  tier: string
  nameEn: string
  nameId: string
  descriptionEn: string
  descriptionId: string
  iconUrl: string
}

interface MembershipBenefitsData {
  memberships: Membership[]
}

export default function CMSRegisterPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    banner: false,
    membership: false,
    join: false,
    membershipBenefits: false,
  })

  // Banner section state
  const [bannerData, setBannerData] = useState<BannerData>({
    titleEn: 'Register',
    titleId: 'Daftar',
  })

  // Membership Category section state
  const [membershipData, setMembershipData] = useState<MembershipSectionData>({
    sectionTitleEn: 'Membership Category',
    sectionTitleId: 'Kategori Keanggotaan',
    sectionDescriptionEn: '',
    sectionDescriptionId: '',
    categories: [
      {
        titleEn: '',
        titleId: '',
        descriptionEn: '',
        descriptionId: '',
        iconUrl: '',
      }
    ]
  })

  // Join ADIGSI section state
  const [joinData, setJoinData] = useState<JoinData>({
    titleEn: 'Join ADIGSI and be part of Indonesia\'s leading cybersecurity and digital transformation network!',
    titleId: 'Bergabunglah dengan ADIGSI dan jadilah bagian dari jaringan keamanan siber dan transformasi digital terkemuka di Indonesia!',
    buttonTextEn: 'Join Now',
    buttonTextId: 'Bergabung Sekarang',
    buttonUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScG1BWquhT9vpcgMfHeJy0ummlZOQXhUAxtYXxSmkNTdUDr6g/viewform?pli=1',
  })

  // Membership Benefits section state
  const [membershipBenefitsData, setMembershipBenefitsData] = useState<MembershipBenefitsData>({
    memberships: [],
  })

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, membershipRes, joinRes, membershipBenefitsRes] = await Promise.all([
          fetch('/api/cms/register/banner'),
          fetch('/api/cms/register/membership'),
          fetch('/api/cms/register/join'),
          fetch('/api/cms/members/membership-benefits')
        ])

        if (bannerRes.ok) {
          const data = await bannerRes.json()
          setBannerData({
            titleEn: data.titleEn || '',
            titleId: data.titleId || '',
          })
        }

        if (membershipRes.ok) {
          const data = await membershipRes.json()
          if (data.sectionTitleEn) {
            setMembershipData({
              sectionTitleEn: data.sectionTitleEn || '',
              sectionTitleId: data.sectionTitleId || '',
              sectionDescriptionEn: data.sectionDescriptionEn || '',
              sectionDescriptionId: data.sectionDescriptionId || '',
              categories: data.categories || [
                {
                  titleEn: '',
                  titleId: '',
                  descriptionEn: '',
                  descriptionId: '',
                  iconUrl: '',
                }
              ]
            })
          }
        }

        if (joinRes.ok) {
          const data = await joinRes.json()
          if (data.titleEn) {
            setJoinData({
              titleEn: data.titleEn,
              titleId: data.titleId,
              buttonTextEn: data.buttonTextEn || 'Join Now',
              buttonTextId: data.buttonTextId || 'Bergabung Sekarang',
              buttonUrl: data.buttonUrl || '',
            })
          }
        }

        if (membershipBenefitsRes.ok) {
          const data = await membershipBenefitsRes.json()
          setMembershipBenefitsData({
            memberships: data.memberships || [
              {
                tier: 'bronze',
                nameEn: 'BRONZE MEMBERSHIP',
                nameId: 'BRONZE MEMBERSHIP',
                descriptionEn: '',
                descriptionId: '',
                iconUrl: '/images/badges/bronze-membership.png',
              },
              {
                tier: 'silver',
                nameEn: 'SILVER MEMBERSHIP',
                nameId: 'SILVER MEMBERSHIP',
                descriptionEn: '',
                descriptionId: '',
                iconUrl: '/images/badges/silver-membership.png',
              },
              {
                tier: 'gold',
                nameEn: 'GOLD MEMBERSHIP',
                nameId: 'GOLD MEMBERSHIP',
                descriptionEn: '',
                descriptionId: '',
                iconUrl: '/images/badges/gold-membership.png',
              },
              {
                tier: 'platinum',
                nameEn: 'PLATINUM MEMBERSHIP',
                nameId: 'PLATINUM MEMBERSHIP',
                descriptionEn: '',
                descriptionId: '',
                iconUrl: '/images/badges/platinum-membership.png',
              },
            ],
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSave = async (section: string) => {
    setIsSaving(section)

    try {
      if (section === 'banner') {
        const response = await fetch('/api/cms/register/banner', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bannerData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save banner')
        }

        toast({
          title: t({ en: 'Success', id: 'Sukses' }),
          description: t({ en: 'Banner saved successfully', id: 'Banner berhasil disimpan' }),
        })
      } else if (section === 'membership') {
        const response = await fetch('/api/cms/register/membership', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(membershipData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save membership')
        }

        toast({
          title: t({ en: 'Success', id: 'Sukses' }),
          description: t({ en: 'Membership categories saved successfully', id: 'Kategori membership berhasil disimpan' }),
        })
      } else if (section === 'join') {
        const response = await fetch('/api/cms/register/join', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(joinData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save join data')
        }

        toast({
          title: t({ en: 'Success', id: 'Sukses' }),
          description: t({ en: 'Join section saved successfully', id: 'Section bergabung berhasil disimpan' }),
        })
      } else if (section === 'membershipBenefits') {
        const response = await fetch('/api/cms/members/membership-benefits', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(membershipBenefitsData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save membership benefits')
        }

        toast({
          title: t({ en: 'Success', id: 'Sukses' }),
          description: t({ en: 'Membership benefits saved successfully', id: 'Manfaat keanggotaan berhasil disimpan' }),
        })
      }
    } catch (error) {
      console.error(`Error saving ${section}:`, error)
      toast({
        title: t({ en: 'Error', id: 'Kesalahan' }),
        description: error instanceof Error ? error.message : t({ en: 'Failed to save changes', id: 'Gagal menyimpan perubahan' }),
        variant: 'destructive',
      })
    } finally {
      setIsSaving(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t({ en: 'Register Page Management', id: 'Manajemen Halaman Daftar' })}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t({ en: 'Manage content sections for the Register page', id: 'Kelola konten section untuk halaman Daftar' })}
        </p>
      </div>

      {isLoading ? (
        <Card className="p-6">
          <div className="text-center py-8 text-muted-foreground">
            {t({ en: 'Loading...', id: 'Memuat...' })}
          </div>
        </Card>
      ) : (
        <>
          {/* Banner Section */}
          <Card className="p-6">
            <div
              className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
              onClick={() => setExpandedSections({ ...expandedSections, banner: !expandedSections.banner })}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Banner', id: 'Banner' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage the Register page banner', id: 'Kelola banner halaman Daftar' })}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.banner ? 'rotate-0' : '-rotate-90'
                  }`}
              />
            </div>

            {expandedSections.banner && (
              <>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="banner-title-en">{t({ en: 'Title (English)', id: 'Judul (English)' })}</Label>
                    <Input
                      id="banner-title-en"
                      value={bannerData.titleEn}
                      onChange={(e) => setBannerData({ ...bannerData, titleEn: e.target.value })}
                      placeholder={t({ en: 'Enter banner title in English', id: 'Masukkan judul banner dalam English' })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="banner-title-id">{t({ en: 'Title (Bahasa Indonesia)', id: 'Judul (Bahasa Indonesia)' })}</Label>
                    <Input
                      id="banner-title-id"
                      value={bannerData.titleId}
                      onChange={(e) => setBannerData({ ...bannerData, titleId: e.target.value })}
                      placeholder={t({ en: 'Enter banner title in Indonesian', id: 'Masukkan judul banner dalam Indonesia' })}
                    />
                  </div>

                  <Button onClick={() => handleSave('banner')} disabled={isSaving === 'banner'}>
                    {isSaving === 'banner' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Banner', id: 'Simpan Banner' })}
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* Membership Categories Section */}
          <Card className="p-6">
            <div
              className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
              onClick={() => setExpandedSections({ ...expandedSections, membership: !expandedSections.membership })}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Membership Categories', id: 'Kategori Membership' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage membership categories and packages', id: 'Kelola kategori dan paket membership' })}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.membership ? 'rotate-0' : '-rotate-90'
                  }`}
              />
            </div>

            {expandedSections.membership && (
              <>
                <div className="space-y-6 mt-4">
                  <div className="border-b border-border pb-4 mb-4">
                    <h3 className="text-sm font-semibold text-foreground mb-4">{t({ en: 'Section Settings', id: 'Pengaturan Section' })}</h3>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-xs">{t({ en: 'Section Title (English)', id: 'Judul Section (English)' })}</Label>
                        <Input
                          value={membershipData.sectionTitleEn}
                          onChange={(e) => setMembershipData({ ...membershipData, sectionTitleEn: e.target.value })}
                          placeholder="e.g., Membership Category"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">{t({ en: 'Section Title (Bahasa Indonesia)', id: 'Judul Section (Bahasa Indonesia)' })}</Label>
                        <Input
                          value={membershipData.sectionTitleId}
                          onChange={(e) => setMembershipData({ ...membershipData, sectionTitleId: e.target.value })}
                          placeholder="e.g., Kategori Keanggotaan"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">{t({ en: 'Section Description (English)', id: 'Deskripsi Section (English)' })}</Label>
                        <Textarea
                          value={membershipData.sectionDescriptionEn}
                          onChange={(e) => setMembershipData({ ...membershipData, sectionDescriptionEn: e.target.value })}
                          placeholder="Enter section description in English"
                          rows={3}
                        />
                      </div>

                      <div>
                        <Label className="text-xs">{t({ en: 'Section Description (Bahasa Indonesia)', id: 'Deskripsi Section (Bahasa Indonesia)' })}</Label>
                        <Textarea
                          value={membershipData.sectionDescriptionId}
                          onChange={(e) => setMembershipData({ ...membershipData, sectionDescriptionId: e.target.value })}
                          placeholder="Masukkan deskripsi section dalam Indonesia"
                          rows={3}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-4">{t({ en: 'Categories', id: 'Kategori' })}</h3>
                  </div>

                  {membershipData.categories.map((category, index) => (
                    <Card key={index} className="p-4 border-muted bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          {/* {category.iconUrl && (
                            <div className="flex-shrink-0">
                              <img
                                src={category.iconUrl}
                                alt="Category icon"
                                className="h-10 w-10 rounded object-cover"
                              />
                            </div>
                          )} */}
                          <h3 className="font-semibold text-foreground">{t({ en: 'Category', id: 'Kategori' })} {index + 1}</h3>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newData = membershipData.categories.filter((_, i) => i !== index)
                            setMembershipData({ ...membershipData, categories: newData })
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs">{t({ en: 'Icon', id: 'Icon' })}</Label>
                          <div className="mt-1">
                            <IconPicker
                              value={category.iconUrl}
                              onChange={(icon) => {
                                const newData = { ...membershipData }
                                newData.categories[index].iconUrl = icon
                                setMembershipData(newData)
                              }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">{t({ en: 'Title (English)', id: 'Judul (English)' })}</Label>
                            <Input
                              value={category.titleEn}
                              onChange={(e) => {
                                const newData = { ...membershipData }
                                newData.categories[index].titleEn = e.target.value
                                setMembershipData(newData)
                              }}
                              placeholder="e.g., Cybersecurity Industry Member"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">{t({ en: 'Title (Bahasa Indonesia)', id: 'Judul (Bahasa Indonesia)' })}</Label>
                            <Input
                              value={category.titleId}
                              onChange={(e) => {
                                const newData = { ...membershipData }
                                newData.categories[index].titleId = e.target.value
                                setMembershipData(newData)
                              }}
                              placeholder="e.g., Anggota Industri Keamanan Siber"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <Label className="text-xs">{t({ en: 'Description (English)', id: 'Deskripsi (English)' })}</Label>
                            <Textarea
                              value={category.descriptionEn}
                              onChange={(e) => {
                                const newData = { ...membershipData }
                                newData.categories[index].descriptionEn = e.target.value
                                setMembershipData(newData)
                              }}
                              placeholder="Enter description"
                              rows={4}
                            />
                          </div>
                          <div>
                            <Label className="text-xs">{t({ en: 'Description (Bahasa Indonesia)', id: 'Deskripsi (Bahasa Indonesia)' })}</Label>
                            <Textarea
                              value={category.descriptionId}
                              onChange={(e) => {
                                const newData = { ...membershipData }
                                newData.categories[index].descriptionId = e.target.value
                                setMembershipData(newData)
                              }}
                              placeholder="Masukkan deskripsi"
                              rows={4}
                            />
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}

                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setMembershipData({
                          ...membershipData,
                          categories: [
                            ...membershipData.categories,
                            {
                              titleEn: '',
                              titleId: '',
                              descriptionEn: '',
                              descriptionId: '',
                              iconUrl: '',
                            }
                          ]
                        })
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t({ en: 'Add Category', id: 'Tambah Kategori' })}
                    </Button>

                    <Button onClick={() => handleSave('membership')} disabled={isSaving === 'membership'}>
                      {isSaving === 'membership' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Categories', id: 'Simpan Kategori' })}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* Join ADIGSI Section */}
          <Card className="p-6">
            <div
              className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
              onClick={() => setExpandedSections({ ...expandedSections, join: !expandedSections.join })}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Join ADIGSI', id: 'Bergabung ADIGSI' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage join section content', id: 'Kelola konten section bergabung' })}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.join ? 'rotate-0' : '-rotate-90'
                  }`}
              />
            </div>

            {expandedSections.join && (
              <>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="join-title-en">{t({ en: 'Title (English)', id: 'Judul (English)' })}</Label>
                    <Textarea
                      id="join-title-en"
                      value={joinData.titleEn}
                      onChange={(e) => setJoinData({ ...joinData, titleEn: e.target.value })}
                      placeholder="Enter title in English"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="join-title-id">{t({ en: 'Title (Bahasa Indonesia)', id: 'Judul (Bahasa Indonesia)' })}</Label>
                    <Textarea
                      id="join-title-id"
                      value={joinData.titleId}
                      onChange={(e) => setJoinData({ ...joinData, titleId: e.target.value })}
                      placeholder="Masukkan judul dalam Indonesia"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="join-button-text-en">{t({ en: 'Button Text (English)', id: 'Text Tombol (English)' })}</Label>
                    <Input
                      id="join-button-text-en"
                      value={joinData.buttonTextEn}
                      onChange={(e) => setJoinData({ ...joinData, buttonTextEn: e.target.value })}
                      placeholder="e.g., Join Now"
                    />
                  </div>

                  <div>
                    <Label htmlFor="join-button-text-id">{t({ en: 'Button Text (Bahasa Indonesia)', id: 'Text Tombol (Bahasa Indonesia)' })}</Label>
                    <Input
                      id="join-button-text-id"
                      value={joinData.buttonTextId}
                      onChange={(e) => setJoinData({ ...joinData, buttonTextId: e.target.value })}
                      placeholder="e.g., Bergabung Sekarang"
                    />
                  </div>

                  <div>
                    <Label htmlFor="join-button-url">{t({ en: 'Button URL', id: 'URL Tombol' })}</Label>
                    <Input
                      id="join-button-url"
                      type="url"
                      value={joinData.buttonUrl}
                      onChange={(e) => setJoinData({ ...joinData, buttonUrl: e.target.value })}
                      placeholder="https://example.com/form"
                    />
                  </div>

                  <Button onClick={() => handleSave('join')} disabled={isSaving === 'join'}>
                    {isSaving === 'join' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Join Section', id: 'Simpan Section Bergabung' })}
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* Membership Benefits Section */}
          <Card className="p-6">
            <div
              className="border-b border-border pb-4 flex items-center justify-between cursor-pointer select-none hover:bg-muted/50 p-3 -m-3 rounded transition-colors"
              onClick={() => setExpandedSections({ ...expandedSections, membershipBenefits: !expandedSections.membershipBenefits })}
            >
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Membership Benefits', id: 'Manfaat Keanggotaan' })}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t({ en: 'Manage membership tiers and benefits', id: 'Kelola tingkat keanggotaan dan manfaat' })}
                </p>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 shrink-0 ${expandedSections.membershipBenefits ? 'rotate-0' : '-rotate-90'
                  }`}
              />
            </div>

            {expandedSections.membershipBenefits && (
              <>
                {/* Membership Tiers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {membershipBenefitsData.memberships.map((membership, membershipIndex) => (
                    <Card key={membershipIndex} className="p-3 border-muted bg-muted/20">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-foreground text-xs">{t({ en: 'Tier', id: 'Tingkat' })} {membershipIndex + 1}</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-xs text-red-600 hover:bg-red-50 px-1"
                          onClick={() => {
                            const newMemberships = membershipBenefitsData.memberships.filter((_, i) => i !== membershipIndex)
                            setMembershipBenefitsData({ ...membershipBenefitsData, memberships: newMemberships })
                          }}
                        >
                          {t({ en: 'Delete', id: 'Hapus' })}
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {/* Tier Icon Selection */}
                        <div className="border border-input rounded-lg p-2 bg-background">
                          <Label className="text-xs font-semibold mb-2 block">{t({ en: 'Icon/Badge', id: 'Icon/Badge' })}</Label>
                          
                          <div className="flex items-start gap-2">
                            {/* Icon Preview - Left */}
                            {membership.iconUrl && (
                              <div className="shrink-0 w-14 h-14 border border-input rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                                <img 
                                  src={membership.iconUrl} 
                                  alt="membership badge"
                                  className="w-full h-full object-contain p-1"
                                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                                />
                              </div>
                            )}

                            {/* Preset & Upload - Right */}
                            <div className="flex-1 space-y-1">
                              {/* Preset Icon Selector */}
                              <select
                                value={membership.iconUrl}
                                onChange={(e) => {
                                  const newMemberships = [...membershipBenefitsData.memberships]
                                  newMemberships[membershipIndex].iconUrl = e.target.value
                                  setMembershipBenefitsData({ ...membershipBenefitsData, memberships: newMemberships })
                                }}
                                className="h-7 w-full px-2 py-0 rounded-md border border-input bg-background text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                              >
                                <option value="">-- {t({ en: 'Select', id: 'Pilih' })} --</option>
                                <option value="/images/badges/bronze-membership.png">🥉 {t({ en: 'Bronze', id: 'Perunggu' })}</option>
                                <option value="/images/badges/silver-membership.png">🥈 {t({ en: 'Silver', id: 'Perak' })}</option>
                                <option value="/images/badges/gold-membership.png">🥇 {t({ en: 'Gold', id: 'Emas' })}</option>
                                <option value="/images/badges/platinum-membership.png">💎 {t({ en: 'Platinum', id: 'Platinum' })}</option>
                              </select>

                              {/* Custom Upload */}
                              <div className="flex items-center gap-1">
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      const reader = new FileReader()
                                      reader.onload = (event) => {
                                        const base64 = event.target?.result as string
                                        const newMemberships = [...membershipBenefitsData.memberships]
                                        newMemberships[membershipIndex].iconUrl = base64
                                        setMembershipBenefitsData({ ...membershipBenefitsData, memberships: newMemberships })
                                      }
                                      reader.readAsDataURL(file)
                                    }
                                  }}
                                  className="hidden"
                                  id={`icon-upload-${membershipIndex}`}
                                />
                                <label htmlFor={`icon-upload-${membershipIndex}`} className="cursor-pointer">
                                  <Button variant="outline" size="sm" className="h-7 text-xs px-2" asChild>
                                    <span>{t({ en: 'Upload', id: 'Upload' })}</span>
                                  </Button>
                                </label>
                                <p className="text-xs text-muted-foreground">{t({ en: 'PNG/JPG', id: 'PNG/JPG' })}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tier Names */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          <div>
                            <Label className="text-xs">{t({ en: 'Name (EN)', id: 'Nama (EN)' })}</Label>
                            <Input
                              value={membership.nameEn}
                              onChange={(e) => {
                                const newMemberships = [...membershipBenefitsData.memberships]
                                newMemberships[membershipIndex].nameEn = e.target.value
                                setMembershipBenefitsData({ ...membershipBenefitsData, memberships: newMemberships })
                              }}
                              placeholder="e.g., PLATINUM MEMBERSHIP"
                              className="h-7 text-xs"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">{t({ en: 'Name (ID)', id: 'Nama (ID)' })}</Label>
                            <Input
                              value={membership.nameId}
                              onChange={(e) => {
                                const newMemberships = [...membershipBenefitsData.memberships]
                                newMemberships[membershipIndex].nameId = e.target.value
                                setMembershipBenefitsData({ ...membershipBenefitsData, memberships: newMemberships })
                              }}
                              placeholder="e.g., PLATINUM MEMBERSHIP"
                              className="h-7 text-xs"
                            />
                          </div>
                        </div>

                        {/* Descriptions */}
                        <div>
                          <Label className="text-xs">{t({ en: 'Description (EN)', id: 'Deskripsi (EN)' })}</Label>
                          <textarea
                            value={membership.descriptionEn}
                            onChange={(e) => {
                              const newMemberships = [...membershipBenefitsData.memberships]
                              newMemberships[membershipIndex].descriptionEn = e.target.value
                              setMembershipBenefitsData({ ...membershipBenefitsData, memberships: newMemberships })
                            }}
                            placeholder={t({ en: 'Enter membership description in English', id: 'Masukkan deskripsi keanggotaan dalam English' })}
                            className="w-full h-20 px-2 py-1 border border-input rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                        </div>

                        <div>
                          <Label className="text-xs">{t({ en: 'Description (ID)', id: 'Deskripsi (ID)' })}</Label>
                          <textarea
                            value={membership.descriptionId}
                            onChange={(e) => {
                              const newMemberships = [...membershipBenefitsData.memberships]
                              newMemberships[membershipIndex].descriptionId = e.target.value
                              setMembershipBenefitsData({ ...membershipBenefitsData, memberships: newMemberships })
                            }}
                            placeholder={t({ en: 'Enter membership description in Indonesian', id: 'Masukkan deskripsi keanggotaan dalam Indonesia' })}
                            className="w-full h-20 px-2 py-1 border border-input rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Add Tier Button */}
                <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="mt-3 h-8 text-xs"
                  onClick={() => {
                    const newMemberships = [...membershipBenefitsData.memberships, {
                      tier: `tier-${Date.now()}`,
                      nameEn: '',
                      nameId: '',
                      descriptionEn: '',
                      descriptionId: '',
                      iconUrl: '/images/badges/bronze-membership.png',
                    }]
                    setMembershipBenefitsData({ ...membershipBenefitsData, memberships: newMemberships })
                  }}
                >
                  {t({ en: '+ Add Tier', id: '+ Tambah Tingkat' })}
                </Button>

                <Button onClick={() => handleSave('membershipBenefits')} disabled={isSaving === 'membershipBenefits'} className="mt-3 h-8 text-xs">
                  {isSaving === 'membershipBenefits' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Membership Benefits', id: 'Simpan Manfaat Keanggotaan' })}
                </Button>
                </div>
              </>
            )}
          </Card>

          
        </>
      )}
    </div>
  )
}
