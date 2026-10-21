import { z } from 'zod'

// The tools of the agent endpoint, as logged in `job_tool_calls.tool`. Jobs: claim the next job, extend its lease,
// complete it, fail it. Restaurants: search by name, submit an import entry for resolution, read the context the job
// kind needs. Accolades: add an unverified one to the claimed edition. Draft: write one field of the claimed
// restaurant's draft each. Edition: report counts and notes for the claimed import. The endpoint registers exactly
// these names, so a new tool is a new value here first.
export const jobTools = [
  'claim-job',
  'extend-lease',
  'complete-job',
  'fail-job',
  'search-restaurants',
  'submit-import-entry',
  'read-context',
  'add-accolade',
  'write-canonical-description',
  'write-structured-profile',
  'write-menu',
  'write-summary',
  'write-article',
  'write-poster-brief',
  'write-links',
  'report-edition',
] as const
export const jobToolSchema = z.enum(jobTools)
export type JobTool = (typeof jobTools)[number]
