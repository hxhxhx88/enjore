'use client'

import type { JSX, RefObject } from 'react'
import type { FormType } from './schema'
import { cn } from '@repo/ui-web/lib/utils'
import { useWatch } from 'react-hook-form'
import { factLabels } from '@/lib/labels'
import { FieldBusinessStatus } from './field-business-status'
import { FieldCoordinates } from './field-coordinates'
import { FieldOpeningHours } from './field-opening-hours'
import { FieldText } from './field-text'
import { useFormFact } from './hooks'

interface Props {
  readonly className?: string | undefined
  readonly formRef?: RefObject<HTMLFormElement | null>
  readonly onSubmit: (form: FormType) => void
}

function fieldFor(fact: FormType['fact']): JSX.Element {
  switch (fact) {
    case 'address':
    case 'district':
    case 'phone':
      return <FieldText label={factLabels[fact]} type="text" />
    case 'website':
      return <FieldText label={factLabels[fact]} type="url" />
    case 'coordinates':
      return <FieldCoordinates />
    case 'openingHours':
      return <FieldOpeningHours />
    case 'businessStatus':
      return <FieldBusinessStatus />
  }
}

export function Form({ className, formRef, onSubmit }: Props): JSX.Element {
  const form = useFormFact()
  const fact = useWatch({ control: form.control, name: 'fact' })

  return (
    <form
      className={cn('flex flex-col gap-5', className)}
      ref={formRef}
      onSubmit={(event) => {
        void form.handleSubmit(onSubmit)(event)
      }}
    >
      {fieldFor(fact)}
    </form>
  )
}
