import { describe, expect, it } from 'vitest'
import '@/i18n'
import {
  getWorkspaceMobilePanelLabels,
  workspaceMobilePanelDefault,
  type WorkspaceMobilePanel,
} from './workspaceMobilePanel'

describe('workspaceMobilePanel', () => {
  it('defaults to chat', () => {
    expect(workspaceMobilePanelDefault).toBe('chat')
  })

  it('exposes Chinese labels for all panels', () => {
    const labels = getWorkspaceMobilePanelLabels()
    const panels: WorkspaceMobilePanel[] = ['sources', 'chat', 'studio']
    for (const panel of panels) {
      expect(labels[panel].length).toBeGreaterThan(0)
    }
    expect(labels.sources).toBe('来源')
    expect(labels.chat).toBe('对话')
    expect(labels.studio).toBe('Studio')
  })
})
