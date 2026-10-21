'use client'

import type { JSX } from 'react'
import { Input } from '@repo/ui-web/primitives/input'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { useHrefWithParameters } from '@/lib/hooks'

interface Props {
  // The query parameter the text is written to, such as `q`.
  readonly name: string
  readonly value: string
  readonly placeholder: string
  readonly className?: string | undefined
}

const debounceMs = 300

// A search box that writes its text into a query parameter after a pause and resets the page. The page renders it
// inside a `Suspense` boundary because it reads the search parameters.
export function FilterSearch({ name, value, placeholder, className }: Props): JSX.Element {
  const router = useRouter()
  const { searchWithParameters } = useHrefWithParameters()
  const [text, setText] = useState(value)
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <Input
      type="search"
      aria-label={placeholder}
      placeholder={placeholder}
      className={className}
      value={text}
      onChange={(event) => {
        const next = event.target.value
        setText(next)
        clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          const trimmed = next.trim()
          router.replace(searchWithParameters({ [name]: trimmed === '' ? undefined : trimmed, page: undefined }), { scroll: false })
        }, debounceMs)
      }}
    />
  )
}
