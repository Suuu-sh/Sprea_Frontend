# Design QA — Decision Lens

## Evidence

- Source visual truth: `/Users/yota/.codex/generated_images/01a04646-9a41-77d0-82fa-f82fc2aefe1e/exec-d1eab5f1-c563-435b-9034-65ea99185c86.png`
- Browser-rendered implementation: `/Users/yota/.codex/.chatgpt-projects/g-p-6a8b0bc7ff6881918beea5f11d8da8eb/sprea-decision-lens-home-viewport-light.png`
- Combined comparison: `/Users/yota/.codex/.chatgpt-projects/g-p-6a8b0bc7ff6881918beea5f11d8da8eb/sprea-design-comparison.png`
- Responsive evidence: `/Users/yota/.codex/.chatgpt-projects/g-p-6a8b0bc7ff6881918beea5f11d8da8eb/sprea-mobile-home.png`
- Source pixels: 1487 × 1058; center-cropped to 1440 × 1024 for comparison.
- Implementation pixels/CSS viewport: 1440 × 1024 at device scale 1.
- Combined comparison pixels: 2880 × 1024, source left and implementation right.
- State: local mock dashboard with the current API response.

## Full-view comparison

The source and implementation share the same narrow light sidebar, compact header, five-metric strip, dominant analysis region, dense decision table, and right-side analyst brief. The implementation uses the actual local dataset rather than the richer illustrative mock state, so row count and chart values intentionally differ.

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

## Primary interactions checked

- Main navigation from 案件リサーチ to 分析.
- Dashboard refresh action.
- Every route rendered: `/`, `/targets`, `/opportunities`, `/analytics`, `/paper-trading`, `/evaluations`, `/sources`, `/settings`, and `/guide`.
- Browser console checked after navigation and refresh: no errors.
- Responsive check at 390 × 844: no horizontal document overflow; mobile navigation remains available.

## Follow-up polish

- [P3] Replace the snapshot bars with a true time-series line once the API exposes historical opportunity aggregates.
- [P3] Add richer hover/focus detail to the chart after historical points become available.

## Implementation checklist

- [x] Apply shared Decision Lens shell to every route.
- [x] Rebuild the home screen around opportunity monitoring and analyst briefing.
- [x] Normalize tables, status states, panels, filters, settings, and guide pages.
- [x] Verify desktop and mobile rendering.
- [x] Verify primary navigation and refresh behavior.

final result: passed
