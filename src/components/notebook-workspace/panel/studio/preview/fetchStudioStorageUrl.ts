import i18n from '@/i18n'
import {
  isObjectStorageExpiredResponse,
  isPresignedGetUrlExpired,
} from './presignedUrlExpiry'
import { ensureFreshStudioContentUrl } from './ensureFreshStudioContentUrl'

async function readErrorBody(response: Response): Promise<string> {
  try {
    return await response.text()
  } catch {
    return ''
  }
}

/**
 * Fetch a studio storage URL; if the signature is expired, refresh once via task API and retry.
 */
export async function fetchStudioStorageUrl(
  params: {
    url: string
    taskId?: string
    init?: RequestInit
    onUrlRefreshed?: (nextUrl: string) => void
  },
): Promise<Response> {
  let url = params.url.trim()
  if (!url) {
    throw new Error(i18n.t('studio:preview.emptyArtifact'))
  }

  let refreshed = false

  if (params.taskId && isPresignedGetUrlExpired(url)) {
    const ensured = await ensureFreshStudioContentUrl({
      taskId: params.taskId,
      contentUrl: url,
      forceRefresh: true,
    })
    if (ensured.contentUrl && ensured.contentUrl !== url) {
      url = ensured.contentUrl
      refreshed = true
      params.onUrlRefreshed?.(url)
    }
  }

  const first = await fetch(url, params.init)
  if (first.ok) {
    return first
  }

  const body = await readErrorBody(first)
  const canRetry =
    Boolean(params.taskId) &&
    !refreshed &&
    isObjectStorageExpiredResponse(first.status, body)

  if (!canRetry || !params.taskId) {
    throw new Error(
      isObjectStorageExpiredResponse(first.status, body)
        ? i18n.t('studio:preview.urlExpired')
        : i18n.t('studio:api.contentFailed', { status: first.status }),
    )
  }

  const ensured = await ensureFreshStudioContentUrl({
    taskId: params.taskId,
    contentUrl: url,
    forceRefresh: true,
  })
  const nextUrl = ensured.contentUrl.trim()
  if (!nextUrl) {
    throw new Error(i18n.t('studio:preview.urlExpired'))
  }
  params.onUrlRefreshed?.(nextUrl)

  const second = await fetch(nextUrl, params.init)
  if (!second.ok) {
    const secondBody = await readErrorBody(second)
    throw new Error(
      isObjectStorageExpiredResponse(second.status, secondBody)
        ? i18n.t('studio:preview.urlExpired')
        : i18n.t('studio:api.contentFailed', { status: second.status }),
    )
  }
  return second
}

export async function downloadStudioStorageFile(params: {
  url: string
  filename: string
  taskId?: string
  onUrlRefreshed?: (nextUrl: string) => void
}) {
  const response = await fetchStudioStorageUrl({
    url: params.url,
    taskId: params.taskId,
    onUrlRefreshed: params.onUrlRefreshed,
  })
  const blob = await response.blob()
  const objectUrl = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = params.filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(objectUrl)
}
