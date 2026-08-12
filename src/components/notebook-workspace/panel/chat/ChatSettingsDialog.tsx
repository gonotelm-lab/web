import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { workspaceDialogLayout } from '../../shared/ui/dialogLayoutTokens'
import {
  getChatAnswerLengthOptionList,
  getChatStyleOptionList,
  settingsToggleButtonSx,
  type ChatAnswerLengthOption,
  type ChatStyleOption,
} from './chatSettings'

type ThinkingToggleValue = 'on' | 'off'

interface ChatSettingsDialogProps {
  open: boolean
  chatStyle: ChatStyleOption
  answerLength: ChatAnswerLengthOption
  enableThinking: boolean
  thinkingToggleDisabled: boolean
  onClose: () => void
  onSave: () => void
  onChatStyleChange: (value: ChatStyleOption) => void
  onAnswerLengthChange: (value: ChatAnswerLengthOption) => void
  onEnableThinkingChange: (enabled: boolean) => void
}

export function ChatSettingsDialog({
  open,
  chatStyle,
  answerLength,
  enableThinking,
  thinkingToggleDisabled,
  onClose,
  onSave,
  onChatStyleChange,
  onAnswerLengthChange,
  onEnableThinkingChange,
}: ChatSettingsDialogProps) {
  const { t } = useTranslation(['chat', 'common'])
  const thinkingValue: ThinkingToggleValue = enableThinking ? 'on' : 'off'
  const chatStyleOptionList = getChatStyleOptionList()
  const chatAnswerLengthOptionList = getChatAnswerLengthOptionList()

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{ paper: { sx: { borderRadius: workspaceDialogLayout.paperRadius } } }}
    >
      <DialogTitle>{t('chat:settings.title')}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={workspaceDialogLayout.sectionStackSpacing}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t('chat:settings.style')}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: workspaceDialogLayout.helperTextMt }}
            >
              {t('chat:settings.styleHelp')}
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={chatStyle}
              onChange={(_, nextValue: ChatStyleOption | null) => {
                if (nextValue) {
                  onChatStyleChange(nextValue)
                }
              }}
              sx={{
                mt: workspaceDialogLayout.controlMt,
                flexWrap: 'wrap',
                gap: workspaceDialogLayout.toggleGap,
                border: 'none',
              }}
            >
              {chatStyleOptionList.map((option) => (
                <ToggleButton key={option.value} value={option.value} sx={settingsToggleButtonSx}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <Divider />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t('chat:settings.length')}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: workspaceDialogLayout.helperTextMt }}
            >
              {t('chat:settings.lengthHelp')}
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={answerLength}
              onChange={(_, nextValue: ChatAnswerLengthOption | null) => {
                if (nextValue) {
                  onAnswerLengthChange(nextValue)
                }
              }}
              sx={{
                mt: workspaceDialogLayout.controlMt,
                flexWrap: 'wrap',
                gap: workspaceDialogLayout.toggleGap,
                border: 'none',
              }}
            >
              {chatAnswerLengthOptionList.map((option) => (
                <ToggleButton key={option.value} value={option.value} sx={settingsToggleButtonSx}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
          </Box>
          <Divider />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t('chat:settings.deepThink')}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: workspaceDialogLayout.helperTextMt }}
            >
              {t('chat:settings.deepThinkHelp')}
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={thinkingValue}
              disabled={thinkingToggleDisabled}
              onChange={(_, nextValue: ThinkingToggleValue | null) => {
                if (nextValue === 'on') {
                  onEnableThinkingChange(true)
                } else if (nextValue === 'off') {
                  onEnableThinkingChange(false)
                }
              }}
              sx={{
                mt: workspaceDialogLayout.controlMt,
                flexWrap: 'wrap',
                gap: workspaceDialogLayout.toggleGap,
                border: 'none',
              }}
            >
              <ToggleButton
                value="off"
                sx={settingsToggleButtonSx}
                aria-label={t('chat:settings.deepThinkOff')}
              >
                {t('chat:settings.deepThinkOff')}
              </ToggleButton>
              <ToggleButton
                value="on"
                sx={settingsToggleButtonSx}
                aria-label={t('chat:settings.deepThinkOn')}
              >
                {t('chat:settings.deepThinkOn')}
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common:action.cancel')}</Button>
        <Button variant="contained" onClick={onSave}>
          {t('common:action.save')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
