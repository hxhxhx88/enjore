---
name: db-schema-change
description: Use when modifying packages/db/prisma/schema.prisma — adding or changing models, fields, relations, or indexes.
---

# DB schema change

## Procedure

- Read `docs/development/0001-workflows/database.md` and `docs/development/0003-coding/database-schema.md`.
- Edit `packages/db/prisma/schema.prisma`. Follow the six-group model layout (metadata, foreign keys, attributes, forward relations, reverse relations, configuration) with a blank line between each group.
- Fields use camelCase with an explicit `@map("snake_case")` even when the snake_case name equals the field name. Tables use plural snake_case via `@@map`. `DateTime` fields always use `@db.Timestamptz`.
- Simple migration: run `task db:dev` to generate and apply.
- Manual SQL (for example, a backfill): run `task db:new -- --name <name>`, hand-edit the generated migration file, then run `task db:dev`.
- After the migration applies, run `task db:gen` to regenerate the Prisma client.
- If the change adds a unique key that user input can violate, or a `Restrict` foreign key, add its message to `uniqueKeys` or `restrictedForeignKeys` in `apps/admin-next/src/lib/db-error.ts`, with a test case.
- Verify with `task check` before handing back.
