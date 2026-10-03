# Contributing

## Requirements

- **Node.js ≥ 20** (see `engines` in `package.json`)
- npm

## Setup

```bash
npm install
```

## Scripts

| Script | Purpose |
|--------|---------|
| `npm run build` | Library ESM + types + tokens → `dist/` |
| `npm test` | Vitest (Playwright Chromium browser) |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run check:exports` | Entry files ↔ `package.json` exports sync |
| `npm run storybook` | Component docs on port 6006 |
| `npm run build-storybook` | Static Storybook build |
| `npm run consumer` | Smoke app against package exports |

## Adding a component

1. **Implementation** — add `src/components/<name>.ts` (register with `safeDefine('mb-<name>', …)`). Keep non-entry helpers in a subfolder (e.g. `src/components/table/*`); only the top-level entry is exported.
2. **`package.json` exports** — add `"./<name>"` pointing at `dist/components/<name>.{d.ts,js}`.
3. **`jsx.d.ts`** — declare `'mb-<name>'` under `JSX.IntrinsicElements` with relevant attributes.
4. **`src/types.ts`** — re-export the component type(s) and add `'mb-<name>'` to `HTMLElementTagNameMap`.
5. **Story** — `stories/<Name>.stories.ts` under an appropriate Storybook title.
6. **Test** — `src/components/<name>.test.ts` (Vitest browser).
7. Run `npm run check:exports` (and typecheck / lint / test) before opening a PR.

## Release notes

Document user-facing work under `## Unreleased` in [CHANGELOG.md](./CHANGELOG.md). Move that section into a versioned heading when cutting a release.

## Docs

- [README.md](./README.md) — install, contracts, scripts
- [docs/go-htmx.md](./docs/go-htmx.md) — Go `html/template` + HTMX
- [docs/parts-and-events.md](./docs/parts-and-events.md) — custom events and `::part` catalog
