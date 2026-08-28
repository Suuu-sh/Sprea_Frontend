# Design QA

- Reference: user-provided screenshot from 2026-08-28
- Target: opportunity list at `http://localhost:3000/`
- Checked viewport: 1800 × 900

## Verification

- Header and rows use the same nine-column grid.
- Removed the unintended empty tenth grid item.
- Header height is 50px and data row height is 88px.
- Product details remain readable without oversized vertical whitespace.
- Price, profit, rate, score, and decision columns align consistently.
- The table fits the available desktop width without horizontal overflow.
- Local mock data renders two complete rows without console-visible layout failures.
- Local `.env.local` renders `LOCAL MOCK DATA`; the production build artifact renders `PRODUCTION DATA`.

final result: passed
