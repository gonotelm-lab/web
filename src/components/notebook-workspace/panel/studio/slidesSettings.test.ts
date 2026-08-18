import { describe, expect, it } from 'vitest'
import {
  buildSlidesRequestParams,
  getDefaultSlidesParameters,
} from './slidesSettings'

describe('buildSlidesRequestParams', () => {
  it('always includes language and visual_style defaults', () => {
    const defaults = getDefaultSlidesParameters()
    expect(buildSlidesRequestParams()).toEqual({
      language: defaults.language,
      visual_style: 'default',
    })
    expect(buildSlidesRequestParams({ tip: '' })).toEqual({
      language: defaults.language,
      visual_style: 'default',
    })
    expect(buildSlidesRequestParams({ tip: '   ' })).toEqual({
      language: defaults.language,
      visual_style: 'default',
    })
  })

  it('trims tip before sending and keeps language / visual_style', () => {
    expect(
      buildSlidesRequestParams({
        tip: '  focus on takeaways  ',
        language: 'en-US',
        visual_style: 'educational',
      }),
    ).toEqual({
      tip: 'focus on takeaways',
      language: 'en-US',
      visual_style: 'educational',
    })
  })

  it('falls back to defaults when language / visual_style are blank', () => {
    const defaults = getDefaultSlidesParameters()
    expect(
      buildSlidesRequestParams({
        language: '  ',
        visual_style: undefined,
      }),
    ).toEqual({
      language: defaults.language,
      visual_style: 'default',
    })
  })

  it('keeps dialog defaults tip as empty string', () => {
    expect(getDefaultSlidesParameters()).toMatchObject({
      tip: '',
      visual_style: 'default',
    })
  })
})
