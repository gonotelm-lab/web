import { useEffect, useRef } from 'react'
import { Box } from '@mui/material'
import type { PresentationData, PptxViewer } from '@aiden0z/pptx-renderer'
import i18n from '@/i18n'
import { subtleScrollbarSx } from '../../../shared/ui/scrollbar'
import { workspaceSpace } from '../../../shared/ui/layoutTokens'
import { loadPptxModule } from './pptxEngine'
import { ensureSlidesPreviewFonts } from './slidesPreviewFonts'
import { slidesRenderSurfaceSx } from './slidesRenderSurface'

interface SlidesInlineDeckProps {
  presentation: PresentationData
  onSlideClick?: (slideIndex: number) => void
}

export function SlidesInlineDeck({
  presentation,
  onSlideClick,
}: SlidesInlineDeckProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const hostRef = useRef<HTMLDivElement>(null)
  const onSlideClickRef = useRef(onSlideClick)

  useEffect(() => {
    onSlideClickRef.current = onSlideClick
  }, [onSlideClick])

  useEffect(() => {
    let cancelled = false
    let viewer: PptxViewer | null = null
    const slideCleanups = new Map<number, () => void>()
    const host = hostRef.current
    const scroll = scrollRef.current
    if (!host || !scroll) {
      return
    }

    const bindSlideElement = (index: number, element: HTMLElement) => {
      slideCleanups.get(index)?.()
      element.style.cursor = onSlideClickRef.current ? 'pointer' : ''
      element.setAttribute('role', 'button')
      element.tabIndex = 0
      element.setAttribute(
        'aria-label',
        i18n.t('studio:slides.openSlideAria', { n: index + 1 }),
      )

      const handleActivate = () => {
        onSlideClickRef.current?.(index)
      }
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleActivate()
        }
      }

      element.addEventListener('click', handleActivate)
      element.addEventListener('keydown', handleKeyDown)
      slideCleanups.set(index, () => {
        element.removeEventListener('click', handleActivate)
        element.removeEventListener('keydown', handleKeyDown)
        element.style.cursor = ''
        element.removeAttribute('role')
        element.removeAttribute('tabindex')
        element.removeAttribute('aria-label')
      })
    }

    void (async () => {
      await ensureSlidesPreviewFonts()
      const { PptxViewer } = await loadPptxModule()
      if (cancelled || !hostRef.current || !scrollRef.current) {
        return
      }
      const nextViewer = new PptxViewer(hostRef.current, {
        fitMode: 'contain',
        scrollContainer: scrollRef.current,
        lazyMedia: true,
        lazySlides: true,
        pdfjs: false,
      })
      viewer = nextViewer

      const onSlideRendered = (event: CustomEvent<{ index: number; element: HTMLElement }>) => {
        const detail = event.detail
        if (!detail?.element || typeof detail.index !== 'number') {
          return
        }
        bindSlideElement(detail.index, detail.element)
      }
      const onSlideUnmounted = (event: CustomEvent<{ index: number }>) => {
        const detail = event.detail
        if (typeof detail?.index !== 'number') {
          return
        }
        slideCleanups.get(detail.index)?.()
        slideCleanups.delete(detail.index)
      }

      nextViewer.on('sliderendered', onSlideRendered)
      nextViewer.on('slideunmounted', onSlideUnmounted)
      nextViewer.load(presentation)
      await nextViewer.renderList({ windowed: true, batchSize: 4, initialSlides: 2 })
    })()

    return () => {
      cancelled = true
      for (const cleanup of slideCleanups.values()) {
        cleanup()
      }
      slideCleanups.clear()
      viewer?.destroy()
      viewer = null
    }
  }, [presentation])

  useEffect(() => {
    const host = hostRef.current
    if (!host) {
      return
    }
    const clickable = Boolean(onSlideClick)
    host.querySelectorAll<HTMLElement>('[role="button"][aria-label]').forEach((element) => {
      element.style.cursor = clickable ? 'pointer' : ''
    })
  }, [onSlideClick])

  return (
    <Box
      ref={scrollRef}
      sx={(theme) => ({
        height: '100%',
        minHeight: 0,
        overflow: 'auto',
        px: workspaceSpace.sm,
        py: workspaceSpace.sm,
        boxSizing: 'border-box',
        ...subtleScrollbarSx(theme),
      })}
    >
      <Box
        ref={hostRef}
        className="slides-render-surface"
        sx={{
          width: '100%',
          minHeight: '100%',
          ...slidesRenderSurfaceSx,
        }}
      />
    </Box>
  )
}
