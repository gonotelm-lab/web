# Chat Stream Checkpoint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** 用 localStorage 持久化 chat 流式断点（taskId + lastStreamId + assistant 草稿），进入时与 stream-task 对齐后从断点续 SSE。

**Architecture:** 独立模块 `chatStreamCheckpoint.ts` 负责读写/匹配/清理；`runStreamSession` 支持初始断点与草稿，并在 apply 后节流落盘；现有 resume effect 按 task 匹配分支恢复或空气泡。

**Tech Stack:** React、localStorage、vitest；不改后端。

**Spec:** `docs/superpowers/specs/2026-08-29-chat-stream-checkpoint-design.md`

## Global Constraints

- 仅改 `gonotelm-web`
- Key：`gonotelm:chat-stream-checkpoint:${chatId}`
- 超过约 1MB 跳过写入；存储失败静默
- 不自动 commit，除非用户要求

---

### Task 1: `chatStreamCheckpoint` 模块 + 单测

**Files:**
- Create: `src/components/notebook-workspace/panel/chat/chatStreamCheckpoint.ts`
- Create: `src/components/notebook-workspace/panel/chat/chatStreamCheckpoint.test.ts`

**Produces:** `loadCheckpoint` / `saveCheckpoint` / `clearCheckpoint` / `isCheckpointMatchingTask` / `createThrottledCheckpointSaver`

- [ ] 实现模块与测例（load/save/clear、坏 JSON、version、task 匹配、超大跳过、throttle flush）
- [ ] `pnpm exec vitest run src/components/notebook-workspace/panel/chat/chatStreamCheckpoint.test.ts`

---

### Task 2: 接入 `useChatConversation`

**Files:**
- Modify: `useChatConversation.ts`

- [ ] `runStreamSession(taskId, assistantMessageId, options?)`：`initialLastStreamId`、`initialAssistantMessage`；apply 后节流 save；结束 clear；pagehide flush
- [ ] 发送新消息前 `clearCheckpoint`
- [ ] resume：无 task → clear；匹配 → 恢复草稿+断点；否则 clear+空气泡
- [ ] `pnpm exec vitest run` 相关测例 + chat mock
