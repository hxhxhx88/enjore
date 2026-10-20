import type { ComponentProps, JSX } from 'react'
import { LoadingWrapper } from './loading-wrapper'
import { Button } from './primitives/button'

interface Props extends ComponentProps<typeof Button> {
  isLoading?: boolean
}

export function LoadingButton({ className, children, disabled, isLoading = false, ref, ...props }: Props): JSX.Element {
  return (
    <LoadingWrapper isLoading={isLoading} className="inline-block">
      <Button ref={ref} className={className} disabled={isLoading || disabled} {...props}>
        {children}
      </Button>
    </LoadingWrapper>
  )
}
