import { describe, expect, it } from 'vitest'
import { resolveStudioArtifactDownload } from './resolveStudioArtifactDownload'

describe('resolveStudioArtifactDownload', () => {
  it('downloads slides from contentUrl as pptx even when content is empty', () => {
    expect(
      resolveStudioArtifactDownload({
        kind: 'slides',
        title: 'Weekly Deck',
        content: '',
        contentUrl: 'https://cdn.example.com/deck.pptx',
      }),
    ).toEqual({
      type: 'url',
      url: 'https://cdn.example.com/deck.pptx',
      filename: 'Weekly_Deck.pptx',
    })
  })

  it('returns null for slides when contentUrl is blank', () => {
    expect(
      resolveStudioArtifactDownload({
        kind: 'slides',
        title: 'Weekly Deck',
        content: '',
        contentUrl: '   ',
      }),
    ).toBeNull()
  })
})
