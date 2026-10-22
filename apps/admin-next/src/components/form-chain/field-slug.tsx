import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { useEffect, useRef } from 'react'
import { Controller, useWatch } from 'react-hook-form'
import { slugify } from '@/lib/slug'
import { useFormChain } from './hooks'

export function FieldSlug(): JSX.Element {
  const { control, setValue, formState } = useFormChain()
  const name = useWatch({ control, name: 'name' })

  // Only a new chain takes its slug from the name; an existing chain keeps the one it has. The prefill stops as soon
  // as the operator types a slug.
  const prefill = formState.defaultValues?.slug === ''
  const typedRef = useRef(false)

  useEffect(() => {
    if (prefill && !typedRef.current) {
      setValue('slug', slugify(name))
    }
  }, [name, prefill, setValue])

  return (
    <Controller
      name="slug"
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel>Slug</FieldLabel>
          <Input
            {...field}
            onChange={(event) => {
              typedRef.current = true
              field.onChange(event)
            }}
          />
          <FieldDescription>Used in URLs. Filled from the name until you type one; a non-Latin name needs one typed.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
