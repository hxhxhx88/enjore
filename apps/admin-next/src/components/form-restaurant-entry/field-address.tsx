import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { Controller } from 'react-hook-form'
import { useFormRestaurantEntry } from './hooks'

export function FieldAddress(): JSX.Element {
  const form = useFormRestaurantEntry()

  return (
    <Controller
      name="address"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Address</FieldLabel>
          <Input {...field} />
          <FieldDescription>As the guide writes it; it narrows the search and is compared with the results.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
