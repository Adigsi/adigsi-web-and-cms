'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, CheckCircle2, AlertCircle, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/contexts/language-context'

interface BannerData {
  titleEn: string
  titleId: string
  imageUrl: string
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

export default function CMSRegisterPage() {
  const { t } = useLanguage()
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState({
    banner: false,
    membership: false,
    join: false,
  })
  const [saveStatus, setSaveStatus] = useState<{
    section: string | null
    type: 'success' | 'error' | null
    message: string
  }>({ section: null, type: null, message: '' })

  // Banner section state
  const [bannerData, setBannerData] = useState<BannerData>({
    titleEn: 'Register',
    titleId: 'Daftar',
    imageUrl: '',
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

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, membershipRes, joinRes] = await Promise.all([
          fetch('/api/cms/register/banner'),
          fetch('/api/cms/register/membership'),
          fetch('/api/cms/register/join')
        ])

        if (bannerRes.ok) {
          const data = await bannerRes.json()
          setBannerData({
            titleEn: data.titleEn || '',
            titleId: data.titleId || '',
            imageUrl: data.imageUrl || '',
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
    setSaveStatus({ section: null, type: null, message: '' })

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

        setSaveStatus({
          section: 'banner',
          type: 'success',
          message: t({ en: 'Banner saved successfully', id: 'Banner berhasil disimpan' }),
        })

        setTimeout(() => {
          setSaveStatus({ section: null, type: null, message: '' })
        }, 3000)
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

        setSaveStatus({
          section: 'membership',
          type: 'success',
          message: t({ en: 'Membership categories saved successfully', id: 'Kategori membership berhasil disimpan' }),
        })

        setTimeout(() => {
          setSaveStatus({ section: null, type: null, message: '' })
        }, 3000)
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

        setSaveStatus({
          section: 'join',
          type: 'success',
          message: t({ en: 'Join section saved successfully', id: 'Section bergabung berhasil disimpan' }),
        })

        setTimeout(() => {
          setSaveStatus({ section: null, type: null, message: '' })
        }, 3000)
      }
    } catch (error) {
      console.error(`Error saving ${section}:`, error)
      setSaveStatus({
        section,
        type: 'error',
        message: error instanceof Error ? error.message : t({ en: 'Failed to save changes', id: 'Gagal menyimpan perubahan' }),
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
                {saveStatus.section === 'banner' && saveStatus.type && (
                  <Alert className={`${saveStatus.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                    {saveStatus.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={saveStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                      {saveStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="banner-image">{t({ en: 'Banner Image', id: 'Gambar Banner' })}</Label>
                    <div className="mt-2">
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        {bannerData.imageUrl && (
                          <div className="mb-4">
                            <img src={bannerData.imageUrl} alt="Banner preview" className="h-32 w-auto mx-auto rounded object-cover" />
                          </div>
                        )}
                        <input
                          id="banner-image"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              const reader = new FileReader()
                              reader.onloadend = () => {
                                setBannerData({ ...bannerData, imageUrl: reader.result as string })
                              }
                              reader.readAsDataURL(file)
                            }
                          }}
                          className="hidden"
                        />
                        <label htmlFor="banner-image" className="cursor-pointer">
                          <div className="text-sm text-muted-foreground">
                            {t({ en: 'Click to upload or drag and drop', id: 'Klik untuk upload atau drag and drop' })}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {t({ en: 'PNG, JPG, GIF up to 10MB', id: 'PNG, JPG, GIF hingga 10MB' })}
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

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
                {saveStatus.section === 'membership' && saveStatus.type && (
                  <Alert className={`${saveStatus.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                    {saveStatus.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={saveStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                      {saveStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

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
                          <div className="mt-2 space-y-3">
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={category.iconUrl === '/images/icon/icon1.png' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                  const newData = { ...membershipData }
                                  newData.categories[index].iconUrl = '/images/icon/icon1.png'
                                  setMembershipData(newData)
                                }}
                                className="flex-1 flex flex-col items-center gap-2 h-auto py-2"
                              >
                                <img src="/images/icon/icon1.png" alt="Icon 1" className="h-8 w-8 object-cover" />
                                <span className="text-xs">Icon 1</span>
                              </Button>
                              <Button
                                type="button"
                                variant={category.iconUrl === '/images/icon/icon2.png' ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => {
                                  const newData = { ...membershipData }
                                  newData.categories[index].iconUrl = '/images/icon/icon2.png'
                                  setMembershipData(newData)
                                }}
                                className="flex-1 flex flex-col items-center gap-2 h-auto py-2"
                              >
                                <img src="/images/icon/icon2.png" alt="Icon 2" className="h-8 w-8 object-cover" />
                                <span className="text-xs">Icon 2</span>
                              </Button>
                            </div>

                            <div className="border-2 border-dashed border-border rounded-lg p-3 text-center">
                              {category.iconUrl && !category.iconUrl.startsWith('/images/icon/') && (
                                <div className="mb-2">
                                  <img src={category.iconUrl} alt="Icon preview" className="h-12 w-12 mx-auto rounded" />
                                </div>
                              )}
                              <input
                                id={`icon-upload-${index}`}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file) {
                                    const reader = new FileReader()
                                    reader.onloadend = () => {
                                      const newData = { ...membershipData }
                                      newData.categories[index].iconUrl = reader.result as string
                                      setMembershipData(newData)
                                    }
                                    reader.readAsDataURL(file)
                                  }
                                }}
                                className="hidden"
                              />
                              <label htmlFor={`icon-upload-${index}`} className="cursor-pointer">
                                <div className="text-xs text-muted-foreground">
                                  {t({ en: 'Click to upload custom icon', id: 'Klik untuk upload custom icon' })}
                                </div>
                              </label>
                            </div>
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
                {saveStatus.section === 'join' && saveStatus.type && (
                  <Alert className={`${saveStatus.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                    {saveStatus.type === 'success' ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={saveStatus.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                      {saveStatus.message}
                    </AlertDescription>
                  </Alert>
                )}

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
        </>
      )}
    </div>
  )
}
