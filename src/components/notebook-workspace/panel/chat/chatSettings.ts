import i18n from '@/i18n'
import { workspaceSpace } from '../../shared/ui/layoutTokens'
import { workspaceType } from '../../shared/ui/typeTokens'

export type ChatStyleOption = 'default' | 'analyst' | 'guide'
export type ChatAnswerLengthOption = 'default' | 'longer' | 'shorter'

export const chatStyleOptionValues: ChatStyleOption[] = ['default', 'analyst', 'guide']
export const chatAnswerLengthOptionValues: ChatAnswerLengthOption[] = [
  'default',
  'longer',
  'shorter',
]

export const getChatStyleOptionList = (): { value: ChatStyleOption; label: string }[] => [
  { value: 'default', label: i18n.t('chat:settings.styleDefault') },
  { value: 'analyst', label: i18n.t('chat:settings.styleAnalyst') },
  { value: 'guide', label: i18n.t('chat:settings.styleGuide') },
]

export const getChatAnswerLengthOptionList = (): {
  value: ChatAnswerLengthOption
  label: string
}[] => [
  { value: 'default', label: i18n.t('chat:settings.lengthDefault') },
  { value: 'longer', label: i18n.t('chat:settings.lengthLonger') },
  { value: 'shorter', label: i18n.t('chat:settings.lengthShorter') },
]

export const settingsToggleButtonSx = {
  minWidth: 72,
  border: '1px solid',
  borderColor: 'divider',
  borderRadius: 999,
  margin: 0,
  px: workspaceSpace.md,
  py: workspaceSpace.xxs,
  textTransform: 'none',
  fontSize: workspaceType.sm,
  '&.MuiToggleButtonGroup-grouped': {
    borderRadius: '999px !important',
    margin: 0,
  },
  '&.MuiToggleButtonGroup-grouped:not(:first-of-type)': {
    borderLeft: '1px solid',
    borderColor: 'divider',
  },
  '&.Mui-selected': {
    bgcolor: 'primary.main',
    color: 'primary.contrastText',
    borderColor: 'primary.main',
    '&:hover': {
      bgcolor: 'primary.dark',
    },
  },
}
