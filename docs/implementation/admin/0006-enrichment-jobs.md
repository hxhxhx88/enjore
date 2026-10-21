# Enrichment jobs

The sixth milestone of the admin in `apps/admin-next`, planned at module level. It delivers the seven draft-writing jobs, the chain the server owns, fill-empty against replace, generation per field with notes, "Enrich" in batch, and the complete dashboard. It implements the generation part of "Generate and review the profile", "Enrich in batch" and "Prompts and generated content rules" of `docs/product/0001-admin-web.md` and the "Enrichment pipeline" of `docs/product/0000-project-overview.md`. It needs milestones 0004 and 0005.

## Goal

- Select ten restaurants, click "Enrich", and find drafts with a canonical description, a structured profile, a menu where one exists, a summary, an article, a brief and links in the morning, with the failures listed on the jobs page.

## Scope

- In: prompts and `read-context` for `canonical-description`, `structured-profile`, `menu`, `summary`, `article`, `poster-brief` and `links`; the seven draft tools; chaining; fill-empty and "Replace everything"; "Generate" and "Regenerate" with notes on every draft field; batch "Enrich"; the dashboard.
- Out: rendering (0007), batch posters and publish (0007).

## Design

- Prompts, one template per kind in `src/lib/prompts/`, rendered from the context `read-context` returns for that kind: the basics, the accolades, the current draft values, the operator's notes, the house-style brief for posters, the article's fixed structure, and the locale rules (`zh-cn` written natively; a summary or article job with a locale writes a Translation row when the locale is not the draft's). Templates live in code, and changing one regenerates nothing by itself.
- Draft tools: each validates with the shared schema (`structuredProfileSchema`, `menuSchema`, `linksSchema`, markdown for the text fields), is callable only from the job of the same kind on the job's restaurant, creates the draft when it is missing, and merges into existing JSON when `replaceAll` is false, so empty factors are filled and filled ones kept.
- Chaining in completion handlers, as the PRD states: the `canonical-description` handler enqueues the derived kinds whose field is empty in both the draft and the published profile; the `poster-brief` handler enqueues `render-poster` when `renderAfterBrief` is set. "Regenerate existing" from the batch travels in the `canonical-description` payload as one additive field, or is realised by enqueueing the derived jobs up front behind a claim guard; the refinement of this document decides.
- Per field: "Generate" when the draft field is empty, "Regenerate" with an optional notes field otherwise, enqueueing one job with the notes; for the structured profile and the menu, "Replace everything" is a separate confirmed action that sets `replaceAll`.
- Batch "Enrich" from the restaurant list: a selection column is added to `DataTable` in `packages/ui-web`, and a bulk action bar enqueues the chain per selected restaurant with a "Regenerate existing" switch; priorities put every canonical description before any derived artifact.
- Origin of a draft field: drafts carry no attempt link, so the field shows "last written by" from the newest `write-*` tool call on that restaurant, with the runner, and "edited since" when the draft changed afterwards.
- Dashboard complete: restaurants by publication state, restaurants missing each profile field, jobs queued, running and failed, editions awaiting verification, the last agent run with its link, recent activity from finished attempts.
- Pipeline spec sections: prompt templates and their context contract, chaining rules, the scoping matrix of the draft tools.

## Work

- Refine this document to file level; then the prompts and `read-context` per kind, the draft tools and the handlers.
- The field controls, "Replace everything", batch "Enrich" with the selection column.
- The dashboard; the pipeline spec sections.

## Done when

- Acceptance scenario: the cloud task is unavailable, a queued job's prompt is copied, run in claude.ai, and the result pasted; the draft field is saved with manual origin.
- Acceptance scenario: two factors of a structured profile are cleared and "Regenerate" fills only them.
- Acceptance scenario: the summary of a published restaurant is regenerated and the public value does not change until the draft is published.
- Ten restaurants selected in the evening have every text field, the structured profile, the menu where one exists and a brief in the morning; posters follow in 0007.

## Boundaries

- Agents write drafts only; verification, publication and manual values are out of their reach, which the tool scoping enforces.
- `render-poster` jobs enqueued by brief completion wait in the queue until 0007 provides the worker; "Settings" shows that it is not configured.
