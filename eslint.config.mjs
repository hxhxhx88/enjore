import antfu from '@antfu/eslint-config'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import reactHooks from 'eslint-plugin-react-hooks'

const ignores = [
  '.pnpm-store/',
  // Do not lint UI primitives which are installed by 3rd party libraries like shadcn.
  'packages/ui-web/src/primitives',
  'packages/db/prisma/migrations',
  'generated',
  // Next.js automatically generates this file.
  'apps/**/next-env.d.ts',
]

// Route segment exports that Next.js reads from page and layout files.
const nextRouteExports = [
  'dynamic',
  'dynamicParams',
  'revalidate',
  'fetchCache',
  'runtime',
  'preferredRegion',
  'maxDuration',
  'generateStaticParams',
  'metadata',
  'generateMetadata',
  'viewport',
  'generateViewport',
  'generateImageMetadata',
  'generateSitemaps',
]

// Type-aware rules only run on real TypeScript files; code blocks in markdown have no project behind them.
const typeScriptFiles = ['**/*.?([cm])ts', '**/*.?([cm])tsx']
const typeScriptIgnores = ['**/*.md/**']

// Dependency boundaries from `docs/development/0000-overview/structure-topology.md`. A later config object replaces
// the whole rule setting for the files it matches, so every block lists the shared pattern together with its own.
const crossWorkspaceImport = {
  regex: String.raw`(^|/)(apps|packages)/[^/]+/`,
  message: 'Import other workspaces through their package name; apps never import other apps.',
}

function restrictImports(files, patterns) {
  return {
    files,
    rules: {
      'no-restricted-imports': ['error', { patterns: [crossWorkspaceImport, ...patterns] }],
    },
  }
}

export default antfu({
  formatters: true,
  react: true,
  typescript: {
    // Enables the type-aware rules. Every TypeScript file must belong to a tsconfig project; the root `tsconfig.json`
    // covers the files outside the workspaces.
    tsconfigPath: 'tsconfig.json',
  },
  nextjs: true,
  ignores,
}, {
  // The antfu preset does not load the official React hooks plugin. Its recommended config carries the rules of hooks,
  // exhaustive deps, and the React Compiler diagnostics that keep components compiler-safe.
  ...reactHooks.configs.flat.recommended,
  files: ['**/*.{ts,tsx}'],
  ignores,
  rules: {
    ...reactHooks.configs.flat.recommended.rules,
    // A stale dependency list is a bug, not a style issue.
    'react-hooks/exhaustive-deps': 'error',
  },
}, {
  // Accessibility of the rendered markup; eslint-react only covers correctness.
  ...jsxA11y.flatConfigs.strict,
  files: ['**/*.tsx'],
  ignores,
}, {
  rules: {
    // Enforce explicit return types on all functions to prevent accidental changes to a function’s signature.
    'ts/explicit-module-boundary-types': 'error',
    // Defining something later in the file can improve readability without harming the code.
    'ts/no-use-before-define': 'off',
    // File name should be kebab-case.
    'unicorn/filename-case': ['error', { cases: { kebabCase: true } }],
    // Not needed — using App Router instead of Pages Router.
    '@next/next/no-html-link-for-pages': 'off',
    // We are not only working in the node environment, allow using `process.env` is pretty safe.
    'node/prefer-global/process': 'off',
    // This bans the use of type assertions ('as' and '<Type>')
    'ts/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
    // Escape hatches from the type system are not allowed either.
    'ts/no-explicit-any': 'error',
    'ts/no-non-null-assertion': 'error',
    // Keep short JSX on one line. The preset's `single-child` would split `<Trans>Sent to {email}.</Trans>` into one
    // child per line, and JSX drops the whitespace around a line break, which changes the translated message.
    'style/jsx-one-expression-per-line': ['error', { allow: 'single-line' }],
  },
}, {
  // Type-aware rules beyond the preset's set.
  files: typeScriptFiles,
  ignores: typeScriptIgnores,
  rules: {
    'ts/no-deprecated': 'error',
    'ts/no-unnecessary-boolean-literal-compare': 'error',
    'ts/no-unnecessary-condition': 'error',
    'ts/only-throw-error': 'error',
    'ts/prefer-nullish-coalescing': 'error',
    'ts/prefer-optional-chain': 'error',
  },
}, {
  files: ['apps/*/src/app/**/*.tsx'],
  rules: {
    // The preset only whitelists these exports when `next` is a root dependency, which is not the case in a monorepo.
    'react-refresh/only-export-components': ['error', { allowExportNames: nextRouteExports }],
  },
}, restrictImports(['packages/ui-web/**'], [{
  group: ['@repo/db', '@repo/db/*', '@repo/email', '@repo/email/*'],
  message: 'UI must stay dumb: `ui-web` may only import `lib` and `i18n`.',
}]), restrictImports(['packages/email/**'], [{
  group: ['@repo/ui-web', '@repo/ui-web/*'],
  message: 'Backend packages must not depend on UI: `email` may only import `db`, `lib` and `i18n`.',
}]), ...['db', 'lib', 'i18n'].map(name => restrictImports([`packages/${name}/**`], [{
  // A package may import itself through its own name (its tsconfig `paths` alias), nothing else from the repo.
  regex: String.raw`^@repo/(?!${name}(/|$))`,
  message: 'Core packages (`db`, `lib`, `i18n`) depend on external libraries only.',
}])), restrictImports(['apps/**', 'configs/**', 'examples/**'], []), {
  files: [
    '**/README.md',
    '**/AGENTS.md',
    '**/CONTRIBUTING.md',
    '**/SKILL.md',
    // When @antfu/eslint-config lints markdown files, it extracts code blocks and treats them as virtual files with paths like SKILL.md/0.ts.
    '**/*.md/**',
  ],
  rules: {
    'unicorn/filename-case': 'off',
  },
})
