import { z } from 'zod'

// Who ran a job attempt (`job_attempts.runner`). `claude` is Claude on the owner's subscription reaching the endpoint
// through the claude.ai custom connector, from a chat, a scheduled task or a Claude Code session; the local worker loops
// headless Claude Code on the owner's machine, and Trigger.dev runs the system tasks. Each of those three authenticates
// with its own secret from the environment. The manual runner is the operator pasting a result for a copied prompt; it
// has no secret because Basic Auth already covers the operator.
export const runners = ['claude', 'local-worker', 'trigger', 'manual'] as const
export const runnerSchema = z.enum(runners)
export type Runner = (typeof runners)[number]
