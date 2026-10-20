import type { JSX } from 'react'
import { colors } from '@repo/email/lib/colors'

export function CodeDisplay({ code }: { code: string }): JSX.Element {
  return (
    <code
      style={{
        backgroundColor: colors.primary,
        color: colors.primaryForeground,
        borderRadius: '3px',
        fontWeight: '600',
        fontSize: '24px',
        textAlign: 'center',
        display: 'block',
        padding: 12,
      }}
    >
      {code}
    </code>
  )
}
