import { env } from '@repo/db/lib/env'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  datasource: {
    url: env.DATABASE_URL,
  },
})
