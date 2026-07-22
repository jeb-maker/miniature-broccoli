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

```html
<form id="item-form-{{ .ID }}" hx-post="/items/{{ .ID }}" hx-trigger="mb-change from:#status-{{ .ID }}">
  <!-- CSRF + hidden fields -->
</form>

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
```

FACE honors the HTML `form="…"` attribute so controls can live outside the `<form>` element.

## Events for `hx-trigger`

Shadow-DOM native `change` / `input` do **not** retarget. Listen for composed custom events:

| Event | Components | Detail |
|-------|------------|--------|
| `mb-change` | input, textarea, select, checkbox, radio-group | `{ value }` or `{ checked, value }` |
| `mb-input` | input, textarea | `{ value }` (+ `files` for file inputs) |
| `mb-close` | modal, toast | — |

Example: `hx-trigger="mb-change delay:300ms"`.

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
