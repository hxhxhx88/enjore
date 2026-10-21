import type { JSX } from 'react'
import { TableSettings } from '@/components/table-settings'
import { readSettings } from '@/lib/settings'

export default function Page(): JSX.Element {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        Whether each integration and runner secret is configured. Values are never shown; configuration lives in the environment.
      </p>
      <TableSettings rows={readSettings()} />
    </div>
  )
}
