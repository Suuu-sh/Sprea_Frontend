# Sprea UI design system

Updated: 2026-09-14

Visual reference: https://styles.refero.design/style/e9f5e976-53f7-42f5-a882-4e63b3c2f734

## Sources of truth

- Shared visual tokens and responsive styles: `app/globals.css`.
- Navigation and page introduction: `components/app-shell.tsx`.
- Product behavior and user instructions: `app/guide/page.tsx`.
- API contracts and decision rules are unchanged by this redesign.

## Adaptation

Cream paper (#fffefc), forest ink (#0f3e17), keylime (#e1f4df), mint (#cfe7d3), and sage (#b1dbb8) replace the previous compact blue-gray treatment. Cards and controls use 14px corners, navigation uses 7px corners, and badges use pill shapes. No card shadows or generated imagery. Serif page headings use system fonts; existing sans fonts remain for data and controls. No proprietary reference fonts are bundled.

Body and table text is generally 12–14px, with larger primary values. Small eyebrow labels are deliberately secondary. Semantic error and warning colors remain for safety rather than converting every state to green.

The sidebar groups research, validation, and administration through spacing. Mobile retains four primary destinations and the all-pages menu. The header help link replaces an inert notification button. Each page starts with a title and purpose; the product-detail empty state links back to a usable list. Wide comparison tables scroll locally rather than hiding price columns.

No login screen is introduced: `/login` continues redirecting to `/`.
