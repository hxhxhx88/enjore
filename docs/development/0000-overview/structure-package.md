# Package structure

Web (Next.js) applications follow a unified directory structure:

```text
apps/*-next
├── src
│   ├── actions            # Server actions shared by several components (see `nextjs-server-action.md`).
│   │   └── ...
│   ├── app                # File-based routing directory for routes and layouts.
│   │   └── ...
│   ├── components         # Application-specific components.
│   │   └── ...            # Note: shared components belong in `packages/ui-web`.
│   ├── lib                # Application-specific utilities and constants.
│   │   ├── routes.ts      # Centralized route URL definitions mirroring `app` routes.
│   │   └── ...
│   ├── providers          # Global application providers (e.g., React Query, Theme, I18n).
│   │   └── ...
│   ├── styles             # Global stylesheets and theme configuration.
│   │   └── ...
│   ├── types              # Global TypeScript type definitions (`.d.ts`), when needed.
│   │   └── ...
│   └── proxy.ts           # Runs before pages: locale detection in `app-next`, Basic Auth in `admin-next`.
├── package.json
├── tsconfig.json
└── ...
```

## Admin specifics

- `src/app/@header/` is a parallel route that renders the breadcrumb. Its `default.tsx` calls `notFound()`, so every body route needs a page there.
- `src/app/api/mcp/route.ts` is the only route handler; its modules live in `src/lib/mcp/`.
- `src/lib/routes.ts` gains a route once its page exists; typed routes reject a link to a page that does not.
- `src/lib/derive-*.ts` compute state instead of storing it, such as `derive-import-status.ts`.
- `src/lib/labels.ts` holds the plain English labels of vocabularies.
