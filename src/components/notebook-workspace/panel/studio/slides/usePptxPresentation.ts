import { useCallback, useEffect, useRef, useState } from 'react'
import type { PresentationData } from '@aiden0z/pptx-renderer'
import i18n from '@/i18n'
import { loadPresentationFromBuffer } from './pptxEngine'
import {
  deleteCachedPresentation,
  getCachedPresentation,
  setCachedPresentation,
} from './pptxPresentationCache'

export type PptxPresentationStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface UsePptxPresentationResult {
  status: PptxPresentationStatus
  presentation: PresentationData | null
  error: string
  reload: () => void
}

const isAbortError = (error: unknown) => {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return true
  }
  return error instanceof Error && error.name === 'AbortError'
}

export function usePptxPresentation(url: string): UsePptxPresentationResult {
  const normalizedUrl = url.trim()
  const [reloadToken, setReloadToken] = useState(0)
  const [remoteStatus, setRemoteStatus] = useState<PptxPresentationStatus>('loading')
  const [remotePresentation, setRemotePresentation] = useState<PresentationData | null>(null)
  const [remoteError, setRemoteError] = useState('')
  const requestSeqRef = useRef(0)

  const reload = useCallback(() => {
    if (normalizedUrl) {
      deleteCachedPresentation(normalizedUrl)
    }
    setRemoteStatus('loading')
    setRemotePresentation(null)
    setRemoteError('')
    setReloadToken((prev) => prev + 1)
  }, [normalizedUrl])

  useEffect(() => {
    if (!normalizedUrl) {
      return
    }
    if (getCachedPresentation(normalizedUrl)) {
      return
    }

    const requestSeq = requestSeqRef.current + 1
    requestSeqRef.current = requestSeq
    const abortController = new AbortController()

    void (async () => {
      try {
        const response = await fetch(normalizedUrl, { signal: abortController.signal })
        if (!response.ok) {
          throw new Error(i18n.t('studio:slides.parseFailed'))
        }
        const buffer = await response.arrayBuffer()
        const nextPresentation = await loadPresentationFromBuffer(buffer)
        if (requestSeqRef.current !== requestSeq) {
          return
        }
        setCachedPresentation(normalizedUrl, nextPresentation, buffer)
        setRemotePresentation(nextPresentation)
        setRemoteStatus('ready')
        setRemoteError('')
      } catch (loadError) {
        if (isAbortError(loadError) || requestSeqRef.current !== requestSeq) {
          return
        }
        setRemotePresentation(null)
        setRemoteStatus('error')
        setRemoteError(
          loadError instanceof Error && loadError.message.trim()
            ? loadError.message
            : i18n.t('studio:slides.parseFailed'),
        )
      }
    })()

    return () => {
      abortController.abort()
    }
  }, [normalizedUrl, reloadToken])

  if (!normalizedUrl) {
    return {
      status: 'error',
      presentation: null,
      error: i18n.t('studio:slides.emptyUrl'),
      reload,
    }
  }

  const cached = getCachedPresentation(normalizedUrl)
  if (cached) {
    return {
      status: 'ready',
      presentation: cached,
      error: '',
      reload,
    }
  }

  return {
    status: remoteStatus,
    presentation: remotePresentation,
    error: remoteError,
    reload,
  }
}
