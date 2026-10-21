import type { Route } from 'next'
import type { JSX, ReactNode } from 'react'
import { Button } from '@repo/ui-web/primitives/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui-web/primitives/card'
import Link from 'next/link'

interface Props {
  readonly title: string
  readonly value: number
  readonly description?: string | undefined
  readonly href?: Route | undefined
  readonly children?: ReactNode
}

// A dashboard card: one number, an optional note, optional detail and an optional link to the list behind it.
export function CardStat({ title, value, description, href, children }: Props): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description !== undefined && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums">{value}</p>
        {children}
        {href !== undefined && (
          <Button variant="link" nativeButton={false} className="h-auto w-fit p-0" render={<Link href={href} />}>
            View all
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
