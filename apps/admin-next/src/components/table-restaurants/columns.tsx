import type { DataTableColumnDef } from '@repo/ui-web/lib/data-table'
import type { Row } from './select'
import { businessStatusSchema } from '@repo/lib/schemas/business-status'
import { Badge } from '@repo/ui-web/primitives/badge'
import { Button } from '@repo/ui-web/primitives/button'
import Link from 'next/link'
import { BadgeBusinessStatus } from '@/components/badge-business-status'
import { BadgePublicationState } from '@/components/badge-publication-state'
import { derivePublicationState } from '@/lib/derive-publication-state'
import { regionLabel } from '@/lib/labels'
import { routes } from '@/lib/routes'

export function makeColumns(): Array<DataTableColumnDef<Row>> {
  return [
    {
      id: 'name',
      header: 'Name',
      cell({ row }) {
        const { id, name, nameLocale } = row.original
        return (
          <div className="flex flex-col items-start">
            <Button variant="link" nativeButton={false} className="h-auto p-0" render={<Link href={routes.restaurants.detail(id)} />}>
              {name}
            </Button>
            <span className="text-xs text-muted-foreground">{nameLocale}</span>
          </div>
        )
      },
    },
    {
      id: 'region',
      header: 'Region',
      cell({ row }) {
        return regionLabel(row.original.region)
      },
    },
    {
      id: 'district',
      header: 'District',
      cell({ row }) {
        return row.original.district ?? ''
      },
    },
    {
      id: 'chain',
      header: 'Chain',
      cell({ row }) {
        return row.original.chain?.name ?? ''
      },
    },
    {
      id: 'state',
      header: 'State',
      cell({ row }) {
        return <BadgePublicationState state={derivePublicationState(row.original)} />
      },
    },
    {
      id: 'status',
      header: 'Business status',
      cell({ row }) {
        const { businessStatus } = row.original
        return businessStatus === null ? '' : <BadgeBusinessStatus status={businessStatusSchema.parse(businessStatus)} />
      },
    },
    {
      id: 'flags',
      header: 'Flags',
      cell({ row }) {
        const { businessStatus } = row.original
        // A published restaurant that closed is still shown to users until the operator withdraws it.
        const closedWhilePublished = derivePublicationState(row.original) === 'published'
          && (businessStatus === 'temporarily-closed' || businessStatus === 'permanently-closed')
        return closedWhilePublished ? <Badge variant="destructive">Closed while published</Badge> : ''
      },
    },
  ]
}
