# Hardening

The eighth milestone, planned at module level. The refresh from Places runs on a schedule, a local worker on the operator's machine drains the queue as an alternative runner, and usage is reported. It implements the "Hardening" milestone of `docs/product/0001-admin-web.md` and the parts of "Edit basics and links" and "Run agents" that remained manual. It needs milestone 0007.

## Goal

- The data stays fresh and the operator knows what the factory costs and where it fails, without opening every page.

## Scope

- In: the periodic refresh decision and its implementation, batch "Refresh from Places", the local worker command, usage reporting, the orphan cleanup in R2.
- Out: link resolvers (0009).

## Design

- Periodic refresh: the admin has three entry points, page renders, server actions and the endpoint, and nobody enqueues refresh jobs on a timer. Two designs fit the codebase and this milestone picks one. The first is a new tool value, callable by the Trigger.dev runner only, that enqueues one `refresh-google-places` job per restaurant whose `googlePlacesRefreshedAt` is older than the threshold, after which the same scheduled run drains them through `claim-job`, the Places client and `complete-job`, with a completion handler that applies the facts under the origin rules. The second is a cron route on the admin, which is a second route-handler exception. Until the decision lands, the stale-basics filter from 0002 and a batch "Refresh from Places" from the list cover the need.
- Local worker: `apps/cli-bun/src/actions/worker/` loops headless Claude Code with `.mcp.json` and `RUNNER_SECRET_LOCAL_WORKER`, following the generic runner prompt, and stops when the session reports an empty queue or after a configured number of cycles. The jobs page shows `local-worker` as the runner of its attempts.
- Usage reporting: the dashboard gains cost per period from `costUsd`, jobs per runner, the failure rate, and a card for published restaurants whose business status turned closed; "Settings" shows when the cloud task last ran.
- Orphan cleanup: a command in `apps/cli-bun` lists the objects in R2 without a `PosterArtwork` row and removes them after confirmation.

## Work

- Refine this document to file level; decide the refresh mechanism and record it in the pipeline spec.
- The local worker command; the reporting cards; the cleanup command.

## Done when

- The local worker drains a queue with runner `local-worker` and its attempts show on the jobs page.
- Refresh runs on its schedule, or the batch action is documented as the v1 answer.
- The dashboard shows last month's cost and the failure rate.

## Boundaries

- Multiple operators, roles and an audit interface beyond the job logs stay out of v1.
