# Form

## General principles

- A form component is solely about UI and has nothing to do with submission logic.
- Use React Hook Form and Zod, following [shadcn's doc](https://ui.shadcn.com/docs/forms/react-hook-form).

## File structure

The recommended file structure for a form component:

```text
my-form/
├── data.ts        # pure mappers between form values and database columns, when they differ
├── field-*.tsx    # a single form field
├── form.tsx       # the final form body
├── hooks.ts       # hooks to manage the form
├── index.ts       # the interface of the component to the outside world
├── provider.tsx   # the provider of the form wrapping the body
└── schema.ts      # the form definition and validation
```

## Examples

See `examples/web/src/form` for detailed examples and explanations. They predate the server-action rules below; `apps/admin-next/src/components/form-award/` applies them.

## Workflow

- Start with `schema.ts`. Define the schema, its validation and `defaultValues`. In the admin, build on `trimmedText`, `optionalUrlSchema` and `slugSchema` from `src/lib/form-schemas.ts`.
- Add `data.ts` when form values and database columns differ: forms hold `''` where the database holds `null`, and `emptyToNull` and `nullToEmpty` from `src/lib/text.ts` map between them. Test the mappers next to them.
- Add `provider.tsx` and `hooks.ts`. Their codes are quite regular and most of the time only need to copy paste from an example. One folder serves both create and edit: the provider merges optional `initialValues` over `defaultValues`, so an edit passes `toFormValues(row)`.
- Implement one by one all the `field-*.tsx` according to your schema.
- Finally, add `index.ts` to define exposed things to the outside.
  - Expose `Form`, `FormProvider` and, when a caller needs it, `FormType`, renamed after the entity: `FormAward`, `FormProviderAward`, `FormTypeAward`.
  - Occasionally, if we want to allow the caller to manage the form, we can expose some hooks.
  - Server actions re-validate their input with the form's schema, so `index.ts` also exposes it as `formSchema<Entity>` (for example `formSchemaAward`), with the pure mappers of `data.ts` (`awardFormToData`, `awardToFormValues`). Keep `'use client'` on `provider.tsx` and add it to `form.tsx`: a server action importing the index pulls both into the server graph, where react-hook-form resolves to a build without hooks.
