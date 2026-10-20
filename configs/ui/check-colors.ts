// Verifies that `colors.ts` mirrors the theme tokens declared in `global.css`.
// Run with `node configs/ui/check-colors.ts` (Node.js strips the types natively).
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { colors } from './colors.ts'

const css = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'global.css'), 'utf8')

// Picks the `selector { ... }` block that declares the theme tokens (the stylesheet has several `:root` blocks).
function tokensOf(selector: string): Record<string, string> {
  const pattern = new RegExp(`${selector.replace('.', '\\.')}\\s*\\{([^}]*)\\}`, 'g')
  for (const [, body] of css.matchAll(pattern)) {
    if (body?.includes('--background:')) {
      return Object.fromEntries(
        [...body.matchAll(/--([\w-]+):([^;]*);/g)].map(([, name, value]) => [name ?? '', (value ?? '').trim()]),
      )
    }
  }
  throw new Error(`No theme token block found for "${selector}" in global.css`)
}

const expected = { light: tokensOf(':root'), dark: tokensOf('.dark') }
const errors: string[] = []

for (const theme of ['light', 'dark'] as const) {
  for (const [name, value] of Object.entries(colors[theme])) {
    const cssValue = expected[theme][name]
    if (cssValue !== value) {
      errors.push(`${theme}.${name}: colors.ts has "${value}" but global.css has "${cssValue ?? 'nothing'}"`)
    }
  }
  for (const name of Object.keys(expected[theme])) {
    if (!(name in colors[theme])) {
      errors.push(`${theme}.${name}: declared in global.css but missing from colors.ts`)
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.warn('colors.ts matches global.css')
