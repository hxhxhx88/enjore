import { z } from 'zod'

// The lifecycle of a job, derived from the `jobs` row rather than stored: cancelled when `cancelledAt` is set, else
// failed when `finishedAt` is set with an error, else succeeded when `finishedAt` is set, else running while
// `leaseExpiresAt` is in the future, else queued. A queued job is claimable, which includes a job whose lease expired.
// Cancel marks a job cancelled at once, and a runner's late result is then rejected; retry clears the finish fields
// and the lease of a failed job.
export const jobStatuses = ['queued', 'running', 'succeeded', 'failed', 'cancelled'] as const
export const jobStatusSchema = z.enum(jobStatuses)
export type JobStatus = (typeof jobStatuses)[number]
