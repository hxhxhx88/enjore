'use client'

import type { JSX } from 'react'
import type { Row } from './utils'
import { DataTable } from '@repo/ui-web/data-table'
import { useMemo } from 'react'
import { makeColumns } from './columns'

interface Props {
  rows: Row[]
  className?: string
}

export function TableUsers({ rows, className }: Props): JSX.Element {
  // Column definitions must keep a stable identity between renders.
  const columns = useMemo(() => makeColumns(), [])
  return <DataTable columns={columns} data={rows} className={className} emptyContent="No users." />
}
