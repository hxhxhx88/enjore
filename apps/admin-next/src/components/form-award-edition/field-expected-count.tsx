import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Controller } from 'react-hook-form'
import { InputNumber } from '@/components/input-number'
import { useFormAwardEdition } from './hooks'

export function FieldExpectedCount(): JSX.Element {
  const form = useFormAwardEdition()

  return (
    <Controller
      name="expectedCount"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Expected count</FieldLabel>
          <InputNumber
            name={field.name}
            ref={field.ref}
            value={field.value}
            onValueChange={field.onChange}
            onBlur={field.onBlur}
            min={0}
            step={1}
          />
          <FieldDescription>How many entries the official list has; an import is checked against it. Optional.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
