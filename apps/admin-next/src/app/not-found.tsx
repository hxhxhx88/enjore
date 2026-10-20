import type { JSX } from 'react'
import { Button } from '@repo/ui-web/primitives/button'
import Link from 'next/link'
import { routes } from '@/lib/routes'

export default function NotFound(): JSX.Element {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-medium">Page not found</h1>
      <Button nativeButton={false} render={<Link href={routes.home} />}>Back to home</Button>
    </div>
  )
}
