import type { JSX } from 'react'
import { isGlyphKey } from '@repo/ui-web/lib/glyphs'
import { Mark } from '@repo/ui-web/mark'
import { useWatch } from 'react-hook-form'
import { useFormAwardTier } from './hooks'

// Shows the mark as the operator types, so an unknown key is seen to fall back to the generic mark before saving.
export function PreviewMark(): JSX.Element {
  const form = useFormAwardTier()
  const [glyphKey, glyphCount] = useWatch({ control: form.control, name: ['glyphKey', 'glyphCount'] })
  const unknown = glyphKey !== '' && !isGlyphKey(glyphKey)

  return (
    <div className="flex items-center gap-3 rounded-md border px-3 py-2">
      <span className="text-sm text-muted-foreground">Preview</span>
      <Mark glyphKey={glyphKey === '' ? 'generic' : glyphKey} count={glyphCount} className="text-2xl" />
      {unknown && <span className="text-xs text-muted-foreground">No drawing for this key yet; the generic mark is shown.</span>}
    </div>
  )
}
