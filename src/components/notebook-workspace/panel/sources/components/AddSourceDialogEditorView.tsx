import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { Box, Button, IconButton, Stack, TextField, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { workspaceSpace } from '../../../shared/ui/layoutTokens'
import { workspaceType } from '../../../shared/ui/typeTokens'

type EditorViewMode = 'url' | 'text'

interface AddSourceDialogEditorViewProps {
  view: EditorViewMode
  disabled: boolean
  urlInput: string
  textInput: string
  textMaxChars: number
  textCharCount: number
  hasSubmitValue: boolean
  onBack: () => void
  onUrlChange: (value: string) => void
  onTextChange: (value: string) => void
  onSubmit: () => Promise<void>
}

/** Keep helper row height stable so counter / hint never reflows the footer. */
const editorHelperTextSx = {
  mx: 0,
  mt: workspaceSpace.xxs,
  minHeight: 20,
  flexShrink: 0,
  fontSize: workspaceType.xs,
  lineHeight: 1.25,
  fontVariantNumeric: 'tabular-nums',
} as const

const editorFieldShellSx = {
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  // Under short viewports (e.g. F12 docked), keep a usable editor but never crush the footer.
  '& .MuiFormControl-root': {
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  '& .MuiInputBase-root': {
    flex: '1 1 auto',
    minHeight: 96,
    maxHeight: '100%',
    alignItems: 'stretch',
  },
  '& .MuiInputBase-input': {
    height: '100% !important',
    minHeight: 0,
    overflow: 'auto !important',
  },
  '& .MuiFormHelperText-root': editorHelperTextSx,
} as const

export function AddSourceDialogEditorView({
  view,
  disabled,
  urlInput,
  textInput,
  textMaxChars,
  textCharCount,
  hasSubmitValue,
  onBack,
  onUrlChange,
  onTextChange,
  onSubmit,
}: AddSourceDialogEditorViewProps) {
  const { t } = useTranslation(['sources', 'common'])

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          flexShrink: 0,
          minHeight: 36,
        }}
      >
        <IconButton size="small" onClick={onBack} disabled={disabled} aria-label={t('sources:editor.backAria')}>
          <ArrowBackIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {view === 'url' ? t('sources:editor.urlTitle') : t('sources:editor.textTitle')}
        </Typography>
      </Stack>

      <Box
        sx={{
          mt: { xs: workspaceSpace.sm, md: workspaceSpace.md },
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {view === 'url' ? (
          <TextField
            fullWidth
            size="small"
            label={t('sources:editor.urlTitle')}
            placeholder="https://example.com/article"
            value={urlInput}
            disabled={disabled}
            onChange={(e) => onUrlChange(e.target.value)}
            helperText={t('sources:editor.urlHelper')}
            slotProps={{
              inputLabel: { shrink: true },
              formHelperText: { sx: editorHelperTextSx },
            }}
          />
        ) : (
          <Box sx={editorFieldShellSx}>
            <TextField
              fullWidth
              multiline
              label={t('sources:editor.textTitle')}
              placeholder={t('sources:editor.textPlaceholder')}
              value={textInput}
              disabled={disabled}
              onChange={(e) => onTextChange(e.target.value)}
              helperText={`${textCharCount}/${textMaxChars}`}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: {
                  maxLength: textMaxChars,
                },
                formHelperText: {
                  sx: {
                    ...editorHelperTextSx,
                    textAlign: 'right',
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>

      <Stack
        direction="row"
        sx={{
          justifyContent: 'flex-end',
          alignItems: 'center',
          flexShrink: 0,
          mt: { xs: workspaceSpace.sm, md: workspaceSpace.md },
          pt: workspaceSpace.sm,
          minHeight: 52,
          borderTop: 1,
          borderColor: 'divider',
        }}
      >
        <Button
          onClick={() => {
            void onSubmit()
          }}
          disabled={disabled || !hasSubmitValue}
          variant="contained"
        >
          {t('sources:editor.submit')}
        </Button>
      </Stack>
    </Box>
  )
}
