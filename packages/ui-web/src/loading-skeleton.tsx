import type { HTMLAttributes, JSX } from 'react'
import { cn } from '@repo/ui-web/lib/utils'
import { Skeleton } from './primitives/skeleton'

export function LoadingSkeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-9/12" />
      <Skeleton className="h-4 w-6/12" />
    </div>
  )
}
