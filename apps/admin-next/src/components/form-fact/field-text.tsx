import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { Controller } from 'react-hook-form'
import { useFormFact } from './hooks'

interface Props {
  readonly label: string
  readonly type: 'text' | 'url'
}

export function FieldText({ label, type }: Props): JSX.Element {
  const form = useFormFact()

  return (
    <Controller
      name="text"
      control={form.control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>{label}</FieldLabel>
          <Input {...field} type={type} placeholder={type === 'url' ? 'https://' : undefined} />
          <FieldDescription>Saved with a manual origin, so a refresh from Places leaves it alone.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
