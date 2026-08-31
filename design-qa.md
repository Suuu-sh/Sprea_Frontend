# Design QA — Decision Lens

## Evidence

- Source visual truth: `/Users/yota/.codex/generated_images/01a04646-9a41-77d0-82fa-f82fc2aefe1e/exec-d1eab5f1-c563-435b-9034-65ea99185c86.png`
- Browser-rendered implementation: `/Users/yota/.codex/.chatgpt-projects/g-p-6a8b0bc7ff6881918beea5f11d8da8eb/sprea-screenshot-match-v3.png`
- Combined comparison: `/Users/yota/.codex/.chatgpt-projects/g-p-6a8b0bc7ff6881918beea5f11d8da8eb/sprea-design-comparison.png`
- Responsive home evidence: `/Users/yota/.codex/.chatgpt-projects/g-p-6a8b0bc7ff6881918beea5f11d8da8eb/sprea-mobile-home-final.png`
- Responsive navigation evidence: `/Users/yota/.codex/.chatgpt-projects/g-p-6a8b0bc7ff6881918beea5f11d8da8eb/sprea-mobile-menu-final.png`
- Responsive settings evidence: `/Users/yota/.codex/.chatgpt-projects/g-p-6a8b0bc7ff6881918beea5f11d8da8eb/sprea-mobile-settings-final.png`
- Source pixels: 1487 × 1058; center-cropped to 1440 × 1024 for comparison.
- Implementation pixels/CSS viewport: 1440 × 1024 at device scale 1.
- Combined comparison pixels: 2880 × 1024, source left and implementation right.
- State: local mock dashboard with the current API response.

## Full-view comparison

The source and implementation now share the same narrow light sidebar, compact header, five-metric strip constrained to the primary column, short composed trend chart, dense ranked table, and analyst brief beginning at the top of the right rail. The implementation uses the actual local dataset rather than the richer illustrative mock state, so row count and chart values intentionally differ.

## Focused comparison

- Header/sidebar: matched navigation density, active-state stripe, environment badge, and compact controls.
- KPI strip: matched low-border, tabular layout with supporting context beneath each value.
- Analysis body: matched left-main/right-brief proportions and thin divider hierarchy.
- Decision table: matched compact rows, status chips, tabular numbers, and teal progress indicators.
- Analyst brief: matched capital, model sample warning, skip reasons, and discovery funnel groupings.

## Findings

No actionable P0, P1, or P2 findings remain.

### Required fidelity surfaces

- Fonts and typography: the existing DM Sans / Noto Sans JP stack is retained, with compact weights and a consistent numerical hierarchy. No visible clipping or unintended wrapping remains at desktop or mobile widths.
- Spacing and layout rhythm: major regions, KPI tracks, table rows, and the analyst rail follow the source density and alignment. Desktop horizontal overflow is absent; mobile document width equals its viewport.
- Colors and visual tokens: white/mist surfaces, navy text, muted slate labels, teal positive states, amber caution, and red errors map consistently across all routes. No decorative gradients are used in the Decision Lens theme.
- Image quality and assets: the target contains no raster content requiring production assets. Existing Lucide icons are retained from the product design system and render sharply.
- Copy and content: labels use the real Sprea domain language and actual API values. Precision is paired with the evaluated sample count, and potentially inconsistent funnel snapshots carry a timing note.

## Comparison history

### Iteration 1

- [P1] Sidebar color did not match the selected third concept.
  - Evidence: the first implementation used a dark navy sidebar while the selected concept used a light analytical rail.
  - Fix: changed the shared sidebar, account panel, navigation states, and footer to light neutral surfaces with a teal active marker.
- Post-fix evidence: `sprea-design-comparison.png` shows the source and updated implementation side by side with matching light navigation treatment.

### Iteration 2

- [P1] Primary/brief column composition did not match the attached screenshot.
  - Evidence: the earlier implementation placed KPIs across the full workspace and began the analyst rail below them.
  - Fix: moved the KPI strip into the primary column and started the data warning and analyst brief at the top of the right rail.
- [P1] Trend region was too tall and pushed the decision table below the intended visual hierarchy.
  - Evidence: the earlier snapshot chart occupied roughly twice the source height.
  - Fix: reduced the trend region to 112px and implemented the source-like bar, average line, moving-average line, and threshold using Recharts.
- [P2] The ranked table lacked the source filter controls and column density.
  - Evidence: the earlier table had fewer analytical columns and no All/BUY/SKIP interaction.
  - Fix: added working filters, required-profit and confidence columns, native progress indicators, compact 52px rows, and the manual-update footer.
- Post-fix evidence: the current `sprea-design-comparison.png` shows the corrected top-level proportions, compact trend, filter row, table density, and right-side briefing.

### Iteration 3 — mobile usability

- [P1] Secondary pages had no visible mobile back action.
  - Fix: added a consistent 38px back button to every non-root page, including a safe home fallback for direct-entry sessions.
- [P1] The bottom navigation exposed every route in a horizontally scrolling strip.
  - Fix: reduced it to four primary destinations plus a stable `その他` action and added a two-column all-pages sheet with active state, close action, environment, and capital context.
- [P1] The guide page exceeded the 390px viewport because a later desktop grid rule overrode its responsive layout.
  - Fix: constrained the guide grid and horizontal table of contents to the mobile viewport.
- [P2] Dense trade and header actions did not adapt cleanly at narrow widths.
  - Fix: stacked trade cards and clock controls, compacted header actions, and added safe-area-aware bottom spacing.
- Post-fix evidence: all nine application routes report a 390px document width in a 390px viewport; the menu opens, routes correctly, and closes after navigation.

### Iteration 4 — chart baseline

- [P1] Negative profit bars used an automatically cropped Y-axis that excluded zero, so the upper part of each bar disappeared at the plot boundary.
  - Fix: forced the analytical scale to include both the zero baseline and the ¥5,000 decision threshold, then rendered an explicit zero reference line. Negative bars now remain visible continuously from zero to their measured value.

## Primary interactions checked

- Main navigation from 案件リサーチ to 分析.
- Dashboard refresh action.
- All/BUY/SKIP decision filters.
- Every route rendered: `/`, `/targets`, `/opportunities`, `/analytics`, `/paper-trading`, `/evaluations`, `/sources`, `/settings`, and `/guide`.
- Browser console checked after navigation and refresh: no errors.
- Responsive check at 390 × 844: no horizontal document overflow; mobile navigation remains available.
- Mobile menu checked: open, close, active route, and navigation to Settings.
- Mobile back action checked on a non-root route.
- Desktop regression check at 1440 × 1024: mobile controls remain hidden and document width matches viewport.

## Follow-up polish

- [P3] Replace the snapshot bars with a true time-series line once the API exposes historical opportunity aggregates.
- [P3] Add richer hover/focus detail to the chart after historical points become available.

## Implementation checklist

- [x] Apply shared Decision Lens shell to every route.
- [x] Rebuild the home screen around opportunity monitoring and analyst briefing.
- [x] Normalize tables, status states, panels, filters, settings, and guide pages.
- [x] Verify desktop and mobile rendering.
- [x] Provide mobile back navigation and a complete all-pages menu.
- [x] Verify all nine routes at 390 × 844 without horizontal overflow.
- [x] Verify primary navigation and refresh behavior.

final result: passed
