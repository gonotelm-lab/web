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
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import type {
  GenerateSlidesParameters,
  StudioArtifactSlidesVisualStyle,
} from '@/types/api'
import { workspaceDialogLayout } from '../../shared/ui/dialogLayoutTokens'
import { settingsToggleButtonSx } from '../chat/chatSettings'
import {
  getDefaultSlidesParameters,
  getSlidesLanguageOptionList,
  getSlidesVisualStyleOptionList,
} from './slidesSettings'

interface SlidesSettingsDialogProps {
  open: boolean
  initialParams: GenerateSlidesParameters
  onClose: () => void
  onGenerate: (params: GenerateSlidesParameters) => void
}

export const SlidesSettingsDialog = memo(function SlidesSettingsDialog({
  open,
  initialParams,
  onClose,
  onGenerate,
}: SlidesSettingsDialogProps) {
  const { t } = useTranslation(['studio', 'common'])
  const [draftParams, setDraftParams] = useState<GenerateSlidesParameters>(initialParams)
  const slidesLanguageOptionList = getSlidesLanguageOptionList()
  const slidesVisualStyleOptionList = getSlidesVisualStyleOptionList()

  const defaults = getDefaultSlidesParameters()
  const language = draftParams.language || defaults.language
  const visualStyle = draftParams.visual_style || defaults.visual_style || 'default'

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: workspaceDialogLayout.paperRadius } } }}>
      <DialogTitle>{t('studio:settings.slides.title')}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={workspaceDialogLayout.sectionStackSpacing}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t('studio:settings.language')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: workspaceDialogLayout.helperTextMt }}>
              {t('studio:settings.languageHelp.slides')}
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={language}
              onChange={(event) =>
                setDraftParams((prev) => ({ ...prev, language: event.target.value }))
              }
              sx={{ mt: workspaceDialogLayout.controlMt }}
            >
              {slidesLanguageOptionList.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t('studio:settings.visualStyle')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: workspaceDialogLayout.helperTextMt }}>
              {t('studio:settings.visualStyleHelp.slides')}
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={visualStyle}
              onChange={(_, nextValue: StudioArtifactSlidesVisualStyle | null) => {
                if (nextValue) {
                  setDraftParams((prev) => ({ ...prev, visual_style: nextValue }))
                }
              }}
              sx={{ mt: workspaceDialogLayout.controlMt, flexWrap: 'wrap', gap: workspaceDialogLayout.toggleGap, border: 'none' }}
            >
              {slidesVisualStyleOptionList.map((option) => (
                <ToggleButton key={option.value} value={option.value} sx={settingsToggleButtonSx}>
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <Typography variant="caption" color="text.secondary" sx={{ mt: workspaceDialogLayout.captionMt, display: 'block' }}>
              {slidesVisualStyleOptionList.find((option) => option.value === visualStyle)?.description}
            </Typography>
          </Box>

          <Divider />

          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {t('studio:settings.tip')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: workspaceDialogLayout.helperTextMt }}>
              {t('studio:settings.tipHelp.slides')}
            </Typography>
            <TextField
              fullWidth
              size="small"
              multiline
              minRows={3}
              maxRows={3}
              slotProps={{ htmlInput: { maxLength: 300 } }}
              placeholder={t('studio:settings.tipPlaceholder.slides')}
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
