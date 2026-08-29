import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import {
  applyStickToBottomScroll,
  isNearBottom,
  scrollToBottomAnimationDurationMs,
  showScrollToBottomButtonThresholdPx,
  smoothScrollDeltaEpsilonPx,
} from './chatConversationCommon'

interface UseChatScrollControlParams {
  messageListRef: RefObject<HTMLDivElement | null>
}

interface UseChatScrollControlResult {
  showScrollToBottomButton: boolean
  isProgrammaticScrollToBottomRef: RefObject<boolean>
  stickToBottomRef: RefObject<boolean>
  scrollToBottom: () => void
  scrollToBottomIfStuck: () => void
  smoothScrollToBottom: () => void
  syncScrollToBottomButtonVisibility: () => void
  syncStickToBottomFromUserScroll: () => void
  stopScrollToBottomAnimation: () => void
  resetScrollControl: () => void
}

/**
 * Centralizes message-list scroll UX:
 * immediate jump, eased animation, "scroll to bottom" button visibility,
 * layout-follow while the user stays at the bottom, and guards that distinguish
 * user scrolling from programmatic scrolling.
 */
export function useChatScrollControl({
  messageListRef,
}: UseChatScrollControlParams): UseChatScrollControlResult {
  const [showScrollToBottomButton, setShowScrollToBottomButton] = useState(false)
  const scrollToBottomAnimationRafRef = useRef<number | null>(null)
  // Shared flag lets scroll listeners ignore programmatic movement and avoid false "user scrolled" signals.
  const isProgrammaticScrollToBottomRef = useRef(false)
  const stickToBottomRef = useRef(true)

  const stopScrollToBottomAnimation = useCallback(() => {
    if (scrollToBottomAnimationRafRef.current !== null) {
      window.cancelAnimationFrame(scrollToBottomAnimationRafRef.current)
      scrollToBottomAnimationRafRef.current = null
    }
    isProgrammaticScrollToBottomRef.current = false
  }, [])

  const syncScrollToBottomButtonVisibility = useCallback(() => {
    const container = messageListRef.current
    if (!container) {
      setShowScrollToBottomButton(false)
      return
    }
    // Button appears only when user is meaningfully away from bottom.
    const distanceToBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight
    const nextVisible = distanceToBottom > showScrollToBottomButtonThresholdPx
    setShowScrollToBottomButton((prev) => (prev === nextVisible ? prev : nextVisible))
  }, [messageListRef])

  const syncStickToBottomFromUserScroll = useCallback(() => {
    const container = messageListRef.current
    if (!container) {
      return
    }
    stickToBottomRef.current = isNearBottom(container)
  }, [messageListRef])

  const scrollToBottom = useCallback(() => {
    const container = messageListRef.current
    if (!container) return
    stickToBottomRef.current = true
    isProgrammaticScrollToBottomRef.current = true
    container.scrollTop = container.scrollHeight
    setShowScrollToBottomButton(false)
    window.requestAnimationFrame(() => {
      const current = messageListRef.current
      if (current && stickToBottomRef.current) {
        current.scrollTop = current.scrollHeight
      }
      isProgrammaticScrollToBottomRef.current = false
    })
  }, [messageListRef])

  const scrollToBottomIfStuck = useCallback(() => {
    if (!stickToBottomRef.current) {
      return
    }
    isProgrammaticScrollToBottomRef.current = true
    applyStickToBottomScroll(messageListRef.current, true)
    setShowScrollToBottomButton(false)
    window.requestAnimationFrame(() => {
      applyStickToBottomScroll(messageListRef.current, stickToBottomRef.current)
      isProgrammaticScrollToBottomRef.current = false
    })
  }, [messageListRef])

  useEffect(() => {
    const container = messageListRef.current
    if (!container || typeof ResizeObserver === 'undefined') {
      return
    }

    const followLayout = () => {
      if (!stickToBottomRef.current) {
        return
      }
      isProgrammaticScrollToBottomRef.current = true
      applyStickToBottomScroll(container, true)
      window.requestAnimationFrame(() => {
        applyStickToBottomScroll(container, stickToBottomRef.current)
        isProgrammaticScrollToBottomRef.current = false
      })
    }

    const observer = new ResizeObserver(followLayout)
    observer.observe(container)
    const content = container.firstElementChild
    if (content) {
      observer.observe(content)
    }

    return () => {
      observer.disconnect()
    }
  }, [messageListRef])

  /**
   * Performs eased scrolling to bottom using requestAnimationFrame,
   * then restores normal scroll-state tracking when animation completes.
   */
  const smoothScrollToBottom = useCallback(() => {
    const container = messageListRef.current
    if (!container) return

    const startTop = container.scrollTop
    const targetTop = Math.max(container.scrollHeight - container.clientHeight, 0)
    const delta = targetTop - startTop
    if (Math.abs(delta) < smoothScrollDeltaEpsilonPx) {
      stickToBottomRef.current = true
      setShowScrollToBottomButton(false)
      return
    }

    stopScrollToBottomAnimation()
    isProgrammaticScrollToBottomRef.current = true
    stickToBottomRef.current = true
    setShowScrollToBottomButton(false)

    const startedAt = performance.now()
    const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / scrollToBottomAnimationDurationMs, 1)
      container.scrollTop = startTop + delta * easeOutCubic(progress)
      if (progress < 1) {
        // RAF chaining keeps animation synced with paint and prevents jank from timer drift.
        scrollToBottomAnimationRafRef.current = window.requestAnimationFrame(tick)
        return
      }
      scrollToBottomAnimationRafRef.current = null
      isProgrammaticScrollToBottomRef.current = false
      syncScrollToBottomButtonVisibility()
    }

    scrollToBottomAnimationRafRef.current = window.requestAnimationFrame(tick)
  }, [messageListRef, stopScrollToBottomAnimation, syncScrollToBottomButtonVisibility])

  const resetScrollControl = useCallback(() => {
    stopScrollToBottomAnimation()
    stickToBottomRef.current = true
    setShowScrollToBottomButton(false)
  }, [stopScrollToBottomAnimation])

  return {
    showScrollToBottomButton,
    isProgrammaticScrollToBottomRef,
    stickToBottomRef,
    scrollToBottom,
    scrollToBottomIfStuck,
    smoothScrollToBottom,
    syncScrollToBottomButtonVisibility,
    syncStickToBottomFromUserScroll,
    stopScrollToBottomAnimation,
    resetScrollControl,
  }
}
