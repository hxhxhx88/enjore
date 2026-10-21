# DB package

Prisma is the ORM. `prisma/schema.prisma` is the single source of truth for the project's data structures.

## Field conventions

- Fields use camelCase (for example `firstName`).
- Add an explicit `@map("snake_case")` to every field, even when the snake_case name equals the field name.
- Tables use plural snake_case inside `@@map` (for example `@@map("users")`).
- `DateTime` fields always use `@db.Timestamptz`.

## Model layout

Organize fields into six semantic groups, with a blank line between each:

- metadata (`id`, `createdAt`, `updatedAt`)
- foreign keys (scalar ID fields)
- attributes (content data)
- forward relations (fields with `@relation`)
- reverse relations (arrays or optional back-references)
- configuration (`@@index`, `@@map`)

Even if a group is empty, keep the separation. See the reference layout in `docs/development/0003-coding/database-schema.md`.

## Workflow

- Edit `packages/db/prisma/schema.prisma`.
- Simple change: run `task db:dev` to generate and apply the migration.
- Needs manual SQL (for example, a backfill): run `task db:new -- --name <name>` first, hand-edit the generated migration, then run `task db:dev`.
- After the migration applies, run `task db:gen` to regenerate the Prisma client.
- If the change adds a unique key that user input can violate, or a `Restrict` foreign key, add its message to `uniqueKeys` or `restrictedForeignKeys` in `apps/admin-next/src/lib/db-error.ts`.

## Deep reading

- `docs/development/0001-workflows/database.md`
- `docs/development/0003-coding/database-schema.md`
