import { act, create } from 'react-test-renderer'
import { describe, expect, it, vi } from 'vitest'
import { SlidesOverlayDeck } from './SlidesOverlayDeck'

vi.mock('./pptxEngine', async () => {
  const actual = await vi.importActual<typeof import('./pptxEngine')>('./pptxEngine')
  return {
    ...actual,
    loadPptxModule: vi.fn(async () => ({
      PptxViewer: class {
        load() {}
        destroy() {}
        renderSlideToContainer() {
          return { dispose() {}, ready: Promise.resolve() }
        }
        renderThumbnailToContainer() {
          return { dispose() {}, ready: Promise.resolve() }
        }
      },
    })),
  }
})

const fakePresentation = { slides: [{}, {}, {}] } as never

describe('SlidesOverlayDeck', () => {
  it('switches active slide when thumbnail clicked', async () => {
    let renderer: ReturnType<typeof create>
    await act(async () => {
      renderer = create(<SlidesOverlayDeck presentation={fakePresentation} />)
    })
    await act(async () => {
      await Promise.resolve()
      await Promise.resolve()
    })

    const buttons = renderer!.root.findAll(
      (node) =>
        typeof node.props === 'object' &&
        node.props !== null &&
        typeof (node.props as { 'aria-label'?: string })['aria-label'] === 'string' &&
        String((node.props as { 'aria-label'?: string })['aria-label']).startsWith('Slide '),
    )
    const third = buttons.find((button) =>
      String((button.props as { 'aria-label'?: string })['aria-label']).includes('3'),
    )
    expect(third).toBeTruthy()
    await act(async () => {
      ;(third!.props as { onClick?: (event: unknown) => void }).onClick?.({})
    })

    const stage = renderer!.root.findByProps({ 'data-testid': 'slides-overlay-stage' })
    expect((stage.props as { 'data-active-index': number })['data-active-index']).toBe(2)
  })

  it('honors initialIndex', async () => {
    let renderer: ReturnType<typeof create>
    await act(async () => {
      renderer = create(
        <SlidesOverlayDeck presentation={fakePresentation} initialIndex={2} />,
      )
    })
    const stage = renderer!.root.findByProps({ 'data-testid': 'slides-overlay-stage' })
    expect((stage.props as { 'data-active-index': number })['data-active-index']).toBe(2)
  })
})
