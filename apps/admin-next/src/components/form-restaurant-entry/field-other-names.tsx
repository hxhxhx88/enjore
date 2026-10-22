import type { JSX } from 'react'
import { Button } from '@repo/ui-web/primitives/button'
import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { XIcon } from 'lucide-react'
import { useId } from 'react'
import { Controller, useFieldArray } from 'react-hook-form'
import { localeTagSuggestions } from '@/lib/locales'
import { useFormRestaurantEntry } from './hooks'

// The other official names, one per locale, such as the English name of a Cantonese kitchen.
export function FieldOtherNames(): JSX.Element {
  const form = useFormRestaurantEntry()
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'otherNames' })
  const listId = useId()

  return (
    <FieldSet>
      <FieldLegend variant="label">Other names</FieldLegend>
      <FieldDescription>The venue's other official names, stored as translations of the name.</FieldDescription>
      <datalist id={listId}>
        {localeTagSuggestions.map(tag => <option key={tag} value={tag} />)}
      </datalist>
      {fields.map((row, index) => (
        <div key={row.id} className="grid grid-cols-[1fr_8rem_auto] items-start gap-2">
          <Controller
            name={`otherNames.${index}.value`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="sr-only">Name</FieldLabel>
                <Input {...field} placeholder="Name" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Controller
            name={`otherNames.${index}.locale`}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="sr-only">Language</FieldLabel>
                <Input {...field} list={listId} placeholder="en-us" />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button type="button" variant="ghost" size="icon" aria-label="Remove this name" onClick={() => remove(index)}>
            <XIcon />
          </Button>
        </div>
      ))}
      <Button type="button" variant="outline" className="w-fit" onClick={() => append({ value: '', locale: 'en-us' })}>
        Add name
      </Button>
    </FieldSet>
  )
}
