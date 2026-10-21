import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { useId } from 'react'
import { Controller } from 'react-hook-form'
import { localeTagSuggestions } from '@/lib/locales'
import { useFormAward } from './hooks'

export function FieldNameLocale(): JSX.Element {
  const form = useFormAward()
  const listId = useId()

  return (
    <Controller
      name="nameLocale"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Name language</FieldLabel>
          <Input {...field} list={listId} />
          <datalist id={listId}>
            {localeTagSuggestions.map(tag => <option key={tag} value={tag} />)}
          </datalist>
          <FieldDescription>Lowercase tag of the language the name is written in, such as en-us or zh-cn.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
