import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import AddLinkIcon from '@mui/icons-material/AddLink'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import NotesIcon from '@mui/icons-material/Notes'
import { Box, Paper, Stack, Typography } from '@mui/material'
import i18n from '@/i18n'
import { detectEncryptedSourceFile } from '../../../../../lib/detectEncryptedSourceFile'
import { workspaceRadius, workspaceSpace } from '../../../shared/ui/layoutTokens'
import { workspaceInteraction, workspaceTransitionPresets } from '../../../shared/ui/motionTokens'
import { workspaceIconSize } from '../../../shared/ui/typeTokens'

interface AddSourceDialogHomeViewProps {
  disabled: boolean
  onCreateFile: (files: File[]) => Promise<void>
  onOpenUrl: () => void
  onOpenText: () => void
}

const maxSourceFileSizeBytes = 100 * 1024 * 1024
const maxSourceFilesPerBatch = 20
const allowedFileExtensions = new Set([
  '.pdf',
  '.txt',
  '.md',
  '.markdown',
  '.csv',
  '.docx',
  '.epub',
  '.xlsx',
  '.pptx',
])
const acceptedFileTypes = '.pdf,.txt,.md,.markdown,.csv,.docx,.epub,.xlsx,.pptx'

const validateSourceFile = (file: File) => {
  const lowerName = file.name.toLowerCase()
  const dotIndex = lowerName.lastIndexOf('.')
  const ext = dotIndex >= 0 ? lowerName.slice(dotIndex) : ''
  if (!allowedFileExtensions.has(ext)) {
    return i18n.t('sources:upload.unsupportedType')
  }
  if (file.size < 1) {
    return i18n.t('sources:upload.emptyFile')
  }
  if (file.size > maxSourceFileSizeBytes) {
    return i18n.t('sources:upload.fileTooLarge')
  }
  return ''
}

function encryptedUserMessage(fileName: string, reason: string): string {
  if (reason === 'read-failed') {
    return i18n.t('sources:upload.readFailedNamed', { fileName })
  }
  return i18n.t('sources:upload.encrypted', { fileName })
}

export function AddSourceDialogHomeView({
  disabled,
  onCreateFile,
  onOpenUrl,
  onOpenText,
}: AddSourceDialogHomeViewProps) {
  const { t } = useTranslation(['sources', 'common'])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [fileError, setFileError] = useState<string>('')
  const [dragActive, setDragActive] = useState(false)
  const [checking, setChecking] = useState(false)
  const interactionDisabled = disabled || checking

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0 || interactionDisabled) return
    if (files.length > maxSourceFilesPerBatch) {
      setFileError(t('sources:upload.tooMany', { max: maxSourceFilesPerBatch }))
      return
    }

    for (const file of files) {
      const errMsg = validateSourceFile(file)
      if (errMsg) {
        setFileError(t('sources:upload.prefixedError', { fileName: file.name, error: errMsg }))
        return
      }
    }

    void (async () => {
      setChecking(true)
      setFileError('')
      try {
        for (const file of files) {
          const result = await detectEncryptedSourceFile(file)
          if (result.encrypted) {
            setFileError(encryptedUserMessage(file.name, result.reason))
            return
          }
        }
        await onCreateFile(files)
      } catch {
        const first = files[0]
        setFileError(
          first
            ? t('sources:upload.readFailedNamed', { fileName: first.name })
            : t('sources:upload.readFailed'),
        )
      } finally {
        setChecking(false)
      }
    })()
  }

  const statusMessage = fileError || (checking ? t('sources:upload.checking') : '')

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
      <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
        {t('sources:dialog.intro')}
      </Typography>

      {/* Upload zone is the only flexible region; cards stay pinned with reserved gap. */}
      <Box
        sx={{
          mt: { xs: workspaceSpace.sm, md: workspaceSpace.md },
          flex: 1,
          minHeight: 120,
          border: 1,
          borderStyle: 'dashed',
          borderColor: dragActive ? 'primary.main' : 'divider',
          borderRadius: workspaceRadius.lg,
          px: workspaceSpace.lg,
          py: workspaceSpace.md,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          overflow: 'auto',
          cursor: interactionDisabled ? 'default' : workspaceInteraction.cursorPointer,
          bgcolor: dragActive ? 'action.hover' : 'transparent',
          transition: workspaceTransitionPresets.borderBg,
        }}
        onClick={() => {
          if (!interactionDisabled) {
            fileInputRef.current?.click()
          }
        }}
        onDragEnter={(event) => {
          if (interactionDisabled) return
          event.preventDefault()
          event.stopPropagation()
          setDragActive(true)
        }}
        onDragOver={(event) => {
          if (interactionDisabled) return
          event.preventDefault()
          event.stopPropagation()
          if (!dragActive) {
            setDragActive(true)
          }
        }}
        onDragLeave={(event) => {
          if (interactionDisabled) return
          event.preventDefault()
          event.stopPropagation()
          setDragActive(false)
        }}
        onDrop={(event) => {
          if (interactionDisabled) return
          event.preventDefault()
          event.stopPropagation()
          setDragActive(false)
          handleFilesSelected(Array.from(event.dataTransfer.files ?? []))
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 420 }}>
          <CloudUploadIcon sx={{ fontSize: workspaceIconSize.xl, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ mt: workspaceSpace.sm }}>
            {t('sources:upload.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: workspaceSpace.sm }}>
            {t('sources:upload.hint')}
          </Typography>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: workspaceSpace.md }}>
            {t('sources:upload.formats')}
          </Typography>
          <Typography
            variant="caption"
            sx={(theme) => ({
              display: 'block',
              mt: workspaceSpace.sm,
              fontWeight: 600,
              color: theme.workspacePalette.status.warning,
            })}
          >
            {t('sources:upload.maxSize')}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: workspaceSpace.sm }}>
            {t('sources:upload.maxBatchHint')}
          </Typography>
          <Typography
            variant="caption"
            sx={(theme) => ({
              display: 'block',
              mt: workspaceSpace.sm,
              minHeight: 18,
              color: fileError
                ? theme.workspacePalette.status.error
                : 'text.secondary',
            })}
          >
            {statusMessage || '\u00a0'}
          </Typography>
        </Box>
        <input
          ref={fileInputRef}
          hidden
          type="file"
          multiple
          accept={acceptedFileTypes}
          aria-label={t('sources:upload.inputAria')}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? [])
            handleFilesSelected(files)
            e.currentTarget.value = ''
          }}
        />
      </Box>

      <Box
        sx={{
          mt: { xs: workspaceSpace.sm, md: workspaceSpace.md },
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
          gap: workspaceSpace.md,
          flexShrink: 0,
        }}
      >
        <Paper
          variant="outlined"
          onClick={onOpenUrl}
          sx={{
            p: workspaceSpace.md,
            minHeight: { xs: 72, md: 88 },
            borderRadius: workspaceRadius.lg,
            cursor: workspaceInteraction.cursorPointer,
            borderStyle: 'dashed',
            borderColor: 'divider',
          }}
        >
          <Stack spacing={workspaceSpace.xxs} sx={{ justifyContent: 'center', height: '100%' }}>
            <Stack direction="row" spacing={workspaceSpace.sm} sx={{ alignItems: 'center' }}>
              <AddLinkIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {t('sources:entry.link')}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={workspaceSpace.sm}>
              <Box sx={{ width: 20, flexShrink: 0 }} aria-hidden />
              <Typography variant="caption" color="text.secondary">
                {t('sources:entry.linkHint')}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
        <Paper
          variant="outlined"
          onClick={onOpenText}
          sx={{
            p: workspaceSpace.md,
            minHeight: { xs: 72, md: 88 },
            borderRadius: workspaceRadius.lg,
            cursor: workspaceInteraction.cursorPointer,
            borderStyle: 'dashed',
            borderColor: 'divider',
          }}
        >
          <Stack spacing={workspaceSpace.xxs} sx={{ justifyContent: 'center', height: '100%' }}>
            <Stack direction="row" spacing={workspaceSpace.sm} sx={{ alignItems: 'center' }}>
              <NotesIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {t('sources:entry.paste')}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={workspaceSpace.sm}>
              <Box sx={{ width: 20, flexShrink: 0 }} aria-hidden />
              <Typography variant="caption" color="text.secondary">
                {t('sources:entry.pasteHint')}
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Box>
  )
}
