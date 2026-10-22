'use client'

import type { JSX } from 'react'
import type { Row } from './select'
import { DataTable } from '@repo/ui-web/data-table'
import { useMemo } from 'react'
import { makeColumns } from './columns'

interface Props {
  readonly rows: Row[]
  readonly className?: string | undefined
}

export function Table({ rows, className }: Props): JSX.Element {
  const columns = useMemo(() => makeColumns(), [])
  return <DataTable columns={columns} data={rows} className={className} emptyContent="No restaurants." />
}
