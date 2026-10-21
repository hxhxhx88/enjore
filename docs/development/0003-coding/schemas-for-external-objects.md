# Schemas for external objects

Everything within this codebase is type safe. However, we do not control objects from external sources. Typical examples include:

- Serialized JSON saved in the database
- JSON responses from external API calls
- JSON request bodies from incoming requests
- URL query parameters

Follow these rules when handling external objects:

- **Always define the schema** using Zod to specify the expected shape.
  - Save a schema that several places read, such as the shape of a `Json` column, in `packages/lib/src/schemas/[name].ts` so it is accessible to the entire codebase. A schema only one route reads stays next to it, such as the query parameters of a list page in `search-parameters.ts`, which fall back with `.catch` instead of failing the page.
- Use Zod to parse raw objects before processing them.
- Ensure that any object entering the codebase boundary is strongly typed.
- `packages/lib/src/schemas/` also holds the domain vocabularies stored in text columns, such as `runner.ts`, `job-kind.ts` and `job-tool.ts`, written as in `enum.md`, and `job-payload.ts`, which maps each job kind to the schema of its `jobs.payload`.
