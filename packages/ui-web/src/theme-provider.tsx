'use client'

import type { JSX, ReactNode } from 'react'
import type { ResolvedTheme } from './lib/theme'
import type { ThemeContextValue } from './lib/theme-context'
import { useEffect, useMemo, useSyncExternalStore } from 'react'
import {
  applyTheme,
  readStoredTheme,
  storeTheme,
  subscribeStoredTheme,
  subscribeSystemTheme,
  systemPrefersDark,
} from './lib/theme'
import { ThemeContext } from './lib/theme-context'

function getServerTheme(): ThemeContextValue['theme'] {
  return 'system'
}

function getServerSystemPrefersDark(): boolean {
  return false
}

// Keeps the `dark` class on `<html>` in sync with the stored preference and the system setting.
// The bootstrap script (`themeInitScript`) applies the class before hydration; the root layout must set
// `suppressHydrationWarning` on `<html>` because of that.
export function ThemeProvider({ children }: { children: ReactNode }): JSX.Element {
  const theme = useSyncExternalStore(subscribeStoredTheme, readStoredTheme, getServerTheme)
  const prefersDark = useSyncExternalStore(subscribeSystemTheme, systemPrefersDark, getServerSystemPrefersDark)
  const resolvedTheme: ResolvedTheme = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme

  useEffect(() => {
    applyTheme(resolvedTheme)
  }, [resolvedTheme])

  const value = useMemo<ThemeContextValue>(() => ({ theme, resolvedTheme, setTheme: storeTheme }), [theme, resolvedTheme])

  return <ThemeContext value={value}>{children}</ThemeContext>
}
