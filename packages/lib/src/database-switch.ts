// A development-only switch that lets a request select another database, for example an isolated database per e2e
// test case. The apps read the requested connection string from this cookie when `DEV_ALLOW_DATABASE_SWITCH` is on.
// See `docs/implementation/0002-database-switch.md`.
export const databaseCookieName = 'database'

const protocols = new Set(['postgres:', 'postgresql:'])

// Parses the comma-separated `DEV_DATABASE_SWITCH_HOSTS` value.
export function parseAllowedHosts(value: string | undefined): string[] {
  return (value ?? '').split(',').map(host => host.trim().toLowerCase()).filter(host => host !== '')
}

function isAllowedHost(host: string, allowedHosts: string[]): boolean {
  return allowedHosts.some((allowed) => {
    // `*.example.com` matches any subdomain, but not `example.com` itself.
    if (allowed.startsWith('*.') && allowed.length > 2) {
      return host.endsWith(allowed.slice(1))
    }

    return host === allowed
  })
}

interface ResolveInput {
  // The connection string requested by the client, if any.
  requestedUrl: string | undefined
  defaultUrl: string
  allowedHosts: string[]
}

// Returns the connection string to use. A request that fails a check throws instead of falling back to the default
// database, so a misconfigured test run cannot write into it.
export function resolveDatabaseUrl({ requestedUrl, defaultUrl, allowedHosts }: ResolveInput): string {
  if (requestedUrl === undefined || requestedUrl === '') {
    return defaultUrl
  }

  if (!URL.canParse(requestedUrl)) {
    throw new Error('The requested database URL is not a valid URL.')
  }

  // Error messages never include the URL itself: it carries credentials.
  const { protocol, hostname } = new URL(requestedUrl)
  if (!protocols.has(protocol)) {
    throw new Error('The requested database URL is not a PostgreSQL connection string.')
  }
  if (!isAllowedHost(hostname.toLowerCase(), allowedHosts)) {
    throw new Error(`The requested database host "${hostname}" is not listed in DEV_DATABASE_SWITCH_HOSTS.`)
  }

  return requestedUrl
}
