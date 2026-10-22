# Poster rendering

The seventh milestone, planned at module level. `render-poster` runs on a Trigger.dev worker that calls the OpenAI image API, stores the originals in R2 and reports through the same endpoint as the agents; "Regenerate artwork" takes notes; "Regenerate posters" and "Publish" run in batch. It implements the rendering part of "Posters" and the batch part of "Enrich in batch" of `docs/product/0001-admin-web.md` and the "Poster" and "System tasks" sections of `docs/product/0000-project-overview.md`. It needs milestone 0006 and adds the app `apps/worker-trigger`.

## Goal

- A new brief produces a round of variants without the operator, and a poster that feels wrong is regenerated from a sentence of notes.

## Scope

- In: the worker app and its render task, the wake-up from the admin, the completion handler, cost on the attempt, the run link, "Regenerate artwork", batch "Regenerate posters" and "Publish".
- Out: periodic refresh and the local worker (0008).

## Design

- Worker `apps/worker-trigger`: a Trigger.dev project that depends on `@repo/lib` only, so it cannot reach the database; `trigger.config.ts`, `src/lib/env.ts` on `@t3-oss/env-core` (`ADMIN_MCP_URL`, `RUNNER_SECRET_TRIGGER`, `OPENAI_API_KEY`, the image model and its unit cost, the R2 variables), `src/lib/mcp-client.ts` (the MCP client over Streamable HTTP with the bearer header and typed wrappers per tool), `src/lib/openai-images.ts`, `src/lib/r2.ts` and `src/trigger/render-poster.ts`. The task sets `maxAttempts` to 1: retries belong to the queue, and "Retry" on the job re-enqueues and wakes the worker again.
- Run flow: `claim-job` with the job id and the run reference, `read-context` for the brief, the notes and the variant count, one render per variant at the highest quality settings, a crop to 16:9 when the model offers no such size (the house-style brief asks for compositions that survive it), an upload per variant under `posters/<restaurantId>/<artworkId>.png`, `extend-lease` between variants, and `complete-job` with the variants (URL, width, height), the brief used and the cost; with no variant produced, `fail-job`.
- Wake-up: when a `render-poster` job is enqueued (brief completion, "Regenerate artwork", the batch), the admin triggers the task with `@trigger.dev/sdk` and an idempotency key of job and attempt count. `TRIGGER_SECRET_KEY`, `TRIGGER_PROJECT_REF` and `RUNNER_SECRET_TRIGGER` are mandatory once this milestone lands, like every variable, and the runner joins the map in `src/app/api/mcp/route.ts`. The job detail links to the run and shows its status.
- Completion handler for `render-poster`: validates the result with `packages/lib/src/schemas/job-result.ts`, creates one `PosterArtwork` per variant linked to the attempt with the brief, and records `costUsd` on the attempt; the variants appear in the "Posters" section with their origin.
- "Regenerate artwork" with notes enqueues `render-poster` with the notes against the current brief. "Regenerate brief" flows through 0006 and, unless the operator chooses to review the brief first, rendering follows automatically.
- Batch "Regenerate posters" enqueues rendering per selected restaurant, and `poster-brief` with rendering for those without a brief; batch "Publish" runs the checklist per restaurant and reports which were skipped and why.
- Repo plumbing: `tasks/worker.yaml` with dev and deploy commands, included from `taskfile.yaml`, `knip.json` and `turbo.json` entries, and `docs/deployment/0006-trigger-dev.md` for the project, its environment and the deploy step.
- Pipeline spec sections: the render task's contract, the result format, image sizes and the crop, the storage keys, cost recording.

## Work

- Refine this document to file level; then the worker app, the MCP client and the render task; deploy to Trigger.dev.
- The wake-up, the handler, the run link and the cost on the job detail.
- "Regenerate artwork", the batch actions, the deployment document, the pipeline spec sections.

## Done when

- Acceptance scenario: ten restaurants enriched overnight have poster variants waiting for review, and the jobs page lists what failed.
- Acceptance scenario: "warmer light, show the counter, less crowded" with "Regenerate artwork" produces a new round of variants, and the best one is selected.
- Each attempt records its cost.

## Boundaries

- The worker never touches the database; it holds the OpenAI and R2 credentials and a runner secret, nothing else.
- Text in artwork is kept out by the brief and the operator's choice; there is no automated check.

## Open questions

- The image model's sizes: the PRD asks for native 16:9; if the chosen model renders 3:2, the worker crops. Decided when the worker is built, with the model named in the pipeline spec.
