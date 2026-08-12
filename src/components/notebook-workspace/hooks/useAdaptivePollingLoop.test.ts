import { createElement } from 'react'
import { act, create } from 'react-test-renderer'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useAdaptivePollingLoop } from './useAdaptivePollingLoop'

function PollHarness({
  enabled,
  tick,
}: {
  enabled: boolean
  tick: () => Promise<boolean> | boolean
}) {
  useAdaptivePollingLoop({
    enabled,
    restartKey: 'notebook-1',
    baseIntervalMs: 1_000,
    maxIntervalMs: 10_000,
    tick,
  })
  return null
}

describe('useAdaptivePollingLoop', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('stops scheduling after tick reports idle', async () => {
    const tick = vi.fn(() => false)

    await act(async () => {
      create(createElement(PollHarness, { enabled: true, tick }))
    })

    expect(tick).toHaveBeenCalledTimes(1)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(20_000)
    })
    expect(tick).toHaveBeenCalledTimes(1)
  })

  it('does not poll when disabled', async () => {
    const tick = vi.fn(() => true)

    await act(async () => {
      create(createElement(PollHarness, { enabled: false, tick }))
    })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5_000)
    })
    expect(tick).not.toHaveBeenCalled()
  })
})
