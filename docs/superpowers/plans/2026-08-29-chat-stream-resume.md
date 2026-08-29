# Chat Stream Resume Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 进入 chat 且首屏 messages 加载成功后，查询 `GET /chats/:id/stream-task`；若有 `task_id` 则插入本地空 assistant 并复用 `runStreamSession` 恢复 SSE 显示。

**Architecture:** API 层新增 `getChatRunningTask`；MSW 默认返回空 `task_id`；`useChatConversation` 在 `messagesQuery.isSuccess` 后触发一次 resume（AbortController 取消 in-flight 查询；流生命周期仍用现有 run token）。

**Tech Stack:** React 19、@tanstack/react-query、vitest + msw、TypeScript。

**Spec:** `docs/superpowers/specs/2026-08-29-chat-stream-resume-design.md`

## Global Constraints

- 只改 `gonotelm-web`；路径相对该目录。
- 顺序硬约束：messages 首屏成功 → 再查 stream-task。
- Running-task 失败静默；空 `task_id` 无操作。
- 不改后端；不持久化 `last_stream_id`。
- 测试：`pnpm exec vitest run <file>`；类型：`pnpm exec tsc -b`。
- **不要自动 commit**，除非用户明确要求。

---

### Task 1: API 类型 + `getChatRunningTask` + MSW + 测试

**Files:**
- Modify: `src/types/api.ts`
- Modify: `src/api/chat.ts`
- Modify: `src/test/mocks/fixtures/chat.ts`
- Modify: `src/test/mocks/handlers/chatHandlers.ts`
- Modify: `src/api/chat.mock.test.ts`

**Interfaces:**
- Produces: `getChatRunningTask(chatId: string, init?: RequestInit) => Promise<ChatGetRunningTaskResponse>`
- Produces: `ChatGetRunningTaskResponse { task_id: string }`

- [x] **Step 1: 写失败测试**

在 `src/api/chat.mock.test.ts` import 增加 `getChatRunningTask`，末尾加：

```ts
  it('returns empty task_id when no running stream task', async () => {
    const result = await getChatRunningTask('chat-1')
    expect(result.task_id).toBe('')
  })

  it('returns running task_id under resume scenario', async () => {
    setMockScenario('chat', 'resume')
    const result = await getChatRunningTask('chat-1')
    expect(result.task_id).toBe('task-running-1')
  })
```

- [x] **Step 2: 跑测确认失败**（实现时直接落地，与 TDD 略有合并）

- [x] **Step 3: 实现**

- [x] **Step 4: 跑测通过** — `25 passed`
---

### Task 2: `useChatConversation` resume effect

**Files:**
- Modify: `src/components/notebook-workspace/panel/chat/useChatConversation.ts`

**Interfaces:**
- Consumes: `getChatRunningTask`, `runStreamSession`, `createEmptyAssistantMessage`, `messagesQuery.isSuccess`

- [ ] **Step 1: 接入 resume effect**

Import `getChatRunningTask`。

在 `runStreamSession` / `createMessageMutation` 定义之后添加 refs + effect：

```ts
  const activeTaskIdRef = useRef(activeTaskId)
  activeTaskIdRef.current = activeTaskId
  const createMessagePendingRef = useRef(createMessageMutation.isPending)
  createMessagePendingRef.current = createMessageMutation.isPending

  useEffect(() => {
    if (!chatId || !messagesQuery.isSuccess) {
      return
    }

    const controller = new AbortController()
    let cancelled = false

    const resumeIfNeeded = async () => {
      if (activeTaskIdRef.current || createMessagePendingRef.current) {
        return
      }
      try {
        const running = await getChatRunningTask(chatId, { signal: controller.signal })
        if (cancelled || controller.signal.aborted) {
          return
        }
        if (!running.task_id) {
          return
        }
        if (activeTaskIdRef.current || createMessagePendingRef.current) {
          return
        }

        const assistantMessageId = `local-assistant-${Date.now()}`
        setActiveAssistantMessageId(assistantMessageId)
        setLiveMessages((prev) => [...prev, createEmptyAssistantMessage(assistantMessageId)])
        await runStreamSession(running.task_id, assistantMessageId)
      } catch (error) {
        if (cancelled || controller.signal.aborted) {
          return
        }
        if (error instanceof DOMException && error.name === 'AbortError') {
          return
        }
        // 静默：不挡正常聊天
      }
    }

    void resumeIfNeeded()

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [chatId, messagesQuery.isSuccess, runStreamSession])
```

注意：

- 依赖**不要**放 `activeTaskId`（避免开始 stream 后 cleanup 误伤；查询取消即可，stream 由现有 token 管）。
- `ChatPanel` 已用 `key={notebookId:chatId}` remount，切换 chat 状态天然重置。

- [ ] **Step 2: 类型检查**

Run: `pnpm exec tsc -b`  
Expected: 无错误

- [ ] **Step 3: 相关单测仍绿**

Run: `pnpm exec vitest run src/api/chat.mock.test.ts src/components/notebook-workspace/panel/chat/chatConversationCommon.test.ts`  
Expected: PASS

---

## Spec coverage checklist

| Spec 项 | Task |
|---|---|
| `getChatRunningTask` + 类型 | Task 1 |
| MSW stream-task | Task 1 |
| messages 成功后再查 | Task 2 gate `isSuccess` |
| 空气泡 + runStreamSession | Task 2 |
| 失败静默 | Task 2 catch |
| cleanup AbortController | Task 2 |
| 与发送/已有 stream 竞态 | Task 2 refs 门闩 |
