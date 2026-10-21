# List page

A list page shows one entity's rows with search, filters and pagination. The admin's "Awards" page is the reference: `apps/admin-next/src/app/(body)/awards/page.tsx` with `src/components/table-awards/`.

## File structure

```text
app/(body)/<entities>/
├── page.tsx                 # server page: parses the search parameters, queries, renders
├── search-parameters.ts     # the Zod schema of `searchParams`, the filter options and the page size
└── button-<entity>-add.tsx  # the create button, when the page has one

components/table-<entities>/
├── select.ts      # the Prisma `select` and the `Row` type derived from it
├── columns.tsx    # `makeColumns()` returning the column definitions over `Row`
├── table.tsx      # the client table over `DataTable` from `@repo/ui-web/data-table`
└── index.ts       # re-exports `select` and the table
```

## Rules

- Parse `searchParams` with Zod and fall back instead of failing: `page` with `.catch(1)`, enum filters with `.catch(undefined)`, the search text trimmed and capped with `.catch('')`. A bad URL shows the first page, never an error.
- Query with `Promise.all([findMany, count])` and a page size of 50; the `where` clause spreads filters conditionally, so `exactOptionalPropertyTypes` holds.
- Filter controls are client components: `src/components/filter-select.tsx`, a Base UI select whose `null` item means all, and `src/components/filter-search.tsx`, a search input debounced by 300 ms. They write their parameter with `searchWithParameters` from `useHrefWithParameters` in `src/lib/hooks.ts` and `router.replace`, and reset `page`; passing `undefined` removes a key. Links that keep the other parameters use `hrefWithParameters`, as `src/components/link-parameters.tsx` and `pagination.tsx` do.
- The filters and `Pagination` read `useSearchParams`, so each sits inside `Suspense`; the table does not.
- A link in a cell is `Button variant="link" nativeButton={false} render={<Link />}`, so the row stays a plain table row.
- Later milestones copy the folder for restaurants and jobs; the shared pieces stay in `src/components/` and `src/lib/hooks.ts`.
