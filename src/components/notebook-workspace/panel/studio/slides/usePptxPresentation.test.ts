import { createElement, useEffect } from 'react'
import { act, create } from 'react-test-renderer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { clearPptxPresentationCache } from './pptxPresentationCache'
import {
  usePptxPresentation,
  type UsePptxPresentationResult,
} from './usePptxPresentation'

vi.mock('./pptxEngine', () => ({
  loadPresentationFromBuffer: vi.fn(async () => ({ __fake: true, slides: [{}, {}] })),
}))

function Harness({
  url,
  onSnap,
}: {
  url: string
  onSnap: (v: UsePptxPresentationResult) => void
}) {
  const snap = usePptxPresentation(url)
  useEffect(() => {
    onSnap(snap)
  }, [onSnap, snap])
  return null
}

describe('usePptxPresentation', () => {
  beforeEach(() => {
    clearPptxPresentationCache()
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({
        ok: true,
        arrayBuffer: async () => new ArrayBuffer(8),
      })),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it('loads presentation from url', async () => {
    let latest: UsePptxPresentationResult | null = null
    await act(async () => {
      create(
        createElement(Harness, {
          url: 'https://example.com/a.pptx',
          onSnap: (v) => {
            latest = v
          },
        }),
      )
    })
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(latest).not.toBeNull()
    expect(latest!.status).toBe('ready')
    expect(latest!.presentation).toBeTruthy()
  })

  it('maps fetch failure to error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => ({ ok: false, status: 500 })),
    )
    let latest: UsePptxPresentationResult | null = null
    await act(async () => {
      create(
        createElement(Harness, {
          url: 'https://example.com/a.pptx',
          onSnap: (v) => {
            latest = v
          },
        }),
      )
    })
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(latest).not.toBeNull()
    expect(latest!.status).toBe('error')
    expect(latest!.error).toBeTruthy()
  })

  it('reports empty url as error', async () => {
    let latest: UsePptxPresentationResult | null = null
    await act(async () => {
      create(
        createElement(Harness, {
          url: '  ',
          onSnap: (v) => {
            latest = v
          },
        }),
      )
    })
    expect(latest).not.toBeNull()
    expect(latest!.status).toBe('error')
    expect(latest!.error).toBeTruthy()
  })
})
