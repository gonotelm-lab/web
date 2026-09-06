import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { ChatNotebookInfoHeader } from './ChatNotebookInfoHeader'

describe('ChatNotebookInfoHeader', () => {
  it('renders notebook title, description, source count, and icon slot', () => {
    const html = renderToStaticMarkup(
      <ChatNotebookInfoHeader
        notebookName="Apple DMA Notebook"
        notebookDescription="Notebook description for chat context."
        notebookSourceCount={9}
      />,
    )

    expect(html).toContain('Apple DMA Notebook')
    expect(html).toContain('Notebook description for chat context.')
    expect(html).toContain('9 个来源')
    expect(html).toContain('data-testid="chat-notebook-icon-slot"')
  })

  it('uses fallback title and keeps empty description as blank placeholder', () => {
    const html = renderToStaticMarkup(
      <ChatNotebookInfoHeader
        notebookName="   "
        notebookDescription=""
        notebookSourceCount={0}
      />,
    )

    expect(html).toContain('Untitled notebook')
    expect(html).not.toContain('No notebook description yet.')
    expect(html).toContain('0 个来源')
  })

  it('renders description skeleton while generating notebook description', () => {
    const html = renderToStaticMarkup(
      <ChatNotebookInfoHeader
        notebookName="Loading Notebook"
        notebookDescription=""
        notebookSourceCount={1}
        descriptionLoading
      />,
    )

    expect(html).toContain('data-testid="chat-notebook-description-skeleton"')
    expect(html).toContain('Loading Notebook')
  })
})
