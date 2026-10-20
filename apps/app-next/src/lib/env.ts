import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'
import { codeLength } from '@/lib/verification'

export const env = createEnv({
  server: {
    // Public origin of this app, used to build absolute URLs in metadata routes.
    APP_ORIGIN: z.url(),
    DATABASE_URL: z.string().min(1),
    // Sign-in session lifetime; the cookie and the database row expire together.
    SESSION_TTL_DAYS: z.coerce.number().int().positive().default(30),
    // Fixed sign-in code for development; skips sending the email. It must look like a real code.
    DEV_VERIFICATION_PRIVATE_CODE: z.string().length(codeLength).regex(/^\d+$/).optional(),
    // Comma-separated emails that receive the fixed code. When empty, every email receives it.
    DEV_TESTER_EMAILS: z.string().optional(),
    // Lets a request select another database through the `database` cookie. Never enable it in production.
    DEV_ALLOW_DATABASE_SWITCH: z.stringbool().default(false),
    // Comma-separated hosts the switch may point at; `*.example.com` matches any subdomain.
    DEV_DATABASE_SWITCH_HOSTS: z.string().optional(),
  },
  client: {},
  runtimeEnv: {
    APP_ORIGIN: process.env.APP_ORIGIN,
    DATABASE_URL: process.env.DATABASE_URL,
    SESSION_TTL_DAYS: process.env.SESSION_TTL_DAYS,
    DEV_VERIFICATION_PRIVATE_CODE: process.env.DEV_VERIFICATION_PRIVATE_CODE,
    DEV_TESTER_EMAILS: process.env.DEV_TESTER_EMAILS,
    DEV_ALLOW_DATABASE_SWITCH: process.env.DEV_ALLOW_DATABASE_SWITCH,
    DEV_DATABASE_SWITCH_HOSTS: process.env.DEV_DATABASE_SWITCH_HOSTS,
  },
  // `.env.local` keeps unused keys with empty values.
  emptyStringAsUndefined: true,
})
