import i18n from '@/i18n'
import { getDefaultStudioOutputLanguage } from '@/i18n/studioOutputLanguage'
import type {
  GenerateSlidesParameters,
  StudioArtifactSlidesVisualStyle,
} from '@/types/api'

export function getDefaultSlidesParameters(): GenerateSlidesParameters {
  return {
    language: getDefaultStudioOutputLanguage(),
    visual_style: 'default',
    tip: '',
  }
}

/** Snapshot defaults; language follows current UI locale at access time. */
export const defaultSlidesParameters: GenerateSlidesParameters =
  getDefaultSlidesParameters()

export function buildSlidesRequestParams(
  params?: GenerateSlidesParameters,
): GenerateSlidesParameters {
  const defaults = getDefaultSlidesParameters()
  const normalized: GenerateSlidesParameters = {
    language: params?.language?.trim() || defaults.language,
    visual_style: params?.visual_style || defaults.visual_style,
  }
  const tip = params?.tip?.trim()
  if (tip) {
    normalized.tip = tip
  }
  return normalized
}

export function getSlidesLanguageOptionList(): { value: string; label: string }[] {
  return [
    { value: 'zh-CN', label: i18n.t('studio:lang.zhCN') },
    { value: 'en-US', label: i18n.t('studio:lang.enUS') },
  ]
}

export function getSlidesVisualStyleOptionList(): {
  value: StudioArtifactSlidesVisualStyle
  label: string
  description: string
}[] {
  return [
    {
      value: 'default',
      label: i18n.t('studio:style.slides.default.label'),
      description: i18n.t('studio:style.slides.default.description'),
    },
    {
      value: 'educational',
      label: i18n.t('studio:style.slides.educational.label'),
      description: i18n.t('studio:style.slides.educational.description'),
    },
    {
      value: 'cute',
      label: i18n.t('studio:style.slides.cute.label'),
      description: i18n.t('studio:style.slides.cute.description'),
    },
  ]
}
