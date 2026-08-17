import { describe, expect, it } from 'vitest'
import {
  STUDIO_ARTIFACT_STATUS_MAX_CONSECUTIVE_FAILURES,
  isStudioTaskCancelled,
  isStudioTaskSoftFailed,
  shouldFinalizeStatusPollFailure,
} from './artifactStatus'

describe('artifact status poll failure tolerance', () => {
  it('tolerates soft failed/expired and not cancelled', () => {
    expect(isStudioTaskSoftFailed('failed')).toBe(true)
    expect(isStudioTaskSoftFailed('expired')).toBe(true)
    expect(isStudioTaskSoftFailed('cancelled')).toBe(false)
    expect(isStudioTaskCancelled('cancelled')).toBe(true)
  })

  it('finalizes only after three consecutive failures', () => {
    expect(STUDIO_ARTIFACT_STATUS_MAX_CONSECUTIVE_FAILURES).toBe(3)
    expect(shouldFinalizeStatusPollFailure(1)).toBe(false)
    expect(shouldFinalizeStatusPollFailure(2)).toBe(false)
    expect(shouldFinalizeStatusPollFailure(3)).toBe(true)
    expect(shouldFinalizeStatusPollFailure(4)).toBe(true)
  })
})
