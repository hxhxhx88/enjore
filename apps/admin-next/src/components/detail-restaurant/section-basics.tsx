'use client'

import type { JSX, ReactNode } from 'react'
import type { FactKey, Facts } from '@/lib/facts'
import { Button } from '@repo/ui-web/primitives/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@repo/ui-web/primitives/table'
import { BadgeBusinessStatus } from '@/components/badge-business-status'
import { BadgeFactOrigin } from '@/components/badge-fact-origin'
import { MapStatic } from '@/components/map-static'
import { factKeys, formatCoordinates, readFacts } from '@/lib/facts'
import { factLabels } from '@/lib/labels'
import { formatOpeningHours } from '@/lib/opening-hours-text'
import { useProps, useStore } from './context'

function renderValue(key: FactKey, facts: Facts): ReactNode {
  switch (key) {
    case 'address':
      return facts.address.value ?? '–'
    case 'district':
      return facts.district.value ?? '–'
    case 'phone':
      return facts.phone.value ?? '–'
    case 'website': {
      const { value } = facts.website
      return value === null
        ? '–'
        : <a href={value} target="_blank" rel="noreferrer" className="underline underline-offset-4">{value}</a>
    }
    case 'coordinates': {
      const { value } = facts.coordinates
      return value === null ? '–' : formatCoordinates(value)
    }
    case 'openingHours': {
      const { value } = facts.openingHours
      return value === null ? '–' : <span className="whitespace-pre-line">{formatOpeningHours(value)}</span>
    }
    case 'businessStatus': {
      const { value } = facts.businessStatus
      return value === null ? '–' : <BadgeBusinessStatus status={value} />
    }
  }
}

// The seven Google Places facts with their origins. "Edit" and "Clear" make a fact manual, which a refresh from
// Places then leaves alone.
export function SectionBasics(): JSX.Element {
  const { restaurant } = useProps()
  const setModalData = useStore(s => s.setModalData)
  const facts = readFacts(restaurant)

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-medium">Basics</h2>
      <div className="overflow-hidden border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-40">Fact</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-36">Origin</TableHead>
              <TableHead className="w-40" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {factKeys.map((key) => {
              const { value, origin } = facts[key]
              return (
                <TableRow key={key}>
                  <TableCell className="align-top">{factLabels[key]}</TableCell>
                  <TableCell className="align-top break-words">{renderValue(key, facts)}</TableCell>
                  <TableCell className="align-top">
                    <BadgeFactOrigin origin={origin} />
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" onClick={() => setModalData({ type: 'fact-edit', fact: key })}>
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" disabled={value === null} onClick={() => setModalData({ type: 'fact-clear', fact: key })}>
                        Clear
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      {facts.coordinates.value !== null && (
        <MapStatic latitude={facts.coordinates.value.latitude} longitude={facts.coordinates.value.longitude} />
      )}
    </section>
  )
}
