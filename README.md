# @miniature-broccoli/mb

Lit design system — rich components, light to consume (atomic ESM entries, Lit as peerDependency).

## Quick start

```bash
npm install
npm run build
npm run storybook
```

**Storybook (GitHub Pages):** https://jeb-maker.github.io/miniature-broccoli/

Consumer smoke (against `dist/`):

```bash
npm run consumer
```

## Consume

```js
import '@miniature-broccoli/mb/tokens.css';
import '@miniature-broccoli/mb/button';
import '@miniature-broccoli/mb/input';
```

There is **no root barrel** that registers every component — import only what you use.

### Components

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

Typography: CSS classes `.mb-title`, `.mb-body`, `.mb-body-sm` (no `mb-text` element).

## Contracts

- **Client-only** custom elements; tokens CSS are SSR-safe.
- **Internal labels** only — `label[for]` from outside does not pierce Shadow DOM.
- **Form-associated** controls (`ElementInternals`) honor `fieldset[disabled]` and participate in `FormData`.
- **`mb-select`**: pass `options={[{ value, label }]}` — do not slot `<option>`.
- **`mb-modal`**: native `<dialog>`.
- **Theming**: semantic CSS variables + `::part(...)`.
- **React**: React 19+ preferred (`./jsx` types). React ≤18: string attributes only.
- **Browsers**: Chrome ≥105, Firefox ≥120, Safari ≥16.4 (FACI).

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run build` | ESM `preserveModules` lib + types + tokens |
| `npm run storybook` | Component docs |
| `npm test` | Vitest browser (Playwright) |
| `npm run consumer` | Smoke app importing from `dist/` |
| `npm run typecheck` | `tsc --noEmit` |

## Package

`@miniature-broccoli/mb` is `private` for now. Peer dependency: `lit@^3.2.0`.
