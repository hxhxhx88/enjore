'use client'

import type { JSX } from 'react'
import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from './hooks/use-theme'
import { Button } from './primitives/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './primitives/dropdown-menu'

// Labels are passed in so that i18n'd apps can translate them.
export interface ThemeToggleLabels {
  light: string
  dark: string
  system: string
  toggle: string
}

export function ThemeToggle({ labels }: { labels: ThemeToggleLabels }): JSX.Element {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label={labels.toggle} />}>
        <SunIcon className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
        <MoonIcon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>{labels.light}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>{labels.dark}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>{labels.system}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
