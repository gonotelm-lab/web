import type { GenerateSlidesParameters } from '@/types/api'

export const defaultSlidesParameters: GenerateSlidesParameters = {
  tip: '',
}

export function buildSlidesRequestParams(
  params?: GenerateSlidesParameters,
): GenerateSlidesParameters {
  const normalized: GenerateSlidesParameters = {}
  const tip = params?.tip?.trim()
  if (tip) {
    normalized.tip = tip
  }
  return normalized
}
