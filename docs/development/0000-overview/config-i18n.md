# I18n configuration

The codebase uses [Lingui](https://lingui.dev/) to handle i18n. `packages/i18n` is the single source of truth for i18n-related concerns, such as supported locales and their translations. The latter lives in `packages/i18n/locales`, which is the central place to look for translation resources.

- In `packages/i18n/lingui.config.ts`, configure where to search for translatable texts.
- For web app configuration, check files in `apps/app-next`:
  - `next.config.ts`
  - `src/lib/i18n.ts` — locale detection in the proxy, the `APP_LOCALE` cookie, `setupI18n` for server components and `getRequestI18n` for server actions.
  - `src/providers/i18n.tsx`
  - `src/components/switcher-locale.tsx` — the locale switcher; it links to the same path under another locale, and the proxy stores the visited locale in the cookie.
