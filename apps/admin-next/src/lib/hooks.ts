import type { UrlObject } from 'node:url'
import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'

export function useHrefWithParameters(): { hrefWithParameters: (parameters: Record<string, string>) => UrlObject } {
  const pathname = usePathname()
  const searchParameters = useSearchParams()

  return {
    hrefWithParameters: useCallback(
      (parameters: Record<string, string>) => {
        const query: Record<string, string> = Object.fromEntries(searchParameters)
        for (const [key, value] of Object.entries(parameters)) {
          query[key] = value
        }

        // A URL object keeps the link compatible with typed routes without asserting the pathname type.
        return { pathname, query }
      },
      [pathname, searchParameters],
    ),
  }
}
