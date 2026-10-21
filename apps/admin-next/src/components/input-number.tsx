'use client'

import type { ComponentProps, JSX } from 'react'
import { Input } from '@repo/ui-web/primitives/input'
import { useState } from 'react'

interface Props extends Omit<ComponentProps<typeof Input>, 'value' | 'defaultValue' | 'onChange' | 'type'> {
  readonly value: number | null
  readonly onValueChange: (value: number | null) => void
}

// A number input whose form value is a number or null. The text is kept locally so partial input such as `97.`
// survives a re-render; an empty text emits null. When the form value changes from outside, the text follows it.
export function InputNumber({ value, onValueChange, ...props }: Props): JSX.Element {
  const [text, setText] = useState(value === null ? '' : String(value))

  const parsed = text.trim() === '' ? null : Number(text)
  const shown = parsed === value ? text : (value === null ? '' : String(value))

  return (
    <Input
      {...props}
      type="number"
      inputMode="decimal"
      value={shown}
      onChange={(event) => {
        const next = event.target.value
        setText(next)
        const n = next.trim() === '' ? null : Number(next)
        onValueChange(n === null || Number.isNaN(n) ? null : n)
      }}
    />
  )
}
