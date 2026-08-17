import type { PresentationData } from '@aiden0z/pptx-renderer'

interface CacheEntry {
  buffer: ArrayBuffer
  presentation: PresentationData
}

const cache = new Map<string, CacheEntry>()

export function getCachedPresentation(url: string): PresentationData | undefined {
  return cache.get(url)?.presentation
}

export function getCachedBuffer(url: string): ArrayBuffer | undefined {
  return cache.get(url)?.buffer
}

export function setCachedPresentation(
  url: string,
  presentation: PresentationData,
  buffer: ArrayBuffer,
): void {
  cache.set(url, { presentation, buffer })
}

export function deleteCachedPresentation(url: string): void {
  cache.delete(url)
}

/** 测试用 */
export function clearPptxPresentationCache(): void {
  cache.clear()
}
