'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/contexts/language-context'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function CMSAboutPage() {
  const { t } = useLanguage()
  const [isSaving, setIsSaving] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<{
    section: string | null
    type: 'success' | 'error' | null
    message: string
  }>({ section: null, type: null, message: '' })

  // Banner section state
  const [bannerData, setBannerData] = useState({
    titleEn: 'About ADIGSI',
    titleId: 'Tentang ADIGSI',
    imageUrl: '/images/about-banner.jpg',
  })

  // Organization Structure section state
  const [orgData, setOrgData] = useState({
    groups: [
      {
        titleEn: 'Supervisory Board',
        titleId: 'Dewan Pengawas',
        members: [
          {
            name: '',
            positionEn: '',
            positionId: '',
            imageUrl: ''
          }
        ]
      }
    ]
  })

  // About ADIGSI section state
  const [aboutData, setAboutData] = useState({
    titleEn: 'Indonesian Association for Digitalization and Cybersecurity',
    titleId: 'Asosiasi Indonesia untuk Digitalisasi dan Keamanan Siber',
    descriptionEn: '',
    descriptionId: '',
    visionEn: '',
    visionId: '',
    missions: [{ en: '', id: '' }]
  })

  // Partners section state
  const [partnersData, setPartnersData] = useState({
    title: 'Our Partners',
    description: 'We collaborate with leading organizations',
  })

  // Fetch banner, organization, and about data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bannerRes, orgRes, aboutRes] = await Promise.all([
          fetch('/api/cms/about/banner'),
          fetch('/api/cms/about/organization'),
          fetch('/api/cms/about/about')
        ])

        if (bannerRes.ok) {
          const data = await bannerRes.json()
          setBannerData({
            titleEn: data.titleEn || '',
            titleId: data.titleId || '',
            imageUrl: data.imageUrl || '',
          })
        }

        if (orgRes.ok) {
          const data = await orgRes.json()
          if (data.groups && data.groups.length > 0) {
            setOrgData({ groups: data.groups })
          }
        }

        if (aboutRes.ok) {
          const data = await aboutRes.json()
          if (data.titleEn) {
            setAboutData({
              titleEn: data.titleEn,
              titleId: data.titleId,
              descriptionEn: data.descriptionEn,
              descriptionId: data.descriptionId,
              visionEn: data.visionEn,
              visionId: data.visionId,
              missions: data.missions || [{ en: '', id: '' }]
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
        const response = await fetch('/api/cms/about/banner', {
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

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveStatus({ section: null, type: null, message: '' })
        }, 3000)
      } else if (section === 'organization') {
        const response = await fetch('/api/cms/about/organization', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orgData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save organization')
        }

        setSaveStatus({
          section: 'organization',
          type: 'success',
          message: t({ en: 'Organization data saved successfully', id: 'Data organisasi berhasil disimpan' }),
        })

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveStatus({ section: null, type: null, message: '' })
        }, 3000)
      } else if (section === 'about') {
        const response = await fetch('/api/cms/about/about', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(aboutData),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to save about data')
        }

        setSaveStatus({
          section: 'about',
          type: 'success',
          message: t({ en: 'About data saved successfully', id: 'Data tentang ADIGSI berhasil disimpan' }),
        })

        // Clear success message after 3 seconds
        setTimeout(() => {
          setSaveStatus({ section: null, type: null, message: '' })
        }, 3000)
      } else {
        // Handle other sections (to be implemented)
        const sectionData: Record<string, unknown> = {
          partners: partnersData,
        }

        console.log(`Saving ${section}:`, sectionData[section])
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
        <h1 className="text-2xl font-bold text-foreground">{t({ en: 'About Page Management', id: 'Manajemen Halaman About' })}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t({ en: 'Manage content sections for the About page', id: 'Kelola konten section untuk halaman About' })}
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
            <div className="mb-6 border-b border-border pb-4">
              <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Banner', id: 'Banner' })}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {t({ en: 'Manage the banner section with title and image', id: 'Kelola section banner dengan judul dan gambar' })}
              </p>
            </div>

            {saveStatus.section === 'banner' && saveStatus.type && (
              <Alert className={`mb-4 ${saveStatus.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
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

        <div className="space-y-4">
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
            {isSaving === 'banner' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
          </Button>
        </div>
      </Card>

      {/* Organization Section */}
      <Card className="p-6">
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Organization Structure', id: 'Struktur Organisasi' })}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t({ en: 'Manage the organization structure with groups and members', id: 'Kelola struktur organisasi dengan grup dan anggota' })}
          </p>
        </div>

        {saveStatus.section === 'organization' && saveStatus.type && (
          <Alert className={`mb-4 ${saveStatus.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
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

        <div className="space-y-6">
          {orgData.groups.map((group, groupIndex) => (
            <div key={groupIndex} className="border border-border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-semibold text-foreground">
                  {t({ en: `Group ${groupIndex + 1}`, id: `Grup ${groupIndex + 1}` })}
                </h3>
                {orgData.groups.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const newGroups = orgData.groups.filter((_, i) => i !== groupIndex)
                      setOrgData({ ...orgData, groups: newGroups })
                    }}
                  >
                    {t({ en: 'Remove Group', id: 'Hapus Grup' })}
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>{t({ en: 'Group Title (English)', id: 'Judul Grup (English)' })}</Label>
                  <Input
                    value={group.titleEn}
                    onChange={(e) => {
                      const newGroups = [...orgData.groups]
                      newGroups[groupIndex].titleEn = e.target.value
                      setOrgData({ ...orgData, groups: newGroups })
                    }}
                    placeholder="e.g., Supervisory Board"
                  />
                </div>
                <div>
                  <Label>{t({ en: 'Group Title (Indonesian)', id: 'Judul Grup (Indonesia)' })}</Label>
                  <Input
                    value={group.titleId}
                    onChange={(e) => {
                      const newGroups = [...orgData.groups]
                      newGroups[groupIndex].titleId = e.target.value
                      setOrgData({ ...orgData, groups: newGroups })
                    }}
                    placeholder="misal, Dewan Pengawas"
                  />
                </div>
              </div>

              <div className="space-y-4 mt-4">
                <Label className="text-sm font-semibold">{t({ en: 'Members', id: 'Anggota' })}</Label>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.members.map((member, memberIndex) => (
                    <div key={memberIndex} className="border border-dashed border-border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">
                          {t({ en: `Member ${memberIndex + 1}`, id: `Anggota ${memberIndex + 1}` })}
                        </span>
                        {group.members.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => {
                              const newGroups = [...orgData.groups]
                              newGroups[groupIndex].members = newGroups[groupIndex].members.filter((_, i) => i !== memberIndex)
                              setOrgData({ ...orgData, groups: newGroups })
                            }}
                          >
                            ×
                          </Button>
                        )}
                      </div>

                      <div>
                        <Label className="text-xs">{t({ en: 'Photo', id: 'Foto' })}</Label>
                        <div className="mt-1.5 border-2 border-dashed border-border rounded p-3">
                          {member.imageUrl && (
                            <div className="mb-2">
                              <img src={member.imageUrl} alt={member.name} className="h-20 w-20 mx-auto rounded object-cover object-top" />
                            </div>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) {
                                const reader = new FileReader()
                                reader.onloadend = () => {
                                  const newGroups = [...orgData.groups]
                                  newGroups[groupIndex].members[memberIndex].imageUrl = reader.result as string
                                  setOrgData({ ...orgData, groups: newGroups })
                                }
                                reader.readAsDataURL(file)
                              }
                            }}
                            className="hidden"
                            id={`member-image-${groupIndex}-${memberIndex}`}
                          />
                          <label htmlFor={`member-image-${groupIndex}-${memberIndex}`} className="cursor-pointer block text-center">
                            <div className="text-xs text-muted-foreground">
                              {t({ en: 'Upload', id: 'Upload' })}
                            </div>
                          </label>
                        </div>
                      </div>

                      <div>
                        <Label className="text-xs">{t({ en: 'Name', id: 'Nama' })}</Label>
                        <Input
                          size={32}
                          value={member.name}
                          onChange={(e) => {
                            const newGroups = [...orgData.groups]
                            newGroups[groupIndex].members[memberIndex].name = e.target.value
                            setOrgData({ ...orgData, groups: newGroups })
                          }}
                          placeholder={t({ en: 'Name', id: 'Nama' })}
                          className="text-xs h-8"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">{t({ en: 'Position (EN)', id: 'Jabatan (EN)' })}</Label>
                        <Input
                          value={member.positionEn}
                          onChange={(e) => {
                            const newGroups = [...orgData.groups]
                            newGroups[groupIndex].members[memberIndex].positionEn = e.target.value
                            setOrgData({ ...orgData, groups: newGroups })
                          }}
                          placeholder="Chairman"
                          className="text-xs h-8"
                        />
                      </div>

                      <div>
                        <Label className="text-xs">{t({ en: 'Position (ID)', id: 'Jabatan (ID)' })}</Label>
                        <Input
                          value={member.positionId}
                          onChange={(e) => {
                            const newGroups = [...orgData.groups]
                            newGroups[groupIndex].members[memberIndex].positionId = e.target.value
                            setOrgData({ ...orgData, groups: newGroups })
                          }}
                          placeholder="Ketua"
                          className="text-xs h-8"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newGroups = [...orgData.groups]
                    newGroups[groupIndex].members.push({
                      name: '',
                      positionEn: '',
                      positionId: '',
                      imageUrl: ''
                    })
                    setOrgData({ ...orgData, groups: newGroups })
                  }}
                >
                  {t({ en: '+ Add Member', id: '+ Tambah Anggota' })}
                </Button>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            className='mr-4'
            onClick={() => {
              setOrgData({
                ...orgData,
                groups: [
                  ...orgData.groups,
                  {
                    titleEn: '',
                    titleId: '',
                    members: [
                      {
                        name: '',
                        positionEn: '',
                        positionId: '',
                        imageUrl: ''
                      }
                    ]
                  }
                ]
              })
            }}
          >
            {t({ en: '+ Add New Group', id: '+ Tambah Grup Baru' })}
          </Button>

          <Button onClick={() => handleSave('organization')} disabled={isSaving === 'organization'}>
            {isSaving === 'organization' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
          </Button>
        </div>
      </Card>

      {/* About ADIGSI Section */}
      <Card className="p-6">
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="text-lg font-semibold text-foreground">{t({ en: 'About ADIGSI', id: 'Tentang ADIGSI' })}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t({ en: 'Manage the ADIGSI information section', id: 'Kelola section informasi ADIGSI' })}
          </p>
        </div>

        {saveStatus.section === 'about' && saveStatus.type && (
          <Alert className={`mb-4 ${saveStatus.type === 'success' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
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

        <div className="space-y-6">
          {/* Title Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="about-title-en">{t({ en: 'Title (English)', id: 'Judul (English)' })}</Label>
              <Input
                id="about-title-en"
                value={aboutData.titleEn}
                onChange={(e) => setAboutData({ ...aboutData, titleEn: e.target.value })}
                placeholder="Indonesian Association for Digitalization and Cybersecurity"
              />
            </div>
            <div>
              <Label htmlFor="about-title-id">{t({ en: 'Title (Indonesian)', id: 'Judul (Indonesia)' })}</Label>
              <Input
                id="about-title-id"
                value={aboutData.titleId}
                onChange={(e) => setAboutData({ ...aboutData, titleId: e.target.value })}
                placeholder="Asosiasi Indonesia untuk Digitalisasi dan Keamanan Siber"
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">{t({ en: 'Description', id: 'Deskripsi' })}</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="about-desc-en">{t({ en: 'Description (English)', id: 'Deskripsi (English)' })}</Label>
                <Textarea
                  id="about-desc-en"
                  value={aboutData.descriptionEn}
                  onChange={(e) => setAboutData({ ...aboutData, descriptionEn: e.target.value })}
                  placeholder="Enter description in English"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="about-desc-id">{t({ en: 'Description (Indonesian)', id: 'Deskripsi (Indonesia)' })}</Label>
                <Textarea
                  id="about-desc-id"
                  value={aboutData.descriptionId}
                  onChange={(e) => setAboutData({ ...aboutData, descriptionId: e.target.value })}
                  placeholder="Masukkan deskripsi dalam bahasa Indonesia"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Vision Section */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">{t({ en: 'Vision', id: 'Visi' })}</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="about-vision-en">{t({ en: 'Vision (English)', id: 'Visi (English)' })}</Label>
                <Textarea
                  id="about-vision-en"
                  value={aboutData.visionEn}
                  onChange={(e) => setAboutData({ ...aboutData, visionEn: e.target.value })}
                  placeholder="Enter vision in English"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="about-vision-id">{t({ en: 'Vision (Indonesian)', id: 'Visi (Indonesia)' })}</Label>
                <Textarea
                  id="about-vision-id"
                  value={aboutData.visionId}
                  onChange={(e) => setAboutData({ ...aboutData, visionId: e.target.value })}
                  placeholder="Masukkan visi dalam bahasa Indonesia"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Missions Section */}
          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold text-foreground mb-3">{t({ en: 'Missions', id: 'Misi' })}</h3>

            <div className="space-y-3">
              {aboutData.missions.map((mission, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <Label className="text-xs">{t({ en: 'EN', id: 'EN' })}</Label>
                      <Input
                        value={mission.en}
                        onChange={(e) => {
                          const newMissions = [...aboutData.missions]
                          newMissions[index].en = e.target.value
                          setAboutData({ ...aboutData, missions: newMissions })
                        }}
                        placeholder="Enter mission in English"
                        className="text-xs h-8"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">{t({ en: 'ID', id: 'ID' })}</Label>
                      <Input
                        value={mission.id}
                        onChange={(e) => {
                          const newMissions = [...aboutData.missions]
                          newMissions[index].id = e.target.value
                          setAboutData({ ...aboutData, missions: newMissions })
                        }}
                        placeholder="Masukkan misi dalam bahasa Indonesia"
                        className="text-xs h-8"
                      />
                    </div>
                  </div>
                  {aboutData.missions.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 mt-6"
                      onClick={() => {
                        setAboutData({
                          ...aboutData,
                          missions: aboutData.missions.filter((_, i) => i !== index)
                        })
                      }}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => {
                setAboutData({
                  ...aboutData,
                  missions: [...aboutData.missions, { en: '', id: '' }]
                })
              }}
            >
              {t({ en: '+ Add Mission', id: '+ Tambah Misi' })}
            </Button>
          </div>

          <Button onClick={() => handleSave('about')} disabled={isSaving === 'about'}>
            {isSaving === 'about' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
          </Button>
        </div>
      </Card>

      {/* Partners Section */}
      <Card className="p-6">
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="text-lg font-semibold text-foreground">{t({ en: 'Partners', id: 'Mitra' })}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t({ en: 'Manage the partners section', id: 'Kelola section mitra' })}
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="partners-title">{t({ en: 'Title', id: 'Judul' })}</Label>
            <Input
              id="partners-title"
              value={partnersData.title}
              onChange={(e) => setPartnersData({ ...partnersData, title: e.target.value })}
              placeholder={t({ en: 'Enter section title', id: 'Masukkan judul section' })}
            />
          </div>

          <div>
            <Label htmlFor="partners-description">{t({ en: 'Description', id: 'Deskripsi' })}</Label>
            <Textarea
              id="partners-description"
              value={partnersData.description}
              onChange={(e) => setPartnersData({ ...partnersData, description: e.target.value })}
              placeholder={t({ en: 'Enter partners description', id: 'Masukkan deskripsi mitra' })}
              rows={5}
            />
          </div>

          <Button onClick={() => handleSave('partners')} disabled={isSaving === 'partners'}>
            {isSaving === 'partners' ? t({ en: 'Saving...', id: 'Menyimpan...' }) : t({ en: 'Save Changes', id: 'Simpan Perubahan' })}
          </Button>
        </div>
      </Card>
        </>
      )}
    </div>
  )
}
