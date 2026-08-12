import { useEffect, useMemo, useState, type KeyboardEvent, type ReactNode, type Ref } from 'react'
import { Box } from '@mui/material'
import { workspaceLayout } from '../../shared/ui/layoutTokens'
import { ChatInputBox, type ChatInputInteractionState } from './ChatInputBox'

const composerMarginTop = workspaceLayout.panelPaddingY

interface ChatComposerProps {
  inputRef?: Ref<HTMLInputElement | HTMLTextAreaElement>
  /** Busy/stream flags from conversation; submit disabled is derived from local draft. */
  interactionState: Omit<ChatInputInteractionState, 'isSubmitDisabled'>
  /** True when chat can accept a send (has chatId, not pending create). */
  canSubmit: boolean
  /** Bump to push a restored draft into the local composer (send failure). */
  restoreNonce?: number
  restoreValue?: string
  suggestions?: string[]
  suggestionsDisabled?: boolean
  leftControlsExtra?: ReactNode
  rightControlsExtra?: ReactNode
  onSend: (prompt: string) => void
  onAbort: () => void
  onSuggestionSelect?: (question: string) => void
}

/**
 * Owns draft text locally so keystrokes do not re-render the transcript tree
 * (rerender-defer-reads / composer island).
 */
export function ChatComposer({
  inputRef,
  interactionState,
  canSubmit,
  restoreNonce = 0,
  restoreValue = '',
  suggestions = [],
  suggestionsDisabled = false,
  leftControlsExtra,
  rightControlsExtra,
  onSend,
  onAbort,
  onSuggestionSelect,
}: ChatComposerProps) {
  const [value, setValue] = useState('')

  useEffect(() => {
    if (restoreNonce <= 0) {
      return
    }
    setValue(restoreValue)
  }, [restoreNonce, restoreValue])

  const resolvedInteractionState = useMemo<ChatInputInteractionState>(
    () => ({
      ...interactionState,
      isSubmitDisabled: !canSubmit || !value.trim(),
    }),
    [canSubmit, interactionState, value],
  )

  const handleSend = () => {
    if (resolvedInteractionState.isStreaming) {
      return
    }
    if (resolvedInteractionState.isSubmitDisabled) {
      return
    }
    const prompt = value.trimEnd()
    if (!prompt.trim()) {
      return
    }
    setValue('')
    onSend(prompt)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return
    }
    event.preventDefault()
    handleSend()
  }

  return (
    <Box sx={{ mt: composerMarginTop }}>
      <ChatInputBox
        value={value}
        inputRef={inputRef}
        onValueChange={setValue}
        onKeyDown={handleKeyDown}
        interactionState={resolvedInteractionState}
        suggestions={suggestions}
        suggestionsDisabled={suggestionsDisabled}
        leftControlsExtra={leftControlsExtra}
        rightControlsExtra={rightControlsExtra}
        onSend={handleSend}
        onAbort={onAbort}
        onSuggestionSelect={onSuggestionSelect}
      />
    </Box>
  )
}
