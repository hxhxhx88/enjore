import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Controller } from 'react-hook-form'
import { InputNumber } from '@/components/input-number'
import { useFormAwardTier } from './hooks'

export function FieldLevel(): JSX.Element {
  const form = useFormAwardTier()

  return (
    <Controller
      name="level"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Level</FieldLabel>
          <InputNumber
            name={field.name}
            ref={field.ref}
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            min={1}
            step={1}
          />
          <FieldDescription>1 is the highest distinction; tables sort tiers by level.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
