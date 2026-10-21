'use client'

import type { DataTableColumnDef } from '@repo/ui-web/lib/data-table'
import type { JSX } from 'react'
import { DataTable } from '@repo/ui-web/data-table'
import { Badge } from '@repo/ui-web/primitives/badge'
import { useMemo } from 'react'

// Declared here rather than imported from `@/lib/settings`, which is server-only.
interface Row {
  readonly name: string
  readonly variables: readonly string[]
  readonly configured: boolean
}

function makeColumns(): Array<DataTableColumnDef<Row>> {
  return [
    {
      id: 'name',
      header: 'Integration',
      cell({ row }) {
        return row.original.name
      },
    },
    {
      id: 'variables',
      header: 'Variables',
      cell({ row }) {
        return (
          <span className="flex flex-wrap gap-1">
            {row.original.variables.map(variable => (
              <code key={variable} className="font-mono text-xs">{variable}</code>
            ))}
          </span>
        )
      },
    },
    {
      id: 'configured',
      header: 'Status',
      cell({ row }) {
        return row.original.configured ? <Badge>Configured</Badge> : <Badge variant="outline">Not configured</Badge>
      },
    },
  ]
}

interface Props {
  readonly rows: Row[]
  readonly className?: string | undefined
}

export function TableSettings({ rows, className }: Props): JSX.Element {
  const columns = useMemo(() => makeColumns(), [])
  return <DataTable columns={columns} data={rows} className={className} emptyContent="Nothing to configure." />
}
