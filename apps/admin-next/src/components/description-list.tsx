import type { JSX, ReactNode } from 'react'
import { cn } from '@repo/ui-web/lib/utils'

interface ListProps {
  readonly className?: string | undefined
  readonly children: ReactNode
}

// A two-column list of labelled values, as detail pages show a record's fields.
export function DescriptionList({ className, children }: ListProps): JSX.Element {
  return <dl className={cn('grid gap-x-6 gap-y-2 text-sm sm:grid-cols-[max-content_1fr]', className)}>{children}</dl>
}

interface ItemProps {
  readonly term: string
  readonly children: ReactNode
}

export function DescriptionItem({ term, children }: ItemProps): JSX.Element {
  return (
    <>
      <dt className="text-muted-foreground">{term}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </>
  )
}
