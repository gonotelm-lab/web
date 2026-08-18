import { useCallback, useEffect, useRef, useState } from 'react'
import type { PresentationData } from '@aiden0z/pptx-renderer'
import i18n from '@/i18n'
import { fetchStudioStorageUrl } from '../preview/fetchStudioStorageUrl'
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

export interface UsePptxPresentationOptions {
  taskId?: string
  onUrlRefreshed?: (nextUrl: string) => void
}

const isAbortError = (error: unknown) => {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return true
  }
  return error instanceof Error && error.name === 'AbortError'
}

export function usePptxPresentation(
  url: string,
  options: UsePptxPresentationOptions = {},
): UsePptxPresentationResult {
  const normalizedUrl = url.trim()
  const { taskId, onUrlRefreshed } = options
  const onUrlRefreshedRef = useRef(onUrlRefreshed)
  onUrlRefreshedRef.current = onUrlRefreshed

  const [reloadToken, setReloadToken] = useState(0)
  const [remoteStatus, setRemoteStatus] = useState<PptxPresentationStatus>('loading')
  const [remotePresentation, setRemotePresentation] = useState<PresentationData | null>(null)
  const [remoteError, setRemoteError] = useState('')
  const [activeUrl, setActiveUrl] = useState(normalizedUrl)
  const requestSeqRef = useRef(0)

  useEffect(() => {
    setActiveUrl(normalizedUrl)
  }, [normalizedUrl])

  const reload = useCallback(() => {
    if (activeUrl) {
      deleteCachedPresentation(activeUrl)
    }
    if (normalizedUrl && normalizedUrl !== activeUrl) {
      deleteCachedPresentation(normalizedUrl)
    }
    setRemoteStatus('loading')
    setRemotePresentation(null)
    setRemoteError('')
    setReloadToken((prev) => prev + 1)
  }, [activeUrl, normalizedUrl])

  useEffect(() => {
    if (!normalizedUrl) {
      return
    }
    if (getCachedPresentation(normalizedUrl) || getCachedPresentation(activeUrl)) {
      return
    }

    const requestSeq = requestSeqRef.current + 1
    requestSeqRef.current = requestSeq
    const abortController = new AbortController()

    void (async () => {
      try {
        let usedUrl = normalizedUrl
        const response = await fetchStudioStorageUrl({
          url: normalizedUrl,
          taskId,
          init: { signal: abortController.signal },
          onUrlRefreshed: (nextUrl) => {
            usedUrl = nextUrl
            setActiveUrl(nextUrl)
            onUrlRefreshedRef.current?.(nextUrl)
          },
        })
        const buffer = await response.arrayBuffer()
        const nextPresentation = await loadPresentationFromBuffer(buffer)
        if (requestSeqRef.current !== requestSeq) {
          return
        }
        setCachedPresentation(usedUrl, nextPresentation, buffer)
        setActiveUrl(usedUrl)
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
    // activeUrl intentionally omitted: refresh updates it without re-triggering fetch
  }, [normalizedUrl, reloadToken, taskId])

  if (!normalizedUrl) {
    return {
      status: 'error',
      presentation: null,
      error: i18n.t('studio:slides.emptyUrl'),
      reload,
    }
  }

  const cached =
    getCachedPresentation(activeUrl) || getCachedPresentation(normalizedUrl)
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
