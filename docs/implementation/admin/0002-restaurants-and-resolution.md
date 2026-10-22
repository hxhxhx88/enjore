# Restaurants and resolution

The second milestone of the admin in `apps/admin-next`. Restaurants are created by hand through the resolver, carry Google Places facts with their origins, belong to chains, keep their official names as translations, and are listed with search and filters. It implements "Resolve a restaurant" and the basics part of "Edit basics and links" of `docs/product/0001-admin-web.md`, and the "Restaurant", "Chain" and "Identity" sections of `docs/product/0000-project-overview.md`. It needs milestone 0001.

## Goal

- The operator types a name and an address, or pastes a Google Maps link, and gets a restaurant with its Places facts, or is taken to the one that already exists.
- Every fact shows where it came from, can be edited or cleared by hand, and a refresh from Places leaves hand-set facts alone.

## Scope

- In: the Places client and fact mapping, the resolver with its scoring helpers, restaurant creation and deletion, the restaurant list and detail with the "Basics" section, chains, the translations editor with "Make canonical", "Refresh from Places" by hand, a stale-basics filter.
- Out: accolades, the duplicates section and merge (0003), the profile and the links (0004), periodic refresh (0008).

## Design

- Places client `src/lib/places/client.ts` calls the Places API (New): text search with a location bias on the region, and place details with a field mask limited to id, display name, formatted address, address components, location, phone, website, regular opening hours and business status. Responses are parsed with a new `packages/lib/src/schemas/google-places.ts`. The keys are `GOOGLE_PLACES_API_KEY` and the client variable `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY`, added to `client` in `src/lib/env.ts`.
- Fact mapping `src/lib/places/map-facts.ts` turns a place into the seven facts: business status (`OPERATIONAL` to `open`, `CLOSED_TEMPORARILY` to `temporarily-closed`, `CLOSED_PERMANENTLY` to `permanently-closed`), opening hours normalized to `packages/lib/src/schemas/opening-hours.ts` including periods that close after midnight, district from the neighborhood or sublocality component, region from the country component. Fixtures for Hong Kong, Macau and a Japanese address drive the tests.
- Resolver: orchestration in `src/lib/resolver/resolve-entry.ts`, `candidates.ts` and `apply-resolution.ts`; pure helpers with tests in `src/lib/resolver/normalize.ts` (NFKC, lowercase, punctuation and spaces stripped, CJK kept), `similarity.ts` (the Dice coefficient over character bigrams, taken as the maximum over the entry's names and the restaurant's canonical and translated names; token Dice for addresses after removing "Hong Kong" and "香港"), `distance.ts` (haversine), `maps-url.ts` (name and coordinates from a Google Maps URL, short links followed server-side) and `decide.ts` (the decision table).
- Match order, as the PRD states: a `SourceReference` with the same award and normalized listing URL is a match. Otherwise a Places text search of the name and address, biased to the region, where a Maps link contributes its name and coordinates; the top result is trusted when name similarity is at least 0.8, or at least 0.5 together with address similarity of at least 0.5; a restaurant that owns that place id is a match. Otherwise the candidates are the restaurants of the region within 300 metres, or with name similarity of at least 0.6 when there are no coordinates, ranked and shaped as `importCandidateSchema` in `packages/lib/src/schemas/import-entry.ts`.
- Decision: a trusted place id nobody owns, with no candidate at or above 0.6 within 300 metres, creates the restaurant; anything else is unresolved and waits for the operator. Fuzzy matches are never accepted automatically. A candidate that belongs to a chain is labelled "branch of" that chain rather than shown as a duplicate. The thresholds live in one constants object and are tuned on the first real import.
- Creation `src/lib/restaurant-create.ts`, shared with 0003 and 0005: the seven facts with origin `google-places`, `googlePlaceRef`, `googlePlacesRefreshedAt`, slug, region, a `SourceReference` when a listing URL is known, and Translation rows for the other official names; two names with the same locale are an input error. A unique violation on the place id or the listing means the restaurant exists, and the operator is taken to it.
- Deletion `src/lib/restaurant-delete.ts`: one transaction that deletes in order the profile, the draft, the artworks and the restaurant, because `Restrict` on the profile's artwork and `Cascade` from the restaurant collide inside a single cascading delete; then the Translation rows of `restaurants`, `restaurant_profiles`, `restaurant_profile_drafts` and `accolades` for that record, which no foreign key removes. Import entries that pointed at the restaurant become unresolved again, which the schema chooses on purpose. Object removal in R2 is added in 0004.
- "Add restaurant" is a two-step sheet, `src/components/sheet-restaurant-add/` with its own store: the entry form (canonical name and locale, other names, address, region defaulting to `hk`, or a Google Maps link) calls `action-restaurant-resolve.ts`; a match navigates to the restaurant; a new restaurant shows the Places facts and the candidates as warnings before `action-restaurant-create.ts`; an unresolved entry offers a candidate to open or "Create anyway".
- Detail `/restaurants/[id]` with `src/components/detail-restaurant/`: the header shows the canonical name with its locale, the slug, the region, the state badges and a menu with "Delete". The "Basics" section, `src/components/section-basics/`, shows each fact with its value and an origin badge, "Edit" (the origin becomes `manual`), "Clear" (null with origin `manual`), the coordinates with a Static Maps image (`NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY`, restricted by referrer) and the "Open in Google Maps" link built from the place id, and the chain picker.
- "Refresh from Places", `action-restaurant-refresh.ts`: updates the facts whose origin is `google-places`, sets `googlePlacesRefreshedAt`, and records an inline `refresh-google-places` job targeting the restaurant with no attempt, finished with a result listing the changed fields or with the Places error. The same function serves the periodic refresh later.
- Chains: a combobox of existing chains with inline creation in the basics form, the fields in `src/components/form-chain/` and `action-chain-create.ts` and `action-chain-update.ts` next to the component that opens it; "Edit chain" from the restaurant page. Chains have no page of their own.
- Translations editor `src/components/editor-translations/`, generic over table, record and field and validated against `translatableFields` in `packages/lib/src/schemas/translation.ts`: one row per locale with add, edit and delete, and "Make canonical", which swaps the row's value and locale with the record's canonical value and locale in one transaction. Actions `action-translation-upsert.ts`, `action-translation-delete.ts` and `action-restaurant-name-swap.ts`. It serves restaurant and chain names here and profile text in 0004.
- List `/restaurants` with `src/components/table-restaurants/`: name with locale, region, district, chain, publication state, business status and flags; search over the name and its translations; filters for region, chain, publication state, business status and stale basics (refreshed more than 30 days ago); a badge for a published restaurant whose status turned closed. Publication state is derived by `src/lib/derive-publication-state.ts` and filtered through where clauses on `profile` and `withdrawnAt`.
- Primitives installed: popover, command (the combobox).

## Work

- Add the environment variables, the Places client, the response schemas and the fact mapping with tests.
- Write the scoring helpers and the decision table with tests, then the resolver orchestration.
- Write `restaurant-create.ts` and `restaurant-delete.ts`.
- Add `routes.restaurants.list` and `routes.restaurants.detail(id)`, the sidebar item, the `@header` pages, the list with filters and search, and `derive-publication-state.ts`.
- Build "Add restaurant" with its resolve and create actions.
- Build the detail page, the "Basics" section with per-fact edit and clear, the map preview, "Refresh from Places", the chain picker and "Edit chain".
- Build the translations editor and "Make canonical"; mount it for the restaurant and chain names.
- Add "Delete" to the header menu; add the restaurant cards to the dashboard.

## Done when

- Real Hong Kong restaurants created by hand in production carry Places facts with origin `google-places`; a second attempt with the same place opens the existing record instead of creating one.
- An edited fact becomes `manual` and survives "Refresh from Places"; the refresh appears as a finished inline job.
- "Make canonical" swaps a Chinese and an English name both ways.
- The list filters by region, chain, publication state, business status and stale basics, and searches translated names.

## Boundaries

- No accolades yet, so every restaurant is unpublished and the publication filter has one useful value.
- The resolver is used only by "Add restaurant"; the pasted list and the agent's tool reuse it in 0003 and 0005.
- Thresholds are provisional until the first import produces real numbers.
