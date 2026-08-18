/**
 * Detect SigV4 / MinIO presigned GET expiry from query string.
 * Only returns true when already past expiry (no early refresh window).
 */
export function isPresignedGetUrlExpired(
  rawUrl: string,
  nowMs: number = Date.now(),
): boolean {
  const trimmed = rawUrl.trim()
  if (!trimmed) {
    return false
  }

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return false
  }

  const dateRaw = parsed.searchParams.get('X-Amz-Date') || parsed.searchParams.get('x-amz-date')
  const expiresRaw =
    parsed.searchParams.get('X-Amz-Expires') || parsed.searchParams.get('x-amz-expires')
  if (!dateRaw || !expiresRaw) {
    return false
  }

  const expiresSeconds = Number(expiresRaw)
  if (!Number.isFinite(expiresSeconds) || expiresSeconds <= 0) {
    return false
  }

  // X-Amz-Date is ISO8601 basic: YYYYMMDDTHHMMSSZ
  const match = /^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/.exec(dateRaw.trim())
  if (!match) {
    return false
  }
  const signedAtMs = Date.UTC(
    Number(match[1]),
    Number(match[2]) - 1,
    Number(match[3]),
    Number(match[4]),
    Number(match[5]),
    Number(match[6]),
  )
  if (!Number.isFinite(signedAtMs)) {
    return false
  }

  const expiresAtMs = signedAtMs + expiresSeconds * 1000
  return nowMs >= expiresAtMs
}

/** True when object storage rejects a presigned GET because the signature expired. */
export function isObjectStorageExpiredResponse(
  status: number,
  bodyText: string,
): boolean {
  if (status !== 403) {
    return false
  }
  const body = bodyText.toLowerCase()
  return body.includes('request has expired') && body.includes('accessdenied')
}
