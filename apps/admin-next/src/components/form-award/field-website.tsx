import type { JSX } from 'react'
import { Field, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { Controller } from 'react-hook-form'
import { useFormAward } from './hooks'

export function FieldWebsite(): JSX.Element {
  const form = useFormAward()

  return (
    <Controller
      name="website"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Website</FieldLabel>
          <Input {...field} type="url" placeholder="https://" />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
