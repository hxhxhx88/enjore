# Admin web

The admin web is the factory: where awards are defined, restaurants imported, profiles enriched, reviewed and published. It lives in `apps/admin-next`. The product context, domain model and automation strategy are in `docs/product/0000-project-overview.md`; this document specifies what the admin does and how it behaves. Technical rules such as schema, tool definitions, lease timings, storage layout and environment variables will be fixed in `docs/implementation/0003-enrichment-pipeline.md` as the implementation lands.

## Overview

- Goals, in order of delivery:
  - Manage awards, their tiers and editions as data.
  - Import the restaurants an edition recognizes, each accolade with a reference.
  - Make every field of a restaurant and every artifact manually manageable: create, edit, clear.
  - Add a button per step that asks an agent to fill it, and a batch action that fills everything for selected restaurants unattended.
  - Review, regenerate with notes, and publish a snapshot.
- One operator, the owner. The existing HTTP Basic Auth is sufficient in v1; there are no accounts or roles.
- The success scenario: import a new edition, select the ten new restaurants, click "Enrich", go to bed, and find canonical descriptions, profiles, menus, summaries, articles and poster variants waiting for review in the morning.

## Concepts and states

- **Restaurant publication state**: unpublished, published, withdrawn, archived. Readiness to publish is computed from a checklist and never stored.
- **Region**: every restaurant carries one. Imports are complete across regions; enrichment and publication focus on Hong Kong first.
- **Business status**: open, temporarily closed, permanently closed. It comes from Google Places, is refreshed periodically, and can be overridden by the operator.
- **Accolade**: unverified until the operator verifies it. Agents can only add unverified accolades.
- **Artifact version**: immutable, with provenance (job, runner, model, prompt version, upstream version) and origin (agent, manual, upload). The newest is the working version unless one is pinned. Structured fields can be locked.
- **Stale**: an artifact whose prompt version or upstream artifact changed since it was produced. Stale is a flag for review, not a trigger.
- **Job**: queued, running, succeeded, failed, cancelled. Each run of a job is an attempt with a runner, a lease and a log.
- **Edition import status**: not imported, importing, imported, verified.

## Pages

- **"Dashboard"** at `/`: counts of restaurants by publication state, restaurants missing each artifact kind, jobs queued, running and failed, editions awaiting verification, the last agent run with its link, recent activity.
- **"Inbox"** at `/inbox`: everything that waits for the operator: unresolved import entries, unverified accolades, new agent artifacts not yet looked at, stale artifacts, published restaurants whose business status turned closed, failed jobs.
- **"Restaurants"** at `/restaurants`: list, search, filters by region, chain, publication state, award, missing artifact and business status, and batch actions, with the detail at `/restaurants/[id]`.
- **"Awards"** at `/awards`: awards with their tiers and editions, with the edition detail at `/awards/[id]/editions/[editionId]`.
- **"Jobs"** at `/jobs`: the queue, with the job detail at `/jobs/[id]`.
- **"Settings"** at `/settings`: configuration status of integrations, runner tokens, prompt versions.
- The template's "Users" pages are removed.

## Detailed behavior

### Manage awards

- Create and edit an award: name, short name, slug, website, which facets its accolades carry (tier, rank, score, label), the maximum of its score when it has one, and whether it is active.
- Tiers: name, level for ordering, glyph key and glyph count, with a live preview of the mark. A glyph key the registry does not know previews as the generic mark; the award is still usable.
- Editions: label, year, region, source URL, expected count, notes. Creating an edition does not import anything.
- An award with accolades cannot be deleted; it can be deactivated.

### Import an edition

- "Import with agent" enqueues an edition import job and sets the edition to importing. The agent finds the official list and submits every entry it contains, whatever its region, with every official name it finds and which one it proposes as canonical from the nature of the restaurant, the address, the facets it holds and the reference URL. The other names are stored as translations of the name. It reports the total it found. An import is complete or it is not done: once an edition is imported, nobody returns to it when another city's turn comes.
- "Copy prompt" shows the same instructions for pasting into Claude or ChatGPT, together with the result format. "Paste a list" accepts that result, or any list the operator assembled, and runs it through the same resolver.
- Each submitted entry is resolved to a restaurant (see "Resolve a restaurant"). A resolved entry creates an unverified accolade, and a new restaurant tagged with its region when none existed. An unresolved entry waits in the inbox with the candidates the resolver found.
- The edition page shows the expected count, the submitted count, the resolved and unresolved counts, and the accolade table: restaurant, facets, reference, origin, verified.
- "Mark verified" on the edition requires no unresolved entries and verifies every accolade of the edition in one step. Accolades can also be verified one by one.

### Resolve a restaurant

- An entry is matched in this order: an existing source reference to the same guide listing, then the Google place id found through Places, then the operator's choice.
- The resolver proposes ranked candidates with distance and address similarity and accepts automatically only when confident. Otherwise the inbox shows the candidates and the operator picks one, creates a new restaurant, or discards the entry.
- Creating a restaurant by hand works the same way: a name and address, or a Google Maps link, go through the resolver. A warning is shown when a restaurant with the same place id, or a close name within walking distance, already exists. Branches of the same chain are shown as such, not as duplicates.
- Entries outside Hong Kong are imported like any other. The region code lets the operator focus enrichment and publication on Hong Kong first and come back to other regions without re-importing.

### Edit basics and links

- Basics: canonical name with its language, the other official names as translations of the name with "Make canonical" to swap, slug, chain (optional: pick an existing chain or create one), region, address, district, coordinates with a map preview, phone, website, booking link, opening hours, business status. Facts from Places are filled in at resolution. Every fact shows its origin: Places, agent or manual. A fact the operator edits becomes manual and is no longer refreshed.
- "Refresh from Places" updates every fact that is not manual and records the date. The same refresh runs periodically.
- Links: Google Maps is derived from the place id and can be overridden. Links to 大众点评 (Dianping), OpenRice and Apple Maps are filled by hand until their resolvers exist, Dianping first. While the Dianping link is empty, the field explains that the apps fall back to "Search on Dianping". The booking page is kept when it exists.

### Manage accolades on a restaurant

- The restaurant page lists its accolades with marks, edition, facets, reference and verification. The operator can add one (award and edition, the facets the award declares, a mandatory reference URL, a note), edit it, verify it or remove it.
- Only the operator verifies. Verification is per accolade and is what publication uses.

### Generate and review an artifact

- Each artifact section on the restaurant page has the same controls: the working version with its provenance badge, "Edit", "Clear", "Generate" when nothing exists or "Regenerate" with an optional notes field, a version history with "Pin" and "Revert", and a stale flag when relevant.
- The canonical description, the summary and the article are edited in a markdown editor with preview. The canonical description also lists its sources.
- The structured profile and the menu are edited in a grouped form, every field editable and clearable, with a raw JSON view validated against the shared schema. Any profile field can be locked. Regeneration fills empty fields by default and leaves locked fields alone; "Replace everything" is a separate, confirmed action.
- Regeneration passes the current version and the notes to the agent, so the operator can steer: "shorter", "mention the set lunch", "the chef left in 2025".
- Nothing generated is shown to users until published. See "Publish and withdraw".

### Posters

- The poster section shows the brief, the artwork variants side by side, and the selected variant.
- "Generate brief", or "Regenerate brief" with notes, writes a new brief from the canonical description. A new brief enqueues rendering automatically unless the operator chooses to review the brief first.
- "Regenerate artwork" with notes renders a new round of variants from the current brief. "Upload artwork" accepts an image the operator produced elsewhere and treats it as a variant with upload origin.
- Selecting a variant produces the derivatives the apps need. Posters carry no text: names, cuisine, district and award marks are rendered by the apps.
- Artwork with detectable text is rejected automatically and shown as rejected.

### Enrich in batch

- From the restaurant list, for example filtered to Hong Kong, select restaurants and choose "Enrich": the server enqueues the chain for each one. The chain is the canonical description, then profile, menu, summary, article, poster brief and links, then rendering. Steps that already have a current, non-stale artifact are skipped unless "Regenerate existing" is chosen.
- "Regenerate posters" and "Publish" are also available in batch. Batch publish applies the checklist per restaurant and reports which ones were skipped and why.
- Queued work is ordered so that the canonical descriptions of all selected restaurants are produced before any derived artifact.

### Publish and withdraw

- "Publish" checks the list: basics with coordinates, at least one verified accolade, a selected poster, a summary in the launch locale. Missing items are listed and the button stays disabled until they are met.
- Publishing freezes a snapshot of the working versions and the verified accolades. Later edits, regenerations and agent writes do not change the published snapshot; the page shows "Changes since publication" and offers "Publish again".
- "Withdraw" removes the restaurant from the public apps and keeps everything. "Archive" withdraws it and hides it from working lists, with a reason; archived restaurants remain reachable through a filter.

### Merge duplicates

- The duplicates section lists candidates: same place id, same source reference, or a close name within walking distance. Branches of the same chain are excluded.
- "Merge" asks which record survives. Accolades, source references, artifacts and links of the other record move to the survivor, conflicting facts are shown for a choice, and the merged record is archived with a pointer to the survivor. The survivor's publication is not changed by the merge.

### Run agents

- "Run now" on the jobs page fires the cloud scheduled task through its API trigger and shows the link to the session so the operator can watch it. The page explains that the schedule also runs hourly and that fires per hour are limited.
- A local worker on the operator's machine is an alternative runner using the same tools. The jobs page shows which runner holds each job.
- Manual mode is available on any queued agent job: "Copy prompt" copies the rendered instructions and the expected result format, and "Paste result" validates the result and writes it through the same path the tools use, with manual origin.
- Runner tokens are created, named and revoked in "Settings". Every write records the token that made it.

### Jobs page

- The list shows kind, target, status, runner, attempts, and created and finished times, with filters by kind, status, runner and restaurant.
- The job detail shows the payload, the rendered prompt, every attempt with its runner, lease and session link, the log of tool calls, the result and the error. "Retry" re-queues a failed job. "Cancel" stops a queued job and releases a running one at the end of its lease.
- Leases in plain words: a runner holds a job for a limited time that each tool call extends. When the lease expires the job goes back to the queue, and a result that arrives afterwards is rejected. The server limits how many runners work at once, so an hourly run and a "Run now" cannot process the same job twice.
- System tasks appear in the same list with their Trigger.dev status and a link to the run.

## Agent interface

- One endpoint on the admin host, outside Basic Auth, authenticated by per-runner bearer tokens. It speaks the Model Context Protocol (MCP), so Claude Code, claude.ai and ChatGPT can use it.
- Tool groups:
  - **Jobs**: claim the next job, extend the lease, complete, fail. Claiming returns the job and its rendered instructions, and those instructions are the only ones a runner follows.
  - **Restaurants**: search by name, submit an import entry for resolution, read the context the job kind needs.
  - **Accolades**: add an unverified accolade to the claimed edition.
  - **Artifacts**: write one kind each: canonical description, profile, menu, summary, article, poster brief, links.
  - **Edition**: report counts and notes for the claimed import.
- Guarantees:
  - Every write is validated against the shared schemas and scoped to the claimed job's target and kind. A profile job cannot write a menu or touch another restaurant.
  - Tools create versions, candidates or unverified records. No tool verifies, publishes, pins, merges, deletes or changes manual values.
  - Context tools return what the job needs and nothing else: no queue internals, no other restaurants, no configuration.
  - Every call is logged on the job as the audit trail. Content fetched from the web is treated as untrusted data.

## Prompts and generated content rules

- Prompt templates live in code with a version each. Every artifact records the prompt version that produced it. Bumping a version flags affected artifacts as stale in the inbox; it never regenerates anything by itself.
- The house-style brief for posters is a template like the others.
- The content locale at launch is `zh-cn`, written natively from the canonical description. The summary fits a card in a few sentences. The article follows a fixed structure: what the place is, who is behind it, what to order, when to go, what it costs, how to book.
- Profile values come from controlled vocabularies in `packages/lib`. The admin shows labels and stores keys.
- Menus record their source URL and capture date.

## Integrations

- Google Places for resolution, basics, the Maps link and periodic refresh.
- The OpenAI image API for artwork, at the highest quality settings and native 16:9.
- Cloudflare R2 for artwork and derivatives.
- Trigger.dev for system tasks.
- The Claude Code cloud scheduled task's fire endpoint for "Run now".
- "Settings" shows whether each integration is configured, lists runner tokens for creation and revocation, and lists the current prompt versions. It never displays secret values; configuration lives in the environment.

## Milestones

- **Factory, manual**: schema; awards, tiers and editions; restaurants with resolution; chains; accolades with references; every artifact manually editable; artwork upload; publication with checklist; inbox basics.
- **Agents, import**: tool endpoint and runner tokens; job queue with attempts and leases; edition import through the cloud task; manual mode; duplicates and merge.
- **Agents, enrichment**: canonical description, profile, menu, summary, article, poster brief and links jobs; chaining; field locks and fill-empty; dashboard.
- **Posters, automated**: Trigger.dev worker with OpenAI rendering, text check and derivatives in R2; batch actions.
- **Hardening**: periodic refresh from Places, stale flags on prompt version bumps, local worker, usage reporting.
- **Link resolvers**: Dianping first, then OpenRice and Apple Maps, each as its own step.

## Acceptance scenarios

- Create the MICHELIN Guide award with its tiers, add the Hong Kong Macau 2026 edition and click "Import with agent". Within the next run every entry, Macau included, exists as a restaurant with an unverified accolade and a reference, the counts match the expected count, and "Mark verified" completes the import. Filtering the restaurant list to Hong Kong shows the ones to enrich first; Macau waits without a second import.
- Select ten unenriched restaurants, click "Enrich" and leave. In the morning each has a canonical description, a profile, a menu where the restaurant publishes one, a summary, an article, a brief and poster variants, and the inbox lists what failed.
- A poster feels wrong: write "warmer light, show the counter, less crowded" and click "Regenerate artwork". A new round of variants appears; select and pin the best one.
- Add the award "We're Smart World" with a tier whose glyph key is unknown. It renders as the generic mark until a drawing is added to the registry; no code change is needed to use the award.
- Import Asia's 50 Best 2025 after the Michelin import. A restaurant present in both ends up as one record with two accolades. A wrong match is found in the duplicates section and fixed by merging.
- The cloud task is unavailable: open a queued job, "Copy prompt", run it in claude.ai, "Paste result". The artifact is saved with manual origin.
- Try to publish a restaurant without a selected poster. The checklist blocks it and names the missing item.
- Import a Cantonese restaurant that carries a Chinese and an English official name: the Chinese name becomes canonical and the English name its translation. For an Italian restaurant the English name is canonical. Either choice can be swapped with "Make canonical".
- Create a chain for a dim sum brand and attach its three branches. The restaurant list filters by chain, and the duplicates section stops proposing the branches as duplicates of each other.
- Lock three profile fields and click "Regenerate". The locked fields are untouched and the empty ones are filled.
- Regenerate the summary of a published restaurant. The public apps still show the old one until "Publish again".

## Boundaries

- Not in v1: multiple operators, roles, editing prompts in the admin, an audit interface beyond provenance and job logs, importing crowd reviews, bookings, any user-facing feature.
- Rate limiting and bot protection for the tool endpoint belong to the deployment layer, as `docs/development/0000-overview/codebase-boundary.md` describes. Token checks are the only brake in application code.
- The tool endpoint is a route handler in a codebase that otherwise uses server actions only. The implementation notes this exception in `docs/development/0003-coding/nextjs-server-action.md`.
- Technical rules live in `docs/implementation/0003-enrichment-pipeline.md`: schema following `docs/philosophy/database-design.md`, tool definitions, lease timings and concurrency limits, prompt templates, storage layout, image sizes, environment variables.
