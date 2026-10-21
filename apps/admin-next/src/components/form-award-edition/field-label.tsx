import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { Controller } from 'react-hook-form'
import { useFormAwardEdition } from './hooks'

export function FieldEditionLabel(): JSX.Element {
  const form = useFormAwardEdition()

  return (
    <Controller
      name="label"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Label</FieldLabel>
          <Input {...field} />
          <FieldDescription>The list as the award names it, such as Hong Kong Macau 2026.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
