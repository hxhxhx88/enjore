import { z } from 'zod'

// The lifecycle of a job (`jobs.status`). A queued job is claimable, and so is a running one whose lease expired. The
// other three are final: cancel marks a queued or running job cancelled at once, and a runner's late result is then
// rejected; retry re-queues a failed job.
export const jobStatuses = ['queued', 'running', 'succeeded', 'failed', 'cancelled'] as const
export const jobStatusSchema = z.enum(jobStatuses)
export type JobStatus = (typeof jobStatuses)[number]
