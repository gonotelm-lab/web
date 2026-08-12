import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import type {
  GenerateQuizParameters,
  StudioArtifactQuizCount,
  StudioArtifactQuizDifficulty,
} from '@/types/api'
import { workspaceDialogLayout } from '../../shared/ui/dialogLayoutTokens'
import { settingsToggleButtonSx } from '../chat/chatSettings'
import {
  defaultQuizParameters,
  getQuizCountOptionList,
  getQuizDifficultyOptionList,
} from './quizSettings'

interface QuizSettingsDialogProps {
  open: boolean
  initialParams: GenerateQuizParameters
  onClose: () => void
  onGenerate: (params: GenerateQuizParameters) => void
}

export const QuizSettingsDialog = memo(function QuizSettingsDialog({
  open,
  initialParams,
  onClose,
  onGenerate,
}: QuizSettingsDialogProps) {
  const { t } = useTranslation(['studio', 'common'])
  const [draftParams, setDraftParams] = useState<GenerateQuizParameters>(initialParams)
  const quizCountOptionList = getQuizCountOptionList()
  const quizDifficultyOptionList = getQuizDifficultyOptionList()

  const count = draftParams.count || defaultQuizParameters.count || 'default'
  const difficulty = draftParams.difficulty || defaultQuizParameters.difficulty || 'medium'

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: workspaceDialogLayout.paperRadius } } }}>
      <DialogTitle>{t('studio:settings.quiz.title')}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={workspaceDialogLayout.sectionStackSpacing}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t('studio:settings.countStyle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: workspaceDialogLayout.helperTextMt }}>
              {t('studio:settings.countStyleHelp.quiz')}
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={count}
              onChange={(_, nextValue: StudioArtifactQuizCount | null) => {
                if (nextValue) {
                  setDraftParams((prev) => ({ ...prev, count: nextValue }))
                }
              }}
              sx={{ mt: workspaceDialogLayout.controlMt, flexWrap: 'wrap', gap: workspaceDialogLayout.toggleGap, border: 'none' }}
            >
              {quizCountOptionList.map((option) => (
                <ToggleButton key={option.value} value={option.value} sx={settingsToggleButtonSx}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Typography variant="caption" color="text.secondary" sx={{ mt: workspaceDialogLayout.captionMt, display: 'block' }}>
              {quizCountOptionList.find((option) => option.value === count)?.description}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t('studio:settings.difficulty')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: workspaceDialogLayout.helperTextMt }}>
              {t('studio:settings.difficultyHelp.quiz')}
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={difficulty}
              onChange={(_, nextValue: StudioArtifactQuizDifficulty | null) => {
                if (nextValue) {
                  setDraftParams((prev) => ({ ...prev, difficulty: nextValue }))
                }
              }}
              sx={{ mt: workspaceDialogLayout.controlMt, flexWrap: 'wrap', gap: workspaceDialogLayout.toggleGap, border: 'none' }}
            >
              {quizDifficultyOptionList.map((option) => (
                <ToggleButton key={option.value} value={option.value} sx={settingsToggleButtonSx}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Typography variant="caption" color="text.secondary" sx={{ mt: workspaceDialogLayout.captionMt, display: 'block' }}>
              {quizDifficultyOptionList.find((option) => option.value === difficulty)?.description}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t('studio:settings.tip')}
            </Typography>
            <TextField
              fullWidth
              size="small"
              multiline
              minRows={2}
              maxRows={2}
              slotProps={{ htmlInput: { maxLength: 300 } }}
              placeholder={t('studio:settings.tipPlaceholder.generic')}
              value={draftParams.tip || ''}
              onChange={(event) =>
                setDraftParams((prev) => ({ ...prev, tip: event.target.value }))
              }
              sx={{ mt: workspaceDialogLayout.controlMt }}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('common:action.cancel')}</Button>
        <Button variant="contained" onClick={() => onGenerate(draftParams)}>
          {t('common:action.generate')}
        </Button>
      </DialogActions>
    </Dialog>
  )
})
