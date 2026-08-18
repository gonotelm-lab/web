import { describe, expect, it } from 'vitest'
import {
  isObjectStorageExpiredResponse,
  isPresignedGetUrlExpired,
} from './presignedUrlExpiry'

describe('isPresignedGetUrlExpired', () => {
  it('returns false when signature params are missing', () => {
    expect(isPresignedGetUrlExpired('https://cdn.example.com/a.pptx')).toBe(false)
  })

  it('returns false when url is still within expiry', () => {
    const url =
      'https://cdn.example.com/a.pptx?X-Amz-Date=20260818T120000Z&X-Amz-Expires=900'
    expect(
      isPresignedGetUrlExpired(url, Date.parse('2026-08-18T12:10:00Z')),
    ).toBe(false)
  })

  it('returns true only after expiry (no early refresh)', () => {
    const url =
      'https://cdn.example.com/a.pptx?X-Amz-Date=20260818T120000Z&X-Amz-Expires=900'
    // exactly at expiry boundary -> expired
    expect(
      isPresignedGetUrlExpired(url, Date.parse('2026-08-18T12:15:00Z')),
    ).toBe(true)
    expect(
      isPresignedGetUrlExpired(url, Date.parse('2026-08-18T12:15:01Z')),
    ).toBe(true)
    // one second before expiry -> not expired
    expect(
      isPresignedGetUrlExpired(url, Date.parse('2026-08-18T12:14:59Z')),
    ).toBe(false)
  })
})

describe('isObjectStorageExpiredResponse', () => {
  it('detects AccessDenied + Request has expired', () => {
    expect(
      isObjectStorageExpiredResponse(
        403,
        '<Error><Code>AccessDenied</Code><Message>Request has expired</Message></Error>',
      ),
    ).toBe(true)
  })

  it('ignores unrelated 403 bodies', () => {
    expect(
      isObjectStorageExpiredResponse(403, '<Error><Code>AccessDenied</Code></Error>'),
    ).toBe(false)
    expect(isObjectStorageExpiredResponse(404, 'Request has expired')).toBe(false)
  })
})
