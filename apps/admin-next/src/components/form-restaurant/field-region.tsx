import type { JSX } from 'react'
import { Field, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { useId } from 'react'
import { Controller } from 'react-hook-form'
import { regionLabels } from '@/lib/labels'
import { useFormRestaurant } from './hooks'

export function FieldRegion(): JSX.Element {
  const form = useFormRestaurant()
  const listId = useId()

  return (
    <Controller
      name="region"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Region</FieldLabel>
          <Input {...field} list={listId} className="w-32" />
          <datalist id={listId}>
            {Object.entries(regionLabels).map(([code, label]) => <option key={code} value={code} label={label} />)}
          </datalist>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
