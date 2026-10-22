import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Controller } from 'react-hook-form'
import { InputNumber } from '@/components/input-number'
import { useFormFact } from './hooks'

export function FieldCoordinates(): JSX.Element {
  const form = useFormFact()

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <Controller
        name="latitude"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Latitude</FieldLabel>
            <InputNumber
              name={field.name}
              ref={field.ref}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              min={-90}
              max={90}
              step="any"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="longitude"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Longitude</FieldLabel>
            <InputNumber
              name={field.name}
              ref={field.ref}
              value={field.value}
              onValueChange={field.onChange}
              onBlur={field.onBlur}
              min={-180}
              max={180}
              step="any"
            />
            <FieldDescription>WGS-84 decimal degrees, as Google Maps shows them.</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  )
}
