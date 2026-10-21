import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Controller } from 'react-hook-form'
import { InputNumber } from '@/components/input-number'
import { useFormAwardTier } from './hooks'

export function FieldGlyphCount(): JSX.Element {
  const form = useFormAwardTier()

  return (
    <Controller
      name="glyphCount"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Glyph count</FieldLabel>
          <InputNumber
            name={field.name}
            ref={field.ref}
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            min={1}
            max={10}
            step={1}
          />
          <FieldDescription>How many times the drawing repeats, such as 3 for three stars.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
