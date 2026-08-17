import SlideshowOutlinedIcon from '@mui/icons-material/SlideshowOutlined'
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded'
import { Box, Button, Paper, Typography } from '@mui/material'
import i18n from '@/i18n'
import type { StudioArtifactItem } from '../types'
import { downloadFileFromUrl } from '../preview/downloadFile'
import { resolveStudioArtifactDisplayTitle } from '../resolveStudioArtifactKind'
import { workspaceSpace } from '../../../shared/ui/layoutTokens'

interface StudioSlidesDownloadCardProps {
  artifact: StudioArtifactItem
}

export function StudioSlidesDownloadCard({ artifact }: StudioSlidesDownloadCardProps) {
  const pptxUrl = artifact.contentUrl.trim()
  const safeName = resolveStudioArtifactDisplayTitle(artifact.title, artifact.kind)
    .replace(/[\\/:*?"<>|]+/g, '_')
    .replace(/\s+/g, '_')
    .slice(0, 60) || 'studio-slides'

  const handleDownload = () => {
    if (!pptxUrl) {
      return
    }
    void downloadFileFromUrl(pptxUrl, `${safeName}.pptx`).catch(() => {
      const anchor = document.createElement('a')
      anchor.href = pptxUrl
      anchor.download = `${safeName}.pptx`
      document.body.appendChild(anchor)
      anchor.click()
      anchor.remove()
    })
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: workspaceSpace.xl,
          maxWidth: 360,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <SlideshowOutlinedIcon
          sx={{ fontSize: 48, color: 'text.secondary', mb: workspaceSpace.md }}
        />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {i18n.t('studio:slides.title')}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: workspaceSpace.xxs, mb: workspaceSpace.md }}
        >
          {i18n.t('studio:slides.downloadHint')}
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<DownloadRoundedIcon />}
          disabled={!pptxUrl}
          onClick={handleDownload}
        >
          {i18n.t('studio:slides.download')}
        </Button>
      </Paper>
    </Box>
  )
}
