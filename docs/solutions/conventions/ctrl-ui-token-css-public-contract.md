---
title: Ctrl UI token CSS public contract
date: 2026-09-05
category: conventions
module: packages/ctrl-ui
problem_type: convention
component: tooling
severity: high
applies_when:
  - "changing the ctrlds token CSS public export or generated custom properties"
  - "reviewing packages/ctrl-ui against plan KTD10, KTD13, or R18"
  - "adding token galleries, scheme samples, or direction and reduced-motion CSS"
  - "changing kit package.json exports, pack CI, or commitlint on main"
related_components:
  - "documentation"
  - "development_workflow"
tags:
  - "ctrlds"
  - "token-css"
  - "public-contract"
  - "design-tokens"
  - "reduced-motion"
  - "pnpm-pack"
  - "logical-properties"
  - "storybook-galleries"
---

# Ctrl UI token CSS public contract

## Context

Ctrl UI’s foundation increment is toolchain plus the token pipeline. The public kit package is `ctrlds` in `packages/ctrl-ui`. Consumers apply semantic tokens by importing generated CSS custom properties, then reading TypeScript collections. That CSS surface is a contract, not an implementation detail.

The plan names the contract in three places:

- **KTD10** (`docs/plans/2026-08-14-001-product-ctrl-ui-foundation-plan.md:492`) — TypeScript is the token source of truth. A Node generator in `packages/ctrl-ui/src/tokens/css.ts` writes `packages/ctrl-ui/src/tokens/generated/variables.css`. Kit `exports` MUST expose `"."` as the ESM+dts collections entry and `"./variables.css"` mapping to the copied dump. Catalog and consumer docs MUST import the `ctrlds` package CSS export (`./variables.css`).
- **KTD13** (`docs/plans/2026-08-14-001-product-ctrl-ui-foundation-plan.md:495`) — custom-property names, scheme selectors (`:root, [data-scheme="light"]` for light; `[data-scheme="dark"]` for dark on any element), `--direction` on `:root` / `[dir="ltr"]` / `[dir="rtl"]`, logical custom-property names for directional inset and space (no `margin-inline` utilities in the dump), and a `@media (prefers-reduced-motion: reduce)` block that sets `--motion-duration: 0s`.
- **R18** (`docs/plans/2026-08-14-001-product-ctrl-ui-foundation-plan.md:335`) — a consumer can install `ctrlds` without cloning this repository. This increment proves that clause by `pnpm pack` of `ctrlds` and installing the tarball into a throwaway app. Catalog `workspace:*` MUST NOT satisfy R18.

The first U2 drop shipped a working generator and galleries, but it did not match that contract: the CSS export was named `tokens.css`, scheme and direction tokens did not land on `:root`, the dump emitted `margin-inline` utilities under a private `[data-ctrl-logical-space]` selector, reduced-motion `0ms` applied only to `:root` (so `[data-scheme]` nodes restored `150ms`), the largest space step was `2xl` rather than `xxl`, galleries omitted the focus ring / density bar / ancestor-scheme sample, CI did not prove pack install, commitlint on push assumed `origin/main`, and the kit README did not state that `@fontsource/inter` is not a kit runtime dependency.

Review asked to Fix. The alignment landed in [PR #4](https://github.com/dedOfficial/ctrl-ui/pull/4) (merged 2026-08-27). The current tree exposes `./variables.css` and the KTD13 selectors.

## Guidance

Treat the generated CSS dump and the kit `exports` map as the public token CSS contract. Do not invent a parallel import path, a scheme-only selector set, or utility rules in the dump.

**Export name (KTD10).** Kit `package.json` MUST expose `"./variables.css"` pointing at the copied dump, not `./tokens.css`.

```14:19:packages/ctrl-ui/package.json
  "exports": {
    ".": {
      "types": "./dist/index.d.mts",
      "import": "./dist/index.mjs"
    },
    "./variables.css": "./dist/tokens/generated/variables.css"
  },
```

tsdown copies the dump into dist (`packages/ctrl-ui/tsdown.config.ts:7-10`). The generator module stays off the public JavaScript surface: `packages/ctrl-ui/src/index.ts:1-6` re-exports `density`, `direction`, `color`, `radius`, `space`, and `typography` only. Catalog and README import that CSS export (`apps/catalog/.storybook/preview.tsx:8`, `packages/ctrl-ui/README.md:48`).

**Scheme cascade (KTD13).** Light color roles MUST apply on `:root` and on `[data-scheme='light']`. Dark roles MUST apply on `[data-scheme='dark']` at any element, not `html` only. Shared non-color tokens MUST apply on `:root` and on any `[data-scheme]` node so a nested scheme island still has space, type, and motion.

```68:82:packages/ctrl-ui/src/tokens/css.ts
export function generateCss(): string {
  const lightBlock = customPropertyBlock({
    selector: ":root, [data-scheme='light']",
    declarations: colorDeclarations("light"),
  });

  const darkBlock = customPropertyBlock({
    selector: "[data-scheme='dark']",
    declarations: colorDeclarations("dark"),
  });

  const sharedBlock = customPropertyBlock({
    selector: ":root, [data-scheme]",
    declarations: sharedDeclarations(),
  });
```

The committed dump matches those selectors (`packages/ctrl-ui/src/tokens/generated/variables.css:3`, `:18`, `:34`).

**Direction token (KTD13).** `--direction` is an inspection mirror. It MUST be set on `:root` (default `ltr`), `[dir='ltr']`, and `[dir='rtl']`. It MUST NOT flip layout. Writing direction is switched only by `dir="ltr"` or `dir="rtl"` on a root element.

```84:92:packages/ctrl-ui/src/tokens/css.ts
  const ltrBlock = customPropertyBlock({
    selector: ":root, [dir='ltr']",
    declarations: [["--direction", direction.ltr]],
  });

  const rtlBlock = customPropertyBlock({
    selector: "[dir='rtl']",
    declarations: [["--direction", direction.rtl]],
  });
```

**Logical CSS shape (KTD13).** Directional inset and space in the dump MUST be custom properties (`--space-inline-*`, `--inset-inline-*`, `--inset-block-*`). The dump MUST NOT emit `margin-inline` / `padding-inline` utility rules or physical `left` / `right` inset properties. Story markup MAY use those CSS properties against the custom properties; the dump itself must not.

```44:60:packages/ctrl-ui/src/tokens/css.ts
function sharedDeclarations(): Array<readonly [string, string]> {
  return [
    ...tokenDeclarations({ prefix: "space", tokens: space }),
    ...tokenDeclarations({ prefix: "space-inline", tokens: space }),
    ["--target-min-size", targetMinSize],
    ...tokenDeclarations({ prefix: "radius", tokens: radius }),
    ["--font-family", typography.family],
    ...tokenDeclarations({ prefix: "font-size", tokens: typography.size }),
    ...tokenDeclarations({ prefix: "font-weight", tokens: typography.weight }),
    ...tokenDeclarations({ prefix: "font-line-height", tokens: typography.lineHeight }),
    ...tokenDeclarations({ prefix: "density", tokens: density }),
    ["--focus-ring-width", focusRing.width],
    ["--focus-ring-offset", focusRing.offset],
    ["--motion-duration", motion.duration],
    ...tokenDeclarations({ prefix: "inset-inline", tokens: space }),
    ...tokenDeclarations({ prefix: "inset-block", tokens: space }),
  ];
}
```

The dump currently emits `--space-inline-xxl: 48px`, `--inset-inline-md: 16px`, and `--inset-block-md: 16px` (`packages/ctrl-ui/src/tokens/generated/variables.css:46`, `:73`, `:79`). `css.test.ts` asserts `--space-inline-sm:`, `--inset-inline-md:`, `--inset-block-md:`, and no `margin-inline:` (`packages/ctrl-ui/src/tokens/css.test.ts:75-78`).

**Reduced-motion cascade (KTD13).** Encode reduced motion as `@media (prefers-reduced-motion: reduce)` setting `--motion-duration: 0s` on the same shared selector as other non-color tokens (`:root, [data-scheme]`). A `:root`-only override loses to a `[data-scheme]` rule that still holds `150ms`.

```1:4:packages/ctrl-ui/src/tokens/semantic/motion.ts
export const motion = {
  duration: "150ms",
  reducedDuration: "0s",
  reducedMotionQuery: "(prefers-reduced-motion: reduce)",
```

```94:97:packages/ctrl-ui/src/tokens/css.ts
  const reducedMotionBlock = `@media ${motion.reducedMotionQuery} {\n${customPropertyBlock({
    selector: ":root, [data-scheme]",
    declarations: [["--motion-duration", motion.reducedDuration]],
  })}\n}`;
```

The dump currently emits `--motion-duration: 0s` inside that media query on `:root, [data-scheme]` (`packages/ctrl-ui/src/tokens/generated/variables.css:92-95`). Use `0s`, not `0ms`.

**Space step name.** The public semantic step is `xxl`, which maps to primitive `48` (`packages/ctrl-ui/src/tokens/semantic/space.ts:9`). Do not publish `2xl`. The dump currently emits `--space-xxl: 48px` (`packages/ctrl-ui/src/tokens/generated/variables.css:40`). `space.test.ts` asserts `space.xxl` (`packages/ctrl-ui/src/tokens/space.test.ts:17`).

**Galleries.** Token galleries are one story per public collection. They MUST show light and dark side by side via per-column `data-scheme` nodes (`apps/catalog/src/stories/tokens/TokenGallery.tsx:29-32`). They MUST also include a sample with no column `data-scheme` so the Storybook scheme toolbar has a node that follows the preview decorator wrapper (`apps/catalog/.storybook/preview.tsx:18`, `apps/catalog/src/stories/tokens/TokenGallery.tsx:9-21`). That wrapper is `div[data-scheme]`, not `:root`. Color MUST paint `focus` as a 2px/2px outline ring on `surface` and `action`, not as a filled swatch (`apps/catalog/src/stories/tokens/Color.stories.tsx:44-61`; ring tokens in `packages/ctrl-ui/src/tokens/semantic/focus.ts:1-3`). Density MUST render a scaled bar (`apps/catalog/src/stories/tokens/Density.stories.tsx:24-28`).

**R18 pack proof.** Catalog `workspace:*` does not prove clone-free install. CI MUST pack `ctrlds` and install the tarball outside the git workspace. Root script `pack:proof` runs `scripts/prove-pack-install.mjs` (`package.json:15`). That script `pnpm pack`s the kit, `pnpm add`s the tarball into a temp app, `require.resolve`s the packed CSS export, and asserts the CSS contains `:root, [data-scheme='light']` and `--color-action:` (`scripts/prove-pack-install.mjs:14-27`). CI runs `pnpm pack:proof` after tests (`.github/workflows/ci.yml:43-44`).

**Commitlint on the pushed range.** On pull requests, fetch `github.base_ref` and lint `--from origin/${{ github.base_ref }} --to HEAD` (`.github/workflows/ci.yml:49-53`). On push, pipe `git log -1 --format=%B ${{ github.sha }}` into commitlint (`.github/workflows/ci.yml:55-57`). Do not hard-code `origin/main` on every event.

**Font dependency.** `@fontsource/inter` is a catalog (and consumer) dependency, not a kit runtime dependency. The catalog loads weights 400, 500, 600, and 700 (`apps/catalog/.storybook/preview.tsx:4-7`, `apps/catalog/package.json:12`). Kit `package.json` has no `@fontsource/inter` dependency. The kit README states that fact (`packages/ctrl-ui/README.md:5`). `--font-family` in the dump is `Inter, system-ui, sans-serif` (`packages/ctrl-ui/src/tokens/generated/variables.css:52`).

**Keep the dump honest.** `css.test.ts` MUST run in the Vitest Node environment (`packages/ctrl-ui/src/tokens/css.test.ts:1`) and MUST fail if the committed dump is stale (`packages/ctrl-ui/src/tokens/css.test.ts:15-20`). That file also asserts scheme selectors, `--space-xxl`, `--direction` on `:root` / `[dir]`, the reduced-motion query, logical custom-property names, and the absence of `margin-inline:` utilities (`packages/ctrl-ui/src/tokens/css.test.ts:33-83`).

## Why This Matters

The CSS dump is what a clone-free consumer actually applies. A TypeScript collection that says `xxl` while CSS exports `--space-2xl`, or a README that names the `./variables.css` export while `exports` only lists `./tokens.css`, is a broken public API even if Storybook looks fine inside the workspace.

Scheme and reduced-motion selector mistakes are silent. Light tokens that exist only on `[data-scheme='light']` never paint `:root`. Reduced motion that sets `0s` only on `:root` loses to `[data-scheme] { --motion-duration: 150ms }`, so a nested scheme island animates for users who asked it not to.

Logical *utilities* in the dump (`margin-inline: var(--space-sm)` on a private attribute) are not the KTD13 directional token surface. Consumers cannot set `--inset-inline-md`; they can only opt into a one-off utility block. The contract is custom properties, so RTL layout in later atoms can read `--space-inline-*` / `--inset-inline-*` / `--inset-block-*` without importing a kit utility class.

R18 is not “the catalog imported the CSS.” Catalog `workspace:*` plus Vite aliases (`apps/catalog/.storybook/main.ts:14-20`) resolve the kit to source, not to packed `dist`. Pack-and-install is the only proof that `exports`, tsdown `copy`, and `files: ["dist"]` actually ship the CSS export. Without `pnpm pack:proof` in CI (`.github/workflows/ci.yml:43-44` plus `scripts/prove-pack-install.mjs`), a renamed export or a missed copy step can merge green.

Galleries that fill-swatch `focus` hide that `--color-focus` is a ring (`packages/ctrl-ui/src/tokens/semantic/focus.ts:1-3`, `apps/catalog/src/stories/tokens/Color.stories.tsx:44-61`). Density without a scaled bar hides that the values are multipliers (`apps/catalog/src/stories/tokens/Density.stories.tsx:24-28`). A side-by-side grid without an ancestor-scheme sample hides that the toolbar paints the preview wrapper rather than only the two column nodes (`apps/catalog/.storybook/preview.tsx:18`, `apps/catalog/src/stories/tokens/TokenGallery.tsx:9-21`).

`@fontsource/inter` on the kit would pull font files into every consumer. Naming Inter in `--font-family` is the token; loading the files is the host’s job (`packages/ctrl-ui/README.md:5`).

Prevention is the generator test plus the pack gate. `css.test.ts` (`packages/ctrl-ui/src/tokens/css.test.ts`) is the KTD13 checklist in executable form. `pack:proof` is the R18 checklist. Do not treat catalog `workspace:*` or a local Storybook render as substitutes.

## When to Apply

- Changing kit `package.json` `exports`, tsdown `copy`, or the CSS generator (`packages/ctrl-ui/src/tokens/css.ts`).
- Adding or renaming a semantic color role, space step, motion duration, or direction token.
- Editing token galleries, `SchemePair`, or Storybook scheme / direction toolbars.
- Touching CI steps that build, test, pack, or commitlint.
- Writing consumer or kit README install snippets that mention CSS imports or Inter.
- Reviewing any PR that claims “tokens are done” against KTD10, KTD13, and R18 rather than against “Storybook shows colors.”

Do not apply this as a reason to add atoms, molecules, organisms, templates, React Aria, or a Next-specific package. The contract is the token CSS public surface for this increment.

## Examples

Concrete **after** state is the current tree. **Prior / wrong** is the first U2 drop on this branch before the KTD10 / KTD13 / R18 review round (the state review asked to Fix; aligned in [PR #4](https://github.com/dedOfficial/ctrl-ui/pull/4), merged 2026-08-27).

### Export path

**Prior / wrong:** `exports` listed `"./tokens.css"`. README and catalog imported that pre-fix specifier (historical; not a repo path).

**After:** consumers import the KTD10 path:

```ts
import "ctrlds/variables.css";
import { color, space, typography } from "ctrlds";
```

(`packages/ctrl-ui/package.json:19`, `packages/ctrl-ui/README.md:47-49`, `apps/catalog/.storybook/preview.tsx:8`)

### Scheme and direction cascade

**Prior / wrong:** color blocks were `[data-scheme='light']` and `[data-scheme='dark']` only; shared tokens were `[data-scheme]` only; `--direction` was `[dir='ltr']` / `[dir='rtl']` only. A document with no `data-scheme` attribute received neither light colors nor space / type tokens.

**After:** light colors on `:root, [data-scheme='light']` (`packages/ctrl-ui/src/tokens/css.ts:70`, `packages/ctrl-ui/src/tokens/generated/variables.css:3`); dark on `[data-scheme='dark']` (`packages/ctrl-ui/src/tokens/css.ts:75`, `packages/ctrl-ui/src/tokens/generated/variables.css:18`); shared tokens on `:root, [data-scheme]` (`packages/ctrl-ui/src/tokens/css.ts:80`, `packages/ctrl-ui/src/tokens/generated/variables.css:34`); `--direction: ltr` on `:root, [dir='ltr']` (`packages/ctrl-ui/src/tokens/css.ts:85`, `packages/ctrl-ui/src/tokens/generated/variables.css:85`).

### Logical CSS in the dump

**Prior / wrong:** the dump included a `[data-ctrl-logical-space]` block with utility declarations `margin-inline: var(--space-sm)`, `padding-inline: var(--space-md)`, `inset-inline: auto`. No `--space-inline-*` / `--inset-inline-*` / `--inset-block-*` custom properties.

**After:** shared declarations emit those custom properties (`packages/ctrl-ui/src/tokens/css.ts:47`, `:58-59`). Tests forbid `margin-inline:` in the dump (`packages/ctrl-ui/src/tokens/css.test.ts:78`). Direction *story* markup still uses `marginInline` / `paddingInline` / `insetInline` against those variables (`apps/catalog/src/stories/tokens/Direction.stories.tsx:26-28`) — that is host CSS, not dump utilities.

### Reduced motion

**Prior / wrong:** `reducedDuration` was `"0ms"`. The media block targeted `:root` only, so `[data-scheme]` kept `--motion-duration: 150ms`.

**After:** `reducedDuration` is `"0s"` (`packages/ctrl-ui/src/tokens/semantic/motion.ts:3`). The media block targets `:root, [data-scheme]` (`packages/ctrl-ui/src/tokens/css.ts:95`, `packages/ctrl-ui/src/tokens/generated/variables.css:92-95`).

### Space step

**Prior / wrong:** semantic key `"2xl"` (quoted, Tailwind-shaped).

**After:** `xxl` maps to primitive `48` (`packages/ctrl-ui/src/tokens/semantic/space.ts:9`) and `--space-xxl: 48px` (`packages/ctrl-ui/src/tokens/generated/variables.css:40`).

### Galleries

**Prior / wrong:** Color painted `focus` as a filled `--color-focus` swatch. Density listed names and numeric multipliers with no bar. `SchemePair` was only the two-column `data-scheme` grid, so the scheme toolbar had no sample outside those columns.

**After:** Color skips `focus` in the fill list and adds “focus on surface” / “focus on action” rows using `outline` and `outlineOffset` from `--focus-ring-width` / `--focus-ring-offset` (`apps/catalog/src/stories/tokens/Color.stories.tsx:35`, `:44-61`). Density swatch width is `calc(var(--space-lg) * ${value})` (`apps/catalog/src/stories/tokens/Density.stories.tsx:24-28`). `SchemePair` renders a sample labeled `root-inheriting scheme sample` above the grid (`apps/catalog/src/stories/tokens/TokenGallery.tsx:9-21`). That node has no column `data-scheme`; it follows the preview decorator `div[data-scheme]` (`apps/catalog/.storybook/preview.tsx:18`), not `:root`.

### Pack proof and commitlint

**Prior / wrong:** no pack-install script; CI jumped from `pnpm test` to `pnpm catalog:build`. Commitlint always `git fetch origin main` then `--from origin/main --to HEAD`, which is wrong on a push of a single commit and brittle when the PR base is not `main`.

**After:** `pnpm pack:proof` → `node ./scripts/prove-pack-install.mjs` (`package.json:15`); CI step “Pack install” (`.github/workflows/ci.yml:43-44`); commitlint gated on `github.event_name == 'pull_request'` with `github.base_ref`, plus a push job that lints the pushed commit message (`.github/workflows/ci.yml:49-57`).

### README font dependency

**Prior / wrong:** kit README did not say `@fontsource/inter` is not a kit runtime dependency; CSS import examples used the pre-fix `tokens.css` specifier; no tarball install section; no note that `workspace:*` does not satisfy R18.

**After:** the kit README states the font split (`packages/ctrl-ui/README.md:5`), documents tarball install importing the CSS export (`packages/ctrl-ui/README.md:32-49`), and states that `workspace:*` does not satisfy clone-free install (`packages/ctrl-ui/README.md:28`).

## Related

- Foundation plan: `docs/plans/2026-08-14-001-product-ctrl-ui-foundation-plan.md` (KTD10, KTD13, R18)
- [PR #4](https://github.com/dedOfficial/ctrl-ui/pull/4) — alignment that landed this contract (merged 2026-08-27)
