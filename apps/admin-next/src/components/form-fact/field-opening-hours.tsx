import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Textarea } from '@repo/ui-web/primitives/textarea'
import { Controller } from 'react-hook-form'
import { useFormFact } from './hooks'

export function FieldOpeningHours(): JSX.Element {
  const form = useFormFact()

  return (
    <Controller
      name="text"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Opening hours</FieldLabel>
          <Textarea {...field} rows={4} placeholder={'Mon-Fri 11:30-15:00, 18:00-22:30\nSat-Sun 12:00-23:00'} className="font-mono" />
          <FieldDescription>
            One line per group of days: Mon, Mon-Fri, Sat, Sun or Daily, then the ranges. A close at or before the
            open means the next day, so 18:00-02:00 runs past midnight.
          </FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
