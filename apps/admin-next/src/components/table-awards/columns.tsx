import type { DataTableColumnDef } from '@repo/ui-web/lib/data-table'
import type { Row } from './select'
import { Badge } from '@repo/ui-web/primitives/badge'
import { Button } from '@repo/ui-web/primitives/button'
import Link from 'next/link'
import { BadgesFacets } from '@/components/badges-facets'
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
            <Button variant="link" nativeButton={false} className="h-auto p-0" render={<Link href={routes.awards.detail(id)} />}>
              {name}
            </Button>
            <span className="text-xs text-muted-foreground">{nameLocale}</span>
          </div>
        )
      },
    },
    {
      id: 'shortName',
      header: 'Short name',
      cell({ row }) {
        return row.original.shortName ?? ''
      },
    },
    {
      id: 'slug',
      header: 'Slug',
      cell({ row }) {
        return <code className="font-mono text-xs">{row.original.slug}</code>
      },
    },
    {
      id: 'facets',
      header: 'Facets',
      cell({ row }) {
        const { hasTier, hasRank, hasLabel, scoreMax } = row.original
        return <BadgesFacets hasTier={hasTier} hasRank={hasRank} hasLabel={hasLabel} scoreMax={scoreMax} />
      },
    },
    {
      id: 'isActive',
      header: 'Active',
      cell({ row }) {
        return row.original.isActive ? <Badge>Active</Badge> : <Badge variant="outline">Inactive</Badge>
      },
    },
    {
      id: 'tiers',
      header: 'Tiers',
      cell({ row }) {
        return row.original._count.tiers
      },
    },
    {
      id: 'editions',
      header: 'Editions',
      cell({ row }) {
        return row.original._count.editions
      },
    },
  ]
}
