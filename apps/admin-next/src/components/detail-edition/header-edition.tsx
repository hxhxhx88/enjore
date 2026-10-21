'use client'

import type { JSX } from 'react'
import { Button } from '@repo/ui-web/primitives/button'
import { BadgeImportStatus } from '@/components/badge-import-status'
import { DescriptionItem, DescriptionList } from '@/components/description-list'
import { deriveImportStatus } from '@/lib/derive-import-status'
import { useProps, useStore } from './context'

function formatDate(date: Date | null): string {
  return date === null ? '–' : date.toLocaleString()
}

export function HeaderEdition(): JSX.Element {
  const { edition } = useProps()
  const setModalData = useStore(s => s.setModalData)

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold">{edition.label}</h1>
        <BadgeImportStatus status={deriveImportStatus(edition)} />
        <div className="ml-auto">
          <Button variant="outline" onClick={() => setModalData({ type: 'edition-edit' })}>
            Edit
          </Button>
        </div>
      </div>
      <DescriptionList>
        <DescriptionItem term="Award">{edition.award.name}</DescriptionItem>
        <DescriptionItem term="Year">{edition.year}</DescriptionItem>
        <DescriptionItem term="Region">{edition.region ?? '–'}</DescriptionItem>
        <DescriptionItem term="Source URL">
          {edition.sourceUrl === null
            ? '–'
            : <a href={edition.sourceUrl} target="_blank" rel="noreferrer" className="underline underline-offset-4">{edition.sourceUrl}</a>}
        </DescriptionItem>
        <DescriptionItem term="Expected count">{edition.expectedCount ?? '–'}</DescriptionItem>
        <DescriptionItem term="Found count">
          {edition.foundCount ?? '–'}
          <span className="ml-2 text-muted-foreground">Reported by the import.</span>
        </DescriptionItem>
        <DescriptionItem term="Notes">
          {edition.notes === null ? '–' : <span className="whitespace-pre-wrap">{edition.notes}</span>}
        </DescriptionItem>
        <DescriptionItem term="Imported at">{formatDate(edition.importedAt)}</DescriptionItem>
        <DescriptionItem term="Verified at">{formatDate(edition.verifiedAt)}</DescriptionItem>
      </DescriptionList>
    </section>
  )
}
