import { describe, expect, it } from 'vitest'
import { getDefaultStudioOutputLanguage } from './studioOutputLanguage'

describe('getDefaultStudioOutputLanguage', () => {
  it('maps zh UI locale to zh-CN', () => {
    expect(getDefaultStudioOutputLanguage('zh')).toBe('zh-CN')
    expect(getDefaultStudioOutputLanguage('zh-CN')).toBe('zh-CN')
  })

  it('maps en UI locale to en-US', () => {
    expect(getDefaultStudioOutputLanguage('en')).toBe('en-US')
    expect(getDefaultStudioOutputLanguage('en-US')).toBe('en-US')
  })
})
