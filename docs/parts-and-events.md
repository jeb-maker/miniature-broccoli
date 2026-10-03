# Custom events and `::part` catalog

Concise reference for styling via shadow parts and listening for composed events (including HTMX `hx-trigger`). For MPA / Go templates and CSRF forms, see [go-htmx.md](./go-htmx.md).

## Custom events

Shadow-DOM native `change` / `input` do **not** retarget. Prefer these composed events:

| Event | Components | Detail |
|-------|------------|--------|
| `mb-change` | `mb-input`, `mb-textarea`, `mb-select`, `mb-checkbox`, `mb-radio-group` | `{ value }` or `{ checked, value }` (checkbox) |
| `mb-input` | `mb-input`, `mb-textarea` | `{ value }` (+ `files` for file inputs) |
| `mb-close` | `mb-modal`, `mb-toast` | — |
| `mb-toggle` | `mb-nav-toggle` | `{ expanded }` |
| `mb-sort` | `mb-table` | `{ key, direction }` (`asc` \| `desc`) |
| `mb-section-toggle` | `mb-table` | `{ id, collapsed }` |
| `mb-reorder` | `mb-table` | `{ rowId, fromSection, toSection, beforeId, afterId, order }` |

**Internal (not for hosts):** `mb-radio` dispatches `mb-radio-select` for `mb-radio-group` coordination.

**Document bus (not for `hx-trigger`):** dispatch `mb-toast` on `document` with `{ message, variant?, autoDismiss? }` to show a mounted `<mb-toast>`.

Example: `hx-trigger="mb-change delay:300ms"`.

## `::part` catalog

Major `part` names exposed for theming (`::part(name)`). Only parts present in component templates are listed.

| Component | Parts |
|-----------|-------|
| `mb-alert` | `base` |
| `mb-avatar` | `base`, `image`, `initials` |
| `mb-badge` | `base` |
| `mb-breadcrumbs` | `nav`, `list`, `item` |
| `mb-button` | `base` |
| `mb-card` | `card`, `header`, `body`, `footer` |
| `mb-checkbox` | `label`, `control` |
| `mb-empty-state` | `panel`, `heading`, `body`, `actions` |
| `mb-input` | `label`, `control` |
| `mb-modal` | `dialog`, `body`, `footer` |
| `mb-nav` | `nav` |
| `mb-nav-toggle` | `button` |
| `mb-pagination` | `nav`, `status`, `actions`, `prev`, `next` |
| `mb-progress` | `label`, `track`, `bar` |
| `mb-radio` | `label`, `control` |
| `mb-radio-group` | `fieldset`, `legend`, `options` |
| `mb-segmented-control` | `nav`, `list` |
| `mb-select` | `label`, `control` |
| `mb-spinner` | `spinner` |
| `mb-table` | `root`, `caption`, `frame`, `head`, `body`, `section`, `section-head`, `section-custom-meta`, `section-count`, `section-rows`, `ungrouped`, `empty` |
| `mb-table-row` | `wrap`, `handle`, `row` |
| `mb-table-cell` | `cell`, `label`, `value`, `sort` |
| `mb-textarea` | `label`, `control` |
| `mb-toast` | `toast`, `message`, `close` |
| `mb-toolbar` | `toolbar`, `start`, `end` |

`mb-tag` is a deprecated alias of `mb-badge` (same `base` part).
