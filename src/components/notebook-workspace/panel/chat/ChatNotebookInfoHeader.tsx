import { useCallback, useEffect, useRef, useState } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import type { Theme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { chatMessageContentTokens } from './layoutTokens'
import { workspaceRadiusPx, workspaceSpace } from '../../shared/ui/layoutTokens'
import { workspaceTransitionPresets } from '../../shared/ui/motionTokens'
import { workspaceIconSize, workspaceType, workspaceTypeRem } from '../../shared/ui/typeTokens'

const notebookInfoTokens = {
  marginTop: 0,
  iconSlotSize: 34,
  iconSlotRadius: workspaceRadiusPx.md,
  iconSlotBorderColor: 'divider',
  iconColor: 'text.secondary',
  titleLineClamp: 2,
  actionRowMinHeight: 28,
  actionIconSize: 16,
}

const fallbackNotebookName = 'Untitled notebook'

const buildCopyActionButtonSx = (copied: boolean) => (theme: Theme) => ({
  p: 0,
  borderRadius: 0,
  color: copied ? theme.workspacePalette.status.success : 'text.disabled',
  bgcolor: 'transparent',
  transition: workspaceTransitionPresets.interactiveColorBorder,
  '&:hover': {
    bgcolor: 'transparent',
    color: copied ? theme.workspacePalette.status.success : 'text.secondary',
  },
})

interface ChatNotebookInfoHeaderProps {
  notebookName: string
  notebookDescription: string
  notebookSourceCount: number
}

export function ChatNotebookInfoHeader({
  notebookName,
  notebookDescription,
  notebookSourceCount,
}: ChatNotebookInfoHeaderProps) {
  const { t } = useTranslation(['chat', 'common'])
  const [copied, setCopied] = useState(false)
  const copyResetTimerRef = useRef<number | null>(null)
  const clearCopyResetTimer = useCallback(() => {
    if (copyResetTimerRef.current) {
      window.clearTimeout(copyResetTimerRef.current)
      copyResetTimerRef.current = null
    }
  }, [])
  const title = notebookName.trim() || fallbackNotebookName
  const description = notebookDescription.trim()
  const normalizedCount =
    Number.isFinite(notebookSourceCount) && notebookSourceCount > 0
      ? Math.floor(notebookSourceCount)
      : 0
  const sourceCountLabel = t('common:sourceCount', { count: normalizedCount })
  const copyPayload = [title, description, sourceCountLabel]
    .filter((part) => part.trim().length > 0)
    .join('\n')
  const canCopy = Boolean(copyPayload.trim())

  const handleCopyNotebookInfo = useCallback(() => {
    if (!canCopy) return
    void navigator.clipboard.writeText(copyPayload).then(() => {
      setCopied(true)
      clearCopyResetTimer()
      copyResetTimerRef.current = window.setTimeout(() => {
        setCopied(false)
        copyResetTimerRef.current = null
      }, 1200)
    }).catch(() => {
      setCopied(false)
    })
  }, [canCopy, clearCopyResetTimer, copyPayload])

  useEffect(() => {
    return clearCopyResetTimer
  }, [clearCopyResetTimer])

  return (
    <Box
      data-testid="chat-notebook-info-header"
      sx={{
        mt: notebookInfoTokens.marginTop,
        ml: chatMessageContentTokens.sideMarginX,
        mr: chatMessageContentTokens.sideMarginX,
      }}
    >
      <Stack spacing={workspaceSpace.sm} sx={{ minWidth: 0, flex: 1 }}>
        <Box
          data-testid="chat-notebook-icon-slot"
          aria-hidden
          sx={{
            flexShrink: 0,
            width: notebookInfoTokens.iconSlotSize,
            height: notebookInfoTokens.iconSlotSize,
            borderRadius: notebookInfoTokens.iconSlotRadius,
            border: 1,
            borderColor: notebookInfoTokens.iconSlotBorderColor,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DescriptionOutlinedIcon sx={{ fontSize: workspaceIconSize.md, color: notebookInfoTokens.iconColor }} />
        </Box>

        <Typography
          variant="h5"
          component="h2"
          sx={{
            minWidth: 0,
            // Keep title on Geist UI scale — oversized display + tracking makes CJK look uneven.
            fontSize: { xs: workspaceTypeRem.xl, md: '1.5rem' },
            lineHeight: 1.35,
            fontWeight: 600,
            letterSpacing: 0,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: notebookInfoTokens.titleLineClamp,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            width: '100%',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
            textAlign: 'left',
            letterSpacing: 0,
            minHeight: '1.6em',
          }}
        >
          {description || '\u00A0'}
        </Typography>

        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontSize: workspaceType.xs, letterSpacing: 0 }}
        >
          {sourceCountLabel}
        </Typography>

        <Box
          sx={{
            mt: workspaceSpace.xxs,
            minHeight: notebookInfoTokens.actionRowMinHeight,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Tooltip title={copied ? t('common:action.copied') : t('common:action.copy')}>
            <span>
              <IconButton
                data-testid="chat-notebook-copy-action"
                size="small"
                disabled={!canCopy}
                onClick={handleCopyNotebookInfo}
                sx={buildCopyActionButtonSx(copied)}
              >
                {copied ? (
                  <CheckIcon
                    sx={(theme) => ({
                      fontSize: notebookInfoTokens.actionIconSize,
                      color: theme.workspacePalette.status.success,
                    })}
                  />
                ) : (
                  <ContentCopyIcon sx={{ fontSize: notebookInfoTokens.actionIconSize }} />
                )}
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Stack>
    </Box>
  )
}
