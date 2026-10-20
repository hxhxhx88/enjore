import { z } from 'zod'

// What a `Verification` row verifies, stored as JSON in its `payload` column. Add a schema here for a new verification
// type (for example a reset email); the database schema stays the same.
export const verificationPayloadSchemaSignIn = z.object({
  type: z.literal('sign-in'),
  email: z.string(),
})

export const verificationPayloadSchema = z.discriminatedUnion('type', [
  verificationPayloadSchemaSignIn,
])

export type VerificationPayload = z.infer<typeof verificationPayloadSchema>
