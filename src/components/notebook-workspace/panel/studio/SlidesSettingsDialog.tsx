import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import type { GenerateSlidesParameters } from '@/types/api'
import { workspaceDialogLayout } from '../../shared/ui/dialogLayoutTokens'

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

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" slotProps={{ paper: { sx: { borderRadius: workspaceDialogLayout.paperRadius } } }}>
      <DialogTitle>{t('studio:settings.slides.title')}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={workspaceDialogLayout.sectionStackSpacing}>
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
