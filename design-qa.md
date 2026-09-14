# UI verification — 2026-09-14

## Scope

Existing frontend routes: `/`, `/targets`, `/opportunities`, `/analytics`, `/paper-trading`, `/evaluations`, `/sources`, `/settings`, `/products`, `/guide`, and `/login` (redirect).

Reference: Ease Health on Refero Styles, documented in `docs/design-system.md`. The source screenshot was reviewed before editing. No images were generated or added.

## Verified

- Desktop screenshots at 1280px: shared cream canvas, forest headings, green panels, readable text, form layout, source cards, guide and product-selection recovery.
- All routes inspected at 390px: document width stayed at 390px; no page-level horizontal overflow. Wide comparison tables retain local scrolling.
- Mobile settings form and multi-action target header visually checked. Fixed wrapped header button labels during QA.
- All-pages menu opens, marks the current page, and closes on navigation to targets.
- Product detail without a key provides a link to the opportunity list.
- `/login` still redirects to the research home.
- Lint, TypeScript, production build and seven automated tests pass.

## Limitations

The configured local API was unavailable. Browser QA therefore covers connection-error, loading, static and empty states, not populated charts/tables or successful API mutations. No production data, credentials or settings were modified. Actual data-dependent interactions must be verified with the local API running before release.
