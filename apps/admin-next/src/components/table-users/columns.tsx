import type { DataTableColumnDef } from '@repo/ui-web/lib/data-table'
import type { Row } from './utils'
import { InlineButton } from '@repo/ui-web/inline-button'
import Link from 'next/link'
import { routes } from '@/lib/routes'

export function makeColumns(): Array<DataTableColumnDef<Row>> {
  return [
    {
      id: 'title',
      header: 'Title',
      cell({ row }) {
        const { id, email } = row.original
        return (
          <Link href={routes.users.detail(id)}>
            <InlineButton>{email}</InlineButton>
          </Link>
        )
      },
    },
    {
      id: 'createdAt',
      header: 'Created at',
      cell({ row }) {
        const { createdAt } = row.original
        return createdAt.toLocaleString()
      },
    },
  ]
}
