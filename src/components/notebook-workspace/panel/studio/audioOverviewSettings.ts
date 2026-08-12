import i18n from '@/i18n'
import type {
  GenerateAudioOverviewParameters,
  StudioArtifactAudioOverviewStyle,
} from '@/types/api'

export const defaultAudioOverviewParameters: GenerateAudioOverviewParameters = {
  language: 'zh-CN',
  style: 'abstract',
  tip: '',
}

export function buildAudioOverviewRequestParams(
  params?: GenerateAudioOverviewParameters,
): GenerateAudioOverviewParameters {
  const normalized: GenerateAudioOverviewParameters = {
    language: params?.language?.trim() || defaultAudioOverviewParameters.language,
    style: params?.style || defaultAudioOverviewParameters.style,
  }
  const tip = params?.tip?.trim()
  if (tip) {
    normalized.tip = tip
  }
  return normalized
}

export function getAudioOverviewLanguageOptionList(): { value: string; label: string }[] {
  return [
    { value: 'zh-CN', label: i18n.t('studio:lang.zhCN') },
    { value: 'en-US', label: i18n.t('studio:lang.enUS') },
  ]
}

export function getAudioOverviewStyleOptionList(): {
  value: StudioArtifactAudioOverviewStyle
  label: string
  description: string
}[] {
  return [
    {
      value: 'abstract',
      label: i18n.t('studio:style.audio.abstract.label'),
      description: i18n.t('studio:style.audio.abstract.description'),
    },
    {
      value: 'deep-research',
      label: i18n.t('studio:style.audio.deepResearch.label'),
      description: i18n.t('studio:style.audio.deepResearch.description'),
    },
    {
      value: 'discussion',
      label: i18n.t('studio:style.audio.discussion.label'),
      description: i18n.t('studio:style.audio.discussion.description'),
    },
    {
      value: 'debate',
      label: i18n.t('studio:style.audio.debate.label'),
      description: i18n.t('studio:style.audio.debate.description'),
    },
  ]
}
