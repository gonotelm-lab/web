import { afterEach, describe, expect, it } from 'vitest'
import i18n from '@/i18n'
import {
  buildInfoGraphicRequestParams,
  getDefaultInfoGraphicParameters,
} from './infoGraphicSettings'

describe('buildInfoGraphicRequestParams', () => {
  afterEach(async () => {
    await i18n.changeLanguage('zh')
  })

  it('fills backend-required defaults when params are omitted', () => {
    expect(buildInfoGraphicRequestParams()).toEqual({
      orientation: 'landscape',
      text_language: 'zh-CN',
      detail_level: 'standard',
      visual_style: 'default',
    })
  })

  it('merges custom params and omits empty extra prompt', () => {
    expect(
      buildInfoGraphicRequestParams({
        orientation: 'landscape',
        text_language: 'en-US',
        detail_level: 'detailed',
        extra_prompt: '  focus on timeline  ',
      }),
    ).toEqual({
      orientation: 'landscape',
      text_language: 'en-US',
      detail_level: 'detailed',
      visual_style: 'default',
      extra_prompt: 'focus on timeline',
    })
  })

  it('keeps dialog defaults aligned with request defaults', () => {
    const defaults = getDefaultInfoGraphicParameters()
    expect(defaults.orientation).toBe('landscape')
    expect(defaults.text_language).toBe('zh-CN')
    expect(defaults.detail_level).toBe('standard')
    expect(defaults.visual_style).toBe('default')
  })

  it('follows UI locale for default text_language', async () => {
    await i18n.changeLanguage('en')
    expect(getDefaultInfoGraphicParameters().text_language).toBe('en-US')
    expect(buildInfoGraphicRequestParams().text_language).toBe('en-US')
  })
})
