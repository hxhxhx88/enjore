'use client'

import type { JSX } from 'react'
import { businessStatusSchema } from '@repo/lib/schemas/business-status'
import { Badge } from '@repo/ui-web/primitives/badge'
import { Button } from '@repo/ui-web/primitives/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui-web/primitives/dropdown-menu'
import { toast } from '@repo/ui-web/primitives/toast'
import { useMutation } from '@tanstack/react-query'
import { EllipsisIcon } from 'lucide-react'
import { BadgeBusinessStatus } from '@/components/badge-business-status'
import { BadgePublicationState } from '@/components/badge-publication-state'
import { DescriptionItem, DescriptionList } from '@/components/description-list'
import { derivePublicationState } from '@/lib/derive-publication-state'
import { factLabels, regionLabel } from '@/lib/labels'
import { googleMapsLink } from '@/lib/resolver/maps-url'
import { actionRestaurantRefresh } from './action-restaurant-refresh'
import { useProps, useStore } from './context'

export function HeaderRestaurant(): JSX.Element {
  const { restaurant } = useProps()
  const setModalData = useStore(s => s.setModalData)

  const state = derivePublicationState(restaurant)
  const status = restaurant.businessStatus === null ? null : businessStatusSchema.parse(restaurant.businessStatus)
  // A published restaurant that closed is still shown to users until the operator withdraws it.
  const closedWhilePublished = state === 'published' && (status === 'temporarily-closed' || status === 'permanently-closed')
  const mapsLink = restaurant.googlePlaceRef === null ? null : googleMapsLink(restaurant.googlePlaceRef, restaurant.name)

  const refresh = useMutation({
    mutationFn: actionRestaurantRefresh,
    onSuccess(output) {
      switch (output.type) {
        case 'ok': {
          toast.add({
            type: 'success',
            title: 'Refreshed from Places.',
            description: output.changedFields.length === 0
              ? 'Nothing changed.'
              : `Updated: ${output.changedFields.map(fact => factLabels[fact].toLowerCase()).join(', ')}.`,
          })
          break
        }
        case 'bad': {
          toast.add({ type: 'warning', title: output.message })
          break
        }
      }
    },
  })

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold">{restaurant.name}</h1>
        <Badge variant="outline">{restaurant.nameLocale}</Badge>
        <BadgePublicationState state={state} />
        {status !== null && <BadgeBusinessStatus status={status} />}
        {closedWhilePublished && <Badge variant="destructive">Closed while published</Badge>}
        <div className="ml-auto flex items-center gap-2">
          <Button variant="outline" onClick={() => setModalData({ type: 'restaurant-edit' })}>
            Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" size="icon" aria-label="More actions" />}>
              <EllipsisIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                disabled={restaurant.googlePlaceRef === null || refresh.isPending}
                onClick={() => refresh.mutate({ restaurantId: restaurant.id })}
              >
                Refresh from Places
              </DropdownMenuItem>
              {mapsLink !== null && (
                <DropdownMenuItem onClick={() => window.open(mapsLink, '_blank', 'noopener,noreferrer')}>
                  Open in Google Maps
                </DropdownMenuItem>
              )}
              <DropdownMenuItem variant="destructive" onClick={() => setModalData({ type: 'restaurant-delete' })}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <DescriptionList>
        <DescriptionItem term="Slug">
          <code className="font-mono text-xs">{restaurant.slug}</code>
        </DescriptionItem>
        <DescriptionItem term="Region">{regionLabel(restaurant.region)}</DescriptionItem>
        <DescriptionItem term="Google place">
          {restaurant.googlePlaceRef === null ? '–' : <code className="font-mono text-xs">{restaurant.googlePlaceRef}</code>}
        </DescriptionItem>
        <DescriptionItem term="Refreshed from Places">
          {restaurant.googlePlacesRefreshedAt === null ? '–' : restaurant.googlePlacesRefreshedAt.toLocaleString()}
        </DescriptionItem>
        <DescriptionItem term="Counts">
          {`${restaurant._count.accolades} accolades · ${restaurant._count.sourceReferences} source references`}
        </DescriptionItem>
      </DescriptionList>
    </section>
  )
}
