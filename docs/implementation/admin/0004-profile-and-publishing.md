# Profile and publishing

The fourth milestone of the admin in `apps/admin-next`, and the end of the manual factory. Every field of the enriched profile is editable by hand in its draft and published forms, posters are uploaded with a crop and selected, and a restaurant is published through the checklist. It implements "Generate and review the profile" without generation, "Posters" for upload and selection, "Publish and withdraw" and the links part of "Edit basics and links" of `docs/product/0001-admin-web.md`. It needs milestone 0003, because publishing requires a verified accolade. It creates `docs/implementation/0003-enrichment-pipeline.md` with its storage section.

## Goal

- A restaurant goes from created to published with a summary and a poster the operator produced elsewhere, and the public apps will read exactly what the operator saw.
- Everything an agent will later write can already be written, edited and cleared by hand, so automation lands on a working manual flow.

## Scope

- In: the field registry and write action, the "Profile" section with its editors, the translations of profile text, the "Posters" section with upload, crop and selection, object storage, the checklist, publish, discard, withdraw and restore, the pending-draft and missing-field filters.
- Out: "Generate" and "Regenerate" (0006), rendering (0007), batch publish (0007).

## Design

- Field registry `src/lib/profile-fields.ts`, with tests: each of the eight fields (summary, article, canonical description, poster brief, structured profile, menu, links, poster) maps to its column, its kind (markdown, JSON, links, poster) and its schema from `packages/lib/src/schemas/`. One action, `action-profile-field-write.ts`, takes the restaurant, the target (`published` or `draft`), the field and a value or null, validates with the field's schema and writes. Null JSON is written as `Prisma.DbNull`. Clearing the published summary or poster is refused with a bad message: the NOT NULL columns are the publish gate.
- Drafts: `src/lib/draft-create.ts` creates the draft on the first draft write, as a copy of the published profile with the profile's Translation rows copied under the draft's key, or empty with `locale` from the restaurant's `nameLocale`.
- "Profile" section `src/components/section-profile/`, a complex component with its own store: one row per field with the published value and the draft value side by side; draft controls "Edit" and "Clear"; "Edit" on the published value with immediate effect; in the header "Publish draft", disabled with the missing checklist items listed, and "Discard draft". "Generate" and "Regenerate" arrive in 0006.
- Editors, each a modal: `editor-markdown.tsx` is a textarea with a preview tab rendered by `react-markdown` with `remark-gfm` and prose styles from `@tailwindcss/typography`; `editor-structured-profile.tsx` is a grouped form built from the vocabularies in `packages/lib/src/schemas/structured-profile.ts`, every factor clearable, with a raw JSON tab validated by `structuredProfileSchema`; `editor-menu.tsx` edits menus, sections and items with `useFieldArray`, plus the source URL, the capture date and the currency, with a raw JSON tab validated by `menuSchema`; `editor-links.tsx` edits the platform references with the URL built by `packages/lib/src/link-url.ts` (with tests) shown next to each, and explains the fallback to "Search on Dianping" while the Dianping reference is empty.
- Translations of profile text: the text editors carry locale tabs for the native locale, `zh-cn` and "Add locale"; a non-native locale edits a Translation row of `restaurant_profiles` or `restaurant_profile_drafts` through the editor from 0002.
- "Posters" section `src/components/section-posters/`: the variants of the restaurant with a preview, the size, the origin (upload, or the attempt's runner) and the brief. "Upload artwork" opens a modal with a crop step fixed to 16:9 (`react-easy-crop`, exported through a canvas at the crop's native resolution, with a warning below 1280 by 720), then uploads with a presigned PUT URL from `action-poster-upload-url.ts` and records the row with `action-poster-artwork-create.ts`, `attemptId` null. "Select" sets `posterArtworkId` on the draft, or on the published profile with immediate effect. "Delete variant" is refused while a profile or draft references it.
- Storage `src/lib/storage.ts` on `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`: objects are keyed `posters/<restaurantId>/<artworkId>.<ext>` and served from `R2_PUBLIC_BASE_URL`, a Cloudflare custom domain with image transformations enabled. There are no derivatives: `packages/lib/src/poster-url.ts` (with tests) builds the `/cdn-cgi/image/width=…,format=auto/` URL for a size, used by the admin's previews now and by the apps later. Environment: `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`, `R2_PUBLIC_BASE_URL`; "Settings" gains the row "Cloudflare R2". A new `docs/deployment/0004-object-storage.md` describes the bucket, the custom domain, the transformations and the CORS rule that allows PUT from the admin origin. `restaurant-delete.ts` gains best-effort removal of the restaurant's objects after the transaction commits.
- Checklist `src/lib/publish/checklist.ts`, pure with tests: coordinates present, at least one verified accolade, a draft with a summary and a selected poster, and a `zh-cn` summary translation of the draft when the draft's locale is not `zh-cn`. It returns named items with a flag each, so the UI lists what is missing.
- Publish `src/lib/publish/publish.ts`, one transaction with an explicit timeout: re-run the checklist, upsert the `RestaurantProfile` from the draft, delete the profile's Translation rows then re-key the draft's rows to `restaurant_profiles` and the profile id, delete the draft. Discard deletes the draft and its rows. "Withdraw" and "Restore" toggle `withdrawnAt` from the header menu; nothing else moves.
- List additions: a badge and filter for a pending draft, and a filter for restaurants missing a given profile field.
- The pipeline spec is created with the "Storage" section: key layout, public base URL, transformation URL shape, environment variables.
- Catalog additions: `remark-gfm`, `@tailwindcss/typography`, `react-easy-crop`, `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`.

## Work

- Write `profile-fields.ts`, `draft-create.ts`, `link-url.ts` and `poster-url.ts` with tests; add the environment variables and the Settings row.
- Write `storage.ts` and the upload actions; set up the bucket, the domain and CORS as the new deployment document describes.
- Build the "Posters" section with the crop modal, selection and deletion.
- Build the four editors and the "Profile" section with the field write action.
- Write `checklist.ts` and `publish.ts` with tests; add "Publish draft", "Discard draft", "Withdraw" and "Restore".
- Add the list badge and filters; extend `restaurant-delete.ts` with object removal.
- Create `docs/implementation/0003-enrichment-pipeline.md` with the storage section.

## Done when

- In production a restaurant goes from created to published: a verified accolade, a draft summary, a cropped upload selected as poster, "Publish draft".
- The selected poster serves at width 800 through the transformation URL.
- Acceptance scenario: publishing without a selected poster is blocked and the checklist names the missing item.
- An edit to the published summary shows immediately; "Discard draft" removes the draft and its translations; "Withdraw" sets the state badge.

## Boundaries

- Nothing generates content; every value is typed or pasted by the operator.
- Posters arrive by upload only; rendering and "Regenerate artwork" come in 0007.
- The 16:9 crop is the only shape accepted; the apps assume it.
