# Restaurants — Claude Code guide

This file orients Claude in this repo. Keep it lean. Deep content lives in `docs/` — read it first.

## What this repo is

- pnpm + Turborepo monorepo, TypeScript. Node.js version pinned in `.nvmrc`, pnpm version in `package.json` (`packageManager`).
- Apps: `apps/app-next` (public web with email sign-in), `apps/admin-next` (admin web behind Basic Auth: dashboard, awards, settings, and the agents' MCP tool endpoint at `/api/mcp`), `apps/cli-bun` (developer commands run with `task cli -- <command>`, such as `seed-awards`).
- Packages: `@repo/db`, `@repo/email`, `@repo/i18n`, `@repo/lib`, `@repo/ui-web`.
- Configs: `@repo/ts-config`, `@repo/ui-config`.
- `task` CLI (`taskfile.yaml`, `tasks/*.yaml`) wraps commands and auto-loads `.env.local`.

## Documentation is the source of truth

- `docs/` is authoritative. Find the relevant topic and read it before editing.
  - `docs/philosophy/` — principles for design and decision-making.
  - `docs/development/0000-overview/` — repo shape, configs, boundaries, tech stack (including deliberately held-back upgrades).
  - `docs/development/0001-workflows/` — DB, i18n, dependency install, dev gate.
  - `docs/development/0002-rules/` — naming, exports, writing style.
  - `docs/development/0003-coding/` — patterns: form, modal, list page, complex component, server action, schemas, enum, runtime error, etc.
  - `docs/implementation/` — technical specs and architectural design.
  - `docs/implementation/admin/` — admin roadmap and milestone plans.
  - `docs/product/`, `docs/deployment/`.
- `CONTRIBUTING.md` is the human-facing overview of the repo.

## Commands you will use

- Always prefer `task ...` over raw `pnpm ...` so `.env.local` loads automatically.
- List all tasks: `task --list-all`.
- Dev loop: `task dev` (all workspaces) or `task dev -- --filter=app-next` (scoped).
- Quality gate: `task check` (typecheck, tests, i18n completeness, UI rem guard, colors sync, lint with type-aware rules and zero warnings allowed, knip).
- Fix lint and formatting: `task fix`. Unit tests alone: `task test`.
- Full build gate: `task build` (runs check first).
- Raw pnpm: `task pnpm -- ...`.
- Scoped workflows: `task db:up`, `task db:dev`, `task db:gen`, `task i18n`, `task ui:web -- <name>`, `task cli -- <command>` (for example `task cli -- seed-awards`, which writes to the database in `.env.local`).

## Workflow gate (non-negotiable)

- Run `task check` regularly during development.
- Run `task build` before declaring work done. It must pass.
- See `docs/development/0001-workflows/development.md`.

## Source-of-truth pointers by domain

- Sign-in and sessions: `apps/app-next/src/components/sign-in/` (steps, forms, in-place actions), `apps/app-next/src/lib/session.ts` (`getSession`, cookie), rules in `docs/implementation/0001-web-session.md`.
- Database access: `connectDatabase()` in each web app's `src/lib/db.ts`, never a module-level client. It is the per-request switch point described in `docs/implementation/0002-database-switch.md`. `apps/cli-bun` commands call `newDatabase(env.DATABASE_URL)` inside the action and disconnect in `finally`.
- Database schema and migrations: `packages/db/prisma/schema.prisma` — after edits run `task db:dev` then `task db:gen`.
- I18n message catalogs: `packages/i18n/locales/*/messages.po` — extract with `task i18n`.
- Shared Zod schemas: `packages/lib/src/schemas/` holds the shapes of external objects such as `Json` columns (for example `verification-payload.ts`, `import-entry.ts`, `menu.ts`) and the domain vocabularies stored in text columns (for example `runner.ts`, `job-kind.ts`, `job-tool.ts`, written as in `enum.md`).
- Web UI primitives: `packages/ui-web/src/primitives/` (shadcn on Base UI; imported through subpaths such as `@repo/ui-web/primitives/button`).
- Marks registry: `packages/ui-web/src/mark.tsx` (`Mark`) and `mark-accolade.tsx` (`MarkAccolade`), with the glyph keys in `packages/ui-web/src/lib/glyphs.ts`; imported as `@repo/ui-web/mark` and `@repo/ui-web/mark-accolade`. An unknown glyph key renders the generic mark.
- Agent tool endpoint: `apps/admin-next/src/app/api/mcp/route.ts` (`POST` only; bearer secret checked by `src/lib/mcp/auth.ts`), tools registered in `src/lib/mcp/server.ts` on `@modelcontextprotocol/server`, tool names fixed in `packages/lib/src/schemas/job-tool.ts`. Claude reaches it through a claude.ai custom connector that sends `RUNNER_SECRET_CLAUDE`; setup in `docs/deployment/0004-claude-connector.md`. There is no `.mcp.json`.
- Admin helpers: `parseDatabaseError` in `apps/admin-next/src/lib/db-error.ts` turns unique and `Restrict` violations into messages; `readSettings()` in `src/lib/settings.ts` is the Settings inventory; `src/lib/labels.ts` holds vocabulary labels; `src/lib/derive-*.ts` compute state instead of storing it.
- Styling tokens: `configs/ui/global.css` and `configs/ui/colors.ts` — `task check` fails when they drift.
- Dependency versions: `pnpm-workspace.yaml` (`catalog:`); manifests only reference the catalog.

## Dependency boundaries (hard rules)

- Data flows down. Import from below, never above or beside.
- `apps/*` may import from `packages/*`; never from another `apps/*`.
- `email` may import `db`, `lib`, `i18n`; never `ui-web`.
- `ui-web` may import `lib`, `i18n`; never `db`, `email`.
- `db`, `lib`, `i18n` depend only on external libraries.
- No deep imports from outside a directory that exposes an `index` — go through the index; files inside it, co-located tests included, import their siblings directly.
- Full table: `docs/development/0000-overview/structure-topology.md`.

## Coding conventions that matter here

- Reverse-order naming: `form-award/` with `FormAward`, `action-award-create.ts` with `actionAwardCreate`. See `docs/development/0002-rules/naming.md`.
- Prefer named exports over default exports. See `docs/development/0002-rules/named-over-default-exports.md`.
- Prefer Next.js server actions for internal web frontend-backend calls; revalidate paths inside the action. Return `{ type: 'ok' } | { type: 'bad', message }` and navigate from the client on success.
- Wrap end-user text with Lingui macros (`<Trans>` preferred, `t` when `<Trans>` cannot express it). `apps/admin-next` is exempt — admin text stays plain. Outside JSX, translate with `i18n._(msg`...`)` (`msg` from `@lingui/core/macro`) on the instance from `setupI18n` in server components or `getRequestI18n()` in server actions; Lingui deprecated `t(i18n)`. Never activate a locale on the global instance.
- Base UI primitives compose custom elements through the `render` prop (never `asChild`); unmount modals with `onOpenChangeComplete`; toasts use `toast.add(...)` from `@repo/ui-web/primitives/toast`.
- Parse external objects (DB JSON, third-party responses, URL params) with Zod schemas. See `docs/development/0003-coding/schemas-for-external-objects.md`.
- Use `findUniqueOrThrow` for internal lookups where presence is expected; catch only user-correctable errors.
- No type assertions (`as`), except `as const`; no `any`; no non-null assertions (`!`). Context hooks throw when their provider is missing instead of asserting.
- Dependency boundaries are enforced by lint (`no-restricted-imports` blocks in `eslint.config.mjs`); `task check` fails on a violation.

## Writing style (always applies)

@docs/development/0002-rules/bullet-points.md
@docs/development/0002-rules/text-capitalization.md

## When you are unsure

- Find the relevant doc in `docs/` first.
- Check `examples/web/src/` for form, modal, server-action, and complex-component reference implementations. For admin pages, copy `apps/admin-next/src/components/table-awards/`, `detail-award/` and `form-award/`, which also follow the server-action rules of `form.md` and the list-page pattern of `list-page.md`.
- Ask before structural decisions (new package, new app, new top-level folder).
