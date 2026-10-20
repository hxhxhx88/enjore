import type { LucideProps } from 'lucide-react'
import type { ButtonHTMLAttributes, ComponentType, JSX } from 'react'
import { cn } from './lib/utils'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly icon?: ComponentType<LucideProps>
}

export function InlineButton({ className, icon: Icon, children, ...props }: Props): JSX.Element {
  return (
    <button
      type="button"
      className={cn(
        'text-primary disabled:text-muted-foreground/75 hover:border-primary cursor-pointer border-b border-transparent text-start transition-all disabled:cursor-not-allowed',
        Icon && 'flex items-center gap-1',
        className,
      )}
      {...props}
    >
      {children}
      {Icon ? <Icon className="h-4 w-4" /> : null}
    </button>
  )
}
