// Theme storage and DOM helpers shared by the provider (React) and the bootstrap script (plain JS).

export const themes = ['light', 'dark', 'system'] as const

export type Theme = (typeof themes)[number]

export type ResolvedTheme = Exclude<Theme, 'system'>

export const themeStorageKey = 'theme'

// Dispatched on `window` after the stored theme changes in the current tab.
export const themeChangeEvent = 'themechange'

const darkQuery = '(prefers-color-scheme: dark)'

const themeSet = new Set<string>(themes)

function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && themeSet.has(value)
}

export function readStoredTheme(): Theme {
  try {
    const value = localStorage.getItem(themeStorageKey)
    return isTheme(value) ? value : 'system'
  }
  catch {
    return 'system'
  }
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(themeStorageKey, theme)
  }
  catch {
    // Storage may be unavailable (private mode, blocked). The theme still applies for this page.
  }
  window.dispatchEvent(new Event(themeChangeEvent))
}

export function subscribeStoredTheme(onChange: () => void): () => void {
  window.addEventListener('storage', onChange)
  window.addEventListener(themeChangeEvent, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(themeChangeEvent, onChange)
  }
}

export function systemPrefersDark(): boolean {
  return window.matchMedia(darkQuery).matches
}

export function subscribeSystemTheme(onChange: () => void): () => void {
  const mql = window.matchMedia(darkQuery)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}

// Applies the resolved theme to `<html>`: the `dark` class drives Tailwind's `dark:` variant.
export function applyTheme(theme: ResolvedTheme): void {
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(theme)
  root.style.colorScheme = theme
}

// Runs before hydration to avoid a flash of the wrong theme. Keep it in sync with `applyTheme` and `readStoredTheme`.
export const themeInitScript = [
  '(function(){try{',
  `var t=localStorage.getItem(${JSON.stringify(themeStorageKey)});`,
  `if(t!=="light"&&t!=="dark"){t=window.matchMedia(${JSON.stringify(darkQuery)}).matches?"dark":"light"}`,
  'var r=document.documentElement;r.classList.remove("light","dark");r.classList.add(t);r.style.colorScheme=t',
  '}catch(e){}})()',
].join('')
