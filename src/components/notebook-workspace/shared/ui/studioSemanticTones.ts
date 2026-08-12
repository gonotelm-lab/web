import type { Theme } from '@mui/material/styles'
import type { StudioArtifactKind } from '@/types/api'
import type { SourceIconType } from '@/components/notebook-workspace/panel/sources/types/sourceTypes'

export type StudioSemanticTone = {
  accent: string
  border: string
  icon: string
  surface: string
}

/** Tool ids without artifactKind still get a distinct Studio tone. */
export type StudioToolToneKey = StudioArtifactKind | 'video-overview' | 'slide-deck' | 'default'

export const resolveStudioToolToneKey = (input: {
  artifactKind?: StudioArtifactKind
  toolId?: string
}): StudioToolToneKey => {
  if (input.artifactKind) {
    return input.artifactKind
  }
  if (input.toolId === 'video-overview' || input.toolId === 'slide-deck') {
    return input.toolId
  }
  return 'default'
}

export const resolveStudioToolTone = (
  theme: Theme,
  key: StudioToolToneKey,
): StudioSemanticTone => {
  const tones = theme.workspacePalette.artifactKind
  return tones[key] ?? tones.default
}

export const resolveSourceTypeTone = (
  theme: Theme,
  iconType: SourceIconType,
): StudioSemanticTone => {
  const tones = theme.workspacePalette.sourceType
  return tones[iconType] ?? tones.default
}
