# Admin web

The admin web is the factory: where awards are defined, restaurants imported, profiles enriched, reviewed and published. It lives in `apps/admin-next`. The product context, domain model and automation strategy are in `docs/product/0000-project-overview.md`; this document specifies what the admin does and how it behaves. Technical rules such as schema, tool definitions, lease timings, storage layout and environment variables will be fixed in `docs/implementation/0003-enrichment-pipeline.md` as the implementation lands. The implementation roadmap is `docs/implementation/admin/index.md`.

## Overview

- Goals, in order of delivery:
  - Manage awards, their tiers and editions as data.
  - Import the restaurants an edition recognizes, each accolade with a reference.
  - Make every field of a restaurant and of its profile manually manageable: create, edit, clear.
  - Add a button per step that asks an agent to fill it, and a batch action that fills everything for selected restaurants unattended.
  - Review, regenerate with notes, and publish the draft.
- One operator, the owner. The existing HTTP Basic Auth is sufficient in v1; there are no accounts or roles.
- The success scenario: import a new edition, select the ten new restaurants, click "Enrich", go to bed, and find canonical descriptions, profiles, menus, summaries, articles and poster variants waiting for review in the morning.

## Concepts and states

- **Restaurant publication state**: unpublished (no published profile), published, withdrawn. Readiness to publish is computed from a checklist and never stored.
- **Region**: every restaurant carries one. Imports are complete across regions; enrichment and publication focus on Hong Kong first.
- **Business status**: open, temporarily closed, permanently closed. It comes from Google Places, is refreshed periodically, and can be overridden by the operator.
- **Accolade**: unverified until the operator verifies it. Agents can only add unverified accolades.
- **Enriched profile**: the published profile, which requires a summary and a selected poster, and at most one draft with every field optional. The outbound links are a field of the profile like the others. Agents write only the draft; the operator edits either. Publish copies the draft onto the published profile and deletes the draft.
- **Origin**: where a value came from. Places facts record Google Places, agent or manual. Artwork, accolades and import entries a runner writes link to the job attempt that wrote them, so their origin is read from there: no attempt is the operator, an attempt by the manual runner is manual mode, any other runner is an agent or a system task. A draft field's origin is read from the newest logged tool call that wrote it.
- **Job**: queued, running, succeeded, failed or cancelled, read from its lease, finish and cancel times rather than stored. Each run of a job is an attempt with a runner, a log of tool calls and a cost.
- **Edition import status**: not imported, importing, imported, verified.

## Pages

- **"Dashboard"** at `/`: the number of awards and how many are active; editions awaiting verification, with the oldest imports linked; counts of restaurants by publication state; restaurants missing each profile field; jobs queued, running and failed; the last agent run with its link; recent activity. A card appears once the data behind it exists, so the first dashboard shows only the awards and the editions awaiting verification.
- **"Restaurants"** at `/restaurants`: list, search, filters by region, chain, publication state, award, missing profile field, pending draft and business status, and batch actions, with the detail at `/restaurants/[id]`. A restaurant with a draft waiting, or a published one whose business status turned closed, carries a badge in the list.
- **"Awards"** at `/awards`: the awards, searchable by name, short name or slug and filtered by active state, with their facets and tier and edition counts. The award detail at `/awards/[id]` shows its fields, its tiers with their marks and its editions with their import status. The edition detail at `/awards/[id]/editions/[edition-id]` shows the edition and is where unresolved entries and unverified accolades wait for the operator.
- **"Jobs"** at `/jobs`: the queue, with failed jobs flagged, and the job detail at `/jobs/[id]`.
- **"Settings"** at `/settings`: the integrations and runner secrets the deployment carries, each with its environment variables and whether they are set.
- There is no inbox: whatever waits for the operator is flagged on the list where it lives.
- The template's "Users" pages are removed.

## Detailed behavior

### Manage awards

- Create and edit an award: name, in the source's own language, and the language of that name; short name; slug; website; which facets its accolades carry (tier, rank, score, label), with the maximum of its score when it carries one; and whether it is active. A new award's slug is filled from its name until the operator types one; a name without Latin letters needs the slug typed.
- Tiers: name, level for ordering (1 is the highest), glyph key and glyph count (1 to 10), with a live preview of the mark. The glyph key field suggests the keys the registry draws and accepts any other; a key the registry does not know previews as the generic mark, and the award is still usable. A tier held by accolades cannot be deleted.
- Editions: label, year, region, source URL, expected count, notes. The region is the scope the list covers, such as Hong Kong Macau or Asia, written freely; it is not a restaurant's region code. Creating an edition does not import anything.
- An award that accolades or source references point at cannot be deleted; it can be deactivated, which keeps it with its accolades and stops offering it when an accolade is added. Deleting an award nothing points at removes its tiers and editions with it.

### Import an edition

- "Import with agent" enqueues an edition import job and sets the edition to importing. The agent finds the official list and submits every entry it contains, whatever its region, with every official name it finds and which one it proposes as canonical from the nature of the restaurant, the address, the facets it holds and the reference URL. The other names are stored as translations of the name. It reports the total it found. An import is complete or it is not done: once an edition is imported, nobody returns to it when another city's turn comes.
- "Copy prompt" shows the same instructions for pasting into Claude or ChatGPT, together with the result format. "Paste a list" accepts that result, or any list the operator assembled, and runs it through the same resolver.
- Each submitted entry is resolved to a restaurant (see "Resolve a restaurant"). A resolved entry creates an unverified accolade, and a new restaurant tagged with its region when none existed. An unresolved entry waits on the edition page with the candidates the resolver found.
- The edition page shows the edition's fields and import status, the expected count, the count the import reported finding, the submitted count, the resolved and unresolved counts, and the accolade table: restaurant, facets, reference, origin, verified.
- "Mark verified" on the edition requires no unresolved entries and verifies every accolade of the edition in one step. Accolades can also be verified one by one.

### Resolve a restaurant

- An entry is matched in this order: an existing source reference to the same guide listing, then the Google place id found through Places, then the operator's choice.
- The resolver proposes ranked candidates with distance and address similarity and accepts automatically only when confident. Otherwise the edition page shows the candidates and the operator picks one, creates a new restaurant, or discards the entry.
- Creating a restaurant by hand works the same way: a name and address, or a Google Maps link, go through the resolver. A place id or guide listing that already belongs to a restaurant opens that restaurant instead of creating another, and a close name within walking distance is shown as a warning. Branches of the same chain are shown as such, not as duplicates.
- Entries outside Hong Kong are imported like any other. The region code lets the operator focus enrichment and publication on Hong Kong first and come back to other regions without re-importing.

### Edit basics and links

- Basics: canonical name with its language, the other official names as translations of the name with "Make canonical" to swap, slug, chain (optional: pick an existing chain or create one), region, address, district, coordinates with a map preview, phone, website, opening hours, business status. Facts from Places are filled in at resolution. Every fact shows its origin: Google Places, agent or manual. A fact the operator edits becomes manual and is no longer refreshed.
- "Refresh from Places" updates every fact that is not manual and records the date. The same refresh runs periodically.
- Links: Google Maps is derived from the place id. 大众点评 (Dianping), OpenRice and Apple Maps are stored as the platform's own identifier, from which the apps build the web URL or the app link, and the booking page as its URL. Links are a field of the profile: an agent's finds land in the draft, and the operator edits the draft or the published profile. They are filled by hand until their resolvers exist, Dianping first. While the Dianping link is empty, the field explains that the apps fall back to "Search on Dianping".

### Manage accolades on a restaurant

- The restaurant page lists its accolades with marks, edition, facets, reference and verification. The operator can add one (award and edition, the facets the award declares, a mandatory reference URL, a note), edit it, verify it or remove it.
- Only the operator verifies. Verification is per accolade and is what publication uses.

### Generate and review the profile

- The profile section of the restaurant page shows every field of the enriched profile with its published value and its draft value side by side. Each draft field has the same controls: "Edit", "Clear", "Generate" when it is empty or "Regenerate" with an optional notes field. The published value can be edited directly, with immediate effect.
- The section has "Publish draft", enabled when the checklist passes, and "Discard draft".
- The canonical description, the summary and the article are edited in a markdown editor with preview. The canonical description also lists its sources.
- The structured profile and the menu are edited in a grouped form, every field editable and clearable, with a raw JSON view validated against the shared schema. Regeneration fills empty fields by default; "Replace everything" is a separate, confirmed action.
- Regeneration passes the current draft and the notes to the agent, so the operator can steer: "shorter", "mention the set lunch", "the chef left in 2025".
- Nothing in a draft is shown to users until published. See "Publish and withdraw".

### Posters

- The poster section shows the brief, the artwork variants side by side, and the selected variant.
- "Generate brief", or "Regenerate brief" with notes, writes a new brief from the canonical description. A new brief enqueues rendering automatically unless the operator chooses to review the brief first.
- "Regenerate artwork" with notes renders a new round of variants from the current brief. "Upload artwork" accepts an image the operator produced elsewhere, lets the operator crop it to 16:9, and treats it as a variant with upload origin.
- Selecting a variant sets it on the draft; the apps request the sizes they need through the image domain's transformations. Posters carry no text: names, cuisine, district and award marks are rendered by the apps.
- Text in artwork is kept out by the brief and by the operator's choice of variant; there is no automated check.

### Enrich in batch

- From the restaurant list, for example filtered to Hong Kong, select restaurants and choose "Enrich": the server enqueues the chain for each one. The chain is the canonical description, then profile, menu, summary, article, poster brief and links, then rendering. Steps whose field is already filled in the draft or the published profile are skipped unless "Regenerate existing" is chosen.
- "Regenerate posters" and "Publish" are also available in batch. Batch publish applies the checklist per restaurant and reports which ones were skipped and why.
- Queued work is ordered so that the canonical descriptions of all selected restaurants are produced before any derived artifact.

### Publish and withdraw

- "Publish draft" checks the list: basics with coordinates, at least one verified accolade, a selected poster and a summary in the draft, and the launch-locale summary when the restaurant's native locale differs. Missing items are listed and the button stays disabled until they are met.
- Publishing copies the draft onto the published profile in one step and deletes the draft. Edits to the published profile, basics and verified accolades take effect immediately. Regenerations and agent writes go to a new draft, which the page shows as "Draft changes" next to the published values, with "Publish draft".
- "Withdraw" removes the restaurant from the public apps and keeps everything. "Delete" removes the restaurant with its profile, draft, artwork, accolades, references and jobs, after confirmation.

### Merge duplicates

- The duplicates section lists candidates with a close name within walking distance; a place id and a guide listing belong to one restaurant each, so they never produce duplicates. Two branches of the same chain are distinct restaurants, each with its own record and accolades, so they are never proposed as candidates for merging.
- "Merge" asks which record survives. Accolades, source references, import entries and artwork of the other record move to the survivor, its profile and draft move when the survivor has none, conflicting facts and unique keys are shown for a choice, and the other record is then deleted. The survivor's published profile is not changed by the merge.

### Run agents

- "Run now" on the jobs page fires the cloud scheduled task through its API trigger and shows the link to the session so the operator can watch it. The page explains that the schedule also runs hourly and that each task allows 30 fires per hour.
- A local worker on the operator's machine is an alternative runner using the same tools. The jobs page shows which runner holds each job.
- Manual mode is available on any queued agent job: "Copy prompt" copies the rendered instructions and the expected result format, and "Paste result" validates the result and writes it through the same path the tools use, with manual origin.
- Each runner that calls the endpoint, Claude, the local worker and Trigger.dev, authenticates with its own secret from the environment; the manual runner has none, because Basic Auth already covers the operator. Rotating a secret is a deployment, and for Claude also re-adding the claude.ai connector with the new header. Every write a runner makes links to its attempt, which records the runner.

### Jobs page

- The list shows kind, target, status, runner, attempts, and created and finished times, with filters by kind, status, runner and restaurant.
- The job detail shows the payload, the rendered prompt, the lease, every attempt with its runner, session link and cost, the log of tool calls, the result and the error. "Retry" re-queues a failed job. "Cancel" stops a queued job and releases a running one at the end of its lease.
- Leases in plain words: a runner holds a job for a limited time that each tool call extends. When the lease expires the job goes back to the queue, and a result that arrives afterwards is rejected. The server limits how many runners work at once, so an hourly run and a "Run now" cannot process the same job twice.
- Rendering appears in the same list with its Trigger.dev status and a link to the run; identity resolution and refreshes from Places run inside the server and appear as jobs without a runner.

## Agent interface

- One endpoint, `/api/mcp` on the admin host, outside Basic Auth and authenticated by a bearer secret per runner; a request without a known secret is refused. It speaks the Model Context Protocol (MCP). Claude reaches it through the claude.ai custom connector, from chats, scheduled tasks and Claude Code sessions alike; the local worker and Trigger.dev use their own secrets. Any other MCP client, ChatGPT included, would need a runner identity and secret of its own, and until then takes part only through manual mode.
- Tool groups:
  - **Jobs**: claim the next job, extend the lease, complete, fail. Claiming returns the job and its rendered instructions, and those instructions are the only ones a runner follows.
  - **Restaurants**: search by name, submit an import entry for resolution, read the context the job kind needs.
  - **Accolades**: add an unverified accolade to the claimed edition.
  - **Draft**: write one field of the restaurant's draft each: canonical description, structured profile, menu, summary, article, poster brief, links.
  - **Edition**: report counts and notes for the claimed import.
- Guarantees:
  - Every write is validated against the shared schemas and scoped to the claimed job's target and kind. A profile job cannot write a menu or touch another restaurant.
  - Tools write draft fields, candidates or unverified records only. No tool verifies, publishes, merges, deletes, edits the published profile or changes manual values.
  - Context tools return what the job needs and nothing else: no queue internals, no other restaurants, no configuration.
  - Every call is logged on the job as the audit trail. Content fetched from the web is treated as untrusted data.

## Prompts and generated content rules

- Prompt templates live in code. Changing a template never regenerates anything by itself; the operator regenerates what should follow it.
- The house-style brief for posters is a template like the others.
- The content locale at launch is `zh-cn`, written natively from the canonical description. The summary fits a card in a few sentences. The article follows a fixed structure: what the place is, who is behind it, what to order, when to go, what it costs, how to book.
- Profile values come from controlled vocabularies in `packages/lib`. The admin shows labels and stores keys.
- Menus record their source URL and capture date.

## Integrations

- Google Places for resolution, basics, the Maps link and periodic refresh.
- The OpenAI image API for artwork, at the highest quality settings and native 16:9.
- Cloudflare R2 for artwork, served through a Cloudflare domain whose image transformations deliver the sizes the apps need.
- Trigger.dev for system tasks.
- The claude.ai custom connector that carries the tool endpoint's URL and bearer secret, which is how Claude reaches the endpoint from chats, scheduled tasks and Claude Code sessions.
- The Claude Code cloud scheduled task's fire endpoint for "Run now".
- "Settings" lists each integration and runner secret with the environment variables behind it and whether they are set: at first the database, Basic Auth and the Claude connector secret, with a row added by each integration as it lands. Every variable listed is required at boot, so the page is an inventory of what the deployment carries rather than a report of gaps. It never displays secret values; configuration lives in the environment.

## Milestones

- **Factory, manual**: schema; awards, tiers and editions, with the launch awards seeded; the "Dashboard" and "Settings" skeletons; restaurants with resolution; chains; accolades with references; every profile field manually editable; artwork upload; publishing with checklist; duplicates and merge.
- **Agents, import**: tool endpoint and runner secrets; job queue with attempts and leases; edition import through the cloud task; manual mode.
- **Agents, enrichment**: canonical description, profile, menu, summary, article, poster brief and links jobs; chaining; fill-empty; the complete dashboard.
- **Posters, automated**: Trigger.dev worker with OpenAI rendering into R2; batch actions.
- **Hardening**: periodic refresh from Places, local worker, usage reporting.
- **Link resolvers**: Dianping first, then OpenRice and Apple Maps, each as its own step.

## Acceptance scenarios

- Open the seeded MICHELIN Guide award, add the Hong Kong Macau 2026 edition and click "Import with agent". Within the next run every entry, Macau included, exists as a restaurant with an unverified accolade and a reference, the counts match the expected count, and "Mark verified" completes the import. Filtering the restaurant list to Hong Kong shows the ones to enrich first; Macau waits without a second import.
- Select ten unenriched restaurants, click "Enrich" and leave. In the morning each has a draft with a canonical description, a structured profile, a menu where the restaurant publishes one, a summary, an article, a brief and poster variants, and the jobs page lists what failed.
- A poster feels wrong: write "warmer light, show the counter, less crowded" and click "Regenerate artwork". A new round of variants appears; select the best one.
- Add the award "We're Smart World" with a tier whose glyph key is unknown. It renders as the generic mark until a drawing is added to the registry; no code change is needed to use the award.
- Import Asia's 50 Best 2025 after the Michelin import. A restaurant present in both ends up as one record with two accolades. A wrong match is found in the duplicates section and fixed by merging.
- The cloud task is unavailable: open a queued job, "Copy prompt", run it in claude.ai, "Paste result". The draft field is saved with manual origin.
- Try to publish a restaurant without a selected poster. The checklist blocks it and names the missing item.
- Import a Cantonese restaurant that carries a Chinese and an English official name: the Chinese name becomes canonical and the English name its translation. For an Italian restaurant the English name is canonical. Either choice can be swapped with "Make canonical".
- Create a chain for a dim sum brand and attach its three branches. The restaurant list filters by chain, and the duplicates section stops proposing the branches as duplicates of each other.
- Clear two fields of a structured profile and click "Regenerate". The filled fields are untouched and the empty ones are filled.
- Regenerate the summary of a published restaurant. The public apps still show the old one until the draft is published.

## Boundaries

- Not in v1: multiple operators, roles, editing prompts in the admin, an audit interface beyond the job logs, importing crowd reviews, bookings, any user-facing feature.
- Rate limiting and bot protection for the tool endpoint belong to the deployment layer, as `docs/development/0000-overview/codebase-boundary.md` describes. Token checks are the only brake in application code.
- The tool endpoint is a route handler in a codebase that otherwise uses server actions only. The implementation notes this exception in `docs/development/0003-coding/nextjs-server-action.md`.
- Technical rules live in `docs/implementation/0003-enrichment-pipeline.md`: schema following `docs/philosophy/database-design.md`, tool definitions, lease timings and concurrency limits, prompt templates, storage layout, image sizes, environment variables.
