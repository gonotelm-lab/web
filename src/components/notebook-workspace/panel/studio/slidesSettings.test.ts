import { describe, expect, it } from 'vitest'
import { buildSlidesRequestParams, defaultSlidesParameters } from './slidesSettings'

describe('buildSlidesRequestParams', () => {
  it('returns empty object when tip is omitted or blank', () => {
    expect(buildSlidesRequestParams()).toEqual({})
    expect(buildSlidesRequestParams({ tip: '' })).toEqual({})
    expect(buildSlidesRequestParams({ tip: '   ' })).toEqual({})
  })

  it('trims tip before sending', () => {
    expect(buildSlidesRequestParams({ tip: '  focus on takeaways  ' })).toEqual({
      tip: 'focus on takeaways',
    })
  })

  it('keeps dialog defaults tip as empty string', () => {
    expect(defaultSlidesParameters).toEqual({ tip: '' })
  })
})
