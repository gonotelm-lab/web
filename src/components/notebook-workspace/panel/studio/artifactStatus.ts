import i18n from '@/i18n'
import type { StudioArtifactTaskStatus } from '@/types/api'

const failedTaskStatusSet = new Set(['failed', 'expired'])
const failedLikeTaskStatusSet = new Set(['failed', 'cancelled', 'expired'])
const retryableTaskStatusSet = new Set(['failed', 'cancelled'])
const pendingTaskStatusSet = new Set(['pending', 'running'])
export type StudioArtifactVisualStatus = 'queued' | 'polling' | 'succeeded' | 'failed' | 'cancelled'

const normalizeStudioTaskStatus = (status: StudioArtifactTaskStatus) =>
  String(status || '').trim().toLowerCase()

export const isStudioTaskCompleted = (status: StudioArtifactTaskStatus) =>
  normalizeStudioTaskStatus(status) === 'completed'

export const isStudioTaskFailed = (status: StudioArtifactTaskStatus) =>
  failedLikeTaskStatusSet.has(normalizeStudioTaskStatus(status))

export const isStudioTaskRetryable = (status: StudioArtifactTaskStatus) =>
  retryableTaskStatusSet.has(normalizeStudioTaskStatus(status))

export const shouldStudioTaskKeepPolling = (status: StudioArtifactTaskStatus) =>
  pendingTaskStatusSet.has(normalizeStudioTaskStatus(status))

export const isStudioTaskRunning = (status: StudioArtifactTaskStatus) =>
  normalizeStudioTaskStatus(status) === 'running'

export const toArtifactVisualStatus = (
  status: StudioArtifactTaskStatus,
): StudioArtifactVisualStatus => {
  const normalized = normalizeStudioTaskStatus(status)
  if (normalized === 'completed') {
    return 'succeeded'
  }
  if (normalized === 'cancelled') {
    return 'cancelled'
  }
  if (failedTaskStatusSet.has(normalized)) {
    return 'failed'
  }
  if (normalized === 'pending') {
    return 'queued'
  }
  return 'polling'
}

export const buildTaskFailedMessage = (status: StudioArtifactTaskStatus) => {
  const normalized = normalizeStudioTaskStatus(status)
  if (normalized === 'cancelled') {
    return i18n.t('studio:error.taskCancelled')
  }
  if (normalized === 'expired') {
    return i18n.t('studio:error.taskExpired')
  }
  return i18n.t('studio:error.taskFailed')
}
