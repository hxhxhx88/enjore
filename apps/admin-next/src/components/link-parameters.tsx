'use client'

import type { ComponentProps, JSX, ReactNode } from 'react'
import Link from 'next/link'
import { useHrefWithParameters } from '@/lib/hooks'

interface Props extends Omit<ComponentProps<typeof Link>, 'href'> {
  parameters: Record<string, string>
  children: ReactNode
}

export function LinkParameters({ parameters, children, ...props }: Props): JSX.Element {
  const { hrefWithParameters } = useHrefWithParameters()
  const href = hrefWithParameters(parameters)

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  )
}
