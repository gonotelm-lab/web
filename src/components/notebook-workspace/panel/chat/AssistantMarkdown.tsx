import { memo, useDeferredValue, type MouseEvent } from 'react'
import {
  MarkdownRenderer,
  type CitationClickTarget,
} from '../../shared/markdown/MarkdownRenderer'

interface AssistantMarkdownProps {
  content: string
  onCitationClick?: (
    event: MouseEvent<HTMLAnchorElement | HTMLElement>,
    target: CitationClickTarget,
  ) => void
}

/**
 * Defers heavy markdown re-parse during stream flushes so input/scroll stay responsive
 * (rerender-use-deferred-value). Left-aligned — no inter-character justify.
 */
export const AssistantMarkdown = memo(function AssistantMarkdown({
  content,
  onCitationClick,
}: AssistantMarkdownProps) {
  const deferredContent = useDeferredValue(content)

  return (
    <MarkdownRenderer
      content={deferredContent}
      renderCitationAsSuperscript
      onCitationClick={onCitationClick}
    />
  )
})
