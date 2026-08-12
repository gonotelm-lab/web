import { useState } from 'react'
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import {
  Button,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputBase,
  Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { workspaceRadius, workspaceSpace } from '../shared/ui/layoutTokens'
import { workspaceTransitionPresets } from '../shared/ui/motionTokens'
import { workspaceIconSize, workspaceTypeRem } from '../shared/ui/typeTokens'

/** Workbench chrome: keep header thin so panels get the viewport. */
const headerChrome = {
  rowMinHeight: 40,
  controlHeight: 32,
  titleFontSize: workspaceTypeRem.sm,
} as const

interface WorkspaceHeaderProps {
  notebookName: string
  isFetching: boolean
  isUpdatingName: boolean
  isDeletingNotebook?: boolean
  onNotebookNameChange: (value: string) => void
  onNotebookNameFocus: () => void
  onNotebookNameBlur: () => void
  onDeleteNotebook?: () => Promise<void>
}

export function WorkspaceHeader({
  notebookName,
  isFetching,
  isUpdatingName,
  isDeletingNotebook = false,
  onNotebookNameChange,
  onNotebookNameFocus,
  onNotebookNameBlur,
  onDeleteNotebook,
}: WorkspaceHeaderProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null)
  const canDelete = typeof onDeleteNotebook === 'function'

  const handleOpenDeleteDialog = () => {
    if (!canDelete) {
      return
    }
    setDeleteErrorMessage(null)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    if (isDeletingNotebook) {
      return
    }
    setDeleteErrorMessage(null)
    setDeleteDialogOpen(false)
  }

  const handleConfirmDelete = () => {
    if (!onDeleteNotebook || isDeletingNotebook) {
      return
    }
    setDeleteErrorMessage(null)
    void onDeleteNotebook()
      .then(() => {
        setDeleteDialogOpen(false)
      })
      .catch((error) => {
        if (error instanceof Error && error.message.trim()) {
          setDeleteErrorMessage(error.message)
          return
        }
        setDeleteErrorMessage('删除失败，请稍后重试')
      })
  }

  return (
    <Box
      component="header"
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Box
        sx={{
          width: '100%',
          minHeight: headerChrome.rowMinHeight,
          px: workspaceSpace.sm,
          py: 0,
          display: 'flex',
          alignItems: 'center',
          gap: workspaceSpace.xxs,
        }}
      >
        <IconButton
          component={Link}
          to="/"
          edge="start"
          color="inherit"
          size="small"
          aria-label="返回"
          sx={{
            ml: 0,
            width: headerChrome.controlHeight,
            height: headerChrome.controlHeight,
            p: 0,
          }}
        >
          <ArrowBackOutlinedIcon sx={{ fontSize: workspaceIconSize.md }} />
        </IconButton>
        <InputBase
          value={notebookName}
          placeholder="未命名笔记本"
          disabled={isDeletingNotebook}
          onChange={(event) => onNotebookNameChange(event.target.value)}
          onFocus={onNotebookNameFocus}
          onBlur={onNotebookNameBlur}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              const input = event.target as HTMLInputElement
              input.blur()
            }
          }}
          inputProps={{
            'aria-label': '笔记名称',
            maxLength: 128,
          }}
          sx={{
            flex: 1,
            minWidth: 0,
            maxWidth: { xs: '100%', md: 560 },
            height: headerChrome.controlHeight,
            px: workspaceSpace.sm,
            py: 0,
            borderRadius: workspaceRadius.md,
            border: 1,
            borderColor: 'transparent',
            bgcolor: 'background.paper',
            cursor: 'text',
            fontSize: headerChrome.titleFontSize,
            lineHeight: 1.3,
            fontWeight: 600,
            letterSpacing: 0,
            transition: workspaceTransitionPresets.borderBg,
            '& input': {
              cursor: 'text',
              textOverflow: 'ellipsis',
              py: 0,
              height: '100%',
            },
            '&:hover': {
              bgcolor: 'background.default',
              borderColor: 'divider',
            },
            '&.Mui-focused': {
              bgcolor: 'action.selected',
              borderColor: 'primary.main',
            },
          }}
        />
        <Box
          sx={{
            ml: 'auto',
            display: 'inline-flex',
            alignItems: 'center',
            gap: workspaceSpace.xxs,
            flexShrink: 0,
          }}
        >
          <IconButton
            size="small"
            aria-label="删除笔记本"
            onClick={handleOpenDeleteDialog}
            disabled={!canDelete || isDeletingNotebook}
            sx={{
              width: headerChrome.controlHeight,
              height: headerChrome.controlHeight,
              p: 0,
            }}
          >
            <DeleteOutlineOutlinedIcon sx={{ fontSize: workspaceIconSize.md }} />
          </IconButton>
          {(isFetching || isUpdatingName || isDeletingNotebook) && <CircularProgress size={14} />}
        </Box>
      </Box>
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>删除笔记本</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            删除后将移除该笔记本及其相关聊天与来源数据，此操作不可恢复。
          </Typography>
          {deleteErrorMessage ? (
            <Typography
              variant="caption"
              sx={(theme) => ({
                mt: workspaceSpace.sm,
                display: 'block',
                color: theme.workspacePalette.status.error,
              })}
            >
              {deleteErrorMessage}
            </Typography>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={isDeletingNotebook}>
            取消
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmDelete}
            disabled={isDeletingNotebook}
            sx={(theme) => ({
              bgcolor: theme.workspacePalette.status.error,
              '&:hover': {
                bgcolor: theme.palette.error.dark,
              },
            })}
          >
            {isDeletingNotebook ? '删除中...' : '删除'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
