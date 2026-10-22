import type { JSX } from 'react'
import { businessStatuses } from '@repo/lib/schemas/business-status'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui-web/primitives/select'
import { Controller } from 'react-hook-form'
import { businessStatusLabels } from '@/lib/labels'
import { useFormFact } from './hooks'

const items = businessStatuses.map(status => ({ value: status, label: businessStatusLabels[status] }))

export function FieldBusinessStatus(): JSX.Element {
  const form = useFormFact()

  return (
    <Controller
      name="businessStatus"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Business status</FieldLabel>
          <Select items={items} value={field.value} onValueChange={value => field.onChange(value)}>
            <SelectTrigger aria-label="Business status">
              <SelectValue placeholder="Pick a status" />
            </SelectTrigger>
            <SelectContent>
              {items.map(item => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldDescription>An override Places no longer refreshes; clear the fact to follow Places again.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
