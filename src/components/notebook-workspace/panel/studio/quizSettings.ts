import i18n from '@/i18n'
import type {
  GenerateQuizParameters,
  StudioArtifactQuizCount,
  StudioArtifactQuizDifficulty,
} from '@/types/api'

export const defaultQuizParameters: GenerateQuizParameters = {
  count: 'default',
  difficulty: 'medium',
  tip: '',
}

export function buildQuizRequestParams(
  params?: GenerateQuizParameters,
): GenerateQuizParameters {
  const normalized: GenerateQuizParameters = {
    count: params?.count || defaultQuizParameters.count,
    difficulty: params?.difficulty || defaultQuizParameters.difficulty,
  }
  const tip = params?.tip?.trim()
  if (tip) {
    normalized.tip = tip
  }
  return normalized
}

export function getQuizCountOptionList(): {
  value: StudioArtifactQuizCount
  label: string
  description: string
}[] {
  return [
    {
      value: 'few',
      label: i18n.t('studio:count.few.label'),
      description: i18n.t('studio:count.few.descriptionQuiz'),
    },
    {
      value: 'default',
      label: i18n.t('studio:count.default.label'),
      description: i18n.t('studio:count.default.descriptionQuiz'),
    },
    {
      value: 'many',
      label: i18n.t('studio:count.many.label'),
      description: i18n.t('studio:count.many.descriptionQuiz'),
    },
  ]
}

export function getQuizDifficultyOptionList(): {
  value: StudioArtifactQuizDifficulty
  label: string
  description: string
}[] {
  return [
    {
      value: 'easy',
      label: i18n.t('studio:difficulty.easy.label'),
      description: i18n.t('studio:difficulty.easy.descriptionQuiz'),
    },
    {
      value: 'medium',
      label: i18n.t('studio:difficulty.medium.label'),
      description: i18n.t('studio:difficulty.medium.descriptionQuiz'),
    },
    {
      value: 'hard',
      label: i18n.t('studio:difficulty.hard.label'),
      description: i18n.t('studio:difficulty.hard.descriptionQuiz'),
    },
  ]
}
