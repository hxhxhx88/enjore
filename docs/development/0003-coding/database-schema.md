# Database schema

The database schema is defined in `packages/db/prisma/schema.prisma`. This file is the single source of truth for the project.

## Model structure

You must organize model fields into **6 distinct semantic groups**. You must strictly **insert a blank line between each group**.

### Group definitions

- **Metadata:** standard lifecycle fields (`id`, `createdAt`, `updatedAt`).
- **Foreign keys:** scalar fields that store IDs (e.g., `userId`, `orgId`).
- **Attributes:** content data fields (e.g., `email`, `name`, `isActive`).
- **Forward relations:** fields that define the relation on this model (e.g., `user User @relation(...)`).
- **Reverse relations:** fields that are back-references from other models (e.g., `posts Post[]`, `profile Profile?`).
- **Configuration:** block-level attributes (`@@index`, `@@map`).

### Formatting example

```prisma
model ModelName {
  // Group 1: Metadata
  id        String   @id @default(cuid())
  createdAt DateTime @default(now()) @map("created_at") @db.Timestamptz
  updatedAt DateTime @default(now()) @map("updated_at") @db.Timestamptz

  // Group 2: Foreign keys
  // (If no foreign keys exist, skip this section but keep separation logic)
  table1Id String @unique @map("table1_id")
  table2Id String @map("table2_id")

  // Group 3: Attributes
  // (Standard data fields)
  attr1 String  @map("attr1")
  attr2 Boolean @default(true) @map("attr2")

  // Group 4: Forward relations
  // (Fields that have @relation attribute)
  table1 Table1 @relation(fields: [table1Id], references: [id], onDelete: Cascade)
  table2 Table2 @relation(fields: [table2Id], references: [id], onDelete: Restrict)

  // Group 5: Reverse relations
  // (Arrays or optional back-references from other models)
  table3 Table3[]
  table4 Table4?

  // Group 6: Configuration
  @@index([table1Id])
  @@map("model_names")
}
```

## General rules

- **Strict separation:** never merge groups. Even if a group is empty (e.g., no foreign keys), maintain the logical separation between adjacent groups where applicable.
- **Naming conventions:**
  - **Fields:** use camelCase (e.g., `firstName`).
  - **DB columns:** use snake_case inside `@map` (e.g., `@map("first_name")`).
  - **Tables:** use plural snake_case inside `@@map` (e.g., `@@map("users")`).
- **Timestamps:** always use `@db.Timestamptz` for `DateTime` fields.
- **Mapping:** always explicitly `@map` field names to snake_case, even if the result is the same (e.g., `email String @map("email")`).
