import { Alert, Box, Button, Stack, Typography } from '@mui/material'
import i18n from '@/i18n'
import type { StudioArtifactItem } from '../types'
import { workspaceLayout, workspaceSpace } from '../../../shared/ui/layoutTokens'
import { StudioSlidesDownloadCard } from '../components/StudioSlidesDownloadCard'
import { SlidesInlineDeck } from './SlidesInlineDeck'
import { SlidesOverlayDeck } from './SlidesOverlayDeck'
import { usePptxPresentation } from './usePptxPresentation'

interface StudioSlidesViewerProps {
  artifact: StudioArtifactItem
  mode: 'inline' | 'overlay'
  onOpenOverlayAtSlide?: (slideIndex: number) => void
  initialSlideIndex?: number
}

export function StudioSlidesViewer({
  artifact,
  mode,
  onOpenOverlayAtSlide,
  initialSlideIndex = 0,
}: StudioSlidesViewerProps) {
  const { status, presentation, error, reload } = usePptxPresentation(
    artifact.contentUrl.trim(),
  )

  if (status === 'loading' || status === 'idle') {
    return (
      <Stack
        sx={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          px: workspaceSpace.md,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {i18n.t('studio:slides.loading')}
        </Typography>
      </Stack>
    )
  }

  if (status === 'error' || !presentation) {
    return (
      <Stack
        spacing={workspaceLayout.listRowGap}
        sx={{
          height: '100%',
          minHeight: 0,
          px: workspaceSpace.md,
          py: workspaceSpace.md,
          boxSizing: 'border-box',
          overflow: 'auto',
        }}
      >
        <Alert severity="error">
          {error || i18n.t('studio:slides.parseFailed')}
        </Alert>
        <Box>
          <Button size="small" variant="outlined" onClick={reload}>
            {i18n.t('common:preview.retryLoad')}
          </Button>
        </Box>
        <StudioSlidesDownloadCard artifact={artifact} />
      </Stack>
    )
  }

  return (
    <Box sx={{ height: '100%', minHeight: 0, width: '100%' }}>
      {mode === 'inline' ? (
        <SlidesInlineDeck
          presentation={presentation}
          onSlideClick={onOpenOverlayAtSlide}
        />
      ) : (
        <SlidesOverlayDeck
          key={`overlay-deck-${initialSlideIndex}`}
          presentation={presentation}
          initialIndex={initialSlideIndex}
        />
      )}
    </Box>
  )
}
