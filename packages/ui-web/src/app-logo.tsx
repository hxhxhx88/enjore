import type { JSX } from 'react'

export function AppLogo({ size, className }: { size: number, className?: string }): JSX.Element {
  return (
    <svg
      className={className}
      fill="none"
      height={size}
      viewBox="0 0 512 512"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* TODO: fill in the real logo */}
      <circle cx="256" cy="256" r="256" fill="white" />
    </svg>
  )
}
