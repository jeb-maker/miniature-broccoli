# Changelog

## Unreleased

- Shared `json-attr` helper and `FormFieldController` for form-associated fields
- i18n label props (`missing-message` / `invalid-message`, `close-label`, `dismiss-label`, `fallback-label`, …)
- Form API attribute parity (`pattern`, `maxlength` / `minlength`, `autocomplete`, `readonly`, …)
- `mb-table` modularization under `src/components/table/*` (public entry remains `./table`)
- `mb-segmented-control` semantics / a11y polish
- Smoke a11y tests (axe) + Storybook `@storybook/addon-a11y`
- Docs: `CONTRIBUTING.md`, `docs/parts-and-events.md` (events + `::part` catalog); cross-links from README / go-htmx / Introduction
- `npm run check:exports` + CI wiring; publish workflow runs lint + export check
- Closes #39–#44

## 0.4.3 — 2026-09-28

Global control-density unification plus component correctness and accessibility fixes.

- Unify chips: `mb-badge` is the single primitive (`variant` + optional `href` + `size`); `mb-tag` is a deprecated alias (defaults to `size="md"`) (#52)
- Tokens: `--mb-control-height` / `-sm`, select end padding, field label gap, `--mb-narrow` (#52)
- Fields (`mb-input` / `mb-select` / `mb-textarea`): full width; clearer label→control gap; selects get breathing room before the chevron (#52)
- `mb-textarea`: `resize: none` by default (#52)
- `mb-toolbar`: shared control height track; full-width stack below `36rem` (#52)
- `mb-segmented-control` / `mb-button`: heights driven by control tokens (#52)
- `mb-table`: full-width frame/rows; `align="end"` / `actions` pin content to the cell end (#52)
- Form controls propagate native constraints and synchronize form-associated values before emitting component events (#48)
- Prevent invalid `mb-select` / `mb-radio-group` values and preserve cancellable `mb-button` actions (#48)
- `mb-table`: reactive presentation, constrained drag targets, keyboard reordering, and valid ARIA state (#48)
- Restart `mb-toast` timers, clamp `mb-progress` ARIA values, and synchronize `mb-nav-toggle` across shadow roots (#48)
- Regression coverage for each corrected behavior (#48)

## 0.4.2 — 2026-09-27

Visual and WCAG 2.2 AA polish across existing components (no API changes).

- Hover / pressed states on buttons, links, nav, segmented controls, pagination, tags, table headers, and icon buttons (#50)
- Clearer card / table edges and light shadow; Fraunces 600 on card and section headings (#50)
- Alert / toast tinted surfaces with status border; readable body text (#50)
- Stronger badge, progress, empty-state, and avatar edges (#50)
- Loading buttons keep full color with spinner (no longer look disabled) (#50)
- Tokens: `--mb-color-border-strong` (3:1), success / dark accent text contrast (4.5:1) (#50)
- 24×24 CSS px targets for checkboxes, radios, modal close, toast dismiss, tags, sort, drag handles (#50)
- Focus-visible rings, muted placeholders, underlined breadcrumbs, invalid checkbox outline (#50)

## 0.4.1 — 2026-09-25

Revues adoption polish for `mb-table`.

- `mb-table`: `reorder-label` / `sort-label` for SSR a11y i18n (#41, #45)
- `mb-table-cell`: `hide-label` / `actions` to opt out of cards field labels (#42, #45)
- `mb-table`: section `meta` / `count: false` + table `hide-count`; optional `slot="section-meta-{id}"` (#40, #46)
- `mb-table`: `sticky-header` for wide layout (#44, #46)
- Docs: HTMX `outerHTML` row-swap + sections contract (#43, #46)

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
