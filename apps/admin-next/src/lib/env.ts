import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().min(1),
    ADMIN_BASIC_AUTH_USERNAME: z.string().min(1),
    ADMIN_BASIC_AUTH_PASSWORD: z.string().min(1),
    // Bearer secret Claude presents at `/api/mcp`; the same value is entered once as the request header of the claude.ai
    // custom connector. Mandatory: an admin without it would serve an endpoint no runner can use, so a deployment
    // missing it fails at boot instead.
    RUNNER_SECRET_CLAUDE: z.string().min(1),
    // Server key for Places API (New): resolution, basics and "Refresh from Places". Mandatory like every other
    // variable (`docs/deployment/0005-google-maps.md`).
    GOOGLE_PLACES_API_KEY: z.string().min(1),
    // Lets a request select another database through the `database` cookie. Never enable it in production.
    DEV_ALLOW_DATABASE_SWITCH: z.stringbool().default(false),
    // Comma-separated hosts the switch may point at; `*.example.com` matches any subdomain.
    DEV_DATABASE_SWITCH_HOSTS: z.string().optional(),
  },
  client: {
    // Browser key for the Maps Static API previews, restricted by HTTP referrer, so it may be inlined in the client.
    NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY: z.string().min(1),
  },
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    ADMIN_BASIC_AUTH_USERNAME: process.env.ADMIN_BASIC_AUTH_USERNAME,
    ADMIN_BASIC_AUTH_PASSWORD: process.env.ADMIN_BASIC_AUTH_PASSWORD,
    RUNNER_SECRET_CLAUDE: process.env.RUNNER_SECRET_CLAUDE,
    GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
    NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY,
    DEV_ALLOW_DATABASE_SWITCH: process.env.DEV_ALLOW_DATABASE_SWITCH,
    DEV_DATABASE_SWITCH_HOSTS: process.env.DEV_DATABASE_SWITCH_HOSTS,
  },
  // `.env.local` keeps unused keys with empty values.
  emptyStringAsUndefined: true,
})
