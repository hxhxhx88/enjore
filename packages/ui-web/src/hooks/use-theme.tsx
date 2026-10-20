'use client'

import type { ThemeContextValue } from '../lib/theme-context'
import { use } from 'react'
import { ThemeContext } from '../lib/theme-context'

export function useTheme(): ThemeContextValue {
  const value = use(ThemeContext)
  if (!value) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return value
}
