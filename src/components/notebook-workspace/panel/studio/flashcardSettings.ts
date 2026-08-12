import i18n from '@/i18n'
import type {
  GenerateFlashcardParameters,
  StudioArtifactFlashcardCount,
  StudioArtifactFlashcardDifficulty,
} from '@/types/api'

export const defaultFlashcardParameters: GenerateFlashcardParameters = {
  count: 'default',
  difficulty: 'medium',
  tip: '',
}

export function buildFlashcardRequestParams(
  params?: GenerateFlashcardParameters,
): GenerateFlashcardParameters {
  const normalized: GenerateFlashcardParameters = {
    count: params?.count || defaultFlashcardParameters.count,
    difficulty: params?.difficulty || defaultFlashcardParameters.difficulty,
  }
  const tip = params?.tip?.trim()
  if (tip) {
    normalized.tip = tip
  }
  return normalized
}

export function getFlashcardCountOptionList(): {
  value: StudioArtifactFlashcardCount
  label: string
  description: string
}[] {
  return [
    {
      value: 'few',
      label: i18n.t('studio:count.few.label'),
      description: i18n.t('studio:count.few.descriptionFlashcard'),
    },
    {
      value: 'default',
      label: i18n.t('studio:count.default.label'),
      description: i18n.t('studio:count.default.descriptionFlashcard'),
    },
    {
      value: 'many',
      label: i18n.t('studio:count.many.label'),
      description: i18n.t('studio:count.many.descriptionFlashcard'),
    },
  ]
}

export function getFlashcardDifficultyOptionList(): {
  value: StudioArtifactFlashcardDifficulty
  label: string
  description: string
}[] {
  return [
    {
      value: 'easy',
      label: i18n.t('studio:difficulty.easy.label'),
      description: i18n.t('studio:difficulty.easy.descriptionFlashcard'),
    },
    {
      value: 'medium',
      label: i18n.t('studio:difficulty.medium.label'),
      description: i18n.t('studio:difficulty.medium.descriptionFlashcard'),
    },
    {
      value: 'hard',
      label: i18n.t('studio:difficulty.hard.label'),
      description: i18n.t('studio:difficulty.hard.descriptionFlashcard'),
    },
  ]
}
