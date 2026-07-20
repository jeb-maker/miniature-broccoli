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
| `./badge` | `mb-badge` |
| `./alert` | `mb-alert` |
| `./card` | `mb-card` |
| `./modal` | `mb-modal` |

Typography: CSS classes `.mb-title`, `.mb-body`, `.mb-body-sm`.

Types: `import '@jeb-maker/mb/types'` · `import '@jeb-maker/mb/jsx'`

## Contracts

- **Client-only** custom elements; tokens CSS are SSR-safe.
- **Internal labels** only — `label[for]` from outside does not pierce Shadow DOM.
- **Form-associated** controls honor `fieldset[disabled]` and `FormData`.
- **`mb-select`**: `options={[{ value, label }]}` — do not slot `<option>`.
- **`mb-modal`**: native `<dialog>`.
- **Browsers**: Chrome ≥105, Firefox ≥120, Safari ≥16.4.

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
