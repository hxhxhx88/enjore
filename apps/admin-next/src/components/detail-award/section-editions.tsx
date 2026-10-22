'use client'

import type { JSX } from 'react'
import { Button } from '@repo/ui-web/primitives/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui-web/primitives/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui-web/primitives/table'
import { EllipsisIcon } from 'lucide-react'
import Link from 'next/link'
import { BadgeImportStatus } from '@/components/badge-import-status'
import { deriveImportStatus } from '@/lib/derive-import-status'
import { routes } from '@/lib/routes'
import { useProps, useStore } from './context'

export function SectionEditions(): JSX.Element {
  const { award } = useProps()
  const setModalData = useStore(s => s.setModalData)

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Editions</h2>
        <Button variant="outline" onClick={() => setModalData({ type: 'edition-add' })}>
          Add edition
        </Button>
      </div>
      <div className="overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Expected</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {award.editions.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-16 text-center text-muted-foreground">
                      No editions yet.
                    </TableCell>
                  </TableRow>
                )
              : award.editions.map(edition => (
                  <TableRow key={edition.id}>
                    <TableCell>
                      <Button
                        variant="link"
                        nativeButton={false}
                        className="h-auto p-0"
                        render={<Link href={routes.awards.edition(award.id, edition.id)} />}
                      >
                        {edition.label}
                      </Button>
                    </TableCell>
                    <TableCell>{edition.year}</TableCell>
                    <TableCell>{edition.region ?? '–'}</TableCell>
                    <TableCell>{edition.expectedCount ?? '–'}</TableCell>
                    <TableCell>
                      <BadgeImportStatus status={deriveImportStatus(edition)} />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`Actions for ${edition.label}`} />}>
                          <EllipsisIcon />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setModalData({ type: 'edition-edit', edition })}>Edit</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}
