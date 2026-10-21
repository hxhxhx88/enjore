import type { JSX } from 'react'
import { knownGlyphKeys } from '@repo/ui-web/lib/glyphs'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { useId } from 'react'
import { Controller } from 'react-hook-form'
import { useFormAwardTier } from './hooks'

export function FieldGlyphKey(): JSX.Element {
  const form = useFormAwardTier()
  const listId = useId()

  return (
    <Controller
      name="glyphKey"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Glyph key</FieldLabel>
          <Input {...field} list={listId} autoComplete="off" />
          <datalist id={listId}>
            {knownGlyphKeys.map(key => <option key={key} value={key} />)}
          </datalist>
          <FieldDescription>Picks the drawing of the mark. Any key is accepted; one without a drawing shows the generic mark.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
