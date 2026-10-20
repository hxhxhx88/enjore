# Schemas for external objects

Everything within this codebase is type safe. However, we do not control objects from external sources. Typical examples include:

- Serialized JSON saved in the database
- JSON responses from external API calls
- JSON request bodies from incoming requests
- URL query parameters

Follow these rules when handling external objects:

- **Always define the schema** using Zod to specify the expected shape.
  - Save the schema in `packages/lib/src/schemas/[name].ts` so it is accessible to the entire codebase.
- Use Zod to parse raw objects before processing them.
- Ensure that any object entering the codebase boundary is strongly typed.
