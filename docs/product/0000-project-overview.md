# Project overview

This document describes the whole product: a curated guide to notable restaurants in Hong Kong for new Hongkongers from mainland China, built from professional sources and presented through AI-crafted profiles and original posters. It is the context for every other product document. The admin web, the first thing we build, is specified in `docs/product/0001-admin-web.md`. The public web and the mobile app get their own documents when their turn comes. Technical rules for the data pipeline will live in `docs/implementation/0003-enrichment-pipeline.md`.

## Overview

- The product answers one question: where should I eat? It is for inspiration, not for looking things up.
- Restaurants enter the database only from professional sources such as the MICHELIN Guide, the World's 50 Best Restaurants and the Black Pearl Guide. We are not building a restaurant database, and we never collect or show crowd scores and reviews.
- For each restaurant we produce an enriched profile: an original 16:9 poster that conveys its character at a glance, a short summary, a long article, a structured profile of the factors people weigh when choosing a restaurant, a digitized menu, and links to the places where crowd opinion lives.
- The first audience is new Hongkongers from mainland China, so content is produced in Simplified Chinese first. The structure is ready for Traditional Chinese, English and other cities later.
- The owner operates the product alone in v1. The admin web is the factory where data is imported, enriched, reviewed and published. It is built before any user-facing surface.

## Principles

- **Professional sources only**: a restaurant exists in our database because a recognized guide or list recognized it. Every accolade carries a reference to where it was published.
- **Original material**: posters are made by us and texts are written by us. We do not store or display crawled photos, and we do not copy guide prose.
- **Digest over raw**: users get an intuitive introduction, not a pile of links. The raw material stays one tap away through the outbound links.
- **Link out for crowd opinion**: each restaurant links to its Google Maps and 大众点评 (Dianping) records, so a user who wants public comments goes there. We never show ratings.
- **Manual before automatic**: everything an agent can fill, the operator can fill, edit or clear by hand. Automation is added on top of a working manual flow.
- **Nothing reaches users without an explicit publish**: agents and regeneration produce candidates; only the operator publishes.
- **High-end and calm**: the public surfaces feel like a well-designed magazine, dark by default.
- **Minimal v1**: the public product only lets people browse, on a map and in a list. Recommendations come after the database is rich.

## Data flow

- **Sources**: awards, their editions and the distinctions they hand out are managed as data in the admin.
- **Import**: for each edition, an agent collects every recognized restaurant, whatever its region, and writes them in through the server, with a reference for every accolade. The server resolves each entry to one restaurant identity. An import is complete: nobody returns to an edition when another city's turn comes.
- **Enrichment**: for each restaurant, an agent writes a canonical description from public information. Every other artifact is derived from it.
- **Review and publish**: the operator reviews, edits, regenerates with notes, and publishes a snapshot.
- **Presentation**: the public web and the mobile app read published snapshots only.

The admin web is the factory. The public apps are the storefront.

## Sources

[Dolici](https://dolici.com/), a comparable aggregator, uses 22 sources. Our model represents all of them. What differs between sources is the kind of distinction they hand out:

- **Tiered**: an ordered set of named distinctions, such as three, two or one MICHELIN stars.
- **Ranked**: a position in a list, such as number 7 on Asia's 50 Best Restaurants.
- **Scored**: a number on a scale, such as 97.5 out of 100 on La Liste.
- **Membership**: being on the list is the distinction, such as the World's 50 Best Discovery.
- **Named**: a one-off prize with a name, such as "Highest new entry".

A source can combine kinds. La Liste publishes a rank and a score; the 50 Best lists publish a rank and sometimes a named prize. Regional lists such as Asia's 50 Best Restaurants are separate awards of the same kind as their global parent.

| Source                             | Kind of distinction                                                          | Hong Kong relevance in v1                        |
| ---------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------ |
| MICHELIN Guide                     | Tiered: three stars, two stars, one star, Bib Gourmand, Selected, Green star | Seeded, Hong Kong Macau edition                  |
| World's 50 Best Restaurants        | Ranked, named prizes                                                         | Seeded, together with Asia's 50 Best Restaurants |
| World's 50 Best Discovery          | Membership                                                                   | Seeded                                           |
| La Liste                           | Scored and ranked                                                            | Seeded                                           |
| Opinionated About Dining (OAD)     | Ranked, regional lists                                                       | Seeded, Asian list                               |
| Gault & Millau                     | Tiered toques with points                                                    | Later                                            |
| James Beard Foundation             | Named prizes by category                                                     | Later, United States only                        |
| 黑珍珠餐厅指南 (Black Pearl Guide) | Tiered: three, two, one diamond                                              | Seeded                                           |
| Forbes Travel Guide                | Tiered: five-star, four-star, recommended                                    | Seeded                                           |
| Tabelog                            | Scored, tiered awards                                                        | Later, Japan only                                |
| Gambero Rosso                      | Tiered forks with points                                                     | Seeded, Top Italian Restaurants in the world     |
| Good Food Guide                    | Scored, or tiered hats                                                       | Later                                            |
| Falstaff                           | Tiered forks with points                                                     | Later                                            |
| Tatler                             | Membership and named prizes                                                  | Seeded, Tatler Dining Hong Kong                  |
| The Pinnacle Guide                 | Tiered pins, bars                                                            | Later                                            |
| We're Smart World                  | Tiered radishes                                                              | Later                                            |
| AAA Travel                         | Tiered diamonds                                                              | Later, North America only                        |
| Harden's                           | Ranked and scored                                                            | Later, United Kingdom only                       |
| Gayot                              | Scored                                                                       | Later                                            |
| Difford's Guide                    | Scored, bars                                                                 | Later                                            |
| Chef's Table                       | Membership                                                                   | Later                                            |
| Google                             | Crowd rating                                                                 | Excluded, Google appears only as the Maps link   |

"Seeded" means the award and its tiers are created as data when the admin launches. Nothing about a source is hard-coded except the drawings used to render its distinctions.

## Domain model

### Restaurant

- A restaurant is one venue at one address. It can optionally belong to a chain, see "Chain" below.
- It has one or more official names, each as the restaurant writes it and tagged with its language. In Hong Kong a restaurant commonly has both a Chinese and an English official name. One is marked primary. The apps show the name that best matches the viewer's locale, with the other alongside. It also has a stable slug for URLs.
- It carries a region code. Every restaurant an edition recognizes is imported whatever its region; v1 enriches and publishes Hong Kong first.
- Basics come from Google Places once the restaurant is resolved: address, district, coordinates, phone, website, opening hours and business status (open, temporarily closed, permanently closed). They are refreshed periodically. The operator or an agent can override any of them, and an overridden fact is not refreshed. Each fact records its origin: Places, agent or manual.
- Identity: a Google place id once resolved, and one source reference per guide listing it was imported from. See "Identity" below.
- Outbound links: Google Maps, 大众点评 (Dianping), OpenRice, Apple Maps and the official booking page. Links are resolved automatically one platform at a time, starting with Google Maps; see "Outbound links" below.

### Chain

- A chain groups the venues of one brand, such as the branches of a dim sum house. It is optional: most restaurants belong to none.
- A chain has official names in the same form as a restaurant's, and a slug. Its branches are the restaurants that point to it.
- Chains let the apps browse all branches of a brand, and they tell the resolver that two branches are distinct venues rather than duplicates.

### Award, tier, edition, accolade

- **Award**: a source, such as the MICHELIN Guide. It declares which facets its accolades carry (tier, rank, score, label) and the scale of its score when it has one.
- **Tier**: a distinction the award defines once and hands out year after year, such as three stars or Bib Gourmand. Tiers belong to the award, not to a list, so "all restaurants that ever held three stars" is a plain query and a new year needs no new tiers. A tier has a level for ordering and a mark: a glyph key and a count, such as star × 3 or diamond × 2.
- **Edition**: one published list of an award, such as the MICHELIN Guide Hong Kong Macau 2026 or Asia's 50 Best Restaurants 2025, with its region, source URL, an expected count and an import status.
- **Accolade**: the link between a restaurant and an edition. It carries the facets the award declares, in any combination the award allows and nothing else: a tier, a rank, a score, a label. A reference URL is mandatory. It records its origin, manual or agent, and whether the operator verified it. A restaurant holds any number of accolades.
- Invariants: a tier on an accolade belongs to the edition's award; an accolade carries the facets its award declares, or is a plain membership when the award declares none.

### Marks

- Distinctions render in a way that feels native to the source without hard-coding sources. The tier's glyph key selects a drawing from a registry in code, repeated by its count; ranked and scored awards render as marks like "#7" and "97.5/100". An unknown glyph key falls back to a generic mark, so a new award works the moment it is entered, and a new drawing is a small, isolated change.
- The drawings are our own and evoke the distinction: a star, a diamond, a toque, a fork, a radish, a pin, a hat. We never reproduce a guide's logo or trademarked symbol, and the award name and year always appear next to the mark.

### Enrichment artifacts

- Per restaurant: canonical description, poster brief, poster artwork, summary per locale, article per locale, structured profile, menu.
- Every artifact is stored as an immutable version with provenance: the job that produced it, the runner and model, the prompt version, and the upstream version it was derived from. Manual edits are versions too, with manual origin.
- The newest version is the working version unless the operator pins one. Regeneration sees the current version and accepts notes from the operator.
- Structured fields can be locked. A regeneration fills empty fields and never touches locked ones; replacing everything is an explicit choice.
- When a prompt version changes or an upstream artifact is regenerated, downstream artifacts are flagged stale, not regenerated silently.

### Identity

- An incoming entry is matched in this order: an existing source reference to the same guide listing, then the Google place id, then the operator's choice. The resolver proposes ranked candidates with distance and address similarity and accepts automatically only when confident. Everything else waits in the review inbox.
- The same restaurant imported from two guides collapses onto one record and gains a second accolade.
- Relocations and renames are handled in the duplicates and merge flow. Branches of a chain are distinct venues and are never merged. A venue that closes keeps its history and is withdrawn from publication.

### Publications

- Publishing freezes a snapshot: the chosen version of each artifact and the set of verified accolades at that moment. Public apps read publications only.
- Regeneration, agent writes and manual edits create candidates; what users see does not change until the operator publishes again.
- A restaurant is publishable when it has its basics with coordinates, at least one verified accolade, a selected poster and a summary in the launch locale. Readiness is computed, never stored.
- Withdraw hides a restaurant from the public apps. Archive withdraws it and hides it from working lists, with a reason.

### Jobs

Work is tracked as jobs in one queue. Two classes exist:

| Kind                            | Class       | Runner                               |
| ------------------------------- | ----------- | ------------------------------------ |
| Import an edition               | Agent job   | Claude on the owner's subscription   |
| Canonical description           | Agent job   | Claude on the owner's subscription   |
| Structured profile              | Agent job   | Claude on the owner's subscription   |
| Menu                            | Agent job   | Claude on the owner's subscription   |
| Summary and article, per locale | Agent job   | Claude on the owner's subscription   |
| Poster brief                    | Agent job   | Claude on the owner's subscription   |
| Outbound links                  | Agent job   | Claude on the owner's subscription   |
| Resolve identity                | System task | Trigger.dev worker                   |
| Render poster artwork           | System task | Trigger.dev worker, OpenAI image API |
| Refresh basics from Places      | System task | Trigger.dev worker, periodic         |

- Agent jobs need web research and judgment. System tasks are deterministic code.
- The server owns the chain: when a canonical description lands it enqueues the derived artifacts, and when a poster brief lands it enqueues rendering.

## Enrichment pipeline

### Canonical description

- One per restaurant, in English, as long as it needs to be. Chinese names of the venue, dishes, chefs and places are kept verbatim.
- Fixed sections: identity, story and chef, cuisine and signature dishes, space and atmosphere, prices and menus, booking and practicalities, press and awards, sources.
- Every claim points to a source. Uncertain facts are marked. Guides are quoted briefly and with attribution, never copied.
- It is internal. Every downstream artifact reads it instead of the web, so later steps are cheap, consistent and reproducible.

### Structured profile

- Starts small, with factors that are universal to dining rather than specific to Hong Kong, and that public information reliably answers: cuisines, price band per person, occasions (date, solo, business, family, friends, celebration, group), meal periods (breakfast, brunch, lunch, afternoon tea, dinner, late night), formality (casual, smart casual, fine dining), reservation policy (walk-in, recommended, required), menu format (à la carte, tasting menu, both), signature dishes.
- More factors are added one at a time when they pass the same two tests. Local or hard-to-verify facts, such as transit access, payment methods or the languages staff speak, stay out until then.
- Informed by [schema.org/Restaurant](https://schema.org/Restaurant) where it fits.
- Values are locale-independent: controlled vocabularies, numbers, and yes, no or unknown. Labels live in the apps' translations. Free text such as signature dish notes lives in the per-locale content.
- Stored as JSON validated by a shared schema in `packages/lib/src/schemas/`.

### Menu

- Digitized from menus the restaurant publishes on its own site or as PDFs. Photo OCR is out of scope for v1.
- Menus, sections and items with prices, notes and dietary tags, kept in the language the restaurant uses. Each menu records its source URL and capture date, which the apps show, because menus go stale.
- Informed by [schema.org/Menu](https://schema.org/Menu), validated by a shared schema.

### Poster

- The poster is the most important artifact: a horizontal 16:9 image from which a user feels what the restaurant is at a glance.
- It is pure artwork and carries no text. An image model renders it from a poster brief. Names, cuisine, district and award marks are rendered by the apps next to the poster, so one poster serves every locale and nothing competes with the image.
- The brief is written from the canonical description. It chooses the medium that fits the restaurant (editorial illustration, ink wash, oil painting, photoreal still life, collage, and so on), the motifs, the palette and the composition. A versioned house-style brief constrains every poster: palettes that sit well on dark backgrounds, no text, no logos, no recognizable people, no trademarks.
- Several variants are rendered per brief. The operator picks one, pins it, or asks for another round with notes. An automated check rejects artwork that contains text.
- Artwork and the derivatives the apps need are stored in object storage and served through its public domain.
- Articles may later embed additional illustrations produced by the same pipeline, never crawled photos.

### Summary and article

- Per locale, written natively from the canonical description, not translated. Simplified Chinese first.
- The summary is a few sentences that fit a card. The article reads like a food columnist's piece: what the place is, who is behind it, what to order, when to go, what it costs, how to book.

### Outbound links

- Links are resolved automatically, one platform at a time. Google Maps comes first and follows from the place id. 大众点评 (Dianping) is next, and how to link it automatically is worked out as its own step. OpenRice, the dominant local platform, and Apple Maps follow.
- Until a platform's resolver exists, its link is filled by hand. While the Dianping link is missing, the apps offer a name search on Dianping instead.
- The official booking page is kept when it exists.

### Locales

- Locale codes follow the repo: `zh-cn` at launch, `zh-hk` and `en-us` later.
- Adding a locale adds content jobs, not schema.

## Automation strategy

### Principle

- The queue is the product and runners are interchangeable. Every runner drains the same queue through the same tools, and the server owns and versions the prompts. A job is handed out together with its rendered instructions, so improving a prompt is a code change and no runner holds instructions of its own.

### Agent jobs on the owner's subscription

- The primary runner is a Claude Code cloud scheduled task, available on the owner's Claude Max plan. It runs on Anthropic's infrastructure with the owner's machine off, draws on subscription usage, and starts two ways: an hourly schedule, and an API trigger that the admin's "Run now" button calls.
- The task clones this repository, which commits the connection to our tool endpoint, and runs with network access for research and a network secret that attaches our token to requests to our host. Its saved prompt is generic: claim jobs, follow the returned instructions, submit through the tools, repeat until the queue is empty or a per-run limit is reached.
- Alternatives using the same tools: a local worker that loops headless Claude Code on the owner's Mac, and a manual mode in the admin where the operator copies the prompt into Claude or ChatGPT and pastes the result back.
- Platform limits that shape the design: the schedule runs at most hourly, the API trigger allows a bounded number of fires per hour, and usage limits bound how much an overnight batch can do. The queue is therefore priority-ordered, canonical descriptions for every restaurant before derived artifacts, so partial progress is useful.

### System tasks

- Rendering, identity resolution and periodic refreshes from Places run on Trigger.dev, which gives retries, long runs and logs. They report results through the same server write path as agents, with their own token, so validation, provenance and chaining live in one place.

### Paid services

- Claude cannot generate images, and ChatGPT's write-capable connectors confirm each action, so neither can drive poster rendering unattended. Artwork therefore comes from the OpenAI image API at the highest quality settings. The cost per image is small next to the value of the poster.
- Google Places for resolution and basics, Cloudflare R2 for images, Trigger.dev for system tasks. Everything else runs on the existing Vercel and Neon setup.

### Safety

- Agents read untrusted web content. Their tools are scoped to the claimed job, validate every write against a schema, create candidates or unverified records only, and can never verify, publish, pin, merge or delete. Every call is logged. The operator's review stands between agents and users.

## Applications and build order

### Admin web

- The factory: awards, imports, restaurants, artifacts, jobs, review and publishing. Specified in `docs/product/0001-admin-web.md`.

### Public web

- The home page is a landing page that introduces the product, with a "Start browsing" button.
- On mobile, browsing follows the mobile app: a map view and a list view, with the detail in a bottom sheet.
- On desktop, browsing is a split view in the tradition of Google Maps and Airbnb: a scrollable list of poster cards on the left, the map on the right, hover and selection kept in sync, and filters by district, cuisine, price band, occasion and award. Each restaurant also has a shareable page of its own.

### Mobile app

- Map view, in the spirit of Apple Maps: a full-screen map with restaurant markers and the user's location, a horizontally scrollable strip of poster cards at the bottom, and a bottom sheet with the detail when a marker or a card is tapped, swiped down to close.
- List view: one full-width 16:9 poster card per restaurant with the summary and award marks, for when distance does not matter.
- Detail: poster, summary, marks, article, structured profile, menu, and buttons that open the restaurant in Google Maps and Dianping.
- Dark, high-end, calm.
- The app reads a read API over publications, because server actions are not available to it.

### Order

- Admin web first, until the data is good.
- Public web, desktop and mobile, second.
- Mobile app third.
- Later: recommendations once the database is rich, favourites, and accounts reusing the existing email sign-in in `apps/app-next`.

## Out of scope for v1

- Crowd reviews and ratings, ours or imported.
- Bookings.
- More than one operator, roles or permissions.
- Enriching and publishing cities other than Hong Kong. Their restaurants are still imported with every edition.
- Locales other than Simplified Chinese.
- Menus from photos.
- Recommendations and personalization.

## Risks and open questions

- **Guide sites may block agents**: imports fall back to secondary sources such as press coverage, to a pasted list, and to count checks against the expected number of entries.
- **Link resolution beyond Google Maps**: automatic linking to Dianping, OpenRice and Apple Maps is worked out one platform at a time. Until then those links are manual and the apps fall back to a name search.
- **Subscription limits**: how many restaurants one night can enrich is unknown until measured. Priority ordering keeps partial runs useful, and a pay-as-you-go runner on the same tools is the escape hatch.
- **Images and marks**: generated artwork must not contain text, logos or recognizable people; distinctions are rendered with our own drawings and attribution. Whether any official mark may be used is for the owner to settle with the guides.
- **Stale menus and closures**: capture dates are shown and business status is checked periodically; closures surface in the review inbox.
- **Identity edge cases**: relocations, renames and branches of a chain need operator judgment; the merge flow and the chain entity exist for them.

## Related documents

- `docs/product/0001-admin-web.md`: the admin web.
- `docs/implementation/0003-enrichment-pipeline.md`: technical rules for the pipeline, written with the implementation.
- `docs/philosophy/database-design.md`: the schema principles the data model follows.
