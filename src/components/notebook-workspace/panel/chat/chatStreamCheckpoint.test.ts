import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildChatStreamCheckpointKey,
  chatStreamCheckpointMaxBytes,
  clearCheckpoint,
  createThrottledCheckpointSaver,
  isCheckpointMatchingTask,
  loadCheckpoint,
  saveCheckpoint,
  setChatStreamCheckpointStorageForTests,
} from './chatStreamCheckpoint'
import { createEmptyAssistantMessage } from './streamEventReducer'

class MemoryStorage {
  private readonly map = new Map<string, string>()

  getItem(key: string) {
    return this.map.has(key) ? (this.map.get(key) ?? null) : null
  }

  setItem(key: string, value: string) {
    this.map.set(key, value)
  }

  removeItem(key: string) {
    this.map.delete(key)
  }
}

describe('chatStreamCheckpoint', () => {
  beforeEach(() => {
    setChatStreamCheckpointStorageForTests(new MemoryStorage())
  })

  afterEach(() => {
    setChatStreamCheckpointStorageForTests(null)
  })

  it('saves and loads a checkpoint for a chat', () => {
    const assistantMessage = createEmptyAssistantMessage('asst-1')
    assistantMessage.fragments = [
      { id: 1, type: 'RESPONSE', response: { status: 'STREAMING', content: 'hello' } },
    ]

    expect(
      saveCheckpoint({
        chatId: 'chat-1',
        taskId: 'task-1',
        lastStreamId: '1-0',
        assistantMessage,
      }),
    ).toBe(true)

    const loaded = loadCheckpoint('chat-1')
    expect(loaded).toMatchObject({
      version: 1,
      chatId: 'chat-1',
      taskId: 'task-1',
      lastStreamId: '1-0',
    })
    expect(loaded?.assistantMessage.fragments[0]?.response?.content).toBe('hello')
  })

  it('clears checkpoint', () => {
    saveCheckpoint({
      chatId: 'chat-1',
      taskId: 'task-1',
      lastStreamId: '1-0',
      assistantMessage: createEmptyAssistantMessage('asst-1'),
    })
    clearCheckpoint('chat-1')
    expect(loadCheckpoint('chat-1')).toBeNull()
  })

  it('returns null and removes corrupt JSON', () => {
    const storage = new MemoryStorage()
    setChatStreamCheckpointStorageForTests(storage)
    storage.setItem(buildChatStreamCheckpointKey('chat-1'), '{not-json')

    expect(loadCheckpoint('chat-1')).toBeNull()
    expect(storage.getItem(buildChatStreamCheckpointKey('chat-1'))).toBeNull()
  })

  it('rejects mismatched version payloads', () => {
    const storage = new MemoryStorage()
    setChatStreamCheckpointStorageForTests(storage)
    storage.setItem(
      buildChatStreamCheckpointKey('chat-1'),
      JSON.stringify({
        version: 99,
        chatId: 'chat-1',
        taskId: 'task-1',
        lastStreamId: '1-0',
        assistantMessage: createEmptyAssistantMessage('asst-1'),
        updatedAt: Date.now(),
      }),
    )

    expect(loadCheckpoint('chat-1')).toBeNull()
  })

  it('matches task ids', () => {
    const checkpoint = {
      version: 1 as const,
      chatId: 'chat-1',
      taskId: 'task-1',
      lastStreamId: '1-0',
      assistantMessage: createEmptyAssistantMessage('asst-1'),
      updatedAt: Date.now(),
    }
    expect(isCheckpointMatchingTask(checkpoint, 'task-1')).toBe(true)
    expect(isCheckpointMatchingTask(checkpoint, 'task-other')).toBe(false)
    expect(isCheckpointMatchingTask(null, 'task-1')).toBe(false)
  })

  it('skips writes that exceed max bytes', () => {
    const assistantMessage = createEmptyAssistantMessage('asst-1')
    assistantMessage.fragments = [
      {
        id: 1,
        type: 'RESPONSE',
        response: {
          status: 'STREAMING',
          content: 'x'.repeat(chatStreamCheckpointMaxBytes),
        },
      },
    ]

    expect(
      saveCheckpoint({
        chatId: 'chat-1',
        taskId: 'task-1',
        lastStreamId: '1-0',
        assistantMessage,
      }),
    ).toBe(false)
    expect(loadCheckpoint('chat-1')).toBeNull()
  })

  it('throttles saves and flushes pending checkpoint', () => {
    vi.useFakeTimers()
    const saver = createThrottledCheckpointSaver(250)
    const first = createEmptyAssistantMessage('asst-1')
    first.fragments = [
      { id: 1, type: 'RESPONSE', response: { status: 'STREAMING', content: 'a' } },
    ]
    const second = createEmptyAssistantMessage('asst-1')
    second.fragments = [
      { id: 1, type: 'RESPONSE', response: { status: 'STREAMING', content: 'ab' } },
    ]

    saver.schedule({
      chatId: 'chat-1',
      taskId: 'task-1',
      lastStreamId: '1-0',
      assistantMessage: first,
    })
    saver.schedule({
      chatId: 'chat-1',
      taskId: 'task-1',
      lastStreamId: '2-0',
      assistantMessage: second,
    })

    expect(loadCheckpoint('chat-1')).toBeNull()
    vi.advanceTimersByTime(250)
    expect(loadCheckpoint('chat-1')?.lastStreamId).toBe('2-0')
    expect(loadCheckpoint('chat-1')?.assistantMessage.fragments[0]?.response?.content).toBe('ab')

    saver.dispose()
    vi.useRealTimers()
  })
})
