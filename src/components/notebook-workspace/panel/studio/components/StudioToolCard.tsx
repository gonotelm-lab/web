import { memo } from 'react'
import { useTranslation } from 'react-i18next'
import ArrowOutwardOutlinedIcon from '@mui/icons-material/ArrowOutwardOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined'
import { alpha } from '@mui/material/styles'
import { Box, ButtonBase, Stack, Tooltip, Typography } from '@mui/material'
import type { StudioToolDefinition } from '../types'
import { workspaceRadius, workspaceSpace } from '../../../shared/ui/layoutTokens'
import { workspaceInteraction, workspaceMotion } from '../../../shared/ui/motionTokens'
import {
  resolveStudioToolTone,
  resolveStudioToolToneKey,
} from '../../../shared/ui/studioSemanticTones'
import { workspaceIconSize, workspaceType } from '../../../shared/ui/typeTokens'

interface StudioToolCardProps {
  tool: StudioToolDefinition
  selected?: boolean
  disabled?: boolean
  pending?: boolean
  onClick?: () => void
  onAdvancedClick?: () => void
}

export const StudioToolCard = memo(function StudioToolCard({
  tool,
  selected = false,
  disabled = false,
  pending = false,
  onClick,
  onAdvancedClick,
}: StudioToolCardProps) {
  const { t } = useTranslation(['studio', 'common'])
  const interactive = Boolean(onClick) && !disabled && !pending
  const Icon = tool.icon
  const statusLabel = pending
    ? t('studio:tool.status.pending')
    : tool.availability === 'available'
      ? t('studio:tool.status.available')
      : t('studio:tool.status.comingSoon')
  const tooltipLabel = tool.availability === 'available'
    ? tool.description
    : statusLabel
  const showAdvancedEntry = Boolean(tool.hasAdvancedConfig)
  const toneKey = resolveStudioToolToneKey({
    artifactKind: tool.artifactKind,
    toolId: tool.id,
  })

  return (
    <Tooltip title={tooltipLabel} arrow placement="top" enterDelay={240}
    >
      <Box component="span" sx={{ display: 'block', width: '100%' }}>
        <ButtonBase
          onClick={interactive ? onClick : undefined}
          disabled={!interactive}
          sx={{
            display: 'block',
            width: '100%',
            borderRadius: workspaceRadius.md,
            textAlign: 'left',
          }}
        >
          <Box
            sx={(theme) => {
              const tone = resolveStudioToolTone(theme, toneKey)
              return {
                width: '100%',
                p: workspaceSpace.sm,
                border: '1px solid',
                borderColor: selected ? tone.accent : 'divider',
                borderRadius: workspaceRadius.lg,
                opacity: disabled && !pending ? 0.62 : 1,
                bgcolor: selected
                  ? tone.surface
                  : tool.availability === 'available'
                    ? 'background.paper'
                    : 'background.default',
                transition:
                  `border-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}, ` +
                  `background-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}, ` +
                  `opacity ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
                boxShadow: 'none',
                ...(interactive
                  ? {
                      cursor: workspaceInteraction.cursorPointer,
                      '&:hover': {
                        borderColor: tone.accent,
                        bgcolor: tone.surface,
                      },
                      '&:active': {
                        borderColor: tone.accent,
                        bgcolor: alpha(tone.accent, 0.12),
                      },
                    }
                  : null),
              }
            }}
          >
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', minWidth: 0 }}>
              <Stack
                direction="row"
                spacing={workspaceSpace.sm}
                sx={{ alignItems: 'center', minWidth: 0 }}
              >
                <Box
                  sx={(theme) => {
                    const tone = resolveStudioToolTone(theme, toneKey)
                    return {
                      width: 20,
                      height: 20,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: tool.availability === 'available' ? tone.icon : 'text.disabled',
                    }
                  }}
                >
                  <Icon sx={{ fontSize: workspaceIconSize.md }} />
                </Box>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ fontWeight: 600, lineHeight: 1.2, minWidth: 0 }}
                >
                  {tool.title}
                </Typography>
              </Stack>
              {pending ? (
                <HourglassBottomOutlinedIcon
                  sx={(theme) => ({
                    fontSize: workspaceType.sm,
                    color: theme.workspacePalette.status.warning,
                    flexShrink: 0,
                  })}
                />
              ) : showAdvancedEntry ? (
                <Box
                  component="span"
                  role="button"
                  tabIndex={interactive ? 0 : -1}
                  data-testid="studio-tool-card-advanced-entry"
                  aria-disabled={!interactive}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (interactive) onAdvancedClick?.()
                  }}
                  onKeyDown={(e) => {
                    if (!interactive) return
                    if (e.key !== 'Enter' && e.key !== ' ') {
                      return
                    }
                    e.preventDefault()
                    e.stopPropagation()
                    onAdvancedClick?.()
                  }}
                  sx={(theme) => {
                    const tone = resolveStudioToolTone(theme, toneKey)
                    return {
                      width: 24,
                      height: 24,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: workspaceRadius.sm,
                      cursor: interactive ? workspaceInteraction.cursorPointer : 'not-allowed',
                      color: interactive ? 'text.secondary' : 'action.disabled',
                      '&:hover': interactive
                        ? { color: tone.accent, bgcolor: tone.surface }
                        : undefined,
                      '&:focus-visible': {
                        outline: '2px solid',
                        outlineColor: tone.accent,
                        outlineOffset: 1,
                      },
                    }
                  }}
                >
                  <EditOutlinedIcon sx={{ fontSize: workspaceIconSize.sm }} />
                </Box>
              ) : (
                <ArrowOutwardOutlinedIcon sx={{ fontSize: workspaceIconSize.sm, color: 'text.disabled' }} />
              )}
            </Stack>
          </Box>
        </ButtonBase>
      </Box>
    </Tooltip>
  )
})
