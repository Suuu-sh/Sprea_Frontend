# Design QA

- Date: 2026-08-28
- Target: Sprea Research frontend (`http://localhost:3000`)
- Data: local display API with two opportunities and two open Paper Trades
- Desktop viewport: 1280 × 681
- Mobile viewport: 390 × 844

## API and state verification

- Opportunity dashboard displays portfolio, two real API rows, decisions, profit and scores.
- Product detail displays canonical identity, three price observations, and decision events.
- Paper Trading displays open trades, locked capital, entry profit and close controls.
- Evaluator displays all 24h / 48h / 72h / 7d schedules and recent run history.
- Collector screen displays API-derived last-run health and empty run-history state.
- Research settings load the persisted backend values and expose validation/error feedback.
- The login admin token remains in session storage only; all Research API requests send Bearer authorization for personal-data protection.
- Backend 401 responses display an admin-token-specific re-login message.
- Loading, empty, connection error, action error and success messages are present.
- Local `.env.local` shows `LOCAL MOCK DATA`; `.env` remains the production default.

## Visual verification

- Desktop opportunity columns remain balanced without horizontal overflow.
- Product price bars, identity metrics, trade cards, schedules and run rows align consistently.
- At 390px, tables collapse to cards and the document has no horizontal overflow.
- Mobile header hides secondary labels/badges, retaining title and icon actions without vertical title wrapping.
- Desktop and mobile browser consoles reported no application errors on all six feature screens.

## Automated checks

- `npm run lint`: passed
- `npm test`: 4 passed
- `npm run build`: passed; all routes statically generated

final result: passed
