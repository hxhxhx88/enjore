# Shell and awards

The first milestone of the admin in `apps/admin-next`. It removes the template's Users pages, lays down the shell and the patterns every later milestone copies, makes awards, tiers and editions manageable, seeds the awards the product launches with, and spikes the path from a Claude Code cloud routine to the admin's tool endpoint. It implements "Manage awards" of `docs/product/0001-admin-web.md` and the "Sources" and "Marks" sections of `docs/product/0000-project-overview.md`. Nothing has to exist before it beyond the schema.

## Goal

- The operator opens the admin and sees "Dashboard", "Awards" and "Settings"; the MICHELIN Guide exists with its tiers; an unknown glyph key renders the generic mark.
- A cloud routine has called the admin's endpoint once with a valid secret, so milestone 0005 builds on a path that is known to work.

## Scope

- In: template cleanup, routes and sidebar, the list, detail, form and action patterns, the marks registry, awards, tiers and editions, award seeds, the "Settings" and "Dashboard" skeletons, the admin's vitest project, the endpoint spike.
- Out: restaurants (0002), accolades and the edition page's tables (0003), imports (0003 and 0005), the queue behind the endpoint (0005).

## Design

- Template cleanup: delete `src/app/(body)/users/**`, `src/app/@header/users/**`, `src/components/table-users/`, `src/components/detail-user/`, `src/components/form-user-add/`, `src/components/form-user-edit/` and `routes.users`. The `User`, `Session` and `Verification` models stay; `apps/app-next` uses them.
- Routes in `src/lib/routes.ts`: `home`, `awards.list`, `awards.detail(id)`, `awards.edition(awardId, editionId)` and `settings`. Typed routes reject a link to a page that does not exist, so the sidebar grows with the pages: "Restaurants" arrives in 0002 and "Jobs" in 0005.
- Sidebar: `src/components/app-sidebar.tsx` lists "Dashboard", "Awards" and "Settings"; the active item is computed from `usePathname` in a client `src/components/app-sidebar-item.tsx`. The layout title names the product's admin instead of "Starter Template".
- Every body route gets a page under `src/app/@header/` for its breadcrumb, because the slot's `default.tsx` calls `notFound()`.
- List page pattern, written once here and copied later: the server page parses `searchParams` with a Zod schema (`page` with `.catch(1)`, enum filters with `.catch(undefined)`, `q` as a trimmed string), runs `Promise.all([findMany, count])` with a page size of 50, and renders `DataTable` from `@repo/ui-web/data-table` and `Pagination` inside `Suspense`. Filter controls are client components that write query parameters through `useHrefWithParameters` and `router.replace`: `src/components/filter-select.tsx` and `src/components/filter-search.tsx`, the latter debounced.
- Detail page pattern: the server page loads with `findUniqueOrThrow`; `src/components/detail-<entity>/` holds the zustand store whose `modalData` is a discriminated union, `provider.tsx`, `modal-controller.tsx` and the `modal-*.tsx` files; buttons set `modalData`; modals unmount in `onOpenChangeComplete`, as `docs/development/0003-coding/modal.md` describes.
- Form pattern: one folder per entity serves create and edit through `initialValues` (`schema.ts`, `provider.tsx`, `hooks.ts`, `form.tsx`, `field-*.tsx`, `index.ts`), as `docs/development/0003-coding/form.md` describes. The template's duplicated add and edit folders are not copied.
- Action pattern: `action-<entity>-<verb>.ts` exporting `action<Entity><Verb>`, marked `'use server'`, parsing its input again with the form's Zod schema, returning `{ type: 'ok' }` or `{ type: 'bad', message }`, revalidating inside, leaving navigation to the client. Only the results of `parseDatabaseError` are caught; everything else throws.
- `parseDatabaseError` moves from `src/lib/db.ts` to a pure `src/lib/db-error.ts`, because its tests cannot import `db.ts` (which validates the environment at import, and CI has none), and is widened from `User.email` to every unique key of the schema: `restaurants.slug`, `restaurants.google_place_ref`, `chains.slug`, `awards.slug`, `award_tiers (award_id, name)`, `award_editions (award_id, label)`, `source_references (award_id, listing_url)`, `accolades (restaurant_id, edition_id, tier_id)` and `translations (locale, table, record_id, field)`. The message names the model and the fields.
- Marks registry in `packages/ui-web/src/mark.tsx`: `glyphs` maps a glyph key to a drawing (`star`, `diamond`, `toque`, `fork`, `radish`, `pin`, `leaf`, `generic`; lucide icons for now, typed so hand-drawn SVG components drop in later), `knownGlyphKeys` lists them, and `Mark({ glyphKey, count })` repeats the drawing `count` times and falls back to `generic` for a key it does not know. `packages/ui-web/src/mark-accolade.tsx` renders a tier mark, `#7`, `97.5/100` or a label from plain props, so the public web reuses it later. Imported as `@repo/ui-web/mark` and `@repo/ui-web/mark-accolade`.
- Derived state: `src/lib/derive-import-status.ts` returns verified, imported, importing or not imported from `verifiedAt`, `importedAt` and whether an unfinished import job targets the edition, which no caller passes before 0005.
- Slugs: `src/lib/slug.ts` slugifies the first Latin-script name among the canonical name and its translations; when none exists, the slug field is left empty and required. Unit tests cover accents, punctuation and CJK input.
- "Settings" at `/settings`: a table of integrations and runner secrets with "Configured" or "Not configured", derived from the presence of their variables in `src/lib/env.ts`. This milestone lists the database, Basic Auth and the Claude runner secret; later milestones add rows. Values are never shown.
- "Dashboard" at `/`: the cards whose data exists at this point, editions awaiting verification and the awards; restaurant counts arrive in 0002, jobs in 0005, missing fields and activity in 0006.
- Seeds: `apps/cli-bun/src/actions/seed-awards/` with `awards.ts` describing the ten sources marked "Seeded" in the overview's table (name, locale, slug, short name, website, facets, score scale, tiers with level, glyph key and count) and `index.ts` upserting awards by slug and tiers by award and name. A tier may use a glyph key the registry does not draw yet and renders the generic mark until a drawing is added. `apps/cli-bun` gains `@repo/db`, `@repo/lib` and a `src/lib/env.ts` on `@t3-oss/env-core`; the command runs with `task cli -- seed-awards` against the database in `.env.local`.
- Tests: `apps/admin-next/vitest.config.ts` mirrors `apps/app-next/vitest.config.ts` and is registered in the root `vitest.config.ts`.
- Endpoint spike: `src/app/api/mcp/route.ts` is the admin's only route handler, `POST` only with `maxDuration` of 60, serving the MCP TypeScript SDK's stateless Streamable HTTP transport. `src/lib/mcp/auth.ts` maps `Authorization: Bearer` to a runner by constant-time comparison; `secureEquals` moves from `src/proxy.ts` to `src/lib/crypto.ts` so both use it. The spike registers `claim-job` alone and returns no job because the queue is empty, which is a valid answer under `packages/lib/src/schemas/job-tool.ts`. `.mcp.json` at the repo root declares the `admin` server at `${ADMIN_MCP_URL}` with the header `Authorization: Bearer ${RUNNER_SECRET_CLOUD_TASK}`; both variables come from the routine's environment and are unset on a developer's machine, so a local session gets no working tools. The proxy's matcher already skips `/api`, so the route protects itself. The exception to the server-action rule is recorded in `docs/development/0003-coding/nextjs-server-action.md`. Outcome: the routine's run of 2026-10-21 proved the path; the same day the connection moved to a claude.ai custom connector carrying the secret as a request header, `.mcp.json` was removed and the runner became `claude` with `RUNNER_SECRET_CLAUDE`, as the index records.
- Primitives installed with `task ui:web -- <name>`: select, textarea, checkbox, switch, badge, card. Tabs wait for the first milestone that needs them (0004).

## Work

- Remove the Users pages, components and route entries; rename the layout title; run `task check` to confirm the template compiles without them.
- Add the routes, the sidebar with the active item, and the `@header` pages for "Awards", the award detail, the edition detail and "Settings".
- Install the primitives; add the admin vitest project.
- Write `slug.ts`, `derive-import-status.ts` and the widened `parseDatabaseError`, with tests.
- Add `mark.tsx` and `mark-accolade.tsx` to `packages/ui-web`.
- Build `form-award`, `form-award-tier` and `form-award-edition` with their actions.
- Build "Awards" at `/awards`: name, short name, slug, facet badges (tier, rank, score, label), active, tier and edition counts; "Add award" opens a sheet with the form.
- Build `/awards/[id]` with `detail-award`: the fields with "Edit"; the tiers table with a live `Mark` preview and add, edit and delete modals; the editions table with import status and add and edit modals; "Deactivate" and "Activate"; "Delete", which the foreign keys refuse while accolades exist and the action reports as a bad message.
- Build `/awards/[id]/editions/[edition-id]` with the edition's fields and "Edit"; counts, tables and import actions are added by 0003 and 0005.
- Build "Settings" and the "Dashboard" cards.
- Write the seed data and command; run it against the development database, then production.
- Spike: the route, the auth module, `.mcp.json`, the environment variables and the Settings row; deploy; create a routine whose prompt lists the available tools and calls `claim-job`; read the authenticated call in the run log. If project MCP servers need trusting, add `!.claude/settings.json` to `.gitignore` and commit the setting.
- Record the route-handler exception in `docs/development/0003-coding/nextjs-server-action.md`.

## Done when

- The Users pages are gone and `task build` passes.
- Awards, tiers and editions are created, edited and deleted in production; a tier's mark previews live.
- The seeds are applied: the MICHELIN Guide has its tiers and the operator adds the "Hong Kong Macau 2026" edition.
- The routine's run log shows one authenticated `claim-job` call that returned no job (seen on 2026-10-21; the connector repeats the call from a chat, a chat task, a cloud task without repository and the terminal).
- Acceptance scenario: adding "We're Smart World" with an unknown glyph key renders the generic mark, with no code change.

## Boundaries

- Chains, restaurants and accolades are not touched; the award detail shows tier and edition counts only.
- The endpoint has no queue behind it; 0005 replaces the stub `claim-job` with the real one.
