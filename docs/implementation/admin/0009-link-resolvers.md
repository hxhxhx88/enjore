# Link resolvers

The ninth milestone, a slot rather than a plan. Outbound links are resolved automatically one platform at a time, 大众点评 (Dianping) first, then OpenRice, then Apple Maps. It implements the "Link resolvers" milestone of `docs/product/0001-admin-web.md` and the "Outbound links" section of `docs/product/0000-project-overview.md`. It needs milestone 0006, whose `links` job already lets an agent find references by research.

## Goal

- A restaurant's Dianping, OpenRice and Apple Maps references are filled without the operator, and checked against the venue's name and address.

## Scope

- In: one step per platform, each starting with a spike that decides the approach.
- Out: everything else; the manual link fields from 0004 remain the fallback.

## Design

- Each platform gets its own step with a spike first, because the three differ: Apple Maps has a server API that searches places by name and location and is the likeliest deterministic resolver; OpenRice and Dianping have no public API, so the candidates are a tightened `links` prompt with a verification tool that fetches the candidate page and checks the name and address, a deterministic search of the platform's site, or staying manual.
- Whatever resolves a link writes it into the draft's `links` field, as the agent does, so a resolved link reaches users only when published.
- The apps build the web URL or the app link from the reference with `packages/lib/src/link-url.ts`; adding a platform is a new key in `packages/lib/src/schemas/links.ts` and a builder, not a schema change.

## Done when

- Each platform's step ends with either a resolver in production or a written decision to stay manual, recorded here and in the pipeline spec.

## Open questions

- Whether Dianping can be resolved without an account, and whether the apps' name search on Dianping is good enough to postpone it.
- Whether an Apple Maps place identifier is stable enough to store, or whether a search by name and coordinates at display time serves better.
