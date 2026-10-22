import type { JSX } from 'react'
import { Field, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { useId } from 'react'
import { Controller } from 'react-hook-form'
import { localeTagSuggestions } from '@/lib/locales'
import { useFormRestaurant } from './hooks'

export function FieldNameLocale(): JSX.Element {
  const form = useFormRestaurant()
  const listId = useId()

  return (
    <Controller
      name="nameLocale"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Language</FieldLabel>
          <Input {...field} list={listId} />
          <datalist id={listId}>
            {localeTagSuggestions.map(tag => <option key={tag} value={tag} />)}
          </datalist>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
