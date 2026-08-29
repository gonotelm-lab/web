import type { ChatUiMessage } from './types'

export const chatStreamCheckpointVersion = 1 as const
export const chatStreamCheckpointKeyPrefix = 'gonotelm:chat-stream-checkpoint:'
/** Skip writes larger than this to avoid blowing localStorage quota. */
export const chatStreamCheckpointMaxBytes = 1024 * 1024
export const chatStreamCheckpointThrottleMs = 250

export interface ChatStreamCheckpoint {
  version: typeof chatStreamCheckpointVersion
  chatId: string
  taskId: string
  lastStreamId: string
  assistantMessage: ChatUiMessage
  updatedAt: number
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

let storageForTests: StorageLike | null = null

/** Test-only: inject an in-memory Storage. Pass null to restore localStorage. */
export function setChatStreamCheckpointStorageForTests(storage: StorageLike | null) {
  storageForTests = storage
}

export function buildChatStreamCheckpointKey(chatId: string) {
  return `${chatStreamCheckpointKeyPrefix}${chatId}`
}

function getStorage(): StorageLike | null {
  if (storageForTests) {
    return storageForTests
  }
  try {
    if (typeof globalThis.localStorage === 'undefined') {
      return null
    }
    return globalThis.localStorage
  } catch {
    return null
  }
}

function isChatUiMessage(value: unknown): value is ChatUiMessage {
  if (!value || typeof value !== 'object') {
    return false
  }
  const message = value as ChatUiMessage
  return (
    typeof message.id === 'string' &&
    (message.role === 'assistant' || message.role === 'user') &&
    Array.isArray(message.fragments) &&
    Array.isArray(message.citations)
  )
}

function isCheckpoint(value: unknown): value is ChatStreamCheckpoint {
  if (!value || typeof value !== 'object') {
    return false
  }
  const checkpoint = value as ChatStreamCheckpoint
  return (
    checkpoint.version === chatStreamCheckpointVersion &&
    typeof checkpoint.chatId === 'string' &&
    typeof checkpoint.taskId === 'string' &&
    typeof checkpoint.lastStreamId === 'string' &&
    typeof checkpoint.updatedAt === 'number' &&
    isChatUiMessage(checkpoint.assistantMessage) &&
    checkpoint.assistantMessage.role === 'assistant'
  )
}

export function loadCheckpoint(chatId: string): ChatStreamCheckpoint | null {
  if (!chatId) {
    return null
  }
  const storage = getStorage()
  if (!storage) {
    return null
  }
  try {
    const raw = storage.getItem(buildChatStreamCheckpointKey(chatId))
    if (!raw) {
      return null
    }
    const parsed: unknown = JSON.parse(raw)
    if (!isCheckpoint(parsed) || parsed.chatId !== chatId) {
      storage.removeItem(buildChatStreamCheckpointKey(chatId))
      return null
    }
    return parsed
  } catch {
    try {
      storage.removeItem(buildChatStreamCheckpointKey(chatId))
    } catch {
      // ignore
    }
    return null
  }
}

export function isCheckpointMatchingTask(
  checkpoint: ChatStreamCheckpoint | null,
  taskId: string,
): checkpoint is ChatStreamCheckpoint {
  return Boolean(checkpoint && taskId && checkpoint.taskId === taskId)
}

export function saveCheckpoint(input: {
  chatId: string
  taskId: string
  lastStreamId: string
  assistantMessage: ChatUiMessage
}): boolean {
  if (!input.chatId || !input.taskId) {
    return false
  }
  if (input.assistantMessage.role !== 'assistant') {
    return false
  }
  const storage = getStorage()
  if (!storage) {
    return false
  }

  const checkpoint: ChatStreamCheckpoint = {
    version: chatStreamCheckpointVersion,
    chatId: input.chatId,
    taskId: input.taskId,
    lastStreamId: input.lastStreamId,
    assistantMessage: input.assistantMessage,
    updatedAt: Date.now(),
  }

  try {
    const serialized = JSON.stringify(checkpoint)
    if (serialized.length > chatStreamCheckpointMaxBytes) {
      return false
    }
    storage.setItem(buildChatStreamCheckpointKey(input.chatId), serialized)
    return true
  } catch {
    return false
  }
}

export function clearCheckpoint(chatId: string) {
  if (!chatId) {
    return
  }
  const storage = getStorage()
  if (!storage) {
    return
  }
  try {
    storage.removeItem(buildChatStreamCheckpointKey(chatId))
  } catch {
    // ignore
  }
}

export interface ThrottledCheckpointSaver {
  schedule: (input: {
    chatId: string
    taskId: string
    lastStreamId: string
    assistantMessage: ChatUiMessage
  }) => void
  flush: () => void
  dispose: () => void
}

export function createThrottledCheckpointSaver(
  throttleMs: number = chatStreamCheckpointThrottleMs,
): ThrottledCheckpointSaver {
  let timerId: ReturnType<typeof setTimeout> | null = null
  let pending: {
    chatId: string
    taskId: string
    lastStreamId: string
    assistantMessage: ChatUiMessage
  } | null = null

  const flush = () => {
    if (timerId !== null) {
      clearTimeout(timerId)
      timerId = null
    }
    if (!pending) {
      return
    }
    const next = pending
    pending = null
    saveCheckpoint(next)
  }

  return {
    schedule(input) {
      pending = input
      if (timerId !== null) {
        return
      }
      timerId = setTimeout(() => {
        timerId = null
        flush()
      }, throttleMs)
    },
    flush,
    dispose() {
      if (timerId !== null) {
        clearTimeout(timerId)
        timerId = null
      }
      pending = null
    },
  }
}
