# Job queue and agent endpoint

The fifth milestone of the admin in `apps/admin-next`, planned at module level and refined to file level before it starts. It delivers the job queue with attempts and leases, the tool endpoint every runner uses, the edition import through the cloud task, manual mode, the "Jobs" pages and "Run now". It implements "Import an edition" with the agent, "Run agents", "Jobs page" and "Agent interface" of `docs/product/0001-admin-web.md` and the "Automation strategy" of `docs/product/0000-project-overview.md`. It needs milestone 0003 for the import path and the endpoint spike of 0001. It extends `docs/implementation/0003-enrichment-pipeline.md`, where tool inputs, lease timings and the cloud task setup are fixed.

## Goal

- The queue is proven first by manual mode, with no runner at all, and then by the cloud task importing a real edition.
- Every write a runner makes goes through a tool that validates it, scopes it to the claimed job and logs it.

## Scope

- In: the queue module, the endpoint with its tool registry and authentication, the `import-edition` job and its prompt, result schemas, manual mode, the "Jobs" list and detail with "Retry" and "Cancel", "Run now", the cloud task setup, the hourly schedule.
- Out: the seven draft-writing kinds (0006), rendering (0007), the local worker (0008).

## Design

- Queue `src/lib/queue/`: enqueue with a priority by kind (`import-edition` 10, `canonical-description` 20, the derived kinds 30 to 35, `render-poster` 40; the inline kinds `resolve-identity` and `refresh-google-places` are never claimable); claim as one atomic update selected with `FOR UPDATE SKIP LOCKED` over jobs that are unfinished, uncancelled and unleased or expired, ordered by priority and creation, refusing when the leased agent jobs reach `JOB_MAX_ACTIVE` (default 2) and routing by class, so a Claude runner claims agent kinds and the Trigger.dev runner system kinds; the claim creates the attempt with the prompt rendered at that moment; extend; complete, which verifies the attempt and runs the kind's handler in `src/lib/queue/handlers/`; fail; retry, which clears the finish fields and the lease; cancel; `derive-job-status.ts`. Lease defaults: `JOB_LEASE_MINUTES` of 20 for agent kinds and 15 for rendering, extended by every tool call.
- Endpoint: the route from the 0001 spike becomes real. Runners are identified by `RUNNER_SECRET_CLOUD_TASK`, `RUNNER_SECRET_LOCAL_WORKER` and `RUNNER_SECRET_TRIGGER`. The tool registry `src/lib/mcp/tools/` is typed `satisfies Record<JobTool, ToolDefinition>` over `packages/lib/src/schemas/job-tool.ts`, so it can neither miss nor invent a tool; inputs are schemas in `packages/lib/src/schemas/job-tool-input.ts` and results in `packages/lib/src/schemas/job-result.ts`, both new and additive. `claim-job` takes optional kinds, a job id, a session URL and a run reference; every other tool takes the attempt id, which must be the newest attempt of its job, unfinished, within its lease and owned by the calling runner. Writes are scoped to the job's target and kind: a job of one kind can call only its own draft tool; `search-restaurants`, `submit-import-entry`, `add-accolade` and `report-edition` belong to `import-edition`; `read-context` returns what the kind needs and nothing else; `search-restaurants` returns id, name, region and district only.
- One invocation path `src/lib/mcp/invoke.ts`: validates the input, runs the handler, writes the `JobToolCall` row with input, output, error and duration, and extends the lease. The MCP route and manual mode both call it, so the log looks the same whoever ran the job.
- Import job: "Import with agent" on the edition enqueues `import-edition` targeting it, and the edition shows "importing" while the job is unfinished. The agent calls `submit-import-entry` per entry, which is `submit-entry.ts` from 0003 with the attempt's id, and `add-accolade` for a restaurant it found with `search-restaurants`, implemented as a pre-resolved import entry so the edition's counts stay right; `report-edition` carries the total and the notes; the completion handler sets `importedAt` and `foundCount`.
- Prompts `src/lib/prompts/`: templates in code, `import-edition` first, rendered at claim from the edition and the award's facets and including the result format. The generic runner prompt that the routine, "Settings" and the local worker share lives in `packages/lib/src/runner-prompt.ts`.
- Manual mode on a queued job: "Copy prompt" renders the instructions and the result format without claiming; "Paste result" parses the text with the kind's result schema, creates an attempt by the `manual` runner, writes through `invoke.ts` as the tools would, and completes, so the handlers run and the log is identical.
- "Run now": a server action calls the cloud routine's fire endpoint with `CLOUD_TASK_TRIGGER_URL` and `CLOUD_TASK_TRIGGER_SECRET`, reports the per-hour cap as a bad message, and shows the returned session link; the runner passes its session URL on `claim-job` so the attempt links to it. The page explains the hourly schedule and the cap.
- Pages: "Jobs" at `/jobs` with kind, target, status, runner, attempts, created and finished, filtered by kind, status, runner and restaurant, failed jobs flagged; `/jobs/[id]` with payload, rendered prompt, lease, attempts with runner, session link and cost, the tool-call log, result and error, "Retry" and "Cancel". Inline jobs show no runner and no run link. The sidebar gains "Jobs"; the dashboard gains the job counts and the last agent run.
- Cloud task: `.mcp.json` from the spike stays; the routine's saved prompt is the generic runner prompt; it runs hourly, and the fire action serves "Run now". The comment in `packages/lib/src/schemas/job-kind.ts` is adjusted to say system tasks run on the admin server or a Trigger.dev worker.
- Environment: the two new runner secrets, `JOB_LEASE_MINUTES`, `JOB_MAX_ACTIVE`, `CLOUD_TASK_TRIGGER_URL`, `CLOUD_TASK_TRIGGER_SECRET`; "Settings" gains their rows.
- Pipeline spec sections: endpoint and authentication, tool definitions with inputs, outputs and scoping, lease and concurrency, priorities, result formats, prompt list, cloud task setup.

## Work

- Refine this document to file level; then the queue module with tests for status derivation and scoping, the registry, `invoke.ts` and the route.
- The import prompt, the result schema, the import handler, "Import with agent".
- Manual mode, proven on an import job before any runner exists.
- The "Jobs" pages, the sidebar item and the dashboard cards.
- The routine, "Run now" and the schedule; the pipeline spec sections; the `job-kind.ts` comment.

## Done when

- An `import-edition` job completed through "Paste result" shows a `manual` attempt with a tool-call log, and the edition's entries went through the 0003 path.
- The endpoint passes a session with the MCP Inspector, and a request without a token gets 401.
- Acceptance scenario: the MICHELIN Guide Hong Kong Macau 2026 edition imported with the agent has every entry as a restaurant with an unverified accolade and a reference, Macau included; the counts match; "Mark verified" completes; filtering to Hong Kong shows the ones to enrich first.

## Boundaries

- Rate limiting and bot protection for the endpoint belong to the deployment layer, as `docs/development/0000-overview/codebase-boundary.md` says; token checks are the only brake in code.
- No tool verifies, publishes, merges, deletes, edits the published profile or changes a manual value.

## Open questions

- The fire endpoint's URL, authentication and cap are confirmed when the routine exists; until then the button is disabled while the variables are unset.
- Lease lengths and the concurrency limit start at the defaults above and are revisited after the first overnight run.
