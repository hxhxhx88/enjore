'use client'

import type { JSX, RefObject } from 'react'
import type { FormType } from './schema'
import { cn } from '@repo/ui-web/lib/utils'
import { FieldAddress } from './field-address'
import { FieldGoogleMapsUrl } from './field-google-maps-url'
import { FieldName } from './field-name'
import { FieldNameLocale } from './field-name-locale'
import { FieldOtherNames } from './field-other-names'
import { FieldRegion } from './field-region'
import { useFormRestaurantEntry } from './hooks'

interface Props {
  readonly className?: string | undefined
  readonly formRef?: RefObject<HTMLFormElement | null>
  readonly onSubmit: (form: FormType) => void
}

export function Form({ className, formRef, onSubmit }: Props): JSX.Element {
  const form = useFormRestaurantEntry()

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
      <FieldOtherNames />
      <FieldAddress />
      <FieldRegion />
      <FieldGoogleMapsUrl />
    </form>
  )
}
