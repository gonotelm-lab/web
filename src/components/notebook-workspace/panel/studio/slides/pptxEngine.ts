import type { PresentationData } from '@aiden0z/pptx-renderer'

type PptxModule = typeof import('@aiden0z/pptx-renderer')

let modulePromise: Promise<PptxModule> | null = null

export function loadPptxModule(): Promise<PptxModule> {
  if (!modulePromise) {
    modulePromise = import('@aiden0z/pptx-renderer')
  }
  return modulePromise
}

export async function loadPresentationFromBuffer(
  buffer: ArrayBuffer,
): Promise<PresentationData> {
  const {
    parseZipLazyMedia,
    buildPresentation,
    RECOMMENDED_ZIP_LIMITS,
  } = await loadPptxModule()
  const files = await parseZipLazyMedia(buffer, RECOMMENDED_ZIP_LIMITS)
  return buildPresentation(files, { lazySlides: true })
}

export function getSlideCount(presentation: PresentationData): number {
  return Array.isArray(presentation.slides) ? presentation.slides.length : 0
}
