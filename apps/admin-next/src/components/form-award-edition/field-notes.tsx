import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Textarea } from '@repo/ui-web/primitives/textarea'
import { Controller } from 'react-hook-form'
import { useFormAwardEdition } from './hooks'

export function FieldNotes(): JSX.Element {
  const form = useFormAwardEdition()

  return (
    <Controller
      name="notes"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Notes</FieldLabel>
          <Textarea {...field} rows={4} />
          <FieldDescription>Anything worth remembering about this list. Optional.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
