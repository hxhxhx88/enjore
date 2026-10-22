import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { Controller } from 'react-hook-form'
import { useFormRestaurant } from './hooks'

// Shown only for a restaurant created without a Google place; with one, the address is a fact Places fills.
export function FieldAddress(): JSX.Element {
  const form = useFormRestaurant()

  return (
    <Controller
      name="address"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Address</FieldLabel>
          <Input {...field} />
          <FieldDescription>Stored with a manual origin; a later place id does not overwrite it.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
