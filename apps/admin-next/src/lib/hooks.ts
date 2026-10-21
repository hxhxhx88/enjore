import type { UrlObject } from 'node:url'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

// A value of `undefined` removes the key, so a filter change can reset `page`.
type QueryParameters = Record<string, string | undefined>

interface HrefWithParameters {
  hrefWithParameters: (parameters: QueryParameters) => UrlObject
  searchWithParameters: (parameters: QueryParameters) => `?${string}`
}

export function useHrefWithParameters(): HrefWithParameters {
  const pathname = usePathname()
  const searchParameters = useSearchParams()

  const merge = useCallback((parameters: QueryParameters): URLSearchParams => {
    const query = new URLSearchParams(searchParameters)
    for (const [key, value] of Object.entries(parameters)) {
      if (value === undefined) {
        query.delete(key)
      }
      else {
        query.set(key, value)
      }
    }
    return query
  }, [searchParameters])

  return useMemo(() => ({
    // A URL object keeps the link compatible with typed routes without asserting the pathname type.
    hrefWithParameters: parameters => ({ pathname, query: Object.fromEntries(merge(parameters)) }),
    // A query-only href is itself a typed route, so `router.replace` accepts it.
    searchWithParameters: parameters => `?${merge(parameters).toString()}`,
  }), [pathname, merge])
}
