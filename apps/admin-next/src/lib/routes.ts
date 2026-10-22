import type { Route } from 'next'

// Literal types keep these compatible with Next.js typed routes. A route is added here once its page exists, which
// is also when its sidebar link appears.
export const routes = {
  home: '/',
  awards: {
    list: '/awards',
    detail: (id: string): Route<`/awards/${string}`> => `/awards/${id}`,
    edition: (awardId: string, editionId: string): Route<`/awards/${string}/editions/${string}`> =>
      `/awards/${awardId}/editions/${editionId}`,
  },
} as const
