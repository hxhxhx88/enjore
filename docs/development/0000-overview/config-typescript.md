# TypeScript configuration

The `configs/ts` directory contains all shared TypeScript configuration files. Except for the Expo application, all other TypeScript applications and packages in the codebase have a `tsconfig.json` that extends one of these files, based on their runtime environment.

## Strictness

`configs/ts/base.json` turns on every check that has no runtime cost:

- `strict` with `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`: an optional property cannot be set to `undefined` explicitly. A component that passes an optional prop straight through declares it as `prop?: T | undefined`, as `DataTable` does for `className`.
- `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`.
- `verbatimModuleSyntax`: type-only imports must say `import type`, which the lint fixer writes for you.
- `erasableSyntaxOnly`: no enums, namespaces or parameter properties, so every file can run under Node.js type stripping and stays compatible with the native compiler.

## Version

- The TypeScript version is pinned in the `pnpm-workspace.yaml` catalog and shared by every workspace.
- TypeScript 7 (the native compiler) is not adopted yet: typescript-eslint has no support for it until the TypeScript 7.1 programmatic API is available. The shared configs avoid the options TypeScript 7 removed (`baseUrl`, legacy `moduleResolution` values, targets below ES2020), so the move will only require bumping the version.
