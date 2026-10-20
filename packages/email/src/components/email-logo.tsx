import type { JSX } from 'react'

// Emails cannot import from `@repo/ui-web`, so the logo lives here.
// Replace this placeholder with an `<Img>` pointing at a hosted PNG: most email clients do not render inline SVG.
export function EmailLogo({ size }: { size: number }): JSX.Element {
  return (
    <svg
      fill="none"
      height={size}
      viewBox="0 0 512 512"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="256" cy="256" r="256" fill="white" />
    </svg>
  )
}
