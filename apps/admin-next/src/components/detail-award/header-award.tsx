'use client'

import type { JSX } from 'react'
import { Badge } from '@repo/ui-web/primitives/badge'
import { Button } from '@repo/ui-web/primitives/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui-web/primitives/dropdown-menu'
import { EllipsisIcon } from 'lucide-react'
import { BadgesFacets } from '@/components/badges-facets'
import { DescriptionItem, DescriptionList } from '@/components/description-list'
import { useProps, useStore } from './context'

export function HeaderAward(): JSX.Element {
  const { award, accoladeCount } = useProps()
  const setModalData = useStore(s => s.setModalData)

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold">{award.name}</h1>
        {award.isActive ? <Badge>Active</Badge> : <Badge variant="outline">Inactive</Badge>}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={() => setModalData({ type: 'award-edit' })}>
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="More actions" />}>
              <EllipsisIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setModalData({ type: 'award-active', isActive: !award.isActive })}>
                {award.isActive ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => setModalData({ type: 'award-delete' })}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <DescriptionList>
        <DescriptionItem term="Name language">{award.nameLocale}</DescriptionItem>
        <DescriptionItem term="Short name">{award.shortName ?? '–'}</DescriptionItem>
        <DescriptionItem term="Slug">
          <code className="font-mono text-xs">{award.slug}</code>
        </DescriptionItem>
        <DescriptionItem term="Website">
          {award.website === null
            ? '–'
            : <a href={award.website} target="_blank" rel="noreferrer" className="underline underline-offset-4">{award.website}</a>}
        </DescriptionItem>
        <DescriptionItem term="Facets">
          <BadgesFacets hasTier={award.hasTier} hasRank={award.hasRank} hasLabel={award.hasLabel} scoreMax={award.scoreMax} />
        </DescriptionItem>
        {award.scoreMax !== null && <DescriptionItem term="Maximum score">{award.scoreMax}</DescriptionItem>}
        <DescriptionItem term="Counts">
          {`${award.tiers.length} tiers · ${award.editions.length} editions · ${accoladeCount} accolades`}
        </DescriptionItem>
      </DescriptionList>
    </section>
  )
}
