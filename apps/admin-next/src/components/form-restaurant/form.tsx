'use client'

import type { JSX, RefObject } from 'react'
import type { FormType } from './schema'
import { cn } from '@repo/ui-web/lib/utils'
import { useWatch } from 'react-hook-form'
import { FieldAddress } from './field-address'
import { FieldName } from './field-name'
import { FieldNameLocale } from './field-name-locale'
import { FieldRegion } from './field-region'
import { FieldSlug } from './field-slug'
import { useFormRestaurant } from './hooks'

interface Props {
  readonly className?: string | undefined
  readonly formRef?: RefObject<HTMLFormElement | null>
  readonly onSubmit: (form: FormType) => void
}

export function Form({ className, formRef, onSubmit }: Props): JSX.Element {
  const form = useFormRestaurant()
  const hasPlace = useWatch({ control: form.control, name: 'hasPlace' })

  return (
    <form
      className={cn('flex flex-col gap-5', className)}
      ref={formRef}
      onSubmit={(event) => {
        void form.handleSubmit(onSubmit)(event)
      }}
    >
      <div className="grid gap-5 sm:grid-cols-[1fr_calc(32*var(--spacing))]">
        <FieldName />
        <FieldNameLocale />
      </div>
      <FieldSlug />
      <FieldRegion />
      {!hasPlace && <FieldAddress />}
    </form>
  )
}
