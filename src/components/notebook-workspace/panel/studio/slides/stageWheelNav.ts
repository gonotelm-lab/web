/** Ignore tiny trackpad jitter until accumulated delta crosses this. */
export const STAGE_WHEEL_THRESHOLD_PX = 40
/** Cooldown after a page flip so one gesture does not skip many slides. */
export const STAGE_WHEEL_COOLDOWN_MS = 280

/**
 * Map wheel deltas to a slide step.
 * Prefer the dominant axis so vertical scroll and horizontal trackpad both work.
 */
export function resolveStageWheelStep(deltaX: number, deltaY: number): -1 | 0 | 1 {
  const absX = Math.abs(deltaX)
  const absY = Math.abs(deltaY)
  if (absX < 1 && absY < 1) {
    return 0
  }
  const delta = absY >= absX ? deltaY : deltaX
  if (delta === 0) {
    return 0
  }
  return delta > 0 ? 1 : -1
}

export function accumulateStageWheelDelta(
  previousAccum: number,
  deltaX: number,
  deltaY: number,
): { nextAccum: number; step: -1 | 0 | 1 } {
  const direction = resolveStageWheelStep(deltaX, deltaY)
  if (direction === 0) {
    return { nextAccum: previousAccum, step: 0 }
  }
  const absX = Math.abs(deltaX)
  const absY = Math.abs(deltaY)
  const delta = absY >= absX ? deltaY : deltaX
  const nextAccum = previousAccum + delta
  if (Math.abs(nextAccum) < STAGE_WHEEL_THRESHOLD_PX) {
    return { nextAccum, step: 0 }
  }
  return { nextAccum: 0, step: nextAccum > 0 ? 1 : -1 }
}
