import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { Controller } from 'react-hook-form'
import { useFormAwardEdition } from './hooks'

export function FieldRegion(): JSX.Element {
  const form = useFormAwardEdition()

  return (
    <Controller
      name="region"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Region</FieldLabel>
          <Input {...field} />
          <FieldDescription>The scope the list covers, such as Hong Kong Macau or Asia. Optional.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
