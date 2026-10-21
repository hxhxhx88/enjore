import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { Controller } from 'react-hook-form'
import { useFormAwardEdition } from './hooks'

export function FieldSourceUrl(): JSX.Element {
  const form = useFormAwardEdition()

  return (
    <Controller
      name="sourceUrl"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Source URL</FieldLabel>
          <Input {...field} type="url" placeholder="https://" />
          <FieldDescription>Where the official list is published. Optional.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
