import i18n from '@/i18n'

export type WorkspaceMobilePanel = 'sources' | 'chat' | 'studio'

export const workspaceMobilePanelDefault: WorkspaceMobilePanel = 'chat'

export function getWorkspaceMobilePanelLabels(): Record<WorkspaceMobilePanel, string> {
  return {
    sources: i18n.t('workspace:mobile.tab.sources'),
    chat: i18n.t('workspace:mobile.tab.chat'),
    studio: i18n.t('workspace:mobile.tab.studio'),
  }
}
