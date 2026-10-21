import { z } from 'zod'

// Who ran a job attempt (`job_attempts.runner`). The cloud task is the Claude Code scheduled task on the owner's
// subscription, the local worker loops headless Claude Code on the owner's machine, and Trigger.dev runs the system
// tasks. Each of those three authenticates with its own secret from the environment. The manual runner is the
// operator pasting a result for a copied prompt; it has no secret because Basic Auth already covers the operator.
export const runners = ['cloud-task', 'local-worker', 'trigger', 'manual'] as const
export const runnerSchema = z.enum(runners)
export type Runner = (typeof runners)[number]
