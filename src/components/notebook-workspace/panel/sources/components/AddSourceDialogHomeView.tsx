import { useRef, useState } from 'react'
import AddLinkIcon from '@mui/icons-material/AddLink'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import NotesIcon from '@mui/icons-material/Notes'
import { Box, Paper, Stack, Typography } from '@mui/material'
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
    return '仅支持 pdf、txt、markdown、csv、docx、epub、xlsx、pptx 文件'
  }
  if (file.size < 1) {
    return '文件不能为空'
  }
  if (file.size > maxSourceFileSizeBytes) {
    return '文件大小不能超过 100MB'
  }
  return ''
}

function encryptedUserMessage(fileName: string, reason: string): string {
  if (reason === 'read-failed') {
    return `${fileName}: 无法读取文件内容`
  }
  return `${fileName}: 文件已加密，无法处理`
}

export function AddSourceDialogHomeView({
  disabled,
  onCreateFile,
  onOpenUrl,
  onOpenText,
}: AddSourceDialogHomeViewProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [fileError, setFileError] = useState<string>('')
  const [dragActive, setDragActive] = useState(false)
  const [checking, setChecking] = useState(false)
  const interactionDisabled = disabled || checking

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0 || interactionDisabled) return
    if (files.length > maxSourceFilesPerBatch) {
      setFileError(`一次最多选择 ${maxSourceFilesPerBatch} 个文件`)
      return
    }

    for (const file of files) {
      const errMsg = validateSourceFile(file)
      if (errMsg) {
        setFileError(`${file.name}: ${errMsg}`)
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
        setFileError(first ? `${first.name}: 无法读取文件内容` : '无法读取文件内容')
      } finally {
        setChecking(false)
      }
    })()
  }

  const statusMessage = fileError || (checking ? '正在检查文件…' : '')

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
        添加来源后，系统能够基于这些对您重要的信息提供回答。
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
            上传来源
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: workspaceSpace.sm }}>
            拖放或点击选择文件，即可上传
          </Typography>

          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: workspaceSpace.md }}>
            支持：pdf、txt、markdown、csv、docx、epub、xlsx、pptx
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
            单个文件最大 100MB
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: workspaceSpace.sm }}>
            一次最多选择 20 个文件
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
          aria-label="选择要上传的来源文件"
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
                链接
              </Typography>
            </Stack>
            <Stack direction="row" spacing={workspaceSpace.sm}>
              <Box sx={{ width: 20, flexShrink: 0 }} aria-hidden />
              <Typography variant="caption" color="text.secondary">
                网站
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
                粘贴文字
              </Typography>
            </Stack>
            <Stack direction="row" spacing={workspaceSpace.sm}>
              <Box sx={{ width: 20, flexShrink: 0 }} aria-hidden />
              <Typography variant="caption" color="text.secondary">
                复制的文字
              </Typography>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Box>
  )
}
