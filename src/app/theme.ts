import { alpha, createTheme } from '@mui/material/styles'
import type { WorkspaceColorPalette } from '@/components/notebook-workspace/shared/ui/workspaceColorPalette'
import { workspaceColorPalette } from '@/components/notebook-workspace/shared/ui/workspaceColorPalette'
import { subtleScrollbarSx } from '@/components/notebook-workspace/shared/ui/scrollbar'
import { workspaceTypeRem } from '@/components/notebook-workspace/shared/ui/typeTokens'
import { workspaceMotion } from '@/components/notebook-workspace/shared/ui/motionTokens'

/* Hallmark · genre: editorial · theme: Studio · design-system: design.md · designed-as-app */

declare module '@mui/material/styles' {
  interface Theme {
    workspacePalette: WorkspaceColorPalette
  }

  interface ThemeOptions {
    workspacePalette?: WorkspaceColorPalette
  }
}

/** Hex bridges mirrored from tokens.css (Studio). */
const studio = {
  paper: '#f7f4ed',
  paper2: '#efebe2',
  paper3: '#e6e1d6',
  ink: '#1c2a22',
  ink2: '#4a5a50',
  rule: '#d8d2c6',
  accent: '#2f6b4f',
  accentDeep: '#24563f',
  accentInk: '#f7f4ed',
  success: '#2f6b4f',
  error: '#c24b3a',
  warning: '#b8922a',
} as const

const fontBody =
  '"Geist", "Noto Sans SC", "Noto Sans CJK SC", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

export const appTheme = createTheme({
  spacing: 8,
  palette: {
    mode: 'light',
    primary: {
      main: studio.accent,
      light: '#4a8a6a',
      dark: studio.accentDeep,
      contrastText: studio.accentInk,
    },
    secondary: {
      main: studio.ink,
      light: '#3a4a40',
      dark: '#121a16',
      contrastText: studio.paper,
    },
    info: {
      main: studio.accent,
      light: '#4a8a6a',
      dark: studio.accentDeep,
      contrastText: studio.accentInk,
    },
    success: {
      main: studio.success,
      contrastText: studio.paper,
    },
    error: {
      main: studio.error,
      contrastText: studio.paper,
    },
    warning: {
      main: studio.warning,
      contrastText: studio.ink,
    },
    background: {
      default: studio.paper2,
      paper: studio.paper,
    },
    text: {
      primary: studio.ink,
      secondary: studio.ink2,
    },
    divider: studio.rule,
    action: {
      hover: alpha(studio.ink, 0.04),
      selected: alpha(studio.accent, 0.1),
      focus: alpha(studio.accent, 0.16),
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    // CJK-first UI: Geist throughout so Latin + Chinese share one sans fallback path.
    // Instrument Serif stays available as --font-display for rare Latin accents only.
    fontFamily: fontBody,
    fontSize: 14,
    h5: {
      fontFamily: fontBody,
      fontSize: workspaceTypeRem.xl,
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: 1.35,
      fontStyle: 'normal',
    },
    h6: {
      fontFamily: fontBody,
      fontSize: workspaceTypeRem.lg,
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: 1.35,
      fontStyle: 'normal',
    },
    subtitle1: {
      fontSize: workspaceTypeRem.sm,
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: 1.4,
    },
    subtitle2: {
      fontSize: workspaceTypeRem.sm,
      fontWeight: 600,
      letterSpacing: 0,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: workspaceTypeRem.sm,
      letterSpacing: 0,
      lineHeight: 1.5,
    },
    body2: {
      fontSize: workspaceTypeRem.sm,
      letterSpacing: 0,
      lineHeight: 1.5,
    },
    caption: {
      fontSize: workspaceTypeRem.xs,
      letterSpacing: 0,
      lineHeight: 1.35,
    },
    button: {
      fontSize: workspaceTypeRem.sm,
      fontWeight: 600,
      letterSpacing: 0,
      textTransform: 'none',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          overflowX: 'clip',
        },
        body: {
          backgroundColor: studio.paper2,
          color: studio.ink2,
          overflowX: 'clip',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: studio.rule,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          boxShadow: 'none',
          transition: [
            `background-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
            `border-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
            `color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
          ].join(', '),
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
          '&.MuiButton-colorPrimary': {
            backgroundColor: studio.accent,
            color: studio.accentInk,
            '&:hover': {
              backgroundColor: studio.accentDeep,
            },
          },
        },
        outlined: {
          borderWidth: 1,
          borderColor: studio.rule,
          '&:hover': {
            borderColor: studio.accent,
            backgroundColor: alpha(studio.accent, 0.04),
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: [
            `background-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
            `color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
          ].join(', '),
          '&:hover': {
            backgroundColor: alpha(studio.accent, 0.08),
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          transition: [
            `border-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
            `background-color ${workspaceMotion.durationBaseMs}ms ${workspaceMotion.easingStandard}`,
          ].join(', '),
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...subtleScrollbarSx(theme),
        }),
      },
    },
  },
  workspacePalette: workspaceColorPalette,
})
