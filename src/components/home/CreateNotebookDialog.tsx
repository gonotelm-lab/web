import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { workspaceDialogLayout } from '../notebook-workspace/shared/ui/dialogLayoutTokens'
import { workspaceSpace } from '../notebook-workspace/shared/ui/layoutTokens'

interface CreateNotebookDialogProps {
  open: boolean
  draftName: string
  submitting: boolean
  errorMessage: string | null
  onDraftNameChange: (value: string) => void
  onClose: () => void
  onCreateWithName: () => void
}

export function CreateNotebookDialog({
  open,
  draftName,
  submitting,
  errorMessage,
  onDraftNameChange,
  onClose,
  onCreateWithName,
}: CreateNotebookDialogProps) {
  const { t } = useTranslation(['home', 'common'])

  return (
    <Dialog
      open={open}
      onClose={submitting ? undefined : onClose}
      fullWidth
      maxWidth="xs"
      slotProps={{ paper: { sx: { borderRadius: workspaceDialogLayout.paperRadius } } }}
    >
      <DialogTitle>{t('home:create.dialogTitle')}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          size="small"
          margin="dense"
          label={t('home:create.nameLabel')}
          value={draftName}
          onChange={(event) => onDraftNameChange(event.target.value)}
          disabled={submitting}
        />
        {errorMessage ? (
          <Alert severity="error" sx={{ mt: workspaceSpace.sm }}>
            {errorMessage}
          </Alert>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          {t('common:action.cancel')}
        </Button>
        <Button
          variant="contained"
          onClick={onCreateWithName}
          disabled={submitting}
        >
          {t('home:create.submit')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
