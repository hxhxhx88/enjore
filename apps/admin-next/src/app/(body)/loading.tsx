import type { JSX } from 'react'
import { LoadingSkeleton } from '@repo/ui-web/loading-skeleton'

export default function Loading(): JSX.Element {
  return (
    <LoadingSkeleton className="max-w-prose" />
  )
}
