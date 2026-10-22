import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { Controller } from 'react-hook-form'
import { useFormRestaurantEntry } from './hooks'

export function FieldGoogleMapsUrl(): JSX.Element {
  const form = useFormRestaurantEntry()

  return (
    <Controller
      name="googleMapsUrl"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Google Maps link</FieldLabel>
          <Input {...field} type="url" placeholder="https://maps.app.goo.gl/…" />
          <FieldDescription>A share link from Google Maps; its name and pin guide the search. Short links are followed.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
