import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

// Validated when the delivery module loads, so a misconfigured deployment fails on the first send attempt with a
// clear message instead of a Postmark error.
export const env = createEnv({
  server: {
    // Sender address; must be a verified sender in Postmark.
    EMAIL_SENDER: z.email(),
    POSTMARK_API_KEY: z.string().min(1),
    POSTMARK_MESSAGE_STREAM: z.string().min(1),
  },
  runtimeEnv: process.env,
})
