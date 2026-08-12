import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded'
import {
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { ListNotebooksSortBy } from '@/types/api'
import {
  workspaceRadius,
  workspaceSpace,
} from '../notebook-workspace/shared/ui/layoutTokens'
import { workspaceIconSize, workspaceType } from '../notebook-workspace/shared/ui/typeTokens'

interface HomeSortSelectorProps {
  value: ListNotebooksSortBy
  onChange: (value: ListNotebooksSortBy) => void
}

export function HomeSortSelector({ value, onChange }: HomeSortSelectorProps) {
  const { t } = useTranslation('home')

  const handleSortByChange = (event: SelectChangeEvent<ListNotebooksSortBy>) => {
    onChange(event.target.value as ListNotebooksSortBy)
  }

  return (
    <FormControl size="small" sx={{ minWidth: 96 }}>
      <Select
        value={value}
        onChange={handleSortByChange}
        IconComponent={KeyboardArrowDownRoundedIcon}
        sx={{
          height: 34,
          borderRadius: workspaceRadius.md,
          '& .MuiSelect-select': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: 'unset',
            boxSizing: 'border-box',
            py: 0,
            pl: workspaceSpace.sm,
            pr: '26px !important',
            fontSize: workspaceType.sm,
            lineHeight: 1.2,
            fontWeight: 500,
            textAlign: 'center',
          },
          '& .MuiSelect-icon': {
            fontSize: workspaceIconSize.sm,
            right: 6,
            top: 'calc(50% - 8px)',
          },
        }}
        aria-label={t('sort.aria')}
      >
        <MenuItem value="last_active" sx={{ fontSize: workspaceType.sm }}>
          {t('sort.lastActive')}
        </MenuItem>
        <MenuItem value="create_time" sx={{ fontSize: workspaceType.sm }}>
          {t('sort.createTime')}
        </MenuItem>
      </Select>
    </FormControl>
  )
}
