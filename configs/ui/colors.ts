export type Theme = 'light' | 'dark'

export interface ThemeColors {
  'background': string
  'foreground': string
  'card': string
  'card-foreground': string
  'popover': string
  'popover-foreground': string
  'primary': string
  'primary-foreground': string
  'secondary': string
  'secondary-foreground': string
  'muted': string
  'muted-foreground': string
  'accent': string
  'accent-foreground': string
  'destructive': string
  'border': string
  'input': string
  'ring': string
  'chart-1': string
  'chart-2': string
  'chart-3': string
  'chart-4': string
  'chart-5': string
  'sidebar': string
  'sidebar-foreground': string
  'sidebar-primary': string
  'sidebar-primary-foreground': string
  'sidebar-accent': string
  'sidebar-accent-foreground': string
  'sidebar-border': string
  'sidebar-ring': string
}

// Copied from `./global.css` for places where `className` is not available.
export const colors: Record<Theme, ThemeColors> = {
  light: {
    'background': 'oklch(0.98 0.006 85)',
    'foreground': 'oklch(0.18 0.01 60)',
    'card': 'oklch(0.99 0.004 85)',
    'card-foreground': 'oklch(0.18 0.01 60)',
    'popover': 'oklch(0.99 0.004 85)',
    'popover-foreground': 'oklch(0.18 0.01 60)',
    'primary': 'oklch(0.54 0.1 78)',
    'primary-foreground': 'oklch(0.985 0.01 85)',
    'secondary': 'oklch(0.94 0.009 85)',
    'secondary-foreground': 'oklch(0.22 0.012 60)',
    'muted': 'oklch(0.955 0.008 85)',
    'muted-foreground': 'oklch(0.52 0.015 62)',
    'accent': 'oklch(0.94 0.009 85)',
    'accent-foreground': 'oklch(0.22 0.012 60)',
    'destructive': 'oklch(0.45 0.155 26)',
    'border': 'oklch(0.9 0.012 80)',
    'input': 'oklch(0.88 0.012 80)',
    'ring': 'oklch(0.54 0.1 78)',
    'chart-1': 'oklch(0.8 0.09 88)',
    'chart-2': 'oklch(0.68 0.08 80)',
    'chart-3': 'oklch(0.56 0.07 75)',
    'chart-4': 'oklch(0.44 0.05 70)',
    'chart-5': 'oklch(0.32 0.03 65)',
    'sidebar': 'oklch(0.965 0.008 85)',
    'sidebar-foreground': 'oklch(0.18 0.01 60)',
    'sidebar-primary': 'oklch(0.54 0.1 78)',
    'sidebar-primary-foreground': 'oklch(0.985 0.01 85)',
    'sidebar-accent': 'oklch(0.93 0.01 85)',
    'sidebar-accent-foreground': 'oklch(0.22 0.012 60)',
    'sidebar-border': 'oklch(0.9 0.012 80)',
    'sidebar-ring': 'oklch(0.54 0.1 78)',
  },
  dark: {
    'background': 'oklch(0.17 0.006 60)',
    'foreground': 'oklch(0.94 0.01 85)',
    'card': 'oklch(0.21 0.006 60)',
    'card-foreground': 'oklch(0.94 0.01 85)',
    'popover': 'oklch(0.21 0.006 60)',
    'popover-foreground': 'oklch(0.94 0.01 85)',
    'primary': 'oklch(0.78 0.1 85)',
    'primary-foreground': 'oklch(0.2 0.01 60)',
    'secondary': 'oklch(0.27 0.008 60)',
    'secondary-foreground': 'oklch(0.94 0.01 85)',
    'muted': 'oklch(0.25 0.008 60)',
    'muted-foreground': 'oklch(0.69 0.018 75)',
    'accent': 'oklch(0.27 0.008 60)',
    'accent-foreground': 'oklch(0.94 0.01 85)',
    'destructive': 'oklch(0.64 0.16 24)',
    'border': 'oklch(1 0 0 / 10%)',
    'input': 'oklch(1 0 0 / 15%)',
    'ring': 'oklch(0.78 0.1 85)',
    'chart-1': 'oklch(0.82 0.1 88)',
    'chart-2': 'oklch(0.73 0.09 82)',
    'chart-3': 'oklch(0.64 0.08 76)',
    'chart-4': 'oklch(0.55 0.06 70)',
    'chart-5': 'oklch(0.46 0.04 65)',
    'sidebar': 'oklch(0.15 0.006 60)',
    'sidebar-foreground': 'oklch(0.94 0.01 85)',
    'sidebar-primary': 'oklch(0.78 0.1 85)',
    'sidebar-primary-foreground': 'oklch(0.2 0.01 60)',
    'sidebar-accent': 'oklch(0.24 0.008 60)',
    'sidebar-accent-foreground': 'oklch(0.94 0.01 85)',
    'sidebar-border': 'oklch(1 0 0 / 10%)',
    'sidebar-ring': 'oklch(0.78 0.1 85)',
  },
}
