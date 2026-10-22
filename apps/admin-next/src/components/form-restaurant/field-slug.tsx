import type { JSX } from 'react'
import { Field, FieldDescription, FieldError, FieldLabel } from '@repo/ui-web/primitives/field'
import { Input } from '@repo/ui-web/primitives/input'
import { useEffect, useRef } from 'react'
import { Controller, useWatch } from 'react-hook-form'
import { slugify } from '@/lib/slug'
import { useFormRestaurant } from './hooks'

export function FieldSlug(): JSX.Element {
  const { control, setValue, formState } = useFormRestaurant()
  const name = useWatch({ control, name: 'name' })

  // Only a form that opens without a slug takes it from the name; the review step passes one computed from the
  // first Latin name, and an existing restaurant keeps its own. The prefill stops once the operator types.
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
          <FieldDescription>Used in URLs, from the first Latin-script name. Type one when no name is Latin.</FieldDescription>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
