/** Hallmark · Cobalt motion — sparse ease-out; no spring / press bounce. */
export const workspaceMotion = {
  easingStandard: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easingOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easingPress: 'cubic-bezier(0.16, 1, 0.3, 1)',
  easingPanelGrid: 'cubic-bezier(0.16, 1, 0.3, 1)',
  durationFastMs: 120,
  durationBaseMs: 180,
  durationPanelMs: 240,
  durationPanelGridMs: 280,
  durationExitMs: 240,
  durationReducedMs: 150,
} as const

export const workspaceAnimation = {
  flowLoadingWaveDurationMs: 1500,
  refreshSpinDurationMs: 1200,
  pendingEllipsisDurationMs: 1600,
  streamStatusFlowDurationSec: 3.1,
  mindmapViewportDurationMs: 240,
  mindmapViewportEasing: 'easeInOutQuad',
} as const

export const workspaceInteraction = {
  cursorPointer: 'pointer',
  hoverTransformNone: 'none',
  hoverLiftCard: 'none',
  activePress: 'none',
  reducedMotionQuery: '@media (prefers-reduced-motion: reduce)',
} as const

export const workspaceTransitionPresets = {
  colorOnly: `color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
  backgroundOnly: `background-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
  opacityOnly: `opacity ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
  colorBorderBg:
    `background-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}, ` +
    `border-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}, ` +
    `color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
  interactiveColorBorder:
    `background-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}, ` +
    `border-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}, ` +
    `color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
  colorBorderBgWithTransform:
    `background-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}, ` +
    `border-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}, ` +
    `color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
  cardLift:
    `border-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}, ` +
    `background-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
  borderBg:
    `border-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}, ` +
    `background-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
  panelTransform: `transform ${workspaceMotion.durationPanelMs}ms ${workspaceMotion.easingStandard}`,
  panelWidth: `width ${workspaceMotion.durationPanelMs}ms ${workspaceMotion.easingStandard}`,
  panelGridColumns:
    `grid-template-columns ${workspaceMotion.durationPanelGridMs}ms ${workspaceMotion.easingPanelGrid}`,
  panelTransformWithFade:
    `transform ${workspaceMotion.durationPanelMs}ms ${workspaceMotion.easingStandard}, ` +
    `opacity ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
} as const
