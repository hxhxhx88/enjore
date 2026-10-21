'use client'

import type { JSX, RefObject } from 'react'
import type { FormType } from './schema'
import { cn } from '@repo/ui-web/lib/utils'
import { FieldGlyphCount } from './field-glyph-count'
import { FieldGlyphKey } from './field-glyph-key'
import { FieldLevel } from './field-level'
import { FieldName } from './field-name'
import { useFormAwardTier } from './hooks'
import { PreviewMark } from './preview-mark'

interface Props {
  readonly className?: string | undefined
  readonly formRef?: RefObject<HTMLFormElement | null>
  readonly onSubmit: (form: FormType) => void
}

export function Form({ className, formRef, onSubmit }: Props): JSX.Element {
  const form = useFormAwardTier()

  return (
    <form
      className={cn('flex flex-col gap-5', className)}
      ref={formRef}
      onSubmit={(event) => {
        void form.handleSubmit(onSubmit)(event)
      }}
    >
      <FieldName />
      <FieldLevel />
      <div className="grid gap-5 sm:grid-cols-2">
        <FieldGlyphKey />
        <FieldGlyphCount />
      </div>
      <PreviewMark />
    </form>
  )
}
