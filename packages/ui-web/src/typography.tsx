import type { HTMLAttributes, JSX } from 'react'
import { cn } from './lib/utils'

export function H1({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>): JSX.Element {
  return <h1 className={cn('text-4xl font-extrabold tracking-tight', className)} {...props}>{children}</h1>
}

export function H2({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>): JSX.Element {
  return <h2 className={cn('text-3xl font-semibold tracking-tight', className)} {...props}>{children}</h2>
}

export function H3({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>): JSX.Element {
  return <h3 className={cn('text-2xl font-semibold tracking-tight', className)} {...props}>{children}</h3>
}

export function H4({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>): JSX.Element {
  return <h4 className={cn('text-xl font-semibold tracking-tight', className)} {...props}>{children}</h4>
}
