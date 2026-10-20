import type { Route } from 'next'

// Literal types keep these compatible with Next.js typed routes.
export const routes = {
  home: '/',
  users: {
    list: '/users',
    detail: (id: string): Route<`/users/${string}`> => `/users/${id}`,
  },
} as const
