import { describe, expect, it } from 'vitest'
import {
  STAGE_WHEEL_THRESHOLD_PX,
  accumulateStageWheelDelta,
  resolveStageWheelStep,
} from './stageWheelNav'

describe('stageWheelNav', () => {
  it('maps vertical and horizontal deltas to slide steps', () => {
    expect(resolveStageWheelStep(0, 20)).toBe(1)
    expect(resolveStageWheelStep(0, -20)).toBe(-1)
    expect(resolveStageWheelStep(30, 5)).toBe(1)
    expect(resolveStageWheelStep(-30, 5)).toBe(-1)
    expect(resolveStageWheelStep(0, 0)).toBe(0)
  })

  it('accumulates until threshold then emits one step', () => {
    const half = STAGE_WHEEL_THRESHOLD_PX / 2
    const first = accumulateStageWheelDelta(0, 0, half)
    expect(first.step).toBe(0)
    expect(first.nextAccum).toBe(half)

    const second = accumulateStageWheelDelta(first.nextAccum, 0, half)
    expect(second.step).toBe(1)
    expect(second.nextAccum).toBe(0)
  })
})
