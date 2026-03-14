/**
 * Validation utility for media payloads (images, PDFs, icons)
 * Ensures all media fields contain provider URLs, not base64/data URIs
 * Works for both frontend validation and backend payload validation
 */

/**
 * Check if a string is a data URI (base64 encoded media)
 * Matches: data:image/png;base64,... or data:application/pdf;base64,...
 */
export function isDataUri(value: string): boolean {
  if (typeof value !== 'string') return false
  return /^data:[a-zA-Z0-9/+]+;base64,/.test(value)
}

/**
 * Check if a string is a valid provider URL (http/https or relative path)
 */
export function isValidMediaUrl(value: string): boolean {
  if (typeof value !== 'string') return false
  const trimmed = value.trim()
  if (trimmed.length === 0) return false
  // Allow http(s) URLs or relative paths (/uploads/..., /images/...)
  return /^(https?:\/\/.+|\/[a-zA-Z0-9/_\-\.]+)$/.test(trimmed)
}

/**
 * Get validation error message for a media field (used in API responses)
 * Returns null if value is valid, error message string if invalid
 */
export function getMediaUrlValidationError(
  value: unknown,
  fieldName: string
): string | null {
  if (!value) {
    return `${fieldName} is required`
  }

  if (typeof value !== 'string') {
    return `${fieldName} must be a string (URL)`
  }

  const trimmed = value.trim()
  if (trimmed.length === 0) {
    return `${fieldName} must not be empty`
  }

  // Reject base64/data URIs
  if (isDataUri(value)) {
    return `${fieldName} contains base64 data URI; provider URLs required (e.g., https://... or /uploads/...)`
  }

  // Validate URL format
  if (!isValidMediaUrl(value)) {
    return `${fieldName} must be a valid provider URL (http(s)://... or /path/to/file)`
  }

  return null
}

/**
 * Validate multiple media fields at once
 * Useful for batch validation in API routes
 */
export function validateMediaFields(
  payload: Record<string, unknown>,
  mediaFieldNames: string[]
): { valid: boolean; error?: string } {
  for (const fieldName of mediaFieldNames) {
    if (payload.hasOwnProperty(fieldName)) {
      const error = getMediaUrlValidationError(payload[fieldName], fieldName)
      if (error) {
        return { valid: false, error }
      }
    }
  }
  return { valid: true }
}
