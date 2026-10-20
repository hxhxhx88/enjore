'use client'

import { themeInitScript } from '@repo/ui-web/lib/theme'
import { useServerInsertedHTML } from 'next/navigation'

// Injects the theme bootstrap script into the server-rendered HTML outside the React tree, so it runs before
// hydration and React never has to render a `<script>` element on the client (which it warns about).
export function ScriptTheme(): null {
  // The markup is a static constant from the UI package, not user input.
  // eslint-disable-next-line react/dom-no-dangerously-set-innerhtml
  useServerInsertedHTML(() => <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />)

  return null
}
