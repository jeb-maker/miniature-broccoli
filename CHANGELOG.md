# Changelog

## Unreleased

- `mb-table`: `reorder-label` / `sort-label` for SSR a11y i18n (#41)
- `mb-table-cell`: `hide-label` / `actions` to opt out of cards field labels (#42)

## 0.4.0 — 2026-09-25

Responsive editable table for Revues-style list pages.

- `mb-table` / `mb-table-row` / `mb-table-cell` — grid on wide viewports, stacked labeled cards below `36rem` (#37)
- Sections: `sections` list + row `section`; collapsible heads (`mb-section-toggle`)
- Sort: head `sort-key` / cell `sort-value`; sorts within each section (`mb-sort`)
- Reorder: `reorderable` drag handles + `moveRow()`; cross-section moves (`mb-reorder`)
- Docs: README, Introduction, Go/HTMX snippets; Storybook `Components/Table`

## 0.3.1 — 2026-08-10

Patch for slotted form controls + small FOUC gap.

- Fix: hide all `mb-select` option slots so slotted `<option>` labels no longer appear under the control (#35)
- Fix: `mb-radio-group` restores slotted `mb-radio` `disabled` when the group re-enables
- Fix: include `mb-nav-toggle` in anti-FOUC `:not(:defined)` hide list
- Docs: `mb-nav-toggle` / `mb-toggle` coverage in README, Introduction, and `docs/go-htmx.md`
- Tests: move badge / card / input suites into their own files

## 0.3.0 — 2026-07-22

Revues P1 shell primitives + select polish.

- `mb-select`: `placeholder` / empty-option label (#22)
- `mb-tag` — neutral chip, optional `href` (#23)
- `mb-breadcrumbs` — slotted or JSON items (#24)
- `mb-nav` + `mb-nav-toggle` — app-shell nav + mobile toggle (#25)
- `mb-avatar` — image + initials fallback (#26)
- `mb-spinner` — standalone HTMX indicator (#27)
- `mb-toolbar` — `start` / `end` layout slots (#28)
- Storybook recipe: status event timeline (`Recipes/Timeline`) (#29)
- `mb-card` / layout primitives stay visible before CE upgrade (no anti-FOUC hide); opt in with class `mb-fouc` (#30)

## 0.2.0 — 2026-07-20

Revues consumer gaps (P0 components + docs/tokens).

- `mb-button`: `variant="danger"`, optional `href` (anchor), `icon-only` (#9)
- `mb-progress` — determinate progressbar (#10)
- `mb-segmented-control` — SSR link filter tabs (#11)
- `mb-empty-state` — heading / body / actions (#12)
- `mb-pagination` — prev/next + status (#13)
- `mb-toast` — success/danger, `show()` / event API, auto-dismiss (#14)
- `mb-input`: `type="number"` (`min`/`max`/`step`) and `type="file"` (`accept`/`multiple`, FACE FormData) (#15)
- `mb-radio` / `mb-radio-group` — FACE, arrow keys, slotted or JSON options (#16)
- Docs: [Go `html/template` + HTMX](./docs/go-htmx.md) (#17)
- `tokens-core.css` (no global body reset) + dark `color-scheme` story / `data-mb-color-scheme` (#18)
