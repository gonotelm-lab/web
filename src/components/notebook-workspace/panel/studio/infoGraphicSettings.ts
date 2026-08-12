import i18n from '@/i18n'
import type {
  GenerateInfoGraphicParameters,
  StudioArtifactInfoGraphicDetailLevel,
  StudioArtifactInfoGraphicOrientation,
  StudioArtifactInfoGraphicVisualStyle,
} from '@/types/api'

export const defaultInfoGraphicParameters: GenerateInfoGraphicParameters = {
  orientation: 'landscape',
  text_language: 'zh-CN',
  detail_level: 'standard',
  visual_style: 'default',
  extra_prompt: '',
}

export function buildInfoGraphicRequestParams(
  params?: GenerateInfoGraphicParameters,
): GenerateInfoGraphicParameters {
  const normalized: GenerateInfoGraphicParameters = {
    orientation: params?.orientation || defaultInfoGraphicParameters.orientation,
    text_language: params?.text_language?.trim() || defaultInfoGraphicParameters.text_language,
    detail_level: params?.detail_level || defaultInfoGraphicParameters.detail_level,
    visual_style: params?.visual_style || defaultInfoGraphicParameters.visual_style,
  }
  const extraPrompt = params?.extra_prompt?.trim()
  if (extraPrompt) {
    normalized.extra_prompt = extraPrompt
  }
  return normalized
}

export function getInfoGraphicOrientationOptionList(): {
  value: StudioArtifactInfoGraphicOrientation
  label: string
}[] {
  return [
    { value: 'landscape', label: i18n.t('studio:infoGraphic.orientation.landscape') },
    { value: 'portrait', label: i18n.t('studio:infoGraphic.orientation.portrait') },
    { value: 'square', label: i18n.t('studio:infoGraphic.orientation.square') },
  ]
}

export function getInfoGraphicLanguageOptionList(): { value: string; label: string }[] {
  return [
    { value: 'zh-CN', label: i18n.t('studio:lang.zhCN') },
    { value: 'en-US', label: i18n.t('studio:lang.enUS') },
  ]
}

export function getInfoGraphicDetailLevelOptionList(): {
  value: StudioArtifactInfoGraphicDetailLevel
  label: string
  description: string
}[] {
  return [
    {
      value: 'concise',
      label: i18n.t('studio:infoGraphic.detail.concise.label'),
      description: i18n.t('studio:infoGraphic.detail.concise.description'),
    },
    {
      value: 'standard',
      label: i18n.t('studio:infoGraphic.detail.standard.label'),
      description: i18n.t('studio:infoGraphic.detail.standard.description'),
    },
    {
      value: 'detailed',
      label: i18n.t('studio:infoGraphic.detail.detailed.label'),
      description: i18n.t('studio:infoGraphic.detail.detailed.description'),
    },
  ]
}

export function getInfoGraphicVisualStyleOptionList(): {
  value: StudioArtifactInfoGraphicVisualStyle
  label: string
  description: string
}[] {
  return [
    {
      value: 'default',
      label: i18n.t('studio:infoGraphic.visual.default.label'),
      description: i18n.t('studio:infoGraphic.visual.default.description'),
    },
    {
      value: 'hand-drawn',
      label: i18n.t('studio:infoGraphic.visual.handDrawn.label'),
      description: i18n.t('studio:infoGraphic.visual.handDrawn.description'),
    },
    {
      value: 'anime',
      label: i18n.t('studio:infoGraphic.visual.anime.label'),
      description: i18n.t('studio:infoGraphic.visual.anime.description'),
    },
    {
      value: 'cute',
      label: i18n.t('studio:infoGraphic.visual.cute.label'),
      description: i18n.t('studio:infoGraphic.visual.cute.description'),
    },
    {
      value: 'educational',
      label: i18n.t('studio:infoGraphic.visual.educational.label'),
      description: i18n.t('studio:infoGraphic.visual.educational.description'),
    },
    {
      value: 'minimal-2.5d',
      label: i18n.t('studio:infoGraphic.visual.minimal25d.label'),
      description: i18n.t('studio:infoGraphic.visual.minimal25d.description'),
    },
  ]
}
