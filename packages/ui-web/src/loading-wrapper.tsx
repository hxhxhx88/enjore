import type { JSX, ReactNode } from 'react'
import { cn } from './lib/utils'
import { Spinner } from './primitives/spinner'

interface Props {
  children: ReactNode
  isLoading?: boolean
  className?: string
}

export function LoadingWrapper({ children, isLoading, className }: Props): JSX.Element {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading
        ? (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Spinner />
            </div>
          )
        : null}
    </div>
  )
}
