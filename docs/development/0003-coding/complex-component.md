# Complex component

## General principles

- Use `zustand` to define a component-wise global store for finer-grained state management.
- Use React Context to share props and prevent prop drilling.
- Separate large components into smaller ones in different files for better maintainability.
- The `useStore` and `useProps` hooks throw when their provider is missing, so a misplaced component fails fast instead of reading `undefined`.

## File structure

The recommended file structure for complex components:

```text
my-component/
├── context.tsx    # State definitions, store creation, and context setup
├── index.tsx      # Entry point and context providers
├── render.tsx     # Main rendering logic and sub-component orchestration
└── *.tsx          # Sub-components
```

## Examples

See `examples/web/src/complex-component` for detailed examples and explanations.

## Workflow

- Start with `context.tsx`. Define `State` and `Props` first.
  - Use `stc` for a quick code snippet.
- Create `index.tsx` and implement the provider wrapping.
  - Use `st` for a quick code snippet.
- Implement `render.tsx` and further sub-components.

## Detail page variant

The admin's detail pages keep the store in `apps/admin-next/src/components/detail-<entity>/`, but a server page loads the record, so the entry point is split:

```text
detail-<entity>/
├── action-*.ts           # server actions the modals call
├── context.tsx           # `State` with `modalData`, `Props` with the loaded record
├── header-<entity>.tsx   # the record's fields and its menu
├── index.ts              # exports the provider, the header, the sections and the select
├── modal-*.tsx           # one modal each
├── modal-controller.tsx  # renders the modal that `modalData` names
├── provider.tsx          # creates the store, provides the props, mounts the modal controller
├── section-*.tsx         # tables of child records
└── select.ts             # the Prisma `select` and the payload types derived from it
```

- The server page loads the record with `findUniqueOrThrow({ select })` and lays out the header and sections inside the provider, so there is no `render.tsx`.
- The provider, the header and the sections carry `'use client'`; `select.ts` stays pure, so the page imports it through the same index.
- Every action revalidates the page, so the props stay fresh without fetching on the client.
