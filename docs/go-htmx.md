# Consuming `@jeb-maker/mb` from Go `html/template` + HTMX

Primary target: MPA hosts (no SPA), tight JS budget, CSRF-protected classic forms, HTMX partial swaps.

## Load order

1. Tokens CSS (prefer `tokens-core.css` if the host already styles `html`/`body`)
2. App CSS
3. HTMX (+ your app JS)
4. Atomic ESM imports for only the custom elements used on the page

```html
<link rel="stylesheet" href="/static/vendor/mb/tokens-core.css" />
<link rel="stylesheet" href="/static/app.css" />
<script src="/static/htmx.min.js" defer></script>
<script type="module">
  import '/static/vendor/mb/button.js';
  import '/static/vendor/mb/select.js';
</script>
```

Anti-FOUC: **interactive** undefined tags (`mb-button`, inputs, `mb-select`, `mb-modal`, `mb-toast`, …) stay `visibility: hidden` until upgraded. **Layout** primitives (`mb-card`, `mb-toolbar`, `mb-nav`, `mb-breadcrumbs`, `mb-empty-state`, …) stay visible so structural chrome can progressively render. Opt a layout tag into the old hide behavior with class `mb-fouc`.

## Custom elements in templates

```html
<mb-button type="submit" name="action" value="save">Save</mb-button>

<mb-button href="/revues/new" variant="secondary">New revue</mb-button>

<mb-button variant="danger" href="/archive">Archive</mb-button>
```

### Selects without client hydration

Slotted native options (recommended for Go templates):

```html
<mb-select name="status" value="{{ .Status }}" label="Status" required placeholder="Tous">
  {{ range .Statuses }}
    <option value="{{ .Value }}" {{ if eq $.Status .Value }}selected{{ end }}>{{ .Label }}</option>
  {{ end }}
</mb-select>
```

Or label the empty option by slotting it:

```html
<mb-select name="section" value="">
  <option value="">Toutes</option>
  <option value="ops">Ops</option>
</mb-select>
```

Or a JSON attribute (escape carefully in templates):

```html
<mb-select
  name="status"
  value="ok"
  options='[{"value":"ok","label":"OK"},{"value":"ko","label":"KO"}]'
></mb-select>
```

### Compact table / HTMX cells

Import `./table`. Below `36rem`, each body row becomes a labeled card (same breakpoint as `mb-nav`). Head labels are copied onto cells when `label` is omitted.

```html
<mb-table label="Items" density="compact" columns="2fr 1fr auto">
  <mb-table-row slot="head">
    <mb-table-cell>Title</mb-table-cell>
    <mb-table-cell>Status</mb-table-cell>
    <mb-table-cell></mb-table-cell>
  </mb-table-row>

  {{ range .Items }}
  <mb-table-row>
    <mb-table-cell primary>
      <form id="item-form-{{ .ID }}" hx-post="/items/{{ .ID }}" hx-trigger="mb-change from:#status-{{ .ID }}">
        <!-- CSRF + hidden fields -->
      </form>
      <mb-input
        form="item-form-{{ .ID }}"
        name="title"
        value="{{ .Title }}"
        density="compact"
        hide-label
        aria-label="Title"
      ></mb-input>
    </mb-table-cell>
    <mb-table-cell>
      <mb-select
        id="status-{{ .ID }}"
        form="item-form-{{ .ID }}"
        name="status"
        value="{{ .Status }}"
        density="compact"
        hide-label
        aria-label="Status"
      >
        <option value="todo">Todo</option>
        <option value="done">Done</option>
      </mb-select>
    </mb-table-cell>
    <mb-table-cell align="end">
      <mb-button size="sm" type="submit" form="item-form-{{ .ID }}">Save</mb-button>
    </mb-table-cell>
  </mb-table-row>
  {{ end }}
</mb-table>
```

Force cards in a narrow column with `layout="cards"`. FACE honors the HTML `form="…"` attribute so controls can live outside the `<form>` element.

### Sections + sort

Pass a section list (JSON attribute or JS `.sections`). Each body row sets `section="…"`. Head cells with `sort-key` reorder rows **within** each section and emit composed `mb-sort` (`{ key, direction }`). Section headers toggle `collapsed` and emit `mb-section-toggle` (`{ id, collapsed }`).

```html
<mb-table
  label="Backlog"
  density="compact"
  columns="2fr 1fr auto"
  sections='[{"id":"ops","label":"Ops"},{"id":"eng","label":"Engineering"}]'
>
  <mb-table-row slot="head">
    <mb-table-cell sort-key="title">Title</mb-table-cell>
    <mb-table-cell sort-key="status">Status</mb-table-cell>
    <mb-table-cell></mb-table-cell>
  </mb-table-row>

  {{ range .Items }}
  <mb-table-row section="{{ .SectionID }}">
    <mb-table-cell primary sort-value="{{ .Title }}">…</mb-table-cell>
    <mb-table-cell sort-value="{{ .Status }}">…</mb-table-cell>
    <mb-table-cell align="end">…</mb-table-cell>
  </mb-table-row>
  {{ end }}
</mb-table>
```

Prefer `sort-value` on cells when the visible control is an `mb-input` / `mb-select` so sort stays stable while editing.

### Drag and drop reorder

Add `reorderable` to show a grab handle on each body row (pointer / touch). Drop on another row to reorder; drop onto a row in another section (or an empty section) to move it. Emits composed `mb-reorder` and clears any active column sort so the manual order sticks. Prefer stable `id` / `data-id` on rows for the event payload.

```html
<mb-table
  reorderable
  sections='[{"id":"ops","label":"Ops"},{"id":"eng","label":"Engineering"}]'
  hx-trigger="mb-reorder"
  hx-post="/backlog/reorder"
  hx-include="[name='csrf']"
>
  …
  <mb-table-row id="item-{{ .ID }}" section="{{ .SectionID }}">…</mb-table-row>
</mb-table>
```

`mb-reorder` detail: `{ rowId, fromSection, toSection, beforeId, afterId, order: [{ id, section }] }`.

### App shell nav + mobile toggle

```html
<header class="app-bar">
  <strong>Acme</strong>
  <mb-nav-toggle for="app-nav"></mb-nav-toggle>
</header>

<mb-nav id="app-nav" label="Site">
  <a href="/revues" aria-current="page">Revues</a>
  <a href="/tasks">Tasks</a>
</mb-nav>
```

Import `./nav` and `./nav-toggle`. Below `36rem`, the toggle is shown and controls `open` on `#app-nav`.

## Events for `hx-trigger`

Shadow-DOM native `change` / `input` do **not** retarget. Listen for composed custom events:

| Event | Components | Detail |
|-------|------------|--------|
| `mb-change` | input, textarea, select, checkbox, radio-group | `{ value }` or `{ checked, value }` |
| `mb-input` | input, textarea | `{ value }` (+ `files` for file inputs) |
| `mb-close` | modal, toast | — |
| `mb-toggle` | nav-toggle | `{ expanded }` |
| `mb-sort` | table | `{ key, direction }` (`asc` \| `desc`) |
| `mb-section-toggle` | table | `{ id, collapsed }` |
| `mb-reorder` | table | `{ rowId, fromSection, toSection, beforeId, afterId, order }` |

Example: `hx-trigger="mb-change delay:300ms"`.

`mb-nav-toggle` also flips `open` on the target `mb-nav` when `for` matches its `id`. Prefer that over wiring `mb-toggle` yourself unless the host needs a side effect (analytics, focus trap, etc.).

Document-level bus (not for `hx-trigger`): dispatch `mb-toast` on `document` with `{ message, variant? }` to show the mounted `<mb-toast>`.

## CSRF + multipart

Keep classic forms: hidden CSRF input + `method="post"` + `enctype="multipart/form-data"` when uploading.

```html
<form method="post" enctype="multipart/form-data" action="/evidence">
  <input type="hidden" name="csrf" value="{{ .CSRF }}" />
  <mb-input type="file" name="file" label="Evidence" accept="image/*,.pdf" required></mb-input>
  <mb-button type="submit">Upload</mb-button>
</form>
```

**File + FACE notes:** `mb-input type="file"` pushes selected `File`(s) into `FormData` via `ElementInternals`. Prefer native form submit for multipart; do not rely on serializing file values into HTMX JSON.

## Tokens coexistence

| Import | Includes |
|--------|----------|
| `tokens-core.css` | Reference + semantic variables, dark scheme, anti-FOUC |
| `typography.css` | `@font-face` + `.mb-title` / `.mb-body` utilities |
| `tokens.css` | Core + typography + `html`/`body` baseline reset |

Bridge host variables:

```css
:root {
  --app-fg: var(--mb-color-fg);
  --mb-color-accent: var(--brand-accent); /* host → mb */
}
```

Dark: automatic via `prefers-color-scheme: dark`, or force with `data-mb-color-scheme="dark"` on `<html>` / `.mb-theme`.

Fonts: skip `typography.css` (or subset woff2) when the host CSS budget is tight — components fall back to `--mb-font-body` stack.

## Toast outside swap targets

Mount a single toast host outside HTMX targets:

```html
<mb-toast id="toast"></mb-toast>
<script type="module">
  import '/static/vendor/mb/toast.js';
  // After a successful swap:
  document.getElementById('toast').show('Saved', 'success');
  // or: document.dispatchEvent(new CustomEvent('mb-toast', { detail: { message: 'Saved', variant: 'success' } }));
</script>
```

## Progressive enhancement

- Link-styled actions: `<mb-button href="…">` works before JS if the CE upgrade fails visually; always keep a meaningful server round-trip.
- Prefer SSR attributes (`value`, `name`, `required`, slotted options) so first paint is correct after upgrade.
- Import only the atomic entries you need — no root barrel.

## JS budget

Lit is a peer dependency. Ship one shared Lit chunk + per-page atomic CE modules. Avoid importing unused components on list pages that only need `mb-badge` / `mb-button`.
