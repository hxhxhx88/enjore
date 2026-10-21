import type { JSX } from 'react'
import { Field, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Controller } from 'react-hook-form'
import { InputNumber } from '@/components/input-number'
import { useFormAwardEdition } from './hooks'

export function FieldYear(): JSX.Element {
  const form = useFormAwardEdition()

  return (
    <Controller
      name="year"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Year</FieldLabel>
          <InputNumber
            name={field.name}
            ref={field.ref}
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            min={1900}
            max={2100}
            step={1}
          />
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
