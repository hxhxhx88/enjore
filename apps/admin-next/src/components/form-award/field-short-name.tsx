import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { Controller } from 'react-hook-form'
import { useFormAward } from './hooks'

export function FieldShortName(): JSX.Element {
  const form = useFormAward()

  return (
    <Controller
      name="shortName"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Short name</FieldLabel>
          <Input {...field} />
          <FieldDescription>Shown where space is tight, such as next to a mark. Optional.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
