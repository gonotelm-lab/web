import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined'
import ChatBubbleOutlineRoundedIcon from '@mui/icons-material/ChatBubbleOutlineRounded'
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { workspaceSpace } from '../shared/ui/layoutTokens'
import {
  getWorkspaceMobilePanelLabels,
  type WorkspaceMobilePanel,
} from './workspaceMobilePanel'

interface WorkspaceMobileTabBarProps {
  value: WorkspaceMobilePanel
  onChange: (panel: WorkspaceMobilePanel) => void
}

const tabMinHeightPx = 56

export function WorkspaceMobileTabBar({ value, onChange }: WorkspaceMobileTabBarProps) {
  useTranslation('workspace')
  const labels = getWorkspaceMobilePanelLabels()

  return (
    <Paper
      square
      elevation={0}
      sx={{
        display: { xs: 'block', md: 'none' },
        flexShrink: 0,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        pb: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      <BottomNavigation
        showLabels
        value={value}
        onChange={(_event, nextValue: WorkspaceMobilePanel) => {
          onChange(nextValue)
        }}
        sx={{
          minHeight: tabMinHeightPx,
          height: tabMinHeightPx,
          bgcolor: 'background.paper',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 0,
            py: workspaceSpace.xxs,
            color: 'text.secondary',
          },
          '& .MuiBottomNavigationAction-root.Mui-selected': {
            color: 'primary.main',
          },
        }}
      >
        <BottomNavigationAction
          value="sources"
          label={labels.sources}
          icon={<DescriptionOutlinedIcon />}
          aria-label={labels.sources}
        />
        <BottomNavigationAction
          value="chat"
          label={labels.chat}
          icon={<ChatBubbleOutlineRoundedIcon />}
          aria-label={labels.chat}
        />
        <BottomNavigationAction
          value="studio"
          label={labels.studio}
          icon={<AutoAwesomeOutlinedIcon />}
          aria-label={labels.studio}
        />
      </BottomNavigation>
    </Paper>
  )
}
