import i18n from '@/i18n'
import type {
  GenerateReportParameters,
  StudioArtifactReportStyle,
} from '@/types/api'

export const defaultReportParameters: GenerateReportParameters = {
  style: 'default',
  language: 'zh-CN',
  tip: '',
}

export function buildReportRequestParams(
  params?: GenerateReportParameters,
): GenerateReportParameters {
  const normalized: GenerateReportParameters = {
    style: params?.style || defaultReportParameters.style,
    language: params?.language?.trim() || defaultReportParameters.language,
  }
  const tip = params?.tip?.trim()
  if (tip) {
    normalized.tip = tip
  }
  return normalized
}

export function getReportLanguageOptionList(): { value: string; label: string }[] {
  return [
    { value: 'zh-CN', label: i18n.t('studio:lang.zhCN') },
    { value: 'en-US', label: i18n.t('studio:lang.enUS') },
  ]
}

export function getReportStyleOptionList(): {
  value: StudioArtifactReportStyle
  label: string
  description: string
}[] {
  return [
    {
      value: 'default',
      label: i18n.t('studio:style.report.default.label'),
      description: i18n.t('studio:style.report.default.description'),
    },
    {
      value: 'brief',
      label: i18n.t('studio:style.report.brief.label'),
      description: i18n.t('studio:style.report.brief.description'),
    },
    {
      value: 'study-guide',
      label: i18n.t('studio:style.report.studyGuide.label'),
      description: i18n.t('studio:style.report.studyGuide.description'),
    },
    {
      value: 'detailed',
      label: i18n.t('studio:style.report.detailed.label'),
      description: i18n.t('studio:style.report.detailed.description'),
    },
  ]
}
