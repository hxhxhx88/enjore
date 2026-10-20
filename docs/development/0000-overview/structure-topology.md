# Codebase topology

To maintain a clean architecture, the following dependency rules must be strictly observed.

For the directory tree and package naming conventions, see `structure-monorepo.md`.

## The hierarchy

Data flows **down**. You may import from packages _below_ you, but never _above_ or _beside_ you.

| Level       | Scope               | Can Import ✅             | Cannot Import ❌                               |
| :---------- | :------------------ | :------------------------ | :--------------------------------------------- |
| **App**     | `apps/*`            | everything in `packages/` | -                                              |
| **Backend** | `email`             | `db`, `lib`, `i18n`       | `ui-web` (backend should not depend on UI)     |
| **UI**      | `ui-web`            | `lib`, `i18n`             | `db`, `email` (UI must be dumb)                |
| **Core**    | `db`, `lib`, `i18n` | external libraries only   | each other (keep them pure), or anything above |

## Enforcement

- The `no-restricted-imports` blocks in `eslint.config.mjs` encode this table; an import across a forbidden boundary, or a relative import into another workspace, fails `task check`.
- The "no deep imports" rule below is not enforced by tooling yet.

## Forbidden patterns

- ❌ No deep imports: if a directory has an `index` in it, can only import those exposed by the index.
- ❌ No app-to-app imports: `apps/*` cannot import code from other `apps/*`. Shared code must move to `packages/`.
