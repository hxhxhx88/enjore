'use client'

import type { JSX, RefObject } from 'react'
import type { FormType } from './schema'
import { cn } from '@repo/ui-web/lib/utils'
import { FieldFacets } from './field-facets'
import { FieldIsActive } from './field-is-active'
import { FieldName } from './field-name'
import { FieldNameLocale } from './field-name-locale'
import { FieldShortName } from './field-short-name'
import { FieldSlug } from './field-slug'
import { FieldWebsite } from './field-website'
import { useFormAward } from './hooks'

interface Props {
  readonly className?: string | undefined
  readonly formRef?: RefObject<HTMLFormElement | null>
  readonly onSubmit: (form: FormType) => void
}

export function Form({ className, formRef, onSubmit }: Props): JSX.Element {
  const form = useFormAward()

  return (
    <form
      className={cn('flex flex-col gap-5', className)}
      ref={formRef}
      onSubmit={(event) => {
        void form.handleSubmit(onSubmit)(event)
      }}
    >
      <FieldName />
      <FieldNameLocale />
      <FieldShortName />
      <FieldSlug />
      <FieldWebsite />
      <FieldFacets />
      <FieldIsActive />
    </form>
  )
}
