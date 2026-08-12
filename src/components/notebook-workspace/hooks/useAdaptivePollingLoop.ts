import { useEffect, useRef } from 'react'

interface UseAdaptivePollingLoopOptions {
  enabled: boolean
  restartKey?: unknown
  baseIntervalMs: number
  maxIntervalMs: number
  /** Return true while work remains; false pauses the loop until enabled/restartKey changes. */
  tick: () => Promise<boolean> | boolean
}

export function useAdaptivePollingLoop({
  enabled,
  restartKey,
  baseIntervalMs,
  maxIntervalMs,
  tick,
}: UseAdaptivePollingLoopOptions) {
  const tickRef = useRef(tick)

  useEffect(() => {
    tickRef.current = tick
  }, [tick])

  useEffect(() => {
    if (!enabled) {
      return
    }

    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | null = null
    let attempt = 0

    const scheduleNext = () => {
      if (cancelled) {
        return
      }
      const delay = Math.min(
        baseIntervalMs * Math.pow(2, attempt),
        maxIntervalMs,
      )
      timeoutId = setTimeout(() => {
        void runTick()
      }, delay)
    }

    const runTick = async () => {
      if (cancelled) {
        return
      }

      try {
        const hasActiveWork = await tickRef.current()
        if (cancelled) {
          return
        }
        if (!hasActiveWork) {
          // Idle: stop scheduling. Callers should flip `enabled` when new work appears.
          attempt = 0
          return
        }
        attempt += 1
      } catch {
        // Polling loop never throws to UI layer.
        attempt += 1
      }
      scheduleNext()
    }

    void runTick()

    return () => {
      cancelled = true
      if (timeoutId !== null) {
        clearTimeout(timeoutId)
      }
    }
  }, [baseIntervalMs, enabled, maxIntervalMs, restartKey])
}
