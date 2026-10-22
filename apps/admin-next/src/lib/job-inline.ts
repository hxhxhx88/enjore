import type { Prisma, Tx } from '@repo/db'
import type { JobKind } from '@repo/lib/schemas/job-kind'

// Inline system tasks, such as a refresh from Places, run inside the server and are recorded afterwards as finished
// jobs with no attempt, so the jobs page of milestone 0005 lists them beside the queued work. The queue's priority
// numbers arrive with 0005; a finished job is never claimed, so its priority only has to be a value.
const inlineJobPriority = 0

interface InlineJob {
  kind: JobKind
  restaurantId: string
  outcome: { result: Prisma.InputJsonValue } | { error: string }
}

export async function recordInlineJob(tx: Tx, { kind, restaurantId, outcome }: InlineJob): Promise<void> {
  await tx.job.create({
    data: {
      kind,
      priority: inlineJobPriority,
      payload: {},
      restaurantId,
      finishedAt: new Date(),
      ...('result' in outcome ? { result: outcome.result } : { error: outcome.error }),
    },
  })
}
