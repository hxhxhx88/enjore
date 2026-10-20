# Package structure

Web (Next.js) applications follow a unified directory structure:

```text
apps/*-next
├── src
│   ├── app                # File-based routing directory for routes and layouts.
│   │   └── ...
│   ├── components         # Application-specific components.
│   │   └── ...            # Note: shared components belong in `packages/ui-web`.
│   ├── lib                # Application-specific utilities and constants.
│   │   ├── routes.ts      # Centralized route URL definitions mirroring `app` routes.
│   │   └── ...
│   ├── providers          # Global application providers (e.g., React Query, Theme, I18n).
│   │   └── ...
│   ├── screens            # Full-screen client-side views (the `app` directory handles routing
│   │   └── ...            # and server-side logic).
│   ├── styles             # Global stylesheets and theme configuration.
│   │   └── ...
│   └── types              # Global TypeScript type definitions (`.d.ts`).
│       └── ...
├── package.json
├── tsconfig.json
└── ...
```
