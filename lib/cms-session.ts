type CmsSessionPayload = {
  sub: string
  email: string
  exp: number
}

type CmsSessionUser = {
  id: string
  email: string
}

function encodeBase64Url(value: string) {
  if (typeof btoa === 'function') {
    return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
  }

  return Buffer.from(value, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')

  if (typeof atob === 'function') {
    return atob(padded)
  }

  return Buffer.from(padded, 'base64').toString('utf8')
}

async function createSignature(payloadEncoded: string) {
  const secret = process.env.CMS_SESSION_SECRET ?? process.env.CMS_AUTH_SECRET

  if (!secret) {
    throw new Error('CMS_SESSION_SECRET atau CMS_AUTH_SECRET belum diset di environment variables.')
  }

  const encoder = new TextEncoder()
  const keyData = encoder.encode(secret)
  const payloadData = encoder.encode(payloadEncoded)

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, payloadData)
  const signatureBytes = Array.from(new Uint8Array(signatureBuffer))
  const signatureString = String.fromCharCode(...signatureBytes)

  return encodeBase64Url(signatureString)
}

export async function createCmsSessionToken(user: CmsSessionUser) {
  const payload: CmsSessionPayload = {
    sub: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
  }

  const payloadEncoded = encodeBase64Url(JSON.stringify(payload))
  const signature = await createSignature(payloadEncoded)

  return `${payloadEncoded}.${signature}`
}

export async function verifyCmsSessionToken(token: string) {
  const [payloadEncoded, providedSignature] = token.split('.')

  if (!payloadEncoded || !providedSignature) {
    return null
  }

  const expectedSignature = await createSignature(payloadEncoded)

  if (expectedSignature !== providedSignature) {
    return null
  }

  const payloadString = decodeBase64Url(payloadEncoded)
  const payload = JSON.parse(payloadString) as CmsSessionPayload

  if (!payload?.sub || !payload?.email || !payload?.exp) {
    return null
  }

  const nowInSeconds = Math.floor(Date.now() / 1000)

  if (payload.exp <= nowInSeconds) {
    return null
  }

  return payload
}
