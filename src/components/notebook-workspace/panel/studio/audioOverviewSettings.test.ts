import { afterEach, describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import {
  buildAudioOverviewRequestParams,
  getDefaultAudioOverviewParameters,
} from './audioOverviewSettings'

describe('buildAudioOverviewRequestParams', () => {
  afterEach(async () => {
    await i18n.changeLanguage('zh')
  })

  it('fills backend-required defaults when params are omitted', () => {
    expect(buildAudioOverviewRequestParams()).toEqual({
      language: 'zh-CN',
      style: 'abstract',
    })
  })

  it('merges custom params and omits empty tip', () => {
    expect(
      buildAudioOverviewRequestParams({
        language: ' en-US ',
        style: 'discussion',
        tip: '  keep concise  ',
      }),
    ).toEqual({
      language: 'en-US',
      style: 'discussion',
      tip: 'keep concise',
    })
  })

  it('keeps dialog defaults aligned with request defaults', () => {
    const defaults = getDefaultAudioOverviewParameters()
    expect(defaults.language).toBe('zh-CN')
    expect(defaults.style).toBe('abstract')
  })

  it('follows UI locale for default language', async () => {
    await i18n.changeLanguage('en')
    expect(getDefaultAudioOverviewParameters().language).toBe('en-US')
    expect(buildAudioOverviewRequestParams().language).toBe('en-US')
  })
})
