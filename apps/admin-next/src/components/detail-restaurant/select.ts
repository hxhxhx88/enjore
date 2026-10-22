import type { Prisma } from '@repo/db'

export const selectRestaurantDetail = {
  id: true,
  name: true,
  nameLocale: true,
  slug: true,
  region: true,
  googlePlaceRef: true,
  googlePlacesRefreshedAt: true,
  withdrawnAt: true,
  address: true,
  addressOrigin: true,
  district: true,
  districtOrigin: true,
  latitude: true,
  longitude: true,
  coordinatesOrigin: true,
  phone: true,
  phoneOrigin: true,
  website: true,
  websiteOrigin: true,
  openingHours: true,
  openingHoursOrigin: true,
  businessStatus: true,
  businessStatusOrigin: true,
  chain: {
    select: { id: true, name: true, nameLocale: true, slug: true, _count: { select: { restaurants: true } } },
  },
  // Presence alone says whether the restaurant is published.
  profile: { select: { id: true } },
  _count: { select: { accolades: true, sourceReferences: true } },
} satisfies Prisma.RestaurantSelect

export type RestaurantDetail = Prisma.RestaurantGetPayload<{ select: typeof selectRestaurantDetail }>
export type ChainRow = NonNullable<RestaurantDetail['chain']>

// The chains the picker offers.
export const selectChainOption = {
  id: true,
  name: true,
  nameLocale: true,
  slug: true,
} satisfies Prisma.ChainSelect

export type ChainOption = Prisma.ChainGetPayload<{ select: typeof selectChainOption }>

// The translation rows of one field, as the page loads them.
export const selectTranslationRow = {
  id: true,
  locale: true,
  value: true,
} satisfies Prisma.TranslationSelect
