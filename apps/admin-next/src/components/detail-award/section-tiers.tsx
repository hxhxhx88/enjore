'use client'

import type { JSX } from 'react'
import { Mark } from '@repo/ui-web/mark'
import { Button } from '@repo/ui-web/primitives/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui-web/primitives/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui-web/primitives/table'
import { EllipsisIcon } from 'lucide-react'
import { useProps, useStore } from './context'

export function SectionTiers(): JSX.Element {
  const { award } = useProps()
  const setModalData = useStore(s => s.setModalData)

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Tiers</h2>
        <Button variant="outline" onClick={() => setModalData({ type: 'tier-add' })}>
          Add tier
        </Button>
      </div>
      <div className="overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mark</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Glyph key</TableHead>
              <TableHead>Count</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {award.tiers.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-16 text-center text-muted-foreground">
                      No tiers yet.
                    </TableCell>
                  </TableRow>
                )
              : award.tiers.map(tier => (
                  <TableRow key={tier.id}>
                    <TableCell>
                      <Mark glyphKey={tier.glyphKey} count={tier.glyphCount} className="text-lg" />
                    </TableCell>
                    <TableCell>{tier.name}</TableCell>
                    <TableCell>{tier.level}</TableCell>
                    <TableCell>
                      <code className="font-mono text-xs">{tier.glyphKey}</code>
                    </TableCell>
                    <TableCell>{tier.glyphCount}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger render={<Button variant="ghost" size="icon" aria-label={`Actions for ${tier.name}`} />}>
                          <EllipsisIcon />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setModalData({ type: 'tier-edit', tier })}>Edit</DropdownMenuItem>
                          <DropdownMenuItem variant="destructive" onClick={() => setModalData({ type: 'tier-delete', tier })}>
                            Delete
                          </DropdownMenuItem>
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
