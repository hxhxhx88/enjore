# Accolades and editions

The third milestone of the admin in `apps/admin-next`. Accolades are managed and verified, an edition is filled from a pasted list that runs through the resolver, unresolved entries wait on the edition page, and duplicates are found and merged. It implements "Import an edition" without the agent, "Manage accolades on a restaurant" and "Merge duplicates" of `docs/product/0001-admin-web.md`. It needs milestone 0002.

## Goal

- The operator pastes the entries of an edition and ends with every entry resolved, created or discarded, every accolade carrying a reference, and the edition marked verified.
- The same import path is later called by the agent's tool and by manual mode, so this milestone proves it without a runner.

## Scope

- In: facet rules, the "Accolades" section, the import path, the edition page with counts and tables, "Paste a list", "Mark verified", the duplicates section and merge, award and unverified filters on the list.
- Out: "Import with agent", "Copy prompt" and the job queue (0005); the profile (0004).

## Design

- Facet rules `src/lib/accolade-facets.ts`, with tests: an accolade carries only the facets its award declares (`hasTier`, `hasRank`, `hasLabel`, and a score when `scoreMax` is set), a tier name must be one of the award's tiers, a score lies between 0 and `scoreMax`, and an award without tiers allows one accolade per restaurant and edition. A violation is an input error returned to whoever submitted the entry, never an unresolved entry.
- "Accolades" section `src/components/section-accolades/` on the restaurant page: mark, award, edition, facets, reference, origin and verified. "Add" opens a sheet whose form picks the award, then the edition, then the facets the award declares, with the mandatory reference URL and a note; "Edit", "Verify", "Unverify" and "Remove" are modals. Actions `action-accolade-create.ts`, `action-accolade-update.ts`, `action-accolade-verify.ts` and `action-accolade-delete.ts`. Origin is derived by `src/lib/derive-origin.ts`: no attempt is the operator, an attempt by the `manual` runner is manual mode, any other runner is an agent or a system task.
- Import path `src/lib/import/submit-entry.ts`, shared with the agent's tool and manual mode in 0005: given an edition and an `importEntryPayloadSchema` object, it validates the facets against the award, creates the `ImportEntry` with the caller's `attemptId`, records an inline `resolve-identity` job targeting the entry, runs the resolver, and applies the outcome. A match or a confident new restaurant sets `restaurantId`, creates one unverified accolade per tier, or one plain accolade, with the entry's `attemptId` and `importEntryId`, and adds the `SourceReference` when it is missing; otherwise the candidates are stored and the entry stays unresolved. The job's result records how the entry was matched; a Places failure lands in its error and "Retry" runs it again.
- Paste format `src/lib/import/parse-result.ts`: a JSON object with `entries`, an array of `importEntryPayloadSchema`, and optional `foundCount` and `notes`. It is the result format that "Copy prompt" prints in 0005, so a list produced by hand, by Claude or by ChatGPT pastes the same way.
- Edition page `/awards/[id]/editions/[edition-id]` completes below `header-edition.tsx`, which already shows the import status badge and the expected and found counts: the submitted, resolved, unresolved and discarded counts, the accolade table (restaurant, facets, reference, origin, verified, "Verify"), and the unresolved entries table with each entry's names, address, facets and ranked candidates (name similarity, distance, "branch of" where it applies) and the actions "Pick", "Create new" and "Discard". "Paste a list" opens a sheet, added to the `ModalData` union of `src/components/detail-edition/context.tsx`, with the format, an inline example and a textarea; entries are created with `attemptId` null and resolved in chunks of 20 per server-action call with a progress bar, because a few hundred Places lookups do not fit one invocation. The paste sets `importedAt` when it is null. "Mark verified" is enabled when no entry is unresolved and verifies every accolade of the edition and the edition itself in one transaction.
- Duplicates section `src/components/section-duplicates/` on the restaurant page: restaurants whose name similarity is above the resolver's threshold within walking distance, excluding the same chain, found by a bounding-box query and scored with the resolver's helpers. "Merge" opens a modal that asks which record survives and shows the plan computed by `src/lib/merge-plan.ts`, with tests: what moves, and the conflicts that need a choice, which are accolades of the same edition on both records (including two tier-less ones, which the unique index does not catch), place ids that differ, name translations present on both for one locale, and chains or regions that differ. Defaults keep the survivor's value and take the other record's `verifiedAt` when only it was verified.
- Merge `action-restaurant-merge.ts`, one transaction: when the survivor has a profile or a draft, the other record's are deleted with their Translation rows; artworks are moved by updating `restaurantId`, and the composite foreign keys declared `ON UPDATE CASCADE` move a surviving profile or draft with them; accolades, source references and import entries are moved; finished jobs are moved and unfinished ones cancelled; name translations the survivor lacks are moved; the chosen facts are copied; the other record is deleted. The survivor's published profile is never written.
- List additions: filter by award, and a badge and filter for restaurants with an unverified accolade.

## Work

- Write `accolade-facets.ts` and `derive-origin.ts` with tests.
- Build the "Accolades" section, its form and actions; mount it on the restaurant page.
- Write `submit-entry.ts` and `parse-result.ts`; add the inline `resolve-identity` job rows.
- Complete the edition page: counts, badge, accolade table, unresolved entries with "Pick", "Create new" and "Discard", "Paste a list" in chunks with progress, "Mark verified".
- Write `merge-plan.ts` with tests, then the merge action and the duplicates section.
- Add the award filter and the unverified flag to the list.

## Done when

- A real edition pasted as JSON in production resolves known venues onto existing restaurants, creates the new ones, parks the ambiguous ones with ranked candidates, and "Mark verified" is blocked until none remain.
- Acceptance scenario: Asia's 50 Best 2025 pasted after the Michelin list gives a restaurant present in both one record with two accolades, and a wrong match is fixed in the duplicates section by merging.
- Acceptance scenario: a Cantonese restaurant with a Chinese and an English official name gets the Chinese name as canonical and the English one as a translation; an Italian one gets the English name; "Make canonical" swaps either.
- Acceptance scenario: a chain with three branches filters the list, and the duplicates section stops proposing the branches as duplicates of each other.

## Boundaries

- Imports are manual here; "Import with agent" and the agent's reported counts arrive with the queue in 0005.
- Merge moves profile and draft rows generically; they only exist once 0004 lands, and 0004 verifies the merge with them.
