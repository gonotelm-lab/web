import { memo } from 'react'
import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { workspaceAnimation } from './motionTokens'

interface FlowLoadingOverlayProps {
  active: boolean
  rgbColor?: string
  peakOpacity?: number
  durationMs?: number
}

/**
 * Sweep uses transform (compositor) instead of background-position, so the
 * loop stays smooth. Keyframes live in index.css to avoid sx re-injection.
 */
export const FlowLoadingOverlay = memo(function FlowLoadingOverlay({
  active,
  rgbColor,
  peakOpacity,
  durationMs = workspaceAnimation.flowLoadingWaveDurationMs,
}: FlowLoadingOverlayProps) {
  const theme = useTheme()
  const resolvedRgbColor = rgbColor ?? theme.workspacePalette.flowLoading.rgbColor
  const resolvedPeakOpacity = peakOpacity ?? theme.workspacePalette.flowLoading.peakOpacity

  if (!active) return null

  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <Box
        className="flow-loading-wave"
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          width: '42%',
          background: `linear-gradient(90deg, rgba(${resolvedRgbColor}, 0) 0%, rgba(${resolvedRgbColor}, ${resolvedPeakOpacity}) 50%, rgba(${resolvedRgbColor}, 0) 100%)`,
          animationDuration: `${durationMs}ms`,
          willChange: 'transform',
          backfaceVisibility: 'hidden',
        }}
      />
    </Box>
  )
})
