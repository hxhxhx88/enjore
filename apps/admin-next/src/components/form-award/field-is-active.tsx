import type { JSX } from 'react'
import { Field, FieldContent, FieldDescription, FieldLabel } from '@repo/ui-web/primitives/field'
import { Switch } from '@repo/ui-web/primitives/switch'
import { useId } from 'react'
import { Controller } from 'react-hook-form'
import { useFormAward } from './hooks'

export function FieldIsActive(): JSX.Element {
  const form = useFormAward()
  const id = useId()

  return (
    <Controller
      name="isActive"
      control={form.control}
      render={({ field }) => (
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor={id}>Active</FieldLabel>
            <FieldDescription>An inactive award is kept with its accolades but no longer offered when adding one.</FieldDescription>
          </FieldContent>
          <Switch
            id={id}
            name={field.name}
            ref={field.ref}
            checked={field.value}
            onCheckedChange={checked => field.onChange(checked)}
            onBlur={field.onBlur}
          />
        </Field>
      )}
    />
  )
}
