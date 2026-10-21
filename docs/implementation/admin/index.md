# Admin implementation roadmap

This folder plans the implementation of the admin web in `apps/admin-next`. The product contract is `docs/product/0001-admin-web.md`, with the domain in `docs/product/0000-project-overview.md`; the schema in `packages/db/prisma/schema.prisma` and the shared schemas in `packages/lib/src/schemas/` are in place. This index fixes the order, the rules every milestone follows and the status; each `000N-*.md` is the plan of one milestone as it was planned, and is refined to file level before the milestone starts. Technical rules that runners depend on, such as tool definitions, lease timings, storage layout and environment variables, are not fixed here but in `docs/implementation/0003-enrichment-pipeline.md`, which milestone 0004 creates and milestones 0005 to 0009 extend.

## Milestones

| Doc                                    | PRD milestone      | Delivers                                                                                                                                                                                    | Depends on           | Status      |
| -------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------- | ----------- |
| `0001-shell-and-awards.md`             | Factory, manual    | Users pages removed; shell, routes and the patterns later milestones copy; "Settings" and "Dashboard" skeletons; awards, tiers with the marks registry, editions; seeds; the endpoint spike | none                 | Done        |
| `0002-restaurants-and-resolution.md`   | Factory, manual    | Google Places client; resolver; "Add restaurant"; chains; basics with origins and "Refresh from Places"; name translations with "Make canonical"; list with search and filters; delete      | 0001                 | Not started |
| `0003-accolades-and-editions.md`       | Factory, manual    | Accolades; the edition page; "Paste a list"; unresolved entries; "Mark verified"; duplicates and merge                                                                                      | 0002                 | Not started |
| `0004-profile-and-publishing.md`       | Factory, manual    | Draft and published editors; poster upload with crop and selection; object storage; checklist; publish, discard, withdraw                                                                   | 0003                 | Not started |
| `0005-job-queue-and-agent-endpoint.md` | Agents, import     | Queue with attempts and leases; the tool endpoint and runner secrets; the import job; manual mode; "Jobs" pages; "Run now"; the cloud task                                                  | 0003, the 0001 spike | Not started |
| `0006-enrichment-jobs.md`              | Agents, enrichment | Seven draft-writing jobs; chaining; fill-empty; "Generate" and "Regenerate" per field; batch "Enrich"; the complete dashboard                                                               | 0004, 0005           | Not started |
| `0007-poster-rendering.md`             | Posters, automated | `apps/worker-trigger`; OpenAI rendering into R2; "Regenerate artwork"; batch "Regenerate posters" and "Publish"                                                                             | 0006                 | Not started |
| `0008-hardening.md`                    | Hardening          | Periodic refresh; local worker; usage reporting                                                                                                                                             | 0007                 | Not started |
| `0009-link-resolvers.md`               | Link resolvers     | Dianping, OpenRice, Apple Maps, one step each                                                                                                                                               | 0006                 | Not started |

## Order

- The PRD's six milestones remain the contract. "Factory, manual" is split in four shippable slices because it is most of the user interface, and "duplicates and merge" moves into it because pasted lists already create duplicates.
- Manual before automatic: the resolver is built for "Add restaurant" (0002), reused by "Paste a list" (0003) and by the agent's tool (0005); every profile field is editable by hand (0004) before any job writes it (0006).
- The queue is proven by manual mode and the import job (0005) before the seven enrichment kinds (0006). Posters are uploadable from 0004, so rendering (0007) comes last among the agent milestones.
- The path from Claude to the admin's tool endpoint was the largest external unknown, so 0001 spiked it before anything was built on it. A Claude Code cloud routine reading a committed `.mcp.json` worked on 2026-10-21, and the same day the connection moved to a claude.ai custom connector, which needs no clone and serves chats, scheduled tasks and Claude Code alike.
- Each milestone ends deployed, with the acceptance scenarios it claims run against real data.

## How to run a milestone

- Read this index, the milestone's document and the PRD sections it names. For 0005 and later, refine the document to file level first, in the style of 0001 to 0004.
- Keep `task check` green while working and run `task build` before declaring the milestone done, as `docs/development/0001-workflows/development.md` requires.
- Update the status column here in the same change. When a decision changes behaviour described in `docs/product`, edit the product document in the same change; when it fixes a rule runners depend on, add it to the pipeline spec.

## Rules every milestone follows

- Follow the docs, not the template: reverse-order names such as `actionAwardCreate` and `form-award`, named exports, server actions that parse their input again with Zod and return `{ type: 'ok' }` or `{ type: 'bad', message }`, `revalidatePath` inside the action and navigation on the client, `findUniqueOrThrow` where a row is expected, no `as`, `any` or `!`.
- State is derived, never stored: helpers in `src/lib/derive-*.ts` compute publication state, import status, job status and origin from timestamps, presence and the job attempt.
- Every body route gets a page under `src/app/@header/`, because the slot's `default.tsx` calls `notFound()`. Typed routes mean a sidebar link appears only once its page exists.
- External objects are parsed with schemas in `packages/lib/src/schemas/`, `Json` columns included on read; a null `Json` value is written as `Prisma.DbNull`.
- Each integration adds its variables to `.env.example` in its own section, to `globalEnv` in `turbo.json`, to `.env.local` and to the app's `src/lib/env.ts`, and a row to "Settings". Variables are mandatory once the milestone that uses them lands: a deployment missing one fails at boot instead of serving a half-working admin. "Settings" is the inventory of what a deployment carries, never of values.
- New primitives are installed with `task ui:web -- <name>` and their `rem` units replaced by `--app-size` math; new dependencies go into the catalog in `pnpm-workspace.yaml`.
- Pure domain logic gets unit tests next to the code, in the admin's vitest project (`apps/admin-next/vitest.config.ts`, registered in the root `vitest.config.ts`); test subjects never import `src/lib/env.ts`.
- Vercel limits shape the design: `maxDuration` of 60 seconds on the endpoint, batch work in chunks of 20 per server-action call with the client looping, and an explicit timeout on interactive transactions.
- Admin text stays plain English; vocabulary labels for the admin live in `src/lib/labels.ts`.

## Acceptance scenarios

| Scenario in `docs/product/0001-admin-web.md`                                                                         | First milestone where it passes |
| -------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| Add "We're Smart World" with an unknown glyph key; it renders the generic mark without a code change                 | 0001                            |
| A Cantonese restaurant's Chinese name is canonical and its English name a translation; "Make canonical" swaps them   | 0003 (the swap itself in 0002)  |
| A chain with three branches filters the list and stops the duplicates section proposing the branches                 | 0003 (the filter in 0002)       |
| Asia's 50 Best after Michelin gives one record with two accolades; a wrong match is fixed by merging                 | 0003                            |
| Publishing without a selected poster is blocked and the missing item is named                                        | 0004                            |
| MICHELIN Guide Hong Kong Macau 2026 imported with the agent, counts match, "Mark verified" completes                 | 0005                            |
| The cloud task is unavailable; "Copy prompt", run elsewhere, "Paste result" saves the draft field with manual origin | 0006                            |
| Two cleared factors of a structured profile are filled by "Regenerate" and the others untouched                      | 0006                            |
| A published restaurant's summary is regenerated; the public value waits for the publish                              | 0006                            |
| Ten restaurants enriched overnight, poster variants included, failures listed on the jobs page                       | 0007                            |
| "Regenerate artwork" with notes produces a new round of variants                                                     | 0007                            |

## Open questions

- Carrier of the admin's MCP server: decided on 2026-10-21 for the claude.ai custom connector with the bearer secret as a fixed request header, a beta the owner's account has. The runner is `claude` with `RUNNER_SECRET_CLAUDE`, `.mcp.json` is gone, and 0008 re-adds a project server only if the local worker needs its own identity. The setup is in `docs/deployment/0004-claude-connector.md`. Should the header beta be withdrawn, the fallback is an OAuth server in the admin, as claude.com's "Authentication for connectors" page describes.
- "Run now": the fire endpoint's URL, authentication and per-hour cap are confirmed in 0005, whose `CLOUD_TASK_TRIGGER_URL` and `CLOUD_TASK_TRIGGER_SECRET` are mandatory like every other variable.
- Periodic refresh: 0008 chooses between a new tool value for a Trigger.dev schedule and a cron route; a stale-basics filter and a batch refresh cover the gap until then.
- Image size: the PRD asks for native 16:9; 0007 renders the largest landscape size the model offers and crops when needed.
- Resolver thresholds: 0002 starts with 0.8 name similarity to trust a Places result and 0.6 within 300 metres to flag a candidate, and tunes them on the first import.
- Leases and concurrency: 0005 starts with 20 minutes for agent jobs, 15 for rendering, and two leased agent jobs at once.
- `importedAt` of a pasted edition: 0003 sets it when the paste completes and it is null.

## Boundaries

- The public web and the mobile app are not planned here; they get their own documents when their turn comes.
- Link resolvers get a slot and open questions only (0009).
- Tool inputs, lease timings, prompt templates and storage layout are fixed in the pipeline spec, not in this folder.
