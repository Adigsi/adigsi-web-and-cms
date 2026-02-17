export const CMS_AUTH_COOKIE = 'adigsi_cms_session'

export function isValidCmsCredential(email: string, password: string) {
  const adminEmail = process.env.CMS_ADMIN_EMAIL ?? 'admin@adigsi.id'
  const adminPassword = process.env.CMS_ADMIN_PASSWORD ?? 'admin123'

  return email === adminEmail && password === adminPassword
}
