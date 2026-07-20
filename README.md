# @jeb-maker/mb

Lit design system — rich components, light to consume (atomic ESM entries, Lit as peerDependency).

## Install (GitHub Packages)

```bash
# .npmrc
@jeb-maker:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

```bash
npm install @jeb-maker/mb lit
```

```js
import '@jeb-maker/mb/tokens.css';
import '@jeb-maker/mb/button';
import '@jeb-maker/mb/input';
```

Hosts that already style `html`/`body` (e.g. Go MPAs) should prefer:

```js
import '@jeb-maker/mb/tokens-core.css'; // variables + anti-FOUC only
// optional: import '@jeb-maker/mb/typography.css'; // @font-face + .mb-* utilities
```

There is **no root barrel** that registers every component — import only what you use.

## Storybook

https://jeb-maker.github.io/miniature-broccoli/

```bash
npm install
npm run storybook
```

## Components

| Import | Tag |
|--------|-----|
| `./button` | `mb-button` |
| `./input` | `mb-input` |
| `./textarea` | `mb-textarea` |
| `./select` | `mb-select` |
| `./checkbox` | `mb-checkbox` |
| `./radio` | `mb-radio` |
| `./radio-group` | `mb-radio-group` |
| `./badge` | `mb-badge` |
| `./alert` | `mb-alert` |
| `./card` | `mb-card` |
| `./modal` | `mb-modal` |
| `./progress` | `mb-progress` |
| `./segmented-control` | `mb-segmented-control` |
| `./empty-state` | `mb-empty-state` |
| `./pagination` | `mb-pagination` |
| `./toast` | `mb-toast` |

Typography: CSS classes `.mb-title`, `.mb-body`, `.mb-body-sm` (from `tokens.css` or `typography.css`).

Types: `import '@jeb-maker/mb/types'` · `import '@jeb-maker/mb/jsx'`

## Contracts

- **Client-only** custom elements; tokens CSS are SSR-safe.
- **Internal labels** only — `label[for]` from outside does not pierce Shadow DOM. Use `aria-label` / `hide-label` for compact cells.
- **Form-associated** controls honor `fieldset[disabled]`, the HTML `form="…"` attribute, and `FormData`.
- **`mb-select`**: JS `.options`, JSON `options='[…]'` attribute, or slotted `<option>` (slotted wins).
- **`mb-button`**: `variant="danger"`; with `href`, renders a styled `<a>` (no accidental form submit).
- **`mb-modal`**: native `<dialog>`.
- **Dark tokens**: `prefers-color-scheme: dark`, or force with `data-mb-color-scheme="dark"|"light"` on `:root` / `.mb-theme`.
- **Browsers**: Chrome ≥105, Firefox ≥120, Safari ≥16.4.

## Integration (Go + HTMX)

See [docs/go-htmx.md](./docs/go-htmx.md) for `html/template` snippets, FOUC, CSRF forms, `hx-trigger` event names, and JS budget guidance.

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run build` | ESM lib + types + tokens |
| `npm run storybook` | Component docs |
| `npm test` | Vitest browser |
| `npm run consumer` | Smoke app via package exports |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint (typescript-eslint + lit + wc) |

Peer dependency: `lit@^3.2.0`.
