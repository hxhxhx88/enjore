'use client'

import type { JSX } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@repo/ui-web/primitives/select'
import { useRouter } from 'next/navigation'
import { useHrefWithParameters } from '@/lib/hooks'

interface Option {
  readonly value: string
  readonly label: string
}

interface Props {
  // The query parameter the choice is written to, such as `active`.
  readonly name: string
  // The current choice as the page parsed it; undefined stands for every value.
  readonly value: string | undefined
  readonly options: ReadonlyArray<Option>
  // The label of the choice that stands for every value, such as "All awards".
  readonly allLabel: string
  readonly className?: string | undefined
}

// A select that writes its choice into a query parameter and resets the page. The page renders it inside a `Suspense`
// boundary because it reads the search parameters.
export function FilterSelect({ name, value, options, allLabel, className }: Props): JSX.Element {
  const router = useRouter()
  const { searchWithParameters } = useHrefWithParameters()

  // Base UI represents "no selection" as `null`, which here stands for every value.
  const items = [{ value: null, label: allLabel }, ...options.map(option => ({ value: option.value, label: option.label }))]

  return (
    <Select
      items={items}
      value={value ?? null}
      onValueChange={(next) => {
        router.replace(searchWithParameters({ [name]: next ?? undefined, page: undefined }), { scroll: false })
      }}
    >
      <SelectTrigger className={className} aria-label={allLabel}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={null}>{allLabel}</SelectItem>
        {options.map(option => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
